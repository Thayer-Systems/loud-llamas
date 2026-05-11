import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { createClient } from "@supabase/supabase-js";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const { answers } = await req.json();

  if (!orderId || !answers) {
    return NextResponse.json({ error: "Missing orderId or answers" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch the order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Require payment before accepting intake
  if (order.stripe_payment_status !== "paid" && order.status !== "paid") {
    return NextResponse.json({ error: "Payment required" }, { status: 402 });
  }

  // Save intake answers
  const rows = Object.entries(answers as Record<string, { answer?: string; llamas_decide?: boolean; is_critical?: boolean }>).map(
    ([question_key, val]) => ({
      order_id: orderId,
      question_key,
      answer: val.answer ?? null,
      llamas_decide: val.llamas_decide ?? false,
      is_critical: val.is_critical ?? false,
    })
  );

  const { error: answersError } = await supabase.from("intake_answers").insert(rows);

  if (answersError) {
    console.error("Failed to save answers:", answersError);
    return NextResponse.json({ error: "Failed to save answers" }, { status: 500 });
  }

  // Update order status
  await supabase
    .from("orders")
    .update({ status: "intake_complete", updated_at: new Date().toISOString() })
    .eq("id", orderId);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const fulfillmentEmail = process.env.FULFILLMENT_EMAIL ?? "team@loudllamas.org";

  // Send fulfillment email to team
  const answerRows = rows
    .map((r) => `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#6B7280;font-size:13px;">${r.question_key}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;">${r.llamas_decide ? "<em>Let The Llamas Decide</em>" : (r.answer ?? "(no answer)")}</td></tr>`)
    .join("");

  await resend.emails.send({
    from: "Loud Llamas <hello@loudllamas.org>",
    to: fulfillmentEmail,
    subject: `New order ready · ${order.channel} ${order.tier} · ${order.customer_name ?? order.customer_email ?? "Unknown"}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;color:#000000;">
        <div style="background:#000000;padding:24px 32px;display:flex;align-items:center;gap:16px;">
          <div>
            <h1 style="color:white;margin:0;font-size:20px;">New order, ready to build</h1>
            <p style="color:#2563EB;margin:4px 0 0;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Loud Llamas Fulfillment</p>
          </div>
        </div>
        <div style="padding:32px;">
          <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
            <tr><td style="padding:8px 12px;background:#F8F8F8;font-weight:bold;font-size:13px;">Channel</td><td style="padding:8px 12px;background:#F8F8F8;">${order.channel}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;font-size:13px;">Tier</td><td style="padding:8px 12px;">${order.tier}</td></tr>
            <tr><td style="padding:8px 12px;background:#F8F8F8;font-weight:bold;font-size:13px;">Price</td><td style="padding:8px 12px;background:#F8F8F8;">$${order.price}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;font-size:13px;">Add-ons</td><td style="padding:8px 12px;">${Array.isArray(order.add_ons) && order.add_ons.length ? order.add_ons.join(", ") : "None"}</td></tr>
            <tr><td style="padding:8px 12px;background:#F8F8F8;font-weight:bold;font-size:13px;">Delivery</td><td style="padding:8px 12px;background:#F8F8F8;">${order.delivery_days} business days</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;font-size:13px;">Customer</td><td style="padding:8px 12px;">${order.customer_name ?? "(not provided)"}</td></tr>
            <tr><td style="padding:8px 12px;background:#F8F8F8;font-weight:bold;font-size:13px;">Email</td><td style="padding:8px 12px;background:#F8F8F8;">${order.customer_email ?? "(not provided)"}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:bold;font-size:13px;">Order ID</td><td style="padding:8px 12px;">${orderId}</td></tr>
          </table>

          <h3 style="margin-bottom:12px;">Intake answers</h3>
          <table style="width:100%;border-collapse:collapse;border:1px solid #EBEBEB;border-radius:8px;overflow:hidden;">
            <thead><tr style="background:#000000;color:white;"><th style="padding:10px 12px;text-align:left;font-size:13px;">Question</th><th style="padding:10px 12px;text-align:left;font-size:13px;">Answer</th></tr></thead>
            <tbody>${answerRows}</tbody>
          </table>

          <div style="margin-top:32px;">
            <a href="${appUrl}/confirmation/${orderId}" style="display:inline-block;background:#2563EB;color:white;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold;font-size:14px;">View order →</a>
          </div>
        </div>
      </div>
    `,
  }).catch(console.error);

  // Trigger n8n webhook if configured. Retry on transient failures so a
  // brief n8n outage doesn't drop the fulfillment trigger. If all retries
  // fail, alert the team so they can manually replay it.
  const n8nUrl = process.env.N8N_WEBHOOK_URL;
  if (n8nUrl) {
    const n8nPayload = JSON.stringify({ orderId, order, answers });
    let n8nOk = false;
    let lastErr: unknown = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const r = await fetch(n8nUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: n8nPayload,
        });
        if (r.ok) { n8nOk = true; break; }
        lastErr = new Error(`n8n returned ${r.status}`);
      } catch (e) {
        lastErr = e;
      }
      // Exponential backoff: 400ms, 1.2s before the next attempt.
      if (attempt < 3) await new Promise((res) => setTimeout(res, 400 * attempt * attempt));
    }

    if (!n8nOk) {
      console.error("n8n webhook failed after 3 attempts:", lastErr);
      await resend.emails.send({
        from: "Loud Llamas <hello@loudllamas.org>",
        to: fulfillmentEmail,
        subject: `⚠️ n8n trigger failed for order ${orderId.slice(0, 8).toUpperCase()}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#DC2626;padding:20px 24px;">
              <h1 style="color:white;margin:0;font-size:18px;">n8n trigger failed</h1>
            </div>
            <div style="padding:24px;">
              <p>The intake was submitted and saved to Supabase, but the n8n fulfillment webhook didn't accept it after 3 attempts.</p>
              <p style="margin-top:16px;"><strong>Order:</strong> ${orderId}<br/><strong>Channel:</strong> ${order.channel} ${order.tier}<br/><strong>Customer:</strong> ${order.customer_name ?? order.customer_email ?? "(unknown)"}</p>
              <p style="margin-top:16px;">Manually replay the workflow in n8n or check that the webhook URL is reachable. The order details and intake answers are already in the database.</p>
              <p style="margin-top:16px;"><a href="${appUrl}/confirmation/${orderId}" style="color:#2563EB;">View order</a></p>
            </div>
          </div>
        `,
      }).catch((e) => console.error("n8n failure alert email also failed:", e));
    }
  }

  return NextResponse.json({ success: true });
}
