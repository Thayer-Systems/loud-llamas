import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

// Derive Stripe types from the SDK's create-method signature so we don't depend
// on whichever namespace shape this version of stripe-node exposes.
type CreateSessionParams = Parameters<typeof stripe.checkout.sessions.create>[0];
type LineItem = NonNullable<CreateSessionParams["line_items"]>[number];
type SubscriptionData = NonNullable<CreateSessionParams["subscription_data"]>;
type AddInvoiceItem = NonNullable<SubscriptionData["add_invoice_items"]>[number];
type CheckoutSession = Awaited<ReturnType<typeof stripe.checkout.sessions.create>>;

const PRICES: Record<string, Record<string, number>> = {
  "website-build":     { starter: 179, growth: 299, pro: 449 },
  "email-lifecycle":   { starter: 99,  growth: 179, pro: 279 },
  "organic-social":    { starter: 249, growth: 499, pro: 899 },
  "seo-aeo":           { starter: 349, growth: 699, pro: 1199 },
  "paid-social":       { starter: 59,  growth: 99,  pro: 149 },
  "sem-google-ads":    { starter: 149, growth: 249, pro: 399 },
  "analytics-tracking":{ starter: 99,  growth: 179, pro: 279 },
  "automation":        { starter: 79,  growth: 199, pro: 399 },
};

// Optional 3-month management subscription per channel/tier (USD/month)
const MGMT_SUB_PRICES: Record<string, Record<string, number>> = {
  "sem-google-ads":     { starter: 99, growth: 149, pro: 199 },
  "analytics-tracking": { starter: 49, growth: 79,  pro: 99  },
  "email-lifecycle":    { starter: 49, growth: 79,  pro: 99  },
};

const CHANNEL_NAMES: Record<string, string> = {
  "website-build":      "Website Build",
  "email-lifecycle":    "Email / Lifecycle",
  "organic-social":     "Organic Social",
  "seo-aeo":            "SEO / AEO Foundation",
  "paid-social":        "Paid Social Playbook",
  "sem-google-ads":     "SEM / Google Ads Setup",
  "analytics-tracking": "Analytics & Tracking",
  "automation":         "Automation",
};

const ADD_ON_PRICES: Record<string, number> = {
  rush:       299,
  automation: 499,
  playbook:   99,
};

const ADD_ON_NAMES: Record<string, string> = {
  rush:       "Rush Delivery (+3 days → same week)",
  automation: "Automation Upgrade",
  playbook:   "Paid Social Playbook Bundle",
};

type PkgInput = { channel: string; tier: string; addOns?: string[]; mgmtSub?: boolean };

