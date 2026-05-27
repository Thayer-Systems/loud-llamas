"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// Calculator inputs you can tune without touching the layout.
const FOUNDATION_PRICE = 699;          // One-time setup bundle (foundation package).
const BURNRATE_MONTHLY = 29;           // Real Burnrate price ($29/mo). Adjust if marketing wants a different number for the calculator.
const HORIZONS = [12, 24, 36] as const;
const SPEND_MIN = 500;
const SPEND_MAX = 10000;
const SPEND_STEP = 100;
const DEFAULT_SPEND = 3800;
const DEFAULT_HORIZON: 12 | 24 | 36 = 24;

type Horizon = (typeof HORIZONS)[number];

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

const AGENCY_TRAPS = [
  { item: "Website", desc: "They own the domain / account access" },
  { item: "Ad accounts", desc: "Billed to their card, not yours" },
  { item: "Email list", desc: "Lives in their platform, leaves with them" },
  { item: "Analytics", desc: "You see the dashboard. They own the data." },
  { item: "Automations", desc: "Cancel = flows stop overnight" },
];

const LL_BENEFITS = [
  { item: "Website", desc: "Domain + hosting in your name from day one" },
  { item: "Ad accounts", desc: "Set up under your business, credentials handed over" },
  { item: "Email list", desc: "Your ESP account, your list, forever" },
  { item: "Analytics", desc: "GA4 + dashboards in your Google account" },
  { item: "Automations", desc: "Yours to edit, extend, or cancel anytime" },
];

