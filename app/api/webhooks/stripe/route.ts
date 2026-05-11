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
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const fulfillmentEmail = process.env.FULFILLMENT_EMAIL ?? "team@loudllamas.org";

  // ─────────────────────────────────────────────────────────────────────
  // Checkout session expired (abandoned cart) — mark the order so it
  // doesn't sit in "pending" forever and skew reporting.
  // ─────────────────────────────────────────────────────────────────────
  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    let orderIds: string[] = [];
    if (session.metadata?.order_ids) {
      try { orderIds = JSON.parse(session.metadata.order_ids); } catch {}
    } else if (session.metadata?.order_id) {
      orderIds = [session.metadata.order_id];
    }
    if (orderIds.length) {
      const { error } = await supabase
        .from("orders")
        .update({ status: "expired", updated_at: new Date().toISOString() })
        .in("id", orderIds)
        .eq("status", "pending"); // don't clobber paid orders
      if (error) console.error("Failed to expire orders:", error);
    }
    return NextResponse.json({ received: true, event: "session_expired" });
  }

  // ─────────────────────────────────────────────────────────────────────
  // Subscription invoice failed (renewal couldn't be charged) — alert team.
  // ─────────────────────────────────────────────────────────────────────
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = typeof (invoice as unknown as { subscription?: string }).subscription === "string"
      ? (invoice as unknown as { subscription: string }).subscription
      : null;
    const customerEmail = invoice.customer_email ?? null;
    const amountDue = ((invoice.amount_due ?? 0) / 100).toFixed(2);
    const attemptCount = invoice.attempt_count ?? 0;

    // Try to identify which product/sub this belongs to for the alert.
    let context = "Unknown subscription";
    if (subscriptionId) {
      const { data: br } = await supabase
        .from("burnrate_subscriptions")
        .select("plan, customer_email")
        .eq("stripe_subscription_id", subscriptionId)
        .maybeSingle();
      if (br) {
        context = `Burnrate (${br.plan})`;
      } else {
        const { data: ms } = await supabase
          .from("management_subscriptions")
          .select("channel, tier, order_id")
          .eq("stripe_subscription_id", subscriptionId)
          .limit(1)
          .maybeSingle();
        if (ms) context = `90-day sprint · ${ms.channel} ${ms.tier}`;
      }
    }

    await resend.emails.send({
      from: "Loud Llamas <hello@loudllamas.org>",
      to: fulfillmentEmail,
      subject: `⚠️ Payment failed · ${context} · ${customerEmail ?? "no email"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #DC2626; padding: 20px 24px;">
            <h1 style="color: white; margin: 0; font-size: 18px;">Subscription payment failed</h1>
          </div>
          <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 12px; background: #F8F8F8; font-weight: bold;">Product</td><td style="padding: 8px 12px; background: #F8F8F8;">${context}</td></tr>
              <tr><td style="padding: 8px 12px; font-weight: bold;">Customer</td><td style="padding: 8px 12px;">${customerEmail ?? "(unknown)"}</td></tr>
              <tr><td style="padding: 8px 12px; background: #F8F8F8; font-weight: bold;">Amount due</td><td style="padding: 8px 12px; background: #F8F8F8;">$${amountDue}</td></tr>
              <tr><td style="padding: 8px 12px; font-weight: bold;">Attempt</td><td style="padding: 8px 12px;">${attemptCount}</td></tr>
              <tr><td style="padding: 8px 12px; background: #F8F8F8; font-weight: bold;">Stripe sub</td><td style="padding: 8px 12px; background: #F8F8F8; font-family: monospace; font-size: 12px;">${subscriptionId ?? "—"}</td></tr>
            </table>
            <p style="color: #6B7280; font-size: 13px; margin-top: 16px;">Stripe will retry automatically. Reach out if the customer needs help updating their card.</p>
          </div>
        </div>
      `,
    }).catch((e) => console.error("Payment-failed alert email failed:", e));

    return NextResponse.json({ received: true, event: "payment_failed" });
  }

  // ─────────────────────────────────────────────────────────────────────
  // Subscription canceled (Burnrate or 90-day sprint hitting its cancel_at)
  // ─────────────────────────────────────────────────────────────────────
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const subId = sub.id;
    const product = (sub.metadata as Record<string, string> | undefined)?.product;

    if (product === "burnrate") {
      const { error } = await supabase
        .from("burnrate_subscriptions")
        .update({ status: "canceled", updated_at: new Date().toISOString() })
        .eq("stripe_subscription_id", subId);
      if (error) console.error("Failed to cancel burnrate sub:", error);
    } else {
      // Could be a 90-day sprint subscription. Update all matching rows.
      const { error } = await supabase
        .from("management_subscriptions")
        .update({ status: "canceled", updated_at: new Date().toISOString() })
        .eq("stripe_subscription_id", subId);
      if (error) console.error("Failed to cancel mgmt sub:", error);
    }

    return NextResponse.json({ received: true, event: "subscription_deleted" });
  }

  // ─────────────────────────────────────────────────────────────────────
  // Checkout completed (the main signup path)
  // ─────────────────────────────────────────────────────────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // ─── Burnrate subscription signup ───
    if (session.metadata?.product === "burnrate") {
      const plan = session.metadata.plan ?? "standard";
      const customerEmail = session.customer_details?.email ?? null;
      const customerName = session.customer_details?.name ?? null;
      const subscriptionId = typeof session.subscription === "string" ? session.subscription : null;

      // Upsert by stripe_session_id so webhook retries are idempotent.
      const { error: brErr } = await supabase
        .from("burnrate_subscriptions")
        .upsert(
          {
            stripe_session_id: session.id,
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
            customer_email: customerEmail,
            plan,
            status: "active",
            is_founder: plan === "founder",
          },
          { onConflict: "stripe_session_id" }
        );

      if (brErr) {
        console.error("Failed to record Burnrate signup:", brErr);
        // Return 500 so Stripe retries the webhook. Idempotent upsert is safe.
        return NextResponse.json({ error: "Failed to record signup" }, { status: 500 });
      }

      // Customer confirmation email
      if (customerEmail) {
        const firstName = customerName?.split(" ")[0] ?? "friend";
        const priceLabel = plan === "founder" ? "$17.99/mo (locked forever)" : "$29/mo";
        await resend.emails.send({
          from: "Loud Llamas <hello@loudllamas.org>",
          to: customerEmail,
          subject: "Welcome to Burnrate. Your first fix list lands in 24 hours.",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #000000;">
              <div style="background: #000000; padding: 32px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Burnrate</h1>
                <p style="color: #2563EB; margin: 8px 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">You're in</p>
              </div>
              <div style="padding: 40px 32px;">
                <h2 style="font-size: 22px; margin-bottom: 8px;">Welcome, ${firstName}.</h2>
                <p style="color: #6B7280; margin-bottom: 32px;">Your Burnrate subscription is live at ${priceLabel}.</p>

                <h3 style="font-size: 16px; margin-bottom: 16px;">What's next</h3>
                <ol style="color: #000000; padding-left: 18px; line-height: 1.6;">
                  <li>We'll send you a separate email with your OAuth connect link.</li>
                  <li>Click it. Authorize Google Ads and Meta (read-only).</li>
                  <li>Wait 24 hours. Your first prioritized fix list lands in your inbox.</li>
                </ol>

                <hr style="border: none; border-top: 1px solid #EBEBEB; margin: 40px 0;" />
                <p style="color: #9CA3AF; font-size: 13px;">Questions? Reply to this email or visit <a href="${appUrl}/support" style="color: #2563EB;">loudllamas.org/support</a>.</p>
                <p style="color: #9CA3AF; font-size: 12px; margin-top: 24px;">Loud Llamas · A Thayer Systems Company</p>
              </div>
            </div>
          `,
        }).catch((e) => console.error("Burnrate customer email failed:", e));
      }

      // Fulfillment team notification
      await resend.emails.send({
        from: "Loud Llamas <hello@loudllamas.org>",
        to: fulfillmentEmail,
        subject: `New Burnrate signup (${plan}) · ${customerEmail ?? "no email"}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #000000;">
            <div style="background: #000000; padding: 24px 32px;">
              <h1 style="color: white; margin: 0; font-size: 18px;">New Burnrate signup</h1>
              <p style="color: #2563EB; margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Action: send OAuth connect link</p>
            </div>
            <div style="padding: 32px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 12px; background: #F8F8F8; font-weight: bold;">Plan</td><td style="padding: 8px 12px; background: #F8F8F8;">${plan}${plan === "founder" ? " · $17.99/mo locked" : " · $29/mo"}</td></tr>
                <tr><td style="padding: 8px 12px; font-weight: bold;">Customer</td><td style="padding: 8px 12px;">${customerName ?? "—"}</td></tr>
                <tr><td style="padding: 8px 12px; background: #F8F8F8; font-weight: bold;">Email</td><td style="padding: 8px 12px; background: #F8F8F8;">${customerEmail ?? "—"}</td></tr>
                <tr><td style="padding: 8px 12px; font-weight: bold;">Stripe sub</td><td style="padding: 8px 12px;">${subscriptionId ?? "—"}</td></tr>
                <tr><td style="padding: 8px 12px; background: #F8F8F8; font-weight: bold;">Session</td><td style="padding: 8px 12px; background: #F8F8F8; font-family: monospace; font-size: 12px;">${session.id}</td></tr>
              </table>
            </div>
          </div>
        `,
      }).catch((e) => console.error("Burnrate team email failed:", e));

      return NextResponse.json({ received: true, product: "burnrate" });
    }

    // ─── Standard setup orders (one-time payment or setup+sprint subscription) ───
    let orderIds: string[] = [];
    if (session.metadata?.order_ids) {
      try {
        orderIds = JSON.parse(session.metadata.order_ids);
      } catch {
        console.error("Failed to parse order_ids metadata");
      }
    } else if (session.metadata?.order_id) {
      orderIds = [session.metadata.order_id];
    }

    if (orderIds.length === 0) {
      console.error("No order IDs in session metadata");
      return NextResponse.json({ error: "Missing order IDs" }, { status: 400 });
    }

    // If this session included 90-day sprints, record them (idempotent).
    if (session.metadata?.has_mgmt_sub === "true" && session.metadata.mgmt_subs) {
      try {
        const mgmtSubs: Array<{ orderId: string; channel: string; tier: string; monthly: number }> =
          JSON.parse(session.metadata.mgmt_subs);
        const subscriptionId = typeof session.subscription === "string" ? session.subscription : null;
        const rows = mgmtSubs.map((m) => ({
          order_id: m.orderId,
          stripe_session_id: session.id,
          stripe_subscription_id: subscriptionId,
          channel: m.channel,
          tier: m.tier,
          monthly_amount: m.monthly * 100,
          status: "active",
        }));
        if (rows.length) {
          // Composite uniqueness on (stripe_subscription_id, order_id) — see migration 003.
          // Upsert keeps webhook retries safe.
          const { error: msErr } = await supabase
            .from("management_subscriptions")
            .upsert(rows, { onConflict: "stripe_subscription_id,order_id" });
          if (msErr) console.error("Failed to record management subscriptions:", msErr);
        }
      } catch (e) {
        console.error("Failed to parse mgmt_subs metadata:", e);
      }
    }

    // Mark all orders as paid and send a confirmation email for each
    for (const orderId of orderIds) {
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
        console.error(`Failed to update order ${orderId}:`, error);
        continue; // try remaining orders even if one fails
      }

      const customerEmail = order.customer_email ?? session.customer_details?.email;
      if (!customerEmail) continue;

      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + (order.delivery_days ?? 7));
      const deliveryStr = deliveryDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });

      await resend.emails.send({
        from: "Loud Llamas <hello@loudllamas.org>",
        to: customerEmail,
        subject: "You're in. Setup starts soon. 🦙",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #000000;">
            <div style="background: #000000; padding: 32px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Loud Llamas</h1>
              <p style="color: #2563EB; margin: 8px 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Order Confirmed</p>
            </div>
            <div style="padding: 40px 32px;">
              <h2 style="font-size: 22px; margin-bottom: 8px;">You're in, ${order.customer_name?.split(" ")[0] ?? "friend"}.</h2>
              <p style="color: #6B7280; margin-bottom: 32px;">Here's what happens next.</p>

              <div style="background: #F8F8F8; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                <p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #6B7280;">Your order</p>
                <p style="margin: 0; font-size: 18px; font-weight: bold;">${order.channel.replace(/-/g, " ")} · ${order.tier.charAt(0).toUpperCase() + order.tier.slice(1)}</p>
                <p style="margin: 8px 0 0; color: #6B7280;">$${order.price} · Estimated delivery by ${deliveryStr}</p>
              </div>

              <h3 style="font-size: 16px; margin-bottom: 16px;">Next step: Fill out your intake form</h3>
              <p style="color: #6B7280; margin-bottom: 24px;">Takes about 5 to 10 minutes. Tell us about your business and we'll take it from there. If you're unsure about anything, check "Let The Llamas Decide."</p>
              <a href="${appUrl}/intake/${order.id}" style="display: inline-block; background: #2563EB; color: white; padding: 14px 28px; border-radius: 999px; text-decoration: none; font-weight: bold; font-size: 16px;">Fill out your intake →</a>

              <hr style="border: none; border-top: 1px solid #EBEBEB; margin: 40px 0;" />
              <p style="color: #9CA3AF; font-size: 13px;">Questions? Reply to this email or visit <a href="${appUrl}/support" style="color: #2563EB;">loudllamas.org/support</a>. Flat $79 break-fix if anything goes wrong after handoff.</p>
              <p style="color: #9CA3AF; font-size: 12px; margin-top: 24px;">Loud Llamas · A Thayer Systems Company</p>
            </div>
          </div>
        `,
      }).catch((e) => console.error("Order confirmation email failed:", e));
    }
  }

  return NextResponse.json({ received: true });
}
