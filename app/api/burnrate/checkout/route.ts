import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

const BURNRATE_PLANS = {
  standard: { name: "Burnrate · Standard", unitAmountCents: 2900, description: "Weekly waste detection. Cancel anytime." },
  founder:  { name: "Burnrate · Founder",  unitAmountCents: 1799, description: "Founder pricing — locked forever. First 100 only." },
} as const;

type PlanKey = keyof typeof BURNRATE_PLANS;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const plan = (body.plan as string) ?? "standard";
    const customerEmail = (body.customerEmail as string | undefined)?.trim() || undefined;

    if (!(plan in BURNRATE_PLANS)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const config = BURNRATE_PLANS[plan as PlanKey];
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: config.name,
              description: config.description,
            },
            unit_amount: config.unitAmountCents,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      customer_email: customerEmail,
      metadata: {
        product: "burnrate",
        plan,
      },
      subscription_data: {
        metadata: {
          product: "burnrate",
          plan,
        },
      },
      success_url: `${appUrl}/burnrate/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/burnrate`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Burnrate checkout error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
