"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const PRICES: Record<string, Record<string, number>> = {
  "website-build":      { starter: 499,  growth: 899,  pro: 1499 },
  "email-lifecycle":    { starter: 249,  growth: 499,  pro: 899  },
  "organic-social":     { starter: 249,  growth: 499,  pro: 899  },
  "seo-aeo":            { starter: 349,  growth: 699,  pro: 1199 },
  "paid-social":        { starter: 149,  growth: 299,  pro: 499  },
  "sem-google-ads":     { starter: 399,  growth: 799,  pro: 1399 },
  "analytics-tracking": { starter: 199,  growth: 399,  pro: 699  },
  "automation":         { starter: 599,  growth: 999,  pro: 1799 },
};

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

const ADD_ON_PRICES: Record<string, number> = { rush: 299, automation: 499, playbook: 99 };
const ADD_ON_NAMES: Record<string, string> = {
  rush:       "Rush Delivery (3 business days)",
  automation: "Automation Upgrade",
  playbook:   "Paid Social Playbook Bundle",
};

type PkgItem = { channel: string; tier: string; addOns: string[] };

function pkgPrice(pkg: PkgItem) {
  const base = PRICES[pkg.channel]?.[pkg.tier] ?? 0;
  const addOns = pkg.addOns.reduce((s, a) => s + (ADD_ON_PRICES[a] ?? 0), 0);
  return { base, addOns, total: base + addOns };
}

function CheckoutContent() {
  const params = useSearchParams();
  const router = useRouter();

  // Multi-package mode: ?packages=ch1:tier1,ch2:tier2
  // Single-package mode: ?channel=ch&tier=t[&addons=a,b][&queue=ch2:t2,...]
  const packagesParam = params.get("packages");
  const channel = params.get("channel") ?? "";
  const tier    = params.get("tier") ?? "";
  const addOnsParam = params.get("addons")?.split(",").filter(Boolean) ?? [];
  const queueParam  = params.get("queue") ?? "";

  const allPackages: PkgItem[] = packagesParam
    ? packagesParam.split(",").map((p) => {
        const [ch, t] = p.split(":");
        return { channel: ch, tier: t, addOns: [] };
      })
    : [
        { channel, tier, addOns: addOnsParam },
        ...queueParam.split(",").filter(Boolean).map((p) => {
          const [ch, t] = p.split(":");
          return { channel: ch, tier: t, addOns: [] };
        }),
      ];

  const grandTotal = allPackages.reduce((sum, pkg) => sum + pkgPrice(pkg).total, 0);
  const isMulti = allPackages.length > 1;

  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  // Guard: redirect if no valid packages
  useEffect(() => {
    const valid = allPackages.every((p) => p.channel && p.tier && PRICES[p.channel]?.[p.tier]);
    if (!valid) router.replace("/packages");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handlePay() {
    if (!name.trim() || !email.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packages: allPackages,
          customerName: name,
          customerEmail: email,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#000000]">
      <Nav />

      <section className="px-6 md:px-12 lg:px-20 py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-4">Almost there</p>
          <h1 className="font-black mb-12" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
            Review &amp; pay
          </h1>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* LEFT — order summary */}
            <div>
              <h2 className="font-bold text-lg mb-6">
                Order summary
                {isMulti && (
                  <span className="ml-2 text-sm font-normal text-[#6B7280]">
                    ({allPackages.length} packages)
                  </span>
                )}
              </h2>

              <div className="border border-[#EBEBEB] rounded-2xl overflow-hidden">
                {allPackages.map((pkg, i) => {
                  const { base, addOns: addOnTotal } = pkgPrice(pkg);
                  const tierLabel = pkg.tier.charAt(0).toUpperCase() + pkg.tier.slice(1);
                  const delivery = pkg.addOns.includes("rush") ? 3 : 7;
                  return (
                    <div
                      key={`${pkg.channel}-${pkg.tier}`}
                      className={`p-5 ${i < allPackages.length - 1 ? "border-b border-[#EBEBEB]" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-bold">{CHANNEL_NAMES[pkg.channel] ?? pkg.channel}</p>
                          <p className="text-[#6B7280] text-sm mt-0.5">
                            {tierLabel} · {delivery}-day delivery
                          </p>
                          {pkg.addOns.length > 0 && (
                            <div className="mt-1 space-y-0.5">
                              {pkg.addOns.map((a) => (
                                <p key={a} className="text-xs text-[#6B7280]">
                                  + {ADD_ON_NAMES[a] ?? a} (+${ADD_ON_PRICES[a]})
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="font-semibold shrink-0">
                          ${(base + addOnTotal).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}

                <div className="p-5 bg-[#F8F8F8] border-t border-[#EBEBEB] flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <span className="font-black text-2xl">${grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 space-y-2 text-sm text-[#6B7280]">
                <p>✓ One-time payment — no subscriptions, no retainers</p>
                <p>✓ Full setup + handoff per package in 5–7 business days</p>
                <p>✓ You own everything — credentials, assets, accounts</p>
                <p>✓ $79 flat break-fix fee if anything ever goes sideways</p>
              </div>
            </div>

            {/* RIGHT — contact info + pay */}
            <div>
              <h2 className="font-bold text-lg mb-6">Your details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full border border-[#DEDEDE] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full border border-[#DEDEDE] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] transition-colors"
                  />
                  <p className="text-xs text-[#9CA3AF] mt-1.5">
                    Confirmation and intake link{isMulti ? "s" : ""} go here.
                  </p>
                </div>
              </div>

              {isMulti && (
                <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-[#2563EB]">
                  <p className="font-semibold mb-1">After you pay</p>
                  <p className="text-[#6B7280]">
                    You&apos;ll fill out a short intake form for each package — one at a time.
                    Takes about 5 minutes per package. We&apos;ll kick off all of them in parallel.
                  </p>
                </div>
              )}

              {error && (
                <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>
              )}

              <button
                onClick={handlePay}
                disabled={loading}
                className="mt-6 w-full bg-[#000000] text-white font-bold text-base py-4 rounded-full hover:bg-[#2563EB] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Redirecting to payment…"
                  : `Pay $${grandTotal.toLocaleString()} →`}
              </button>

              <p className="text-xs text-[#9CA3AF] text-center mt-4">
                Secured by Stripe. We never see your card details.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#6B7280]">Loading…</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
