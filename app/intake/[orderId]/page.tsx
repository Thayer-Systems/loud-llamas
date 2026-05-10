import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import IntakeForm from "./IntakeForm";

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

export default async function IntakePage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ paid?: string; nextOrders?: string }>;
}) {
  const { orderId } = await params;
  const { nextOrders } = await searchParams;

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

  // Already submitted
  if (order.status === "intake_complete") {
    return (
      <div className="min-h-screen bg-white text-[#000000]">
        <Nav />
        <section className="px-6 md:px-12 lg:px-20 py-32 text-center">
          <p className="text-5xl mb-6">🦙</p>
          <h1 className="font-black text-3xl mb-4">Already submitted</h1>
          <p className="text-[#6B7280] mb-8">We already have your intake for this order. We&apos;re on it.</p>
          <a href={`/confirmation/${orderId}`} className="inline-block bg-[#000000] text-white font-bold px-8 py-4 rounded-full hover:bg-[#2563EB] transition-colors">View your order →</a>
        </section>
        <Footer />
      </div>
    );
  }

  const channelName = CHANNEL_NAMES[order.channel] ?? order.channel;
  const tierLabel = order.tier.charAt(0).toUpperCase() + order.tier.slice(1);

  return (
    <div className="min-h-screen bg-white text-[#000000]">
      <Nav />

      <section className="bg-[#000000] px-6 md:px-12 lg:px-20 py-16">
        <div className="max-w-3xl mx-auto">
          {nextOrders ? (
            <p className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-3">
              Package intake ({nextOrders.split(",").length + 1} remaining after this)
            </p>
          ) : (
            <p className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-3">Step 2 of 2</p>
          )}
          <h1 className="font-black text-white leading-tight" style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}>
            Tell us about your business
          </h1>
          <p className="text-[#9CA3AF] mt-3">
            {channelName} · {tierLabel} · Order #{orderId.slice(0, 8).toUpperCase()}
          </p>
          <p className="text-[#6B7280] mt-4 max-w-xl leading-relaxed">
            Answer what you can. If you&apos;re unsure about anything, hit{" "}
            <span className="text-[#2563EB] font-semibold">Let The Llamas Decide</span>{" "}
            and we&apos;ll make the call. Takes about 5 to 10 minutes.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-20 py-16">
        <div className="max-w-3xl mx-auto">
          <IntakeForm orderId={orderId} channel={order.channel} nextOrders={nextOrders} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