export default function CalculatorContent() {
  const [monthlySpend, setMonthlySpend] = useState(DEFAULT_SPEND);
  const [months, setMonths] = useState<Horizon>(DEFAULT_HORIZON);
  const [withBurnrate, setWithBurnrate] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const agencyTotal = monthlySpend * months;
  const burnrateTotal = withBurnrate ? BURNRATE_MONTHLY * months : 0;
  const llTotal = FOUNDATION_PRICE + burnrateTotal;
  const savings = Math.max(agencyTotal - llTotal, 0);

  async function sendReport() {
    if (!email.trim()) {
      setError("Drop your email.");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/calculator-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          monthlySpend,
          months,
          withBurnrate,
          agencyTotal,
          llTotal,
          burnrateTotal,
          savings,
        }),
      });
      if (!res.ok) throw new Error("Failed to send report");
      setStatus("sent");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
      setStatus("idle");
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#000000]">
      <Nav />

      {/* HERO */}
      <section className="px-6 md:px-12 lg:px-20 py-16 md:py-20 border-b border-[#EBEBEB]">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-bold tracking-widest uppercase text-[#2563EB] mb-5">
            Stop renting. Start owning.
          </p>
          <h1
            className="font-black text-[#000000] leading-[1.0] tracking-tight"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
          >
            Find out exactly how much your agency is costing you.
          </h1>
          <p className="mt-6 text-lg text-[#6B7280] leading-relaxed max-w-2xl">
            Every month you pay a retainer, you own nothing. Change the numbers below. The math doesn&apos;t lie.
          </p>
        </div>
      </section>

      {/* INPUTS */}
      <section className="px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Monthly spend */}
          <div className="mb-10">
            <div className="flex items-baseline justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#000000]">
                Monthly agency spend
              </p>
              <p className="font-black text-[#2563EB]" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
                ${fmt(monthlySpend)}/mo
              </p>
            </div>
            <input
              type="range"
              min={SPEND_MIN}
              max={SPEND_MAX}
              step={SPEND_STEP}
              value={monthlySpend}
              onChange={(e) => setMonthlySpend(Number(e.target.value))}
              className="w-full h-2 rounded-full bg-[#E5E7EB] appearance-none cursor-pointer calculator-slider"
              style={{ accentColor: "#2563EB" }}
              aria-label="Monthly agency spend"
            />
            <div className="flex justify-between text-xs text-[#6B7280] mt-2">
              <span>${fmt(SPEND_MIN)}</span>
              <span>${fmt(SPEND_MAX)}</span>
            </div>
          </div>

          {/* Time horizon */}
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#000000] mb-4">
              Time horizon
            </p>
            <div className="flex gap-2 flex-wrap">
              {HORIZONS.map((h) => (
                <button
                  key={h}
                  onClick={() => setMonths(h)}
                  className={`px-5 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all ${
                    months === h
                      ? "border-[#2563EB] bg-blue-50 text-[#2563EB]"
                      : "border-[#E5E7EB] text-[#6B7280] hover:border-[#BEBEBE]"
                  }`}
                  aria-pressed={months === h}
                >
                  {h} months
                </button>
              ))}
            </div>
          </div>

          {/* Include Burnrate */}
          <label className="flex items-center gap-3 cursor-pointer mb-10 select-none">
            <input
              type="checkbox"
              checked={withBurnrate}
              onChange={(e) => setWithBurnrate(e.target.checked)}
              className="w-5 h-5 rounded border-2 border-[#E5E7EB] accent-[#2563EB] cursor-pointer"
              style={{ accentColor: "#2563EB" }}
            />
            <span className="text-[#6B7280]">
              Include Burnrate (${BURNRATE_MONTHLY}/mo monitoring add-on)
            </span>
          </label>

          {/* SAVINGS BIG CARD */}
          <div className="border-2 border-[#2563EB] rounded-2xl p-8 text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#000000] mb-4">
              You&apos;d save
            </p>
            <p className="font-black text-[#2563EB] leading-none" style={{ fontSize: "clamp(2.75rem, 7vw, 5rem)" }}>
              ${fmt(savings)}
            </p>
            <p className="text-[#6B7280] mt-4 text-base md:text-lg">
              over {months} months. And own everything at the end.
            </p>
          </div>

          {/* COMPARISON CARDS */}
          <div className="grid md:grid-cols-2 gap-5 mb-16">
            {/* Agency */}
            <div className="border border-[#EBEBEB] rounded-2xl p-7">
              <p className="text-xs font-bold uppercase tracking-widest text-[#DC2626] mb-3">
                Your agency
              </p>
              <p className="font-black text-[#000000] leading-none mb-2" style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)" }}>
                ${fmt(agencyTotal)}
              </p>
              <p className="text-sm text-[#6B7280] mb-6">total over {months} months</p>
              <ul className="flex flex-col divide-y divide-[#EBEBEB]">
                {AGENCY_TRAPS.map((t) => (
                  <li key={t.item} className="flex items-start gap-3 py-3">
                    <span className="text-[#DC2626] font-bold text-lg leading-none mt-0.5 shrink-0" aria-hidden="true">✕</span>
                    <div>
                      <p className="font-bold text-[#000000] text-sm">{t.item}</p>
                      <p className="text-sm text-[#6B7280]">{t.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-6 pt-5 border-t-2 border-[#DC2626] text-xs font-bold uppercase tracking-widest text-[#DC2626]">
                Stop paying → Own nothing.
              </p>
            </div>

            {/* Loud Llamas */}
            <div className="border border-[#EBEBEB] rounded-2xl p-7">
              <p className="text-xs font-bold uppercase tracking-widest text-[#2563EB] mb-3">
                Loud Llamas
              </p>
              <p className="font-black text-[#2563EB] leading-none mb-2" style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)" }}>
                ${fmt(llTotal)}
              </p>
              <p className="text-sm text-[#6B7280] mb-6">total over {months} months</p>
              <ul className="flex flex-col divide-y divide-[#EBEBEB]">
                {LL_BENEFITS.map((b) => (
                  <li key={b.item} className="flex items-start gap-3 py-3">
                    <span className="text-[#2563EB] font-bold text-lg leading-none mt-0.5 shrink-0" aria-hidden="true">✓</span>
                    <div>
                      <p className="font-bold text-[#000000] text-sm">{b.item}</p>
                      <p className="text-sm text-[#6B7280]">{b.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-6 pt-5 border-t-2 border-[#2563EB] text-xs font-bold uppercase tracking-widest text-[#2563EB]">
                Pay once → Own forever.
              </p>
            </div>
          </div>

          {/* BREAKDOWN ROW */}
          <div className="border border-[#EBEBEB] rounded-2xl p-6 md:p-8 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-6 md:gap-4 text-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mb-2">One-time setup</p>
                <p className="font-black text-[#000000]" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>
                  ${fmt(FOUNDATION_PRICE)}
                </p>
                <p className="text-xs text-[#6B7280] mt-1">Foundation package</p>
              </div>
              <span className="text-2xl text-[#9CA3AF] font-bold hidden md:block">+</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mb-2">Burnrate (optional)</p>
                <p className="font-black text-[#000000]" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>
                  ${withBurnrate ? BURNRATE_MONTHLY : 0}/mo
                </p>
                <p className="text-xs text-[#6B7280] mt-1">
                  {withBurnrate ? `${months} months · $${fmt(burnrateTotal)}` : "Toggle above to include"}
                </p>
              </div>
              <span className="text-2xl text-[#9CA3AF] font-bold hidden md:block">=</span>
              <div className="border-t-2 md:border-t-0 md:border-l-2 border-[#2563EB] pt-6 md:pt-0 md:pl-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#000000] mb-2">Your total</p>
                <p className="font-black text-[#2563EB]" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}>
                  ${fmt(llTotal)}
                </p>
                <p className="text-xs text-[#6B7280] mt-1">{withBurnrate ? "over " + months + " months" : "one-time"}</p>
              </div>
            </div>
          </div>

          {/* EMAIL CAPTURE */}
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-black text-[#000000] mb-4 leading-[1.05]" style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}>
              Get your custom savings report.
            </h2>
            <p className="text-[#6B7280] text-base md:text-lg mb-8 leading-relaxed">
              We&apos;ll email you a full breakdown based on your <span className="font-bold text-[#000000]">${fmt(monthlySpend)}/mo</span> spend over <span className="font-bold text-[#000000]">{months} months</span>. Plus what to do next.
            </p>

            {status === "sent" ? (
              <div className="bg-blue-50 border-2 border-[#2563EB] rounded-2xl p-6">
                <p className="font-bold text-[#2563EB]">Report on the way.</p>
                <p className="text-sm text-[#6B7280] mt-1">Check your inbox in a minute. Spam folder if it&apos;s a few minutes.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border border-[#DEDEDE] rounded-xl px-4 py-3.5 text-base focus:outline-none focus:border-[#2563EB] transition-colors"
                />
                {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
                <button
                  onClick={sendReport}
                  disabled={status === "sending"}
                  className="bg-[#000000] text-white font-bold py-3.5 rounded-xl hover:bg-[#2563EB] transition-colors duration-300 uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "sending" ? "Sending…" : "Send my report"}
                </button>
                <p className="text-xs text-[#9CA3AF] mt-1">
                  No spam. Just the numbers. Plus how to act on them.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CROSS LINKS */}
      <section className="bg-[#F8F8F8] px-6 md:px-12 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="font-black text-[#000000] mb-3" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}>
              Packages
            </h3>
            <Link href="/packages" className="text-[#2563EB] font-semibold hover:underline">
              See what&apos;s included in the one-time setup →
            </Link>
          </div>
          <div>
            <h3 className="font-black text-[#000000] mb-3" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}>
              Burnrate
            </h3>
            <Link href="/burnrate" className="text-[#2563EB] font-semibold hover:underline">
              The optional ${BURNRATE_MONTHLY}/mo monitoring add-on →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
