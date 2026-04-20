import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

const PRICES: Record<string, Record<string, number>> = {
  "website-build":     { starter: 499,  growth: 899,  pro: 1499 },
  "email-lifecycle":   { starter: 249,  growth: 499,  pro: 899  },
  "organic-social":    { starter: 249,  growth: 499,  pro: 899  },
  "seo-aeo":           { starter: 349,  growth: 699,  pro: 1199 },
  "paid-social":       { starter: 149,  growth: 299,  pro: 499  },
  "sem-google-ads":    { starter: 399,  growth: 799,  pro: 1399 },
  "analytics-tracking":{ starter: 199,  growth: 399,  pro: 699  },
  "automation":        { starter: 599,  growth: 999,  pro: 1799 },
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

type PkgInput = { channel: string; tier: string; addOns?: string[] };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerEmail } = body;

    // Support both { packages: [...] } and legacy { channel, tier, addOns }
    const packages: PkgInput[] = body.packages ?? [
      { channel: body.channel, tier: body.tier, addOns: body.addOns ?? [] },
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
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Create one Supabase order per package
    const createdOrders: Array<{ id: string; channel: string; tier: string; addOns: string[]; basePrice: number; deliveryDays: number }> = [];

    for (const pkg of packages) {
      const addOns = pkg.addOns ?? [];
      const basePrice = PRICES[pkg.channel][pkg.tier];
      const addOnTotal = addOns.reduce((sum, a) => sum + (ADD_ON_PRICES[a] ?? 0), 0);
      const deliveryDays = addOns.includes("rush") ? 3 : 7;

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

      createdOrders.push({ id: order.id, channel: pkg.channel, tier: pkg.tier, addOns, basePrice, deliveryDays });
    }

    // Build Stripe line items for all packages
    const lineItems: {
      price_data: {
        currency: "usd";
        product_data: { name: string; description: string };
        unit_amount: number;
      };
      quantity: 1;
    }[] = [];

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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    // Build intake chain URL: first order's intake, rest queued as nextOrders
    const [firstOrder, ...remaining] = createdOrders;
    const nextOrdersParam = remaining.length
      ? `&nextOrders=${encodeURIComponent(remaining.map((o) => o.id).join(","))}`
      : "";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      allow_promotion_codes: true,
      customer_email: customerEmail || undefined,
      metadata: {
        // Store all order IDs so the webhook can mark them all paid
        order_ids: JSON.stringify(createdOrders.map((o) => o.id)),
      },
      success_url: `${appUrl}/intake/${firstOrder.id}?paid=1${nextOrdersParam}`,
      cancel_url: `${appUrl}/packages`,
    });

    // Save Stripe session ID back to all orders
    await supabase
      .from("orders")
      .update({ stripe_session_id: session.id })
      .in("id", createdOrders.map((o) => o.id));

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
