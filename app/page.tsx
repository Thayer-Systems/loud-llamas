import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FAQAccordion from "@/components/FAQAccordion";

const CHANNELS = [
  { name: "Website Build", slug: "website-build", starter: 499 },
  { name: "Email / Lifecycle", slug: "email-lifecycle", starter: 249 },
  { name: "Organic Social", slug: "organic-social", starter: 249 },
  { name: "SEO / AEO Foundation", slug: "seo-aeo", starter: 349 },
  { name: "Paid Social Playbook", slug: "paid-social", starter: 149 },
  { name: "SEM / Google Ads", slug: "sem-google-ads", starter: 399 },
  { name: "Analytics & Tracking", slug: "analytics-tracking", starter: 199 },
  { name: "Automation", slug: "automation", starter: 599 },
];

const STEPS = [
  {
    number: "01",
    title: "Pick your package",
    desc: "8 channels. 3 tiers each. You know what you need — or let the configurator figure it out.",
  },
  {
    number: "02",
    title: "Fill out your intake",
    desc: "Answer a few questions about your business. Stuck on something? Check the box. Let The Llamas Decide.",
  },
  {
    number: "03",
    title: "We build it, you own it",
    desc: "5–7 business days. Full handoff. Yours forever. No dependency, no retainer, no monthly fee.",
  },
];

const STATS = [
  { value: "8", label: "Marketing Channels" },
  { value: "5–7", label: "Day Turnaround" },
  { value: "3", label: "Tiers Per Channel" },
  { value: "$79", label: "Break Fix Fee" },
];

const FAQS = [
  {
    q: "Do I need to know exactly what I want?",
    a: "Not really. That's what the configurator is for. If you're stuck, check the box. Let The Llamas Decide. You can update it later.",
  },
  {
    q: "How long does it take?",
    a: "5–7 business days standard. 3 days if you add rush at checkout.",
  },
  {
    q: "What if something breaks after handoff?",
    a: "Flat $79 troubleshooting fee. No drama.",
  },
  {
    q: "Do you offer ongoing management?",
    a: "No. But we can refer you to someone who does.",
  },
  {
    q: "What platforms do you use?",
    a: "We recommend the best tool for your budget and situation. Every recommendation comes with affiliate pricing where available, which helps keep our setup fees low.",
  },
  {
    q: "Can I buy more than one package?",
    a: "Oh, we hope you do. It helps feed the llamas. Each one is its own sprint. Mix and match.",
  },
  {
    q: "Why is Paid Social a playbook instead of a setup?",
    a: "Because Meta makes it nearly impossible for third parties to properly access and configure ad accounts on behalf of clients. Rather than promise something we cannot cleanly deliver, we built a better product. The playbook gives you everything you need to launch it yourself.",
  },
];

const TICKER_ITEMS = [
  "Website Build", "Email / Lifecycle", "Organic Social", "SEO / AEO Foundation",
  "Paid Social Playbook", "SEM / Google Ads", "Analytics & Tracking", "Automation",
  "5–7 Day Turnaround", "One-Time Price", "Full Handoff", "No Retainers",
];

/* ── Inline SVG illustrations ── */

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


