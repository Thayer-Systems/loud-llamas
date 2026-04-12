import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const CHANNELS = [
  { name: "Website Build", slug: "website-build", starter: 499 },
  { name: "Email / Lifecycle", slug: "email-lifecycle", starter: 249 },
  { name: "Organic Social", slug: "organic-social", starter: 249 },
  { name: "SEO / AEO Foundation", slug: "seo-aeo", starter: 349 },
  { name: "Paid Social Playbook", slug: "paid-social", starter: 149 },
  { name: "SEM / Google Ads", slug: "sem-google-ads", starter: 399 },
  { name: "Analytics & Tracking", slug: "analytics-tracking", starter: 199 },
];

const STEPS = [
  {
    number: "01",
    title: "Pick your package",
    desc: "7 channels. 3 tiers each. You know what you need — or let the configurator figure it out.",
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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#0D0D0D]">
      <Nav />

      {/* ── HERO ── */}
      <section className="min-h-[92vh] flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-16 pb-8">
        <div className="max-w-7xl mx-auto w-full">
          <p
            className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-8 animate-fade-in"
            style={{ animationDelay: "0ms" }}
          >
            Marketing Setup Studio
          </p>

          <h1
            className="font-black leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(3.5rem, 9.5vw, 8.5rem)" }}
          >
            <span
              className="block animate-slide-up overflow-hidden"
              style={{ animationDelay: "80ms" }}
            >
              Stop stalling.
            </span>
            <span
              className="block animate-slide-up overflow-hidden"
              style={{ animationDelay: "220ms" }}
            >
              <span className="relative inline-block">
                Start marketing.
                {/* Scribble underline in brand blue */}
                <svg
                  className="scribble-underline"
                  viewBox="0 0 520 12"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 9 C70 2, 140 12, 260 6 S430 1, 518 9"
                    stroke="#2563EB"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </span>
          </h1>

          <div className="mt-10 max-w-xl">
            <p
              className="text-xl text-[#6B7280] leading-relaxed animate-fade-in"
              style={{ animationDelay: "480ms" }}
            >
              Pick your channel. Pay once. Get it done in 5–7 days.
            </p>
            <div
              className="mt-8 flex flex-wrap gap-4 animate-fade-in"
              style={{ animationDelay: "620ms" }}
            >
              <Link
                href="/packages"
                className="bg-[#0D0D0D] text-white font-semibold text-base px-8 py-4 rounded-full hover:bg-[#2563EB] transition-colors duration-300"
              >
                Build your setup
              </Link>
              <Link
                href="/#how-it-works"
                className="text-[#0D0D0D] font-semibold text-base px-8 py-4 rounded-full border border-[#DEDEDE] hover:border-[#0D0D0D] transition-colors duration-300"
              >
                How it works
              </Link>
            </div>
          </div>
        </div>

        {/* Divider line at bottom of hero */}
        <div className="max-w-7xl mx-auto w-full mt-20">
          <div className="h-px bg-[#EBEBEB]" />
        </div>
      </section>

      {/* ── PROBLEM BLOCK ── */}
      <section className="px-6 md:px-12 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto">
          <p
            className="font-semibold text-[#0D0D0D] leading-tight max-w-4xl"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
          >
            You know you need to do it. You&apos;ve been putting it off. We get it.
          </p>
          <p className="mt-6 text-lg text-[#6B7280] max-w-2xl leading-relaxed">
            Here&apos;s what we do: set it all up, hand you the keys, and get out of your way.
          </p>
        </div>
      </section>

      {/* ── PULL QUOTE ── */}
      <section className="bg-[#0D0D0D] px-6 md:px-12 lg:px-20 py-28">
        <div className="max-w-7xl mx-auto">
          <blockquote
            className="font-black text-white leading-tight max-w-4xl"
            style={{ fontSize: "clamp(2rem, 5vw, 4.25rem)" }}
          >
            &ldquo;We&apos;re not your agency.{" "}
            <span className="text-[#2563EB]">We&apos;re your launch crew.&rdquo;</span>
          </blockquote>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="px-6 md:px-12 lg:px-20 py-28">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-4">
            The Process
          </p>
          <h2
            className="font-black text-[#0D0D0D] mb-16"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            {STEPS.map((step) => (
              <div key={step.number}>
                <span
                  className="font-black text-[#0D0D0D] opacity-[0.05] leading-none block select-none"
                  style={{ fontSize: "5.5rem" }}
                >
                  {step.number}
                </span>
                <h3 className="text-xl font-bold text-[#0D0D0D] mt-3">{step.title}</h3>
                <p className="text-[#6B7280] mt-3 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKAGE PREVIEW ── */}
      <section className="bg-[#F8F8F8] px-6 md:px-12 lg:px-20 py-28">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-4">
            What We Set Up
          </p>
          <h2
            className="font-black text-[#0D0D0D] mb-3"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            7 channels. Pick yours.
          </h2>
          <p className="text-[#6B7280] text-lg mb-12">
            Starter, Growth, or Pro. One-time price. Full setup.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {CHANNELS.map((ch) => (
              <Link
                key={ch.slug}
                href={`/configure/${ch.slug}`}
                className="bg-white rounded-2xl p-6 border border-[#EBEBEB] hover:border-[#2563EB] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <h3 className="font-bold text-base text-[#0D0D0D] mb-3 group-hover:text-[#2563EB] transition-colors">
                  {ch.name}
                </h3>
                <p className="text-sm text-[#6B7280] mb-5">
                  from{" "}
                  <span className="font-semibold text-[#0D0D0D]">${ch.starter}</span>
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

      {/* ── POSITIONING BLOCK ── */}
      <section className="px-6 md:px-12 lg:px-20 py-28">
        <div className="max-w-7xl mx-auto">
          <h2
            className="font-black text-[#0D0D0D] leading-[1.0] max-w-4xl"
            style={{ fontSize: "clamp(2.5rem, 5.5vw, 5.5rem)" }}
          >
            No retainers.<br />
            No monthly fees.<br />
            <span className="text-[#BEBEBE]">No 18-month contracts.</span>
          </h2>
          <p className="mt-8 text-xl text-[#6B7280] max-w-md">
            Just a clean setup and a handoff.
          </p>
        </div>
      </section>

      {/* ── PAID SOCIAL CALLOUT ── */}
      <section className="bg-[#0D0D0D] px-6 md:px-12 lg:px-20 py-28">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block bg-[#2563EB] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-10">
            Honest talk about Meta
          </span>
          <p
            className="text-[#9CA3AF] leading-relaxed max-w-3xl"
            style={{ fontSize: "clamp(1.125rem, 2vw, 1.5rem)" }}
          >
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
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="px-6 md:px-12 lg:px-20 py-28">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-4">
            Got questions
          </p>
          <h2
            className="font-black text-[#0D0D0D] mb-16"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            FAQ
          </h2>

          <div className="divide-y divide-[#EBEBEB] max-w-3xl">
            {FAQS.map((faq) => (
              <div key={faq.q} className="py-7">
                <p className="font-bold text-[#0D0D0D] text-lg mb-2">{faq.q}</p>
                <p className="text-[#6B7280] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="bg-[#0D0D0D] px-6 md:px-12 lg:px-20 py-28">
        <div className="max-w-7xl mx-auto">
          <h2
            className="font-black text-white leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(3rem, 8vw, 7.5rem)" }}
          >
            Stop stalling.<br />
            <span className="text-[#2563EB]">Let the llamas handle it.</span>
          </h2>
          <p className="text-[#6B7280] mt-8 text-lg max-w-sm">
            Pick a channel. Pay once. Done in 5–7 days.
          </p>
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
