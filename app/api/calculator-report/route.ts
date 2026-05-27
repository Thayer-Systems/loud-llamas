import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export const runtime = "nodejs";

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email as string | undefined)?.trim();
    const monthlySpend = Number(body.monthlySpend);
    const months = Number(body.months);
    const withBurnrate = !!body.withBurnrate;
    const agencyTotal = Number(body.agencyTotal);
    const llTotal = Number(body.llTotal);
    const burnrateTotal = Number(body.burnrateTotal);
    const savings = Number(body.savings);

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    if (!Number.isFinite(monthlySpend) || !Number.isFinite(months) || !Number.isFinite(savings)) {
      return NextResponse.json({ error: "Invalid calculator inputs" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://loudllamas.org";
    const fulfillmentEmail = process.env.FULFILLMENT_EMAIL ?? "team@loudllamas.org";

    // Customer report
    await resend.emails.send({
      from: "Loud Llamas <hello@loudllamas.org>",
      to: email,
      subject: `You'd save $${fmt(savings)} over ${months} months. Here's the math.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #000000;">
          <div style="background: #000000; padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Loud Llamas</h1>
            <p style="color: #2563EB; margin: 8px 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Your savings report</p>
          </div>
          <div style="padding: 40px 32px;">
            <h2 style="font-size: 22px; margin-bottom: 8px;">Here's the math.</h2>
            <p style="color: #6B7280; margin-bottom: 28px;">Based on what you told us in the calculator.</p>

            <div style="background: #F8F8F8; border-radius: 12px; padding: 20px; margin-bottom: 12px;">
              <p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #DC2626; font-weight: bold;">Your agency</p>
              <p style="margin: 0; font-size: 28px; font-weight: 900; color: #000000;">$${fmt(agencyTotal)}</p>
              <p style="margin: 4px 0 0; color: #6B7280; font-size: 13px;">$${fmt(monthlySpend)}/mo × ${months} months</p>
            </div>

            <div style="background: #F8F8F8; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #2563EB; font-weight: bold;">Loud Llamas</p>
              <p style="margin: 0; font-size: 28px; font-weight: 900; color: #2563EB;">$${fmt(llTotal)}</p>
              <p style="margin: 4px 0 0; color: #6B7280; font-size: 13px;">
                $699 foundation${withBurnrate ? ` + $${fmt(burnrateTotal)} Burnrate (${months} months)` : ""}
              </p>
            </div>

            <div style="border: 2px solid #2563EB; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 28px;">
              <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #000000; font-weight: bold;">You'd save</p>
              <p style="margin: 0; font-size: 48px; font-weight: 900; color: #2563EB; line-height: 1;">$${fmt(savings)}</p>
              <p style="margin: 12px 0 0; color: #6B7280;">over ${months} months. And you own everything at the end.</p>
            </div>

            <h3 style="font-size: 16px; margin-bottom: 12px;">What to do next</h3>
            <p style="color: #6B7280; margin-bottom: 20px; line-height: 1.6;">
              The foundation package is one payment. You own the website, the ad accounts, the email list, the analytics, and the automations. Forever. We hand it off in 5 to 7 business days.
            </p>
            <a href="${appUrl}/packages" style="display: inline-block; background: #2563EB; color: white; padding: 14px 28px; border-radius: 999px; text-decoration: none; font-weight: bold; font-size: 16px;">See packages →</a>

            <hr style="border: none; border-top: 1px solid #EBEBEB; margin: 36px 0;" />
            <p style="color: #9CA3AF; font-size: 13px;">
              Numbers based on your inputs: $${fmt(monthlySpend)}/mo, ${months} months${withBurnrate ? ", with Burnrate" : ""}. Re-run the calculator anytime at <a href="${appUrl}/calculator" style="color: #2563EB;">loudllamas.org/calculator</a>.
            </p>
            <p style="color: #9CA3AF; font-size: 12px; margin-top: 24px;">Loud Llamas · A Thayer Systems Company</p>
          </div>
        </div>
      `,
    });

    // Team lead notification (so fulfillment sees the lead arrived).
    await resend.emails.send({
      from: "Loud Llamas <hello@loudllamas.org>",
      to: fulfillmentEmail,
      replyTo: email,
      subject: `Calculator lead · $${fmt(savings)} savings · ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563EB; padding: 20px 24px;">
            <h1 style="color: white; margin: 0; font-size: 18px;">New calculator lead</h1>
          </div>
          <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 12px; background: #F8F8F8; font-weight: bold;">Email</td><td style="padding: 8px 12px; background: #F8F8F8;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding: 8px 12px; font-weight: bold;">Monthly spend</td><td style="padding: 8px 12px;">$${fmt(monthlySpend)}/mo</td></tr>
              <tr><td style="padding: 8px 12px; background: #F8F8F8; font-weight: bold;">Horizon</td><td style="padding: 8px 12px; background: #F8F8F8;">${months} months</td></tr>
              <tr><td style="padding: 8px 12px; font-weight: bold;">With Burnrate</td><td style="padding: 8px 12px;">${withBurnrate ? "Yes" : "No"}</td></tr>
              <tr><td style="padding: 8px 12px; background: #F8F8F8; font-weight: bold;">Agency total</td><td style="padding: 8px 12px; background: #F8F8F8;">$${fmt(agencyTotal)}</td></tr>
              <tr><td style="padding: 8px 12px; font-weight: bold;">LL total</td><td style="padding: 8px 12px;">$${fmt(llTotal)}</td></tr>
              <tr><td style="padding: 8px 12px; background: #F8F8F8; font-weight: bold;">Savings shown</td><td style="padding: 8px 12px; background: #F8F8F8; color: #2563EB; font-weight: bold;">$${fmt(savings)}</td></tr>
            </table>
            <p style="color: #6B7280; font-size: 13px; margin-top: 16px;">Reply directly to this email to reach the lead.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Calculator report error:", err);
    return NextResponse.json({ error: "Failed to send report" }, { status: 500 });
  }
}
