import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FAQAccordion from "@/components/FAQAccordion";
import FounderCounter from "@/components/FounderCounter";
import { getFounderCount } from "@/lib/founder-count";

export const revalidate = 60;

type ChannelGroup = "one-time" | "setup-sub" | "custom";
type ChannelCard = {
  name: string;
  slug: string;
  from: number;
  sub?: number;
  group: ChannelGroup;
  blurb: string;
};

const CHANNELS: ChannelCard[] = [
  { name: "Website Build", slug: "website-build", from: 179, group: "one-time", blurb: "Fully custom. No WordPress." },
  { name: "Paid Social Playbook", slug: "paid-social", from: 59, group: "one-time", blurb: "Built around your ICP. Not a template." },
  { name: "SEM / Google Ads", slug: "sem-google-ads", from: 149, sub: 99, group: "setup-sub", blurb: "Setup + optional 3-mo management." },
  { name: "Analytics & Tracking", slug: "analytics-tracking", from: 99, sub: 49, group: "setup-sub", blurb: "GA4, events, dashboard." },
  { name: "Email / Lifecycle", slug: "email-lifecycle", from: 99, sub: 49, group: "setup-sub", blurb: "Welcome flow + segmentation." },
  { name: "Automation", slug: "automation", from: 79, group: "custom", blurb: "Custom-quoted. Not a template." },
];

const STEPS = [
  {
    number: "01",
    title: "Pick your channel",
    desc: "6 setups + Burnrate. No bundle nonsense. Buy what you need. Skip what you don't.",
  },
  {
    number: "02",
    title: "Fill out your intake",
    desc: "Short form. No discovery call. No 'kickoff workshop.' Submit and you're done.",
  },
  {
    number: "03",
    title: "We build it in 5–7 days",
    desc: "You get the work, the credentials, and the receipts. Then we leave. You own it forever.",
  },
];

const STATS = [
  { value: "5–7", label: "Day Turnaround" },
  { value: "$0", label: "Retainers" },
  { value: "0", label: "Discovery Calls" },
  { value: "100%", label: "Yours Forever" },
];

// Marketing-staged founder count for the front of the funnel.
// Shows "23 spots left" until we wire the live count back in.
const STATIC_FOUNDER_COUNT = 77;
const STATIC_FOUNDER_TOTAL = 100;

const FAQS = [
  {
    q: "Do I need to know exactly what I want?",
    a: "Not really. The configurator handles it. If you're stuck on something, check the box. Let The Llamas Decide.",
  },
  {
    q: "How long does it take?",
    a: "5–7 business days standard. Burnrate's first report lands in 24 hours.",
  },
  {
    q: "What if something breaks after handoff?",
    a: "Flat $79 troubleshooting fee. No retainer. No drama.",
  },
  {
    q: "Do you offer ongoing management?",
    a: "Only on SEM, Analytics, and Email — and only as an optional 3-month subscription, never required. Burnrate is the one true recurring product. Everything else is one-time.",
  },
  {
    q: "Why is Paid Social a playbook instead of a setup?",
    a: "Meta makes it nearly impossible for third parties to configure ad accounts on behalf of clients. We're not going to pretend otherwise. So we built something better — a custom playbook around your ICP and your offer. You run it. We built the roadmap.",
  },
  {
    q: "What's Burnrate?",
    a: "A SaaS that connects your Google Ads and Meta accounts, runs weekly waste detection, and hands you a prioritized fix list. $29/mo. Founders pay $17.99/mo locked forever. First 100 only.",
  },
  {
    q: "Can I buy more than one package?",
    a: "Please do. It feeds the llamas. Each setup is its own sprint — they run in parallel.",
  },
];

const TICKER_ITEMS = [
  "Website Build", "SEM / Google Ads", "Analytics & Tracking", "Email / Lifecycle",
  "Paid Social Playbook", "Automation", "Burnrate",
  "5–7 Day Turnaround", "Pay Once", "Full Handoff", "No Retainers", "No Discovery Calls",
];

function LlamaJumpSVG() {
  return (
    <div className="w-64 lg:w-80 shrink-0 flex items-center justify-center" aria-hidden="true">
      <Image
        src="/black-and-white-llama-outline-illustration-with-llama-and-glama-clipart-vector.jpg"
        alt=""
        width={320}
        height={320}
        className="object-contain"
        style={{ filter: "invert(1)" }}
      />
    </div>
  );
}

