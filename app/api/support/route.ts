import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function POST(req: NextRequest) {
  const { name, email, orderId, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const fulfillmentEmail = process.env.FULFILLMENT_EMAIL ?? "team@loudllamas.org";

  await resend.emails.send({
    from: "Loud Llamas Support <hello@loudllamas.org>",
    to: fulfillmentEmail,
    replyTo: email,
    subject: `Support request${orderId ? ` · Order #${orderId}` : ""} · ${name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#000000;padding:24px 32px;">
          <h1 style="color:white;margin:0;font-size:18px;">Support request</h1>
        </div>
        <div style="padding:32px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${orderId ? `<p><strong>Order ID:</strong> ${orderId}</p>` : ""}
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
          <p style="white-space:pre-wrap;">${message}</p>
        </div>
      </div>
    `,
  });

  // Auto-reply to customer
  await resend.emails.send({
    from: "Loud Llamas <hello@loudllamas.org>",
    to: email,
    subject: "Got it. We'll be in touch.",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#000000;">
        <div style="background:#000000;padding:32px;text-align:center;">
          <h1 style="color:white;margin:0;font-size:24px;">Loud Llamas</h1>
        </div>
        <div style="padding:40px 32px;">
          <h2 style="margin-bottom:8px;">We got your message, ${name.split(" ")[0]}.</h2>
          <p style="color:#6B7280;">We reply within 1 business day. Usually faster.</p>
          <hr style="border:none;border-top:1px solid #EBEBEB;margin:32px 0;" />
          <p style="color:#9CA3AF;font-size:13px;">Loud Llamas · A Thayer Systems Company</p>
        </div>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