export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#0D0D0D]">
      <Nav />

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-16 pb-8 overflow-hidden">
        <div
          className="absolute right-0 top-0 h-full pointer-events-none select-none hidden lg:flex items-center pr-8"
          aria-hidden="true"
        >
          <Image src="/logo-dark.png" alt="" width={560} height={560} className="object-contain" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 lg:pr-[520px]">
          <p
            className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-8 animate-fade-in"
            style={{ animationDelay: "0ms" }}
          >
            Marketing Setup Studio
          </p>
          <h1 className="font-black leading-[0.92] tracking-tight" style={{ fontSize: "clamp(3.5rem, 9.5vw, 8.5rem)" }}>
            <span className="block animate-slide-up overflow-hidden pb-3" style={{ animationDelay: "80ms" }}>
              Stop stalling.
            </span>
            <span className="block animate-slide-up overflow-hidden pb-10" style={{ animationDelay: "220ms" }}>
              <span className="relative inline-block">
                Start marketing.
                <svg className="scribble-underline" viewBox="0 0 520 10" preserveAspectRatio="none" aria-hidden="true">
                  <polygon points="0,0 520,4 520,6 0,10" fill="#2563EB" />
                </svg>
              </span>
            </span>
          </h1>
          <div className="mt-10 max-w-xl">
            <p className="text-xl text-[#6B7280] leading-relaxed animate-fade-in" style={{ animationDelay: "480ms" }}>
              Pick your channel. Pay once. Get it done in 5–7 days.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "620ms" }}>
              <Link href="/packages" className="bg-[#0D0D0D] text-white font-semibold text-base px-8 py-4 rounded-full hover:bg-[#2563EB] transition-colors duration-300">
                Build your setup
              </Link>
              <Link href="/how-it-works" className="text-[#0D0D0D] font-semibold text-base px-8 py-4 rounded-full border border-[#DEDEDE] hover:border-[#0D0D0D] transition-colors duration-300">
                How it works
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto w-full mt-20 relative z-10">
          <div className="h-px bg-[#EBEBEB]" />
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="px-6 md:px-12 lg:px-20 py-16 bg-[#0D0D0D]">
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

      {/* ── TICKER ── */}
      <div className="border-y border-[#EBEBEB] py-4 overflow-hidden bg-white">
        <div className="ticker-track flex gap-12 whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="text-sm font-semibold text-[#0D0D0D] flex items-center gap-3 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] inline-block" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── PROBLEM BLOCK ── */}
      <section className="px-6 md:px-12 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-semibold text-[#0D0D0D] leading-tight max-w-3xl mx-auto" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
            You know you need to do it. You&apos;ve been putting it off. We get it.
          </p>
          <p className="mt-6 text-lg text-[#6B7280] max-w-xl mx-auto leading-relaxed">
            Here&apos;s what we do: set it all up, hand you the keys, and get out of your way.
          </p>
        </div>
      </section>

      {/* ── PULL QUOTE + LLAMA ── */}
      <section className="bg-[#0D0D0D] px-6 md:px-12 lg:px-20 py-28">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <blockquote className="font-black text-white leading-tight max-w-3xl" style={{ fontSize: "clamp(2rem, 5vw, 4.25rem)" }}>
            We&apos;re not your agency.{" "}
            <span className="text-[#2563EB]">We&apos;re your launch crew.</span>
          </blockquote>
          <LlamaJumpSVG />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="px-6 md:px-12 lg:px-20 py-28">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-4">The Process</p>
          <h2 className="font-black text-[#0D0D0D] mb-16" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            {STEPS.map((step) => (
              <div key={step.number} className="border-t-2 border-[#0D0D0D] pt-6">
                <span className="text-4xl font-black text-[#2563EB]">{step.number}</span>
                <h3 className="text-xl font-bold text-[#0D0D0D] mt-4">{step.title}</h3>
                <p className="text-[#6B7280] mt-3 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKAGE PREVIEW ── */}
      <section className="bg-[#F8F8F8] px-6 md:px-12 lg:px-20 py-28">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-4">What We Set Up</p>
          <h2 className="font-black text-[#0D0D0D] mb-3" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
            8 channels. Pick yours.
          </h2>
          <p className="text-[#6B7280] text-lg mb-12">Starter, Growth, or Pro. One-time price. Full setup.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {CHANNELS.map((ch) => (
              <Link
                key={ch.slug}
                href={`/configure/${ch.slug}`}
                className="bg-white rounded-2xl p-6 border border-[#EBEBEB] hover:border-[#2563EB] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <h3 className="font-bold text-base text-[#0D0D0D] mb-3 group-hover:text-[#2563EB] transition-colors">{ch.name}</h3>
                <p className="text-sm text-[#6B7280] mb-5">
                  from <span className="font-semibold text-[#0D0D0D]">${ch.starter}</span>
                </p>
                <span className="text-sm font-semibold text-[#2563EB] flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                  Get started <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-12">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 text-[#0D0D0D] font-semibold border-b-2 border-[#0D0D0D] pb-0.5 hover:border-[#2563EB] hover:text-[#2563EB] transition-colors duration-300"
            >
              See all packages &amp; pricing <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── POSITIONING BLOCK — right-aligned, all black, llama party left ── */}
      <section className="px-6 md:px-12 lg:px-20 py-28">
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
              className="font-black text-[#0D0D0D] leading-[1.0]"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 5.5rem)" }}
            >
              No retainers.<br />
              No monthly fees.<br />
              No 18-month contracts.
            </h2>
            <p className="mt-8 text-xl text-[#6B7280] max-w-md lg:ml-auto">
              Just a clean setup and a handoff.
            </p>
          </div>
        </div>
      </section>

      {/* ── PAID SOCIAL CALLOUT + PLAYBOOK ── */}
      <section className="bg-[#0D0D0D] px-6 md:px-12 lg:px-20 py-28">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="flex-1">
            <span className="inline-block bg-[#2563EB] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-10">
              Honest talk about Meta
            </span>
            <p className="text-[#9CA3AF] leading-relaxed max-w-3xl" style={{ fontSize: "clamp(1.125rem, 2vw, 1.5rem)" }}>
              Meta makes it nearly impossible for third parties to configure ad accounts on behalf
              of clients. We&apos;re not going to pretend otherwise. So instead of a half-baked
              setup, we built something better:{" "}
              <span className="text-white font-semibold">The Paid Social Playbook.</span>{" "}
              Years of paid social experience packaged into a step-by-step implementation guide.
              You run it. We built it. Same outcome, no access headaches.
            </p>
            <Link
              href="/configure/paid-social"
              className="inline-block mt-10 bg-[#2563EB] text-white font-semibold px-8 py-4 rounded-full hover:bg-blue-500 transition-colors duration-300"
            >
              Get the playbook
            </Link>
          </div>
          <div className="flex justify-center lg:justify-end pt-4 shrink-0">
            <Image
              src="/meta-logo-white.png"
              alt=""
              width={220}
              height={220}
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* ── FAQ — accordion, centered ── */}
      <section id="faq" className="px-6 md:px-12 lg:px-20 py-28">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-4">Got questions</p>
          <h2 className="font-black text-[#0D0D0D] mb-16" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
            FAQ
          </h2>
          <FAQAccordion faqs={FAQS} />
        </div>
      </section>

      {/* ── FOOTER CTA — centered with party icons ── */}
      <section className="bg-[#0D0D0D] px-6 md:px-12 lg:px-20 py-28">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-start justify-center gap-6 md:gap-10">
            <span className="text-5xl md:text-7xl mt-2 hidden sm:block" aria-hidden="true">🎉</span>
            <h2
              className="font-black text-white leading-[0.92] tracking-tight"
              style={{ fontSize: "clamp(3rem, 8vw, 7.5rem)" }}
            >
              Stop stalling.<br />
              Let the llamas<br />
              <span className="text-[#2563EB]">handle it.</span>
            </h2>
            <span className="text-5xl md:text-7xl mt-2 hidden sm:block" aria-hidden="true">🎉</span>
          </div>
          <p className="text-[#6B7280] mt-8 text-lg">Pick a channel. Pay once. Done in 5–7 days.</p>
          <Link
            href="/packages"
            className="inline-block mt-10 bg-white text-[#0D0D0D] font-bold text-lg px-10 py-4 rounded-full hover:bg-[#2563EB] hover:text-white transition-colors duration-300"
          >
            Build your setup
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
