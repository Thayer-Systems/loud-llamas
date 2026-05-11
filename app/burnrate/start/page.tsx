"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FounderCounter from "@/components/FounderCounter";

type Plan = "standard" | "founder";

function StartContent() {
  const params = useSearchParams();
  const initialPlan = (params.get("plan") === "founder" ? "founder" : "standard") as Plan;
  const [plan, setPlan] = useState<Plan>(initialPlan);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Start with marketing-staged display. Live count overwrites this on mount.
  const [founder, setFounder] = useState<{ count: number; total: number }>({ count: 86, total: 100 });

  // Fetch live count so the cap can be enforced visually.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/founder-count")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data.count === "number" && typeof data.total === "number") {
          // Display the higher of the staged number or the real count so the
          // counter never moves backward when staged data is replaced.
          setFounder({
            count: Math.max(86, data.count),
            total: data.total,
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const founderRemaining = Math.max(founder.total - founder.count, 0);
  const founderSoldOut = founderRemaining <= 0;

  // If founder is sold out and the user landed with ?plan=founder, force them to standard.
  useEffect(() => {
    if (founderSoldOut && plan === "founder") setPlan("standard");
  }, [founderSoldOut, plan]);

  async function handleStart() {
    if (!email.trim()) {
      setError("Drop your email so we can set up your account.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/burnrate/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, customerEmail: email }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        // If founder was sold out between page load and submit, switch the UI to standard.
        if (data.code === "FOUNDER_FULL") {
          setPlan("standard");
          setFounder((f) => ({ count: f.total, total: f.total }));
        }
        throw new Error(data.error ?? "Checkout failed");
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#000000]">
      <Nav />

      <section className="px-6 md:px-12 lg:px-20 py-16">
        <div className="max-w-3xl mx-auto">
          <Link href="/burnrate" className="text-sm text-[#6B7280] hover:text-[#2563EB] transition-colors">
            ← Back to Burnrate
          </Link>

          <p className="text-sm font-bold tracking-widest uppercase text-[#2563EB] mt-8 mb-4">Start Burnrate</p>
          <h1 className="font-black mb-4 leading-[0.95]" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
            Pick a plan.<br />Connect your accounts next.
          </h1>
          <p className="text-[#6B7280] text-lg mb-12 max-w-xl">
            After payment we&apos;ll send you a link to OAuth into Google Ads and Meta. First fix list lands in 24 hours.
          </p>

          {/* Plan picker */}
          <div className="grid md:grid-cols-2 gap-5 mb-10">
            <button
              onClick={() => setPlan("standard")}
              className={`text-left rounded-2xl p-6 border-2 transition-all ${
                plan === "standard"
                  ? "border-[#000000] bg-[#F8F8F8]"
                  : "border-[#E5E7EB] hover:border-[#BEBEBE]"
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-[#6B7280] mb-2">Standard</p>
              <p className="font-black text-3xl mb-1">$29<span className="text-base text-[#6B7280] font-bold">/mo</span></p>
              <p className="text-[#6B7280] text-sm">Cancel anytime. No annual lock-in.</p>
            </button>
            <button
              onClick={() => !founderSoldOut && setPlan("founder")}
              disabled={founderSoldOut}
              className={`text-left rounded-2xl p-6 border-2 transition-all ${
                founderSoldOut
                  ? "border-[#E5E7EB] bg-[#F8F8F8] opacity-60 cursor-not-allowed"
                  : plan === "founder"
                    ? "border-[#2563EB] bg-blue-50"
                    : "border-[#E5E7EB] hover:border-[#BEBEBE]"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className={`text-xs font-bold uppercase tracking-widest ${founderSoldOut ? "text-[#9CA3AF]" : "text-[#2563EB]"}`}>Founder</p>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                  founderSoldOut ? "bg-[#E5E7EB] text-[#6B7280]" : "bg-[#2563EB] text-white"
                }`}>
                  {founderSoldOut ? "Sold out" : "First 100"}
                </span>
              </div>
              <p className={`font-black text-3xl mb-1 ${founderSoldOut ? "text-[#9CA3AF] line-through" : "text-[#2563EB]"}`}>
                $17.99<span className="text-base font-bold">/mo</span>
              </p>
              <p className="text-[#6B7280] text-sm">
                {founderSoldOut
                  ? "All 100 founder spots are gone. Standard pricing only from here."
                  : "Locked forever. No price increases. Ever."}
              </p>
            </button>
          </div>

          {plan === "founder" && !founderSoldOut && (
            <div className="mb-10">
              <FounderCounter count={founder.count} total={founder.total} variant="light" size="md" />
            </div>
          )}

          {/* Email + start */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full border border-[#DEDEDE] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] transition-colors"
              />
              <p className="text-xs text-[#9CA3AF] mt-1.5">
                We&apos;ll send your account setup link here after payment.
              </p>
            </div>

            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

            <button
              onClick={handleStart}
              disabled={loading}
              className="w-full bg-[#000000] text-white font-bold text-base py-4 rounded-full hover:bg-[#2563EB] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Redirecting to payment…"
                : plan === "founder"
                  ? "Lock in $17.99/mo →"
                  : "Start at $29/mo →"}
            </button>
            <p className="text-xs text-[#9CA3AF] text-center">
              Secured by Stripe. Cancel anytime from your billing portal.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function BurnrateStartPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#6B7280]">Loading…</p>
      </div>
    }>
      <StartContent />
    </Suspense>
  );
}
