import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

// Derive types from the SDK's create-method signature where possible.
// add_invoice_items is a documented Stripe API param on subscription_data but
// stripe-node v22 hasn't added it to the TS types yet — we declare it locally
// and cast at the call site.
type CreateSessionParams = NonNullable<Parameters<typeof stripe.checkout.sessions.create>[0]>;
type LineItem = NonNullable<CreateSessionParams["line_items"]>[number];
type CheckoutSession = Awaited<ReturnType<typeof stripe.checkout.sessions.create>>;

type AddInvoiceItem = {
  price_data: {
    currency: "usd";
    product_data: { name: string };
    unit_amount: number;
  };
  quantity: number;
};

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

// Optional 90-day sprint per channel/tier (USD/month)
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
          { error: `Channel ${pkg.channel} doesn't offer a 90-day sprint` },
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
              name: `${CHANNEL_NAMES[o.channel]}: ${o.tier.charAt(0).toUpperCase() + o.tier.slice(1)}`,
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
      // ---- Subscription flow (one or more 90-day sprints + one-time setups on first invoice) ----
      // Recurring line items: each mgmt sub is its own line item
      const lineItems: LineItem[] = [];
      const mgmtSubsMeta: Array<{ orderId: string; channel: string; tier: string; monthly: number }> = [];

      for (const o of createdOrders) {
        if (o.mgmtSub && o.mgmtSubMonthly > 0) {
          lineItems.push({
            price_data: {
              currency: "usd",
              product_data: {
                name: `${CHANNEL_NAMES[o.channel]}: 90-day sprint`,
                description: `Optional 90-day sprint for ${CHANNEL_NAMES[o.channel]} (${o.tier.charAt(0).toUpperCase() + o.tier.slice(1)}). Auto-cancels at day 90.`,
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
              name: `${CHANNEL_NAMES[o.channel]}: ${o.tier.charAt(0).toUpperCase() + o.tier.slice(1)} (Setup)`,
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

      // The Stripe API supports cancel_at and add_invoice_items on
      // subscription_data for Checkout Sessions, but stripe-node v22's TS
      // types don't surface them. Build the subscription_data with full
      // shape and attach via cast.
      const subscriptionDataExtended = {
        cancel_at: cancelAt,
        add_invoice_items: addInvoiceItems,
        metadata: {
          order_ids: JSON.stringify(createdOrders.map((o) => o.id)),
          mgmt_subs: JSON.stringify(mgmtSubsMeta),
        },
      };
      const subscriptionParams: CreateSessionParams = {
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
        subscription_data: subscriptionDataExtended as unknown as CreateSessionParams["subscription_data"],
        success_url: `${appUrl}/intake/${firstOrder.id}?paid=1${nextOrdersParam}`,
        cancel_url: `${appUrl}/packages`,
      };
      session = await stripe.checkout.sessions.create(subscriptionParams);
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
