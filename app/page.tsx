import Image from "next/image";
import Link from "next/link";

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
    <div className="min-h-screen bg-white text-[#1F2937]" style={{ fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}>

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Loud Llamas" width={40} height={40} className="rounded" />
            <span className="font-bold text-lg text-[#1F2937] hidden sm:block">Loud Llamas</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/packages" className="text-sm font-medium text-[#6B7280] hover:text-[#1F2937] transition-colors">
              Packages
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-[#6B7280] hover:text-[#1F2937] transition-colors hidden sm:block">
              How It Works
            </Link>
            <Link href="#faq" className="text-sm font-medium text-[#6B7280] hover:text-[#1F2937] transition-colors hidden sm:block">
              FAQ
            </Link>
            <Link
              href="/packages"
              className="bg-[#2563EB] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-[#1F2937] text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Stop stalling.<br />Start marketing.
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              Pick your channel. Pay once. Get it done in 5–7 days.
            </p>
            <Link
              href="/packages"
              className="inline-block bg-[#2563EB] text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-600 transition-colors"
            >
              Build your setup
            </Link>
          </div>
          <div className="flex-shrink-0">
            <Image src="/logo.png" alt="Loud Llamas" width={260} height={260} className="rounded-2xl" priority />
          </div>
        </div>
      </section>

      {/* PROBLEM BLOCK */}
      <section className="bg-[#F3F4F6] py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-2xl md:text-3xl font-semibold text-[#1F2937] leading-relaxed">
            You know you need to do it. You&apos;ve been putting it off. We get it.
          </p>
          <p className="mt-6 text-lg text-[#6B7280]">
            Here&apos;s what we do: set it all up, hand you the keys, and get out of your way.
          </p>
        </div>
      </section>

      {/* PULL QUOTE */}
      <section className="bg-[#2563EB] py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <blockquote className="text-3xl md:text-4xl font-extrabold text-white">
            &ldquo;We&apos;re not your agency.<br />We&apos;re your launch crew.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-16">How it works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {STEPS.map((step) => (
              <div key={step.number} className="flex flex-col gap-4">
                <span className="text-6xl font-extrabold text-[#2563EB] opacity-20 leading-none">{step.number}</span>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-[#6B7280] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGE PREVIEW */}
      <section className="bg-[#F3F4F6] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-4">7 channels. Pick yours.</h2>
          <p className="text-center text-[#6B7280] mb-12 text-lg">Starter, Growth, or Pro. One-time price. Full setup.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {CHANNELS.map((ch) => (
              <Link
                key={ch.slug}
                href={`/configure/${ch.slug}`}
                className="bg-white rounded-2xl p-6 border border-[#E5E7EB] hover:border-[#2563EB] hover:shadow-md transition-all group"
              >
                <h3 className="font-bold text-lg mb-2 group-hover:text-[#2563EB] transition-colors">{ch.name}</h3>
                <p className="text-sm text-[#6B7280] mb-4">
                  from <span className="font-semibold text-[#1F2937]">${ch.starter}</span>
                </p>
                <span className="text-sm font-semibold text-[#2563EB]">Get started →</span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/packages"
              className="inline-block border-2 border-[#2563EB] text-[#2563EB] font-bold px-8 py-3 rounded-xl hover:bg-[#2563EB] hover:text-white transition-colors"
            >
              See all packages &amp; pricing
            </Link>
          </div>
        </div>
      </section>

      {/* POSITIONING BLOCK */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1F2937] leading-snug">
            No retainers. No monthly fees.<br />No 18-month contracts.
          </h2>
          <p className="mt-6 text-xl text-[#6B7280]">Just a clean setup and a handoff.</p>
        </div>
      </section>

      {/* PAID SOCIAL CALLOUT */}
      <section className="bg-[#1F2937] text-white py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="inline-block bg-yellow-400 text-[#1F2937] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded mb-6">
            Honest talk about Meta
          </div>
          <p className="text-lg text-gray-300 leading-relaxed">
            Meta makes it nearly impossible for third parties to configure ad accounts on behalf of clients.
            We&apos;re not going to pretend otherwise. So instead of a half-baked setup, we built something
            better:{" "}
            <strong className="text-white">The Paid Social Playbook.</strong> Years of paid social experience
            packaged into a step-by-step implementation guide. You run it. We built it. Same outcome, no access
            headaches.
          </p>
          <Link
            href="/configure/paid-social"
            className="inline-block mt-8 bg-[#2563EB] text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
          >
            Get the playbook
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-[#F3F4F6]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold mb-12 text-center">FAQ</h2>
          <div className="flex flex-col gap-5">
            {FAQS.map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
                <p className="font-bold text-[#1F2937] mb-2">{faq.q}</p>
                <p className="text-[#6B7280] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="bg-[#2563EB] py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Stop stalling.<br />Let the llamas handle it.
          </h2>
          <p className="text-blue-100 mb-8 text-lg">Pick a channel. Pay once. Done in 5–7 days.</p>
          <Link
            href="/packages"
            className="inline-block bg-white text-[#2563EB] font-bold text-lg px-10 py-4 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Build your setup
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1F2937] text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Loud Llamas" width={36} height={36} className="rounded" />
            <div>
              <p className="text-white font-bold">Loud Llamas</p>
              <p className="text-xs">A Thayer Systems Company</p>
            </div>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/packages" className="hover:text-white transition-colors">Packages</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
            <Link href="#faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="/support" className="hover:text-white transition-colors">Support</Link>
          </div>
          <p className="text-xs">Marketing Setup. Done Once. Done Right.</p>
        </div>
      </footer>

    </div>
  );
}
