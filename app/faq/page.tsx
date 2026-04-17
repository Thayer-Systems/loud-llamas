import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FAQAccordion from "@/components/FAQAccordion";

export const metadata = {
  title: "FAQ — Loud Llamas",
  description: "Common questions about how Loud Llamas works, what's included, turnaround time, and what happens after handoff.",
};

const FAQS = [
  {
    q: "Do I need to know exactly what I want?",
    a: "Not really. That's what the configurator is for. If you're stuck on something, check the box. Let The Llamas Decide. You can always update it later — we'll reach out if we have questions before we start.",
  },
  {
    q: "How long does it take?",
    a: "Standard turnaround is 5–7 business days from the time your intake is submitted. Need it faster? Add Rush Delivery at checkout for +$299 and we'll get it done in 3 business days.",
  },
  {
    q: "What's included in the handoff?",
    a: "Everything. You get full credentials, login access, documentation on what was built and how it works, and all assets we created. There are no strings attached. It's yours, forever.",
  },
  {
    q: "What if something breaks after handoff?",
    a: "We offer a flat $79 break-fix fee per incident. No retainer required, no ongoing commitment. Just reach out and we'll sort it out.",
  },
  {
    q: "Do you offer ongoing management?",
    a: "No — we're a setup shop, not an agency. We get everything configured and hand it off. If you need ongoing management, we can point you in the right direction.",
  },
  {
    q: "What platforms do you use?",
    a: "We recommend the best tool for your budget and situation. We work across all major platforms — Klaviyo, Mailchimp, ActiveCampaign, WordPress, Webflow, Google Ads, GA4, and more. We'll tell you exactly what we're using before we start.",
  },
  {
    q: "Can I buy more than one package?",
    a: "Yes, and we hope you do. It helps feed the llamas. Each channel is its own sprint, so you can buy as many as you want. They run independently.",
  },
  {
    q: "Do I need to share my passwords?",
    a: "Usually not. Most platforms support admin role invites — we'll walk you through exactly what access to grant. We'll never ask for master passwords.",
  },
  {
    q: "Why is Paid Social a playbook instead of a setup?",
    a: "Because Meta makes it nearly impossible for third parties to configure ad accounts on behalf of clients — not for lack of trying. Rather than sell you something we can't cleanly deliver, we built a better product: a complete step-by-step implementation guide built from years of paid social experience. You run it. We built the roadmap.",
  },
  {
    q: "What if I'm not happy with the result?",
    a: "Talk to us. We're a small team and we take our work seriously. If something isn't right, we'll make it right. We're not going to disappear after handoff.",
  },
  {
    q: "Is there a free trial or money-back guarantee?",
    a: "There's no free trial — we're doing real setup work. But if we can't complete your setup as described, you don't pay. We stand behind the work.",
  },
  {
    q: "What do I need to provide to get started?",
    a: "After checkout, you'll fill out a short intake form. It takes about 5–10 minutes. Attach any existing assets (logo, brand colors, copy) and answer a few questions about your goals. If you're unsure about anything, check the 'Let The Llamas Decide' box.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white text-[#000000]">
      <Nav />

      {/* HEADER */}
      <section className="bg-[#000000] px-6 md:px-12 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-4">Got questions</p>
          <h1 className="font-black text-white leading-tight" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
            Frequently asked questions
          </h1>
          <p className="text-[#9CA3AF] text-xl mt-4 max-w-xl">
            If it&apos;s not here, reach out. We&apos;re real people and we&apos;ll answer.
          </p>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="px-6 md:px-12 lg:px-20 py-24">
        <div className="max-w-3xl mx-auto">
          <FAQAccordion faqs={FAQS} />
        </div>
      </section>

      {/* STILL HAVE QUESTIONS */}
      <section className="bg-[#F8F8F8] px-6 md:px-12 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-4">Still unsure?</p>
            <h2 className="font-black text-[#000000] mb-6" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              We&apos;re not a robot.
            </h2>
            <p className="text-[#6B7280] text-lg leading-relaxed mb-8">
              If you have a question that&apos;s not covered here, just ask. No sales call required —
              just a real answer from the team.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/support"
                className="inline-block bg-[#000000] text-white font-bold px-8 py-4 rounded-full hover:bg-[#2563EB] transition-colors duration-300"
              >
                Contact us
              </Link>
              <Link
                href="/packages"
                className="inline-block border border-[#DEDEDE] text-[#000000] font-bold px-8 py-4 rounded-full hover:border-[#000000] transition-colors duration-300"
              >
                See all packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