export default async function HomePage() {
  // Live count is computed but not used on the homepage marketing surface — the
  // displayed counter is staged. Keep the call so any cache warming still happens.
  await getFounderCount();
  const founderCount = STATIC_FOUNDER_COUNT;
  const founderTotal = STATIC_FOUNDER_TOTAL;

  return (
    <div className="min-h-screen bg-white text-[#000000]">
      <Nav />

      {/* HERO */}
      <section className="relative min-h-[78vh] flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-12 pb-6 overflow-hidden">
        <div
          className="absolute top-1/2 -translate-y-1/2 right-[6vw] pointer-events-none select-none hidden lg:flex items-center"
          aria-hidden="true"
        >
          <Image src="/logo-dark.png" alt="" width={380} height={380} className="object-contain" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 lg:pr-[360px]">
          <p
            className="text-sm font-bold tracking-widest uppercase text-[#2563EB] mb-6 animate-fade-in"
            style={{ animationDelay: "0ms" }}
          >
            Marketing setup. Done once. Done right.
          </p>
          <h1 className="font-black leading-[0.95] tracking-tight" style={{ fontSize: "clamp(2.5rem, 6.5vw, 5.25rem)" }}>
            <span className="block animate-slide-up overflow-hidden pb-2" style={{ animationDelay: "80ms" }}>
              Agencies are a scam.
            </span>
            <span className="block animate-slide-up overflow-hidden pb-8" style={{ animationDelay: "220ms" }}>
              <span className="relative inline-block">
                We&apos;re the exit.
                <svg className="scribble-underline" viewBox="0 0 520 10" preserveAspectRatio="none" aria-hidden="true">
                  <polygon points="0,0 520,4 520,6 0,10" fill="#2563EB" />
                </svg>
              </span>
            </span>
          </h1>
          <div className="mt-8 max-w-xl">
            <p className="text-lg md:text-xl text-[#6B7280] leading-relaxed animate-fade-in" style={{ animationDelay: "480ms" }}>
              You don&apos;t need a retainer. You don&apos;t need a 12-month contract. You need a setup. Pay once. Own it forever.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 animate-fade-in" style={{ animationDelay: "620ms" }}>
              <Link href="/packages" className="bg-[#000000] text-white font-semibold text-base px-7 py-3.5 rounded-full hover:bg-[#2563EB] transition-colors duration-300">
                See Packages
              </Link>
              <Link href="/burnrate" className="text-[#000000] font-semibold text-base px-7 py-3.5 rounded-full border border-[#DEDEDE] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors duration-300">
                What is Burnrate?
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto w-full mt-12 relative z-10">
          <div className="h-px bg-[#EBEBEB]" />
        </div>
      </section>

      {/* STATS BAR */}
      <section className="px-6 md:px-12 lg:px-20 py-16 bg-[#000000]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="font-black text-white leading-none" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                  {stat.value}
                </p>
                <p className="text-[#2563EB] text-sm mt-2 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="border-y border-[#EBEBEB] py-4 overflow-hidden bg-white">
        <div className="ticker-track flex gap-12 whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="text-sm font-semibold text-[#000000] flex items-center gap-3 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] inline-block" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* PROBLEM BLOCK */}
      <section className="px-6 md:px-12 lg:px-20 py-24">
        <div className="max-w-4xl mx-auto">
          <p className="font-black text-[#000000] leading-[1.05]" style={{ fontSize: "clamp(2rem, 4.5vw, 3.75rem)" }}>
            You&apos;ve been quoted{" "}
            <span className="text-[#6B7280]">$5K/mo for a 12-month contract</span>{" "}
            to do what we&apos;ll set up in a week.
          </p>
          <p className="mt-8 text-lg text-[#6B7280] max-w-2xl leading-relaxed">
            Marketing agencies are bloated. They sell process and time. We sell finished work. Pick a channel. Pay once. Get the credentials. We leave. The end.
          </p>
        </div>
      </section>

      {/* PULL QUOTE */}
      <section className="bg-[#000000] px-6 md:px-12 lg:px-20 py-28">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <blockquote className="font-black text-white leading-[0.95] max-w-3xl" style={{ fontSize: "clamp(2rem, 5vw, 4.25rem)" }}>
            We&apos;re not your agency.{" "}
            <span className="text-[#2563EB]">We&apos;re your launch crew.</span>
          </blockquote>
          <LlamaJumpSVG />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="px-6 md:px-12 lg:px-20 py-28">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-bold tracking-widest uppercase text-[#2563EB] mb-4">The Process</p>
          <h2 className="font-black text-[#000000] mb-16 leading-[1.0]" style={{ fontSize: "clamp(2rem, 4.5vw, 3.75rem)" }}>
            Pick. Submit. Done in a week.
          </h2>
          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            {STEPS.map((step) => (
              <div key={step.number} className="border-t-2 border-[#000000] pt-6">
                <span className="text-4xl font-black text-[#2563EB]">{step.number}</span>
                <h3 className="text-xl font-bold text-[#000000] mt-4">{step.title}</h3>
                <p className="text-[#6B7280] mt-3 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGE PREVIEW */}
      <section className="bg-[#F8F8F8] px-6 md:px-12 lg:px-20 py-28">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-bold tracking-widest uppercase text-[#2563EB] mb-4">What we set up</p>
          <h2 className="font-black text-[#000000] mb-3 leading-[1.0]" style={{ fontSize: "clamp(2rem, 4.5vw, 3.75rem)" }}>
            Six setups. Pick yours.
          </h2>
          <p className="text-[#6B7280] text-lg mb-12">Plus Burnrate, the only recurring thing we sell.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHANNELS.map((ch) => {
              const href = ch.group === "custom" ? "/support?topic=automation" : `/configure/${ch.slug}`;
              return (
                <Link
                  key={ch.slug}
                  href={href}
                  className="bg-white rounded-2xl p-6 border border-[#EBEBEB] hover:border-[#2563EB] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-bold text-base text-[#000000] group-hover:text-[#2563EB] transition-colors">{ch.name}</h3>
                    {ch.group === "custom" && (
                      <span className="bg-[#000000] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded shrink-0">Custom Quote</span>
                    )}
                    {ch.group === "setup-sub" && (
                      <span className="bg-blue-50 text-[#2563EB] text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded shrink-0">+ Optional sub</span>
                    )}
                  </div>
                  <p className="text-sm text-[#6B7280] mb-4 leading-relaxed flex-1">{ch.blurb}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-sm text-[#6B7280]">
                      from <span className="font-extrabold text-[#000000] text-lg">${ch.from}</span>
                      {ch.sub !== undefined && (
                        <span className="block text-xs mt-0.5">+ ${ch.sub}/mo · 3 mo (optional)</span>
                      )}
                    </p>
                    <span className="text-sm font-semibold text-[#2563EB] flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                      {ch.group === "custom" ? "Get a quote" : "Get started"} <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-12">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 text-[#000000] font-semibold border-b-2 border-[#000000] pb-0.5 hover:border-[#2563EB] hover:text-[#2563EB] transition-colors duration-300"
            >
              See all packages &amp; pricing <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* NO RETAINERS — bubble-gum llama */}
      <section className="px-6 md:px-12 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex justify-center lg:justify-start shrink-0">
            <Image
              src="/llama-gum.png"
              alt=""
              width={340}
              height={340}
              className="object-contain rounded-2xl"
            />
          </div>
          <div className="lg:ml-auto text-left lg:text-right">
            <h2
              className="font-black text-[#000000] leading-[1.0]"
              style={{ fontSize: "clamp(2.25rem, 5vw, 4.75rem)" }}
            >
              No retainers.<br />
              No monthly fees.<br />
              No 18-month contracts.
            </h2>
            <p className="mt-7 text-lg text-[#6B7280] max-w-md lg:ml-auto">
              Just a clean setup and a handoff.
            </p>
          </div>
        </div>
      </section>

      {/* BURNRATE CALLOUT */}
      <section className="bg-[#000000] text-white px-6 md:px-12 lg:px-20 py-28">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.4fr_1fr] gap-12 items-center">
          <div>
            <span className="inline-block bg-[#2563EB] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8">
              Your 24/7 paid media monitor · $29/mo
            </span>
            <h2 className="font-black leading-[0.95]" style={{ fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)" }}>
              Your paid ads are<br />
              <span className="text-[#2563EB]">bleeding money.</span><br />
              You can&apos;t see where.
            </h2>
            <p className="text-gray-300 text-lg mt-8 max-w-xl leading-relaxed">
              Burnrate watches your Google Ads and Meta accounts 24/7. Catches the waste. Flags the keywords you&apos;re paying for and already rank organically. Hands you a fix list every week.
            </p>
            <p className="text-gray-400 mt-4 max-w-xl">
              Agencies charge $2,000/mo to glance at this dashboard once a month. We watch it every day for $29.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/burnrate"
                className="bg-[#2563EB] text-white font-bold text-base px-8 py-4 rounded-full hover:bg-blue-700 transition-colors duration-300"
              >
                See Burnrate →
              </Link>
              <Link
                href="/burnrate/start"
                className="text-white font-semibold text-base px-8 py-4 rounded-full border border-[#374151] hover:border-white transition-colors duration-300"
              >
                Start Burnrate
              </Link>
            </div>
          </div>
          <div className="lg:pl-4">
            <FounderCounter count={founderCount} total={founderTotal} variant="dark" size="lg" />
            <p className="text-sm text-gray-400 mt-4 leading-relaxed">
              First 100 customers lock in <span className="text-[#2563EB] font-bold">$17.99/mo forever</span>. After that, $29/mo.
            </p>
          </div>
        </div>
      </section>

      {/* FOUNDER OFFER */}
      <section className="px-6 md:px-12 lg:px-20 py-28">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-bold tracking-widest uppercase text-[#2563EB] mb-4">The Founder Deal</p>
          <h2 className="font-black text-[#000000] leading-[0.95]" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
            First 100 clients.<br />
            <span className="text-[#2563EB]">50% off everything.</span>
          </h2>
          <p className="text-[#6B7280] text-xl mt-6 max-w-2xl leading-relaxed">
            Half off any setup. Burnrate locked at $17.99/mo forever. We&apos;re building the proof that this model works — you get the discount for being early.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <div className="border-2 border-[#000000] rounded-3xl p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-[#000000] mb-3">Setup discount</p>
              <p className="font-black text-5xl mb-3">50% off</p>
              <p className="text-[#6B7280] mb-6">Any one-time setup. Stack as many as you want. Code applies at checkout.</p>
              <Link
                href="/packages"
                className="inline-block bg-[#000000] text-white font-bold px-6 py-3 rounded-full hover:bg-[#2563EB] transition-colors"
              >
                See packages →
              </Link>
            </div>
            <div className="border-2 border-[#2563EB] rounded-3xl p-8 bg-[#000000] text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-[#2563EB] mb-3">Burnrate · Founder</p>
              <p className="font-black text-5xl mb-3">$17.99<span className="text-lg text-gray-400 font-bold">/mo</span></p>
              <p className="text-gray-300 mb-6">Locked forever. No price increases — ever.</p>
              <FounderCounter count={founderCount} total={founderTotal} variant="dark" size="sm" />
              <Link
                href="/burnrate"
                className="inline-block mt-6 bg-[#2563EB] text-white font-bold px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
              >
                Lock it in →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PAID SOCIAL CALLOUT */}
      <section className="bg-[#F8F8F8] px-6 md:px-12 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1">
            <span className="inline-block bg-[#000000] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8">
              Honest talk about Meta
            </span>
            <p className="text-[#000000] font-medium leading-relaxed" style={{ fontSize: "clamp(1.125rem, 2vw, 1.5rem)" }}>
              Meta won&apos;t let agencies properly access your ad account. Period. So instead of pretending we can do something we can&apos;t, we built the{" "}
              <Link href="/configure/paid-social" className="text-[#2563EB] font-bold hover:underline">Paid Social Playbook</Link>{" "}
              — a custom roadmap built around your ICP and your offer. You run the ads. We built the plan.
            </p>
            <Link
              href="/configure/paid-social"
              className="inline-block mt-8 bg-[#2563EB] text-white font-semibold px-8 py-4 rounded-full hover:bg-blue-700 transition-colors duration-300"
            >
              Get the playbook from $59 →
            </Link>
          </div>
          <div className="flex justify-center lg:justify-end pt-4 shrink-0">
            <Image
              src="/meta-logo.png"
              alt=""
              width={180}
              height={180}
              className="object-contain opacity-90"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 md:px-12 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm font-bold tracking-widest uppercase text-[#2563EB] mb-4">Got questions</p>
          <h2 className="font-black text-[#000000] mb-16" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
            FAQ
          </h2>
          <FAQAccordion faqs={FAQS} />
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="bg-[#000000] px-6 md:px-12 lg:px-20 py-28">
        <div className="max-w-7xl mx-auto text-center">
          <h2
            className="font-black text-white leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(3rem, 8vw, 7.5rem)" }}
          >
            Stop renting your<br />
            marketing.<br />
            <span className="text-[#2563EB]">Buy it instead.</span>
          </h2>
          <p className="text-[#6B7280] mt-8 text-lg">Pick a channel. Pay once. Done in 5–7 days.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/packages"
              className="inline-block bg-white text-[#000000] font-bold text-lg px-10 py-4 rounded-full hover:bg-[#2563EB] hover:text-white transition-colors duration-300"
            >
              See packages
            </Link>
            <Link
              href="/burnrate"
              className="inline-block border-2 border-[#374151] text-white font-bold text-lg px-10 py-4 rounded-full hover:border-white transition-colors duration-300"
            >
              Or start Burnrate
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
