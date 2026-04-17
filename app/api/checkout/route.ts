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

export async function POST(req: NextRequest) {
  try {
    const { channel, tier, addOns = [], customerName, customerEmail } = await req.json();

    if (!channel || !tier) {
      return NextResponse.json({ error: "Missing channel or tier" }, { status: 400 });
    }

    const basePrice = PRICES[channel]?.[tier];
    if (!basePrice) {
      return NextResponse.json({ error: "Invalid channel or tier" }, { status: 400 });
    }

    const addOnTotal = (addOns as string[]).reduce((sum, a) => sum + (ADD_ON_PRICES[a] ?? 0), 0);
    const totalPrice = basePrice + addOnTotal;
    const deliveryDays = (addOns as string[]).includes("rush") ? 3 : 7;

    // Create pending order in Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        channel,
        tier,
        price: totalPrice,
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

    // Build line items
    const lineItems = [
      {
        price_data: {
          currency: "usd" as const,
          product_data: {
            name: `${CHANNEL_NAMES[channel]} — ${tier.charAt(0).toUpperCase() + tier.slice(1)}`,
            description: `Full setup handoff in ${deliveryDays} business days. You own it forever.`,
          },
          unit_amount: basePrice * 100,
        },
        quantity: 1,
      },
    ];

    for (const addOn of addOns as string[]) {
      if (ADD_ON_PRICES[addOn]) {
        lineItems.push({
          price_data: {
            currency: "usd" as const,
            product_data: { name: ADD_ON_NAMES[addOn] ?? addOn, description: "Add-on service" },
            unit_amount: ADD_ON_PRICES[addOn] * 100,
          },
          quantity: 1,
        });
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail || undefined,
      metadata: { order_id: order.id },
      success_url: `${appUrl}/intake/${order.id}?paid=1`,
      cancel_url: `${appUrl}/configure/${channel}`,
    });

    // Save session ID back to order
    await supabase
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
