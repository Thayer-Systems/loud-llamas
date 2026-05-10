import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FounderCounter from "@/components/FounderCounter";
import { getFounderCount } from "@/lib/founder-count";

export const revalidate = 60;

export const metadata = {
  title: "Burnrate — Find the money your ads are burning",
  description:
    "Connect Google Ads and Meta. Burnrate runs weekly waste detection, finds paid/organic keyword overlap, and hands you a prioritized fix list. $29/mo. Founder pricing $17.99/mo for the first 100.",
};

const WHAT_IT_DOES = [
  {
    title: "Weekly waste detection",
    desc: "Spots dead keywords, broken match types, and budget being lit on fire. Every week. Automatically.",
  },
  {
    title: "Paid/organic keyword overlap",
    desc: "Finds the queries where you're paying Google for clicks you'd already rank for organically. Stop double-paying.",
  },
  {
    title: "Prioritized fix list",
    desc: "Not a 30-page report nobody reads. A short list of what to do next, ordered by impact.",
  },
  {
    title: "Cross-platform connected",
    desc: "Google Ads and Meta in one view. Compare what's actually working — without flipping between tabs.",
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Connect Google Ads", desc: "OAuth. One click. We never see your password." },
  { step: "02", title: "Connect Meta", desc: "Same deal. OAuth. Read-only by default." },
  { step: "03", title: "First report in 24 hours", desc: "Then weekly. Forever. Until you cancel." },
];

const COMPARISON = [
  { item: "Cost", agency: "$2,000+ /mo", burnrate: "$29 /mo" },
  { item: "Time to first insight", agency: "2–6 weeks", burnrate: "24 hours" },
  { item: "Onboarding calls", agency: "Multiple", burnrate: "Zero" },
  { item: "Manual data uploads", agency: "Constant", burnrate: "None" },
  { item: "Cancel anytime", agency: "Try the 12-month contract", burnrate: "Yes" },
];

// Marketing-staged count; live count helper is still called for cache warming.
const STATIC_FOUNDER_COUNT = 77;
const STATIC_FOUNDER_TOTAL = 100;

export default async function BurnratePage() {
  await getFounderCount();
  const founderCount = STATIC_FOUNDER_COUNT;
  const founderTotal = STATIC_FOUNDER_TOTAL;

  return (
    <div className="min-h-screen bg-white text-[#000000]">
      <Nav />

      {/* HERO */}
      <section className="bg-[#000000] text-white px-6 md:px-12 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.4fr_1fr] gap-12 items-center">
          <div>
            <p className="text-sm font-bold tracking-widest uppercase text-[#2563EB] mb-6">
              Your 24/7 paid media monitor
            </p>
            <h1 className="font-black leading-[0.92] tracking-tight" style={{ fontSize: "clamp(3rem, 7.5vw, 6.5rem)" }}>
              Your ads are bleeding.<br />
              <span className="text-[#2563EB]">Burnrate finds the wound.</span>
            </h1>
            <p className="text-xl text-gray-300 mt-8 max-w-xl leading-relaxed">
              Agencies charge $2,000/mo to do what Burnrate does automatically every week. Connect Google Ads. Connect Meta. Get your first fix list in 24 hours.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/burnrate/start"
                className="bg-[#2563EB] text-white font-bold text-base px-8 py-4 rounded-full hover:bg-blue-700 transition-colors duration-300"
              >
                Start Burnrate →
              </Link>
              <a
                href="#how"
                className="text-white font-semibold text-base px-8 py-4 rounded-full border border-[#374151] hover:border-white transition-colors duration-300"
              >
                How it works
              </a>
            </div>
          </div>
          <div className="lg:pl-8">
            <FounderCounter count={founderCount} total={founderTotal} variant="dark" size="lg" />
            <p className="text-sm text-gray-400 mt-4">
              First 100 customers lock in <span className="text-[#2563EB] font-bold">$17.99/mo forever</span>. Standard price after that is $29/mo.
            </p>
          </div>
        </div>
      </section>

      {/* PUNCH LINE */}
      <section className="px-6 md:px-12 lg:px-20 py-20 bg-[#F8F8F8]">
        <div className="max-w-5xl mx-auto">
          <p className="font-black leading-[1.05] text-[#000000]" style={{ fontSize: "clamp(1.75rem, 4vw, 3.25rem)" }}>
            You set it up.{" "}
            <span className="text-[#6B7280]">Now it&apos;s leaking money</span>{" "}
            and you don&apos;t know it.
          </p>
          <p className="text-[#6B7280] text-lg mt-6 max-w-2xl">
            Most ad accounts waste 20–40% of their spend on garbage clicks, dead keywords, and queries the brand already ranks for organically. You&apos;re busy. You don&apos;t have time to audit it weekly. We do.
          </p>
        </div>
      </section>

      {/* WHAT IT DOES */}
      <section className="px-6 md:px-12 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-[#2563EB] mb-4">What it does</p>
          <h2 className="font-black mb-12" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
            Four things. That&apos;s it.
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {WHAT_IT_DOES.map((w) => (
              <div key={w.title} className="border-t-2 border-[#000000] pt-6">
                <h3 className="text-xl font-black mb-3">{w.title}</h3>
                <p className="text-[#6B7280] leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-[#000000] text-white px-6 md:px-12 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-[#2563EB] mb-4">How it works</p>
          <h2 className="font-black mb-12 leading-[1.0]" style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}>
            Connect. Wait 24 hours. Stop wasting money.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="border-t-2 border-[#2563EB] pt-6">
                <span className="text-4xl font-black text-[#2563EB]">{s.step}</span>
                <h3 className="text-xl font-bold mt-4">{s.title}</h3>
                <p className="text-gray-400 mt-3 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="px-6 md:px-12 lg:px-20 py-24 bg-[#F8F8F8]">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-[#2563EB] mb-4">Burnrate vs. an agency</p>
          <h2 className="font-black mb-10" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}>
            Same outcome. <span className="text-[#2563EB]">98% less money.</span>
          </h2>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
            <div className="grid grid-cols-3 bg-[#F3F4F6] text-xs font-bold uppercase tracking-widest text-[#6B7280] py-3 px-4">
              <span></span>
              <span>Agency</span>
              <span className="text-[#2563EB]">Burnrate</span>
            </div>
            {COMPARISON.map((row, i) => (
              <div
                key={row.item}
                className={`grid grid-cols-3 py-4 px-4 text-sm ${i < COMPARISON.length - 1 ? "border-b border-[#EBEBEB]" : ""}`}
              >
                <span className="font-semibold text-[#000000]">{row.item}</span>
                <span className="text-[#6B7280]">{row.agency}</span>
                <span className="font-bold text-[#2563EB]">{row.burnrate}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="px-6 md:px-12 lg:px-20 py-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-[#2563EB] mb-4">Pricing</p>
          <h2 className="font-black mb-12" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
            Two prices. No tiers.
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Standard */}
            <div className="border-2 border-[#E5E7EB] rounded-3xl p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-[#6B7280] mb-3">Standard</p>
              <p className="font-black mb-1" style={{ fontSize: "clamp(2.5rem, 4.5vw, 3.5rem)" }}>
                $29<span className="text-lg text-[#6B7280] font-bold">/mo</span>
              </p>
              <p className="text-[#6B7280] mb-6">Cancel anytime. No annual lock-in.</p>
              <ul className="space-y-2 text-sm text-[#6B7280] mb-8">
                <li className="flex gap-2"><span className="text-[#2563EB]">✓</span>Weekly waste detection</li>
                <li className="flex gap-2"><span className="text-[#2563EB]">✓</span>Google Ads + Meta connected</li>
                <li className="flex gap-2"><span className="text-[#2563EB]">✓</span>Prioritized fix list</li>
                <li className="flex gap-2"><span className="text-[#2563EB]">✓</span>OAuth onboarding</li>
              </ul>
              <Link
                href="/burnrate/start?plan=standard"
                className="block w-full text-center bg-[#000000] text-white font-bold py-3.5 rounded-full hover:bg-[#2563EB] transition-colors"
              >
                Start at $29/mo →
              </Link>
            </div>
            {/* Founder */}
            <div className="border-2 border-[#2563EB] rounded-3xl p-8 bg-[#000000] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#2563EB] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl">
                First 100 only
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#2563EB] mb-3">Founder · Locked forever</p>
              <p className="font-black mb-1" style={{ fontSize: "clamp(2.5rem, 4.5vw, 3.5rem)" }}>
                $17.99<span className="text-lg text-gray-400 font-bold">/mo</span>
              </p>
              <p className="text-gray-400 mb-6">38% off. Forever. No price increases — ever.</p>
              <div className="mb-6">
                <FounderCounter count={founderCount} total={founderTotal} variant="dark" size="sm" />
              </div>
              <Link
                href="/burnrate/start?plan=founder"
                className="block w-full text-center bg-[#2563EB] text-white font-bold py-3.5 rounded-full hover:bg-blue-700 transition-colors"
              >
                Lock in $17.99/mo →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AGGRESSIVE FOOTER CTA */}
      <section className="bg-[#000000] text-white px-6 md:px-12 lg:px-20 py-28">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-black leading-[0.95]" style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}>
            Stop paying agencies<br />
            <span className="text-[#2563EB]">to read your dashboards.</span>
          </h2>
          <p className="text-gray-400 text-xl mt-8 max-w-xl">
            They charge $2,000 a month for what Burnrate does automatically every week. The math is the math.
          </p>
          <Link
            href="/burnrate/start"
            className="inline-block mt-10 bg-white text-[#000000] font-bold text-lg px-10 py-4 rounded-full hover:bg-[#2563EB] hover:text-white transition-colors duration-300"
          >
            Start Burnrate
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
