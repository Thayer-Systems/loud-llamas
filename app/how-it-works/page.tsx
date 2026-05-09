import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "How It Works — Loud Llamas",
  description: "Pick a channel, fill out your intake, and we build it in 5–7 days. No calls, no retainers, no guesswork.",
};

const STEPS = [
  {
    number: "01",
    title: "Pick your package",
    tagline: "You know what you need. Or you don't — that's fine too.",
    description:
      "Browse 6 marketing channels plus Burnrate. Not sure which one to pick? Start with whatever's been on your to-do list the longest. You can always add more later — each one is its own sprint.",
    details: [
      "Website Build, SEM / Google Ads, Analytics, Email, Paid Social Playbook, or Automation",
      "Starter, Growth, or Pro tiers — scaled by scope, not by time",
      "One-time price, no surprise invoices (Burnrate is the only recurring product)",
      "Mix and match — buy as many channels as you want",
    ],
  },
  {
    number: "02",
    title: "Fill out your intake",
    tagline: "A few questions. No calls required.",
    description:
      "After you pick your package, you'll fill out a short intake form. It's a quick set of questions about your business, your goals, and what you already have. If you're stuck on something — check the box. Let The Llamas Decide. We'll use our judgment.",
    details: [
      "Button-grid questions — no long essays required",
      "Every critical field has a 'Let The Llamas Decide' option",
      "Takes about 5–10 minutes depending on the channel",
      "You can upload assets (logo, copy, etc.) right in the form",
    ],
  },
  {
    number: "03",
    title: "We build it",
    tagline: "5–7 business days. We get to work, you get on with your life.",
    description:
      "Once your intake is submitted, our team starts building. We use your answers to configure, set up, and launch your marketing channel exactly the way you described. Need it faster? Add Rush Delivery at checkout for a 3-day turnaround.",
    details: [
      "Standard delivery: 5–7 business days",
      "Rush delivery available: 3 business days (+$299)",
      "You'll get a confirmation email with your expected delivery date",
      "We work async — no status calls, no check-ins required",
    ],
  },
  {
    number: "04",
    title: "You own it",
    tagline: "Full handoff. No strings attached.",
    description:
      "When we're done, we hand everything over. Credentials, documentation, logins — it's all yours. There's no retainer, no monthly fee, and no dependency on us to keep things running. If something breaks after handoff, our flat $79 break-fix fee has you covered.",
    details: [
      "Full documentation of what was built and how it works",
      "All credentials and access transferred to you",
      "No ongoing fees, no subscriptions, no monthly invoices",
      "Break fix support available at $79/incident if something goes wrong",
    ],
  },
];

const WHAT_WE_NEED = [
  { item: "Access to your platforms", note: "We'll tell you exactly what to share — no password sharing required for most channels." },
  { item: "Your completed intake form", note: "The more detail you give us, the better the result. Use 'Let The Llamas Decide' if you're unsure." },
  { item: "Any existing assets", note: "Logo, brand colors, copy, photos — anything you have. We work with what we've got." },
  { item: "A little patience", note: "We're building something real. 5–7 days goes fast." },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white text-[#000000]">
      <Nav />

      {/* HEADER */}
      <section className="bg-[#000000] px-6 md:px-12 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-4">The Process</p>
          <h1 className="font-black text-white leading-tight" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
            How it works
          </h1>
          <p className="text-[#9CA3AF] text-xl mt-4 max-w-xl">
            Pick a channel. Fill out an intake. We build it. You own it. That&apos;s the whole thing.
          </p>
        </div>
      </section>

      {/* STEPS */}
      <section className="px-6 md:px-12 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto flex flex-col gap-0">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`flex flex-col lg:flex-row gap-12 py-16 ${i < STEPS.length - 1 ? "border-b border-[#EBEBEB]" : ""}`}
            >
              {/* Step number */}
              <div className="lg:w-32 shrink-0">
                <span className="text-5xl font-black text-[#2563EB]">{step.number}</span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h2 className="text-3xl font-black text-[#000000] mb-1">{step.title}</h2>
                <p className="text-[#2563EB] font-semibold mb-4">{step.tagline}</p>
                <p className="text-[#6B7280] text-lg leading-relaxed mb-8 max-w-2xl">{step.description}</p>
                <ul className="flex flex-col gap-3">
                  {step.details.map((d) => (
                    <li key={d} className="flex items-start gap-3 text-[#000000]">
                      <span className="text-[#2563EB] mt-1 shrink-0">✓</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT WE NEED FROM YOU */}
      <section className="bg-[#F8F8F8] px-6 md:px-12 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-4">Your side of the deal</p>
          <h2 className="font-black text-[#000000] mb-12" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            What we need from you
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {WHAT_WE_NEED.map((w) => (
              <div key={w.item} className="bg-white rounded-2xl p-6 border border-[#EBEBEB]">
                <p className="font-bold text-[#000000] mb-2">{w.item}</p>
                <p className="text-[#6B7280] leading-relaxed">{w.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="px-6 md:px-12 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-4">Timeline</p>
          <h2 className="font-black text-[#000000] mb-12" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            What to expect, day by day
          </h2>
          <div className="max-w-2xl flex flex-col gap-0 divide-y divide-[#EBEBEB]">
            {[
              { day: "Day 0", label: "You complete checkout + intake form" },
              { day: "Day 1", label: "We review your intake and start building" },
              { day: "Days 2–5", label: "Active build — we set everything up per your intake" },
              { day: "Day 5–7", label: "Quality check, final touches, handoff prep" },
              { day: "Day 7", label: "You receive credentials, documentation, and full ownership" },
            ].map((t) => (
              <div key={t.day} className="flex items-center gap-8 py-5">
                <span className="text-sm font-black text-[#2563EB] w-20 shrink-0">{t.day}</span>
                <span className="text-[#000000] font-medium">{t.label}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-[#6B7280] mt-6">
            Rush delivery compresses Days 1–7 into 3 business days. Add it at checkout for +$299.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#000000] px-6 md:px-12 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-black text-white leading-tight mb-4" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
            Ready to stop putting it off?
          </h2>
          <p className="text-[#9CA3AF] text-lg mb-10 max-w-lg">
            Pick a channel. Fill out the intake. We handle the rest in 5–7 days.
          </p>
          <Link
            href="/packages"
            className="inline-block bg-white text-[#000000] font-bold text-lg px-10 py-4 rounded-full hover:bg-[#2563EB] hover:text-white transition-colors duration-300"
          >
            See all packages
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