const THREE_MONTHS_SECONDS = 60 * 60 * 24 * 90;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerEmail } = body;

    // Support both { packages: [...] } and legacy { channel, tier, addOns, mgmtSub }
    const packages: PkgInput[] = body.packages ?? [
      { channel: body.channel, tier: body.tier, addOns: body.addOns ?? [], mgmtSub: !!body.mgmtSub },
    ];

    if (!packages.length) {
      return NextResponse.json({ error: "No packages provided" }, { status: 400 });
    }

    // Validate all
    for (const pkg of packages) {
      if (!pkg.channel || !pkg.tier || !PRICES[pkg.channel]?.[pkg.tier]) {
        return NextResponse.json(
          { error: `Invalid package: ${pkg.channel}/${pkg.tier}` },
          { status: 400 }
        );
      }
      if (pkg.mgmtSub && !MGMT_SUB_PRICES[pkg.channel]?.[pkg.tier]) {
        return NextResponse.json(
          { error: `Channel ${pkg.channel} doesn't offer a management subscription` },
          { status: 400 }
        );
      }
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Create one Supabase order per package
    type CreatedOrder = {
      id: string;
      channel: string;
      tier: string;
      addOns: string[];
      basePrice: number;
      deliveryDays: number;
      mgmtSub: boolean;
      mgmtSubMonthly: number;
    };
    const createdOrders: CreatedOrder[] = [];

    for (const pkg of packages) {
      const addOns = pkg.addOns ?? [];
      const basePrice = PRICES[pkg.channel][pkg.tier];
      const addOnTotal = addOns.reduce((sum, a) => sum + (ADD_ON_PRICES[a] ?? 0), 0);
      const deliveryDays = addOns.includes("rush") ? 3 : 7;
      const mgmtSubMonthly = pkg.mgmtSub ? (MGMT_SUB_PRICES[pkg.channel]?.[pkg.tier] ?? 0) : 0;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          channel: pkg.channel,
          tier: pkg.tier,
          price: basePrice + addOnTotal,
          add_ons: addOns,
          delivery_days: deliveryDays,
          status: "pending",
          customer_name: customerName || null,
          customer_email: customerEmail || null,
        })
        .select()
        .single();

      if (orderError || !order) {
        console.error("Order creation failed:", orderError);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
      }

      createdOrders.push({
        id: order.id,
        channel: pkg.channel,
        tier: pkg.tier,
        addOns,
        basePrice,
        deliveryDays,
        mgmtSub: !!pkg.mgmtSub,
        mgmtSubMonthly,
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const [firstOrder, ...remaining] = createdOrders;
    const nextOrdersParam = remaining.length
      ? `&nextOrders=${encodeURIComponent(remaining.map((o) => o.id).join(","))}`
      : "";

    const hasAnyMgmtSub = createdOrders.some((o) => o.mgmtSub);

    let session: CheckoutSession;

    if (!hasAnyMgmtSub) {
      // ---- Existing one-time payment flow ----
      const lineItems: LineItem[] = [];
      for (const o of createdOrders) {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: `${CHANNEL_NAMES[o.channel]} — ${o.tier.charAt(0).toUpperCase() + o.tier.slice(1)}`,
              description: `Full setup handoff in ${o.deliveryDays} business days. You own it forever.`,
            },
            unit_amount: o.basePrice * 100,
          },
          quantity: 1,
        });
        for (const addOn of o.addOns) {
          if (ADD_ON_PRICES[addOn]) {
            lineItems.push({
              price_data: {
                currency: "usd",
                product_data: {
                  name: ADD_ON_NAMES[addOn] ?? addOn,
                  description: `Add-on for ${CHANNEL_NAMES[o.channel]}`,
                },
                unit_amount: ADD_ON_PRICES[addOn] * 100,
              },
              quantity: 1,
            });
          }
        }
      }

      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        allow_promotion_codes: true,
        payment_intent_data: { statement_descriptor: "LOUD LLAMAS" },
        customer_email: customerEmail || undefined,
        metadata: {
          order_ids: JSON.stringify(createdOrders.map((o) => o.id)),
        },
        success_url: `${appUrl}/intake/${firstOrder.id}?paid=1${nextOrdersParam}`,
        cancel_url: `${appUrl}/packages`,
      });
    } else {
      // ---- Subscription flow (one or more 3-mo mgmt subs + one-time setups on first invoice) ----
      // Recurring line items: each mgmt sub is its own line item
      const lineItems: LineItem[] = [];
      const mgmtSubsMeta: Array<{ orderId: string; channel: string; tier: string; monthly: number }> = [];

      for (const o of createdOrders) {
        if (o.mgmtSub && o.mgmtSubMonthly > 0) {
          lineItems.push({
            price_data: {
              currency: "usd",
              product_data: {
                name: `${CHANNEL_NAMES[o.channel]} — Management (3 mo)`,
                description: `3-month optional management for ${CHANNEL_NAMES[o.channel]} — ${o.tier.charAt(0).toUpperCase() + o.tier.slice(1)}. Auto-cancels after 3 charges.`,
              },
              unit_amount: o.mgmtSubMonthly * 100,
              recurring: { interval: "month" },
            },
            quantity: 1,
          });
          mgmtSubsMeta.push({
            orderId: o.id,
            channel: o.channel,
            tier: o.tier,
            monthly: o.mgmtSubMonthly,
          });
        }
      }

      // One-time charges (setup + addons) added to the first invoice
      const addInvoiceItems: AddInvoiceItem[] = [];
      for (const o of createdOrders) {
        addInvoiceItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: `${CHANNEL_NAMES[o.channel]} — ${o.tier.charAt(0).toUpperCase() + o.tier.slice(1)} (Setup)`,
            },
            unit_amount: o.basePrice * 100,
          },
          quantity: 1,
        });
        for (const addOn of o.addOns) {
          if (ADD_ON_PRICES[addOn]) {
            addInvoiceItems.push({
              price_data: {
                currency: "usd",
                product_data: { name: ADD_ON_NAMES[addOn] ?? addOn },
                unit_amount: ADD_ON_PRICES[addOn] * 100,
              },
              quantity: 1,
            });
          }
        }
      }

      const cancelAt = Math.floor(Date.now() / 1000) + THREE_MONTHS_SECONDS;

      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "subscription",
        allow_promotion_codes: true,
        customer_email: customerEmail || undefined,
        metadata: {
          order_ids: JSON.stringify(createdOrders.map((o) => o.id)),
          has_mgmt_sub: "true",
          mgmt_subs: JSON.stringify(mgmtSubsMeta),
        },
        subscription_data: {
          cancel_at: cancelAt,
          add_invoice_items: addInvoiceItems,
          metadata: {
            order_ids: JSON.stringify(createdOrders.map((o) => o.id)),
            mgmt_subs: JSON.stringify(mgmtSubsMeta),
          },
        },
        success_url: `${appUrl}/intake/${firstOrder.id}?paid=1${nextOrdersParam}`,
        cancel_url: `${appUrl}/packages`,
      });
    }

    // Save Stripe session ID back to all orders
    await supabase
      .from("orders")
      .update({ stripe_session_id: session.id })
      .in("id", createdOrders.map((o) => o.id));

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
