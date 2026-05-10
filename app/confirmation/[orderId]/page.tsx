import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

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

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !order) notFound();

  const channelName = CHANNEL_NAMES[order.channel] ?? order.channel;
  const tierLabel = order.tier.charAt(0).toUpperCase() + order.tier.slice(1);

  const createdAt = new Date(order.created_at);
  const deliveryDate = new Date(createdAt);
  deliveryDate.setDate(deliveryDate.getDate() + (order.delivery_days ?? 7));
  const deliveryStr = deliveryDate.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const CHECKLIST = [
    { done: true,  text: "Payment received" },
    { done: order.status !== "pending", text: "Intake form submitted" },
    { done: false, text: "Setup in progress" },
    { done: false, text: "Review & handoff" },
  ];

  return (
    <div className="min-h-screen bg-white text-[#000000]">
      <Nav />

      {/* HERO */}
      <section className="bg-[#000000] px-6 md:px-12 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-5xl mb-6">🎉</p>
          <h1 className="font-black text-white leading-tight mb-4" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
            You&apos;re in the queue.
          </h1>
          <p className="text-[#9CA3AF] text-xl max-w-lg">
            The llamas are on it. Expected delivery by{" "}
            <span className="text-white font-semibold">{deliveryStr}</span>.
          </p>
        </div>
      </section>

      {/* ORDER DETAILS + CHECKLIST */}
      <section className="px-6 md:px-12 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">

          {/* Order summary */}
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-4">Your order</p>
            <div className="border border-[#EBEBEB] rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-[#EBEBEB]">
                <p className="font-bold text-xl">{channelName}</p>
                <p className="text-[#6B7280] mt-1">{tierLabel} tier</p>
              </div>
              <div className="p-6 border-b border-[#EBEBEB] space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Order ID</span>
                  <span className="font-mono font-semibold">#{orderId.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Status</span>
                  <span className="font-semibold capitalize">{order.status.replace("_", " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Delivery by</span>
                  <span className="font-semibold">{deliveryStr}</span>
                </div>
                {order.customer_email && (
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Confirmation sent to</span>
                    <span className="font-semibold">{order.customer_email}</span>
                  </div>
                )}
              </div>
              <div className="p-6 bg-[#F8F8F8] flex justify-between">
                <span className="font-bold">Total paid</span>
                <span className="font-black text-xl">${order.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-8 space-y-2 text-sm text-[#6B7280]">
              <p>Questions? <Link href="/support" className="text-[#2563EB] hover:underline">Contact us</Link>. We reply within 1 business day.</p>
              <p>Something goes sideways after handoff? $79 flat break-fix fee. No drama.</p>
            </div>
          </div>

          {/* Progress checklist */}
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-4">What happens next</p>
            <div className="space-y-6">
              {CHECKLIST.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${item.done ? "bg-[#000000]" : "bg-[#F0F0F0]"}`}>
                    {item.done
                      ? <span className="text-white text-sm">✓</span>
                      : <span className="text-[#9CA3AF] text-xs font-bold">{i + 1}</span>
                    }
                  </div>
                  <div>
                    <p className={`font-semibold ${item.done ? "text-[#000000]" : "text-[#9CA3AF]"}`}>{item.text}</p>
                    {i === 1 && !item.done && (
                      <Link
                        href={`/intake/${orderId}`}
                        className="inline-block mt-2 text-sm font-bold text-white bg-[#2563EB] px-4 py-2 rounded-full hover:bg-blue-500 transition-colors"
                      >
                        Fill out intake →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-[#F8F8F8] rounded-2xl p-6">
              <p className="font-bold mb-2">What we need from you</p>
              <ul className="text-sm text-[#6B7280] space-y-2">
                <li>→ Complete the intake form (link above)</li>
                <li>→ Accept any platform access invites we send</li>
                <li>→ Be available to answer a quick follow-up if needed</li>
              </ul>
              <p className="text-xs text-[#9CA3AF] mt-4">That&apos;s it. We handle the rest.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#000000] px-6 md:px-12 lg:px-20 py-20 text-center">
        <h2 className="font-black text-white mb-4" style={{ fontSize: "clamp(1.75rem, 3vw, 2.75rem)" }}>
          Want to add another channel?
        </h2>
        <p className="text-[#9CA3AF] mb-8">Each setup is its own sprint. Mix and match.</p>
        <Link
          href="/packages"
          className="inline-block bg-white text-[#000000] font-bold px-8 py-4 rounded-full hover:bg-[#2563EB] hover:text-white transition-colors duration-300"
        >
          See all packages
        </Link>
      </section>

      <Footer />
    </div>
  );
}
