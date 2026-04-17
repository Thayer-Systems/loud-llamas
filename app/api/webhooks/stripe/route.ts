import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { resend } from "@/lib/resend";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // Allow unsigned events in dev when webhook secret not yet set
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;

    if (!orderId) {
      console.error("No order_id in session metadata");
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Mark order as paid
    const { data: order, error } = await supabase
      .from("orders")
      .update({
        stripe_payment_status: "paid",
        status: "paid",
        customer_email: session.customer_details?.email ?? null,
        customer_name: session.customer_details?.name ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()
      .single();

    if (error || !order) {
      console.error("Failed to update order:", error);
      return NextResponse.json({ error: "DB update failed" }, { status: 500 });
    }

    // Send confirmation email to customer
    const customerEmail = order.customer_email ?? session.customer_details?.email;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + (order.delivery_days ?? 7));
    const deliveryStr = deliveryDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

    if (customerEmail) {
      await resend.emails.send({
        from: "Loud Llamas <hello@loudllamas.org>",
        to: customerEmail,
        subject: "You're in. Setup starts soon. 🦙",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0D0D0D;">
            <div style="background: #0D0D0D; padding: 32px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Loud Llamas</h1>
              <p style="color: #2563EB; margin: 8px 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Order Confirmed</p>
            </div>
            <div style="padding: 40px 32px;">
              <h2 style="font-size: 22px; margin-bottom: 8px;">You're in, ${order.customer_name?.split(" ")[0] ?? "friend"}.</h2>
              <p style="color: #6B7280; margin-bottom: 32px;">Here's what happens next.</p>

              <div style="background: #F8F8F8; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                <p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #6B7280;">Your order</p>
                <p style="margin: 0; font-size: 18px; font-weight: bold;">${order.channel.replace(/-/g, " ")} — ${order.tier.charAt(0).toUpperCase() + order.tier.slice(1)}</p>
                <p style="margin: 8px 0 0; color: #6B7280;">$${order.price} · Estimated delivery by ${deliveryStr}</p>
              </div>

              <h3 style="font-size: 16px; margin-bottom: 16px;">Next step: Fill out your intake form</h3>
              <p style="color: #6B7280; margin-bottom: 24px;">Takes about 5–10 minutes. Tell us about your business and we'll take it from there. If you're unsure about anything, check "Let The Llamas Decide."</p>
              <a href="${appUrl}/intake/${order.id}" style="display: inline-block; background: #2563EB; color: white; padding: 14px 28px; border-radius: 999px; text-decoration: none; font-weight: bold; font-size: 16px;">Fill out your intake →</a>

              <hr style="border: none; border-top: 1px solid #EBEBEB; margin: 40px 0;" />
              <p style="color: #9CA3AF; font-size: 13px;">Questions? Reply to this email or visit <a href="${appUrl}/support" style="color: #2563EB;">loudllamas.org/support</a>. Flat $79 break-fix if anything goes wrong after handoff.</p>
              <p style="color: #9CA3AF; font-size: 12px; margin-top: 24px;">Loud Llamas · A Thayer Systems Company</p>
            </div>
          </div>
        `,
      }).catch(console.error);
    }
  }

  return NextResponse.json({ received: true });
}
