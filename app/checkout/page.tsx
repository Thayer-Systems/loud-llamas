"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const PRICES: Record<string, Record<string, number>> = {
  "website-build":      { starter: 179, growth: 299, pro: 449 },
  "email-lifecycle":    { starter: 99,  growth: 179, pro: 279 },
  "organic-social":     { starter: 249, growth: 499, pro: 899 },
  "seo-aeo":            { starter: 349, growth: 699, pro: 1199 },
  "paid-social":        { starter: 59,  growth: 99,  pro: 149 },
  "sem-google-ads":     { starter: 149, growth: 249, pro: 399 },
  "analytics-tracking": { starter: 99,  growth: 179, pro: 279 },
  "automation":         { starter: 79,  growth: 199, pro: 399 },
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

// Optional 3-month management subscription per channel/tier (USD/month)
const MGMT_SUB_PRICES: Record<string, Record<string, number>> = {
  "sem-google-ads":     { starter: 99, growth: 149, pro: 199 },
  "analytics-tracking": { starter: 49, growth: 79,  pro: 99  },
  "email-lifecycle":    { starter: 49, growth: 79,  pro: 99  },
};

const MGMT_SUB_INCLUDES: Record<string, string> = {
  "sem-google-ads":     "Weekly bid adjustments · 1 campaign change/wk · monthly report",
  "analytics-tracking": "Monthly review · alert monitoring · dashboard updates",
  "email-lifecycle":    "Deliverability monitoring · 1 new email/mo · performance report",
};

type PkgItem = { channel: string; tier: string; addOns: string[]; mgmtSub?: boolean };

function pkgBase(pkg: PkgItem) {
  return PRICES[pkg.channel]?.[pkg.tier] ?? 0;
}

function mgmtSubPrice(pkg: PkgItem) {
  return MGMT_SUB_PRICES[pkg.channel]?.[pkg.tier] ?? 0;
}

function isMgmtEligible(pkg: PkgItem) {
  return mgmtSubPrice(pkg) > 0;
}

function CheckoutContent() {
  const params = useSearchParams();
  const router = useRouter();

  // Multi-package: ?packages=ch1:tier1,ch2:tier2
  // Single-package: ?channel=ch&tier=t[&addons=a,b]
  const packagesParam = params.get("packages");
  const channel = params.get("channel") ?? "";
  const tier    = params.get("tier") ?? "";
  const addOnsParam = params.get("addons")?.split(",").filter(Boolean) ?? [];

  const basePackages: PkgItem[] = packagesParam
    ? packagesParam.split(",").map((p) => {
        const [ch, t] = p.split(":");
        return { channel: ch, tier: t, addOns: [] };
      })
    : [{ channel, tier, addOns: addOnsParam }];

  // Add-on state: rush is global (one fee regardless of package count)
  // automation & playbook are per-package (keyed by index)
  const [rushEnabled, setRushEnabled] = useState(addOnsParam.includes("rush"));
  // per-package add-ons: { [pkgIndex]: Set of addon keys }
  const [pkgAddOns, setPkgAddOns] = useState<Record<number, Set<string>>>(() => {
    const init: Record<number, Set<string>> = {};
    basePackages.forEach((_, i) => { init[i] = new Set(); });
    return init;
  });
  // 3-month management subscription opt-in per package
  const [mgmtSubs, setMgmtSubs] = useState<Record<number, boolean>>(() => {
    const init: Record<number, boolean> = {};
    basePackages.forEach((_, i) => { init[i] = false; });
    return init;
  });

  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const isMulti = basePackages.length > 1;

  // Build final packages array with add-ons resolved
  const allPackages: PkgItem[] = basePackages.map((pkg, i) => {
    const addOns: string[] = [];
    if (rushEnabled) addOns.push("rush");
    pkgAddOns[i]?.forEach((a) => addOns.push(a));
    const mgmtSub = !!mgmtSubs[i] && isMgmtEligible(pkg);
    return { ...pkg, addOns, mgmtSub };
  });

  // Per-package add-on options (what's eligible for each channel)
  function eligibleAddOns(pkg: PkgItem) {
    const opts: { key: string; label: string; price: number; desc: string }[] = [];
    if (pkg.channel !== "automation") {
      opts.push({ key: "automation", label: "Automation Upgrade", price: 499, desc: "Add automated workflows to this package" });
    }
    if (pkg.channel !== "paid-social") {
      opts.push({ key: "playbook", label: "Paid Social Playbook Bundle", price: 99, desc: "Add the full paid social guide to this package" });
    }
    return opts;
  }

  function togglePkgAddOn(pkgIndex: number, key: string) {
    setPkgAddOns((prev) => {
      const next = new Set(prev[pkgIndex]);
      if (next.has(key)) next.delete(key); else next.add(key);
      return { ...prev, [pkgIndex]: next };
    });
  }

  function toggleMgmtSub(pkgIndex: number) {
    setMgmtSubs((prev) => ({ ...prev, [pkgIndex]: !prev[pkgIndex] }));
  }

  // Totals
  const rushFee = rushEnabled ? ADD_ON_PRICES.rush : 0;
  const packageSubtotals = basePackages.map((pkg, i) => {
    const extras = Array.from(pkgAddOns[i] ?? []).reduce((s, a) => s + (ADD_ON_PRICES[a] ?? 0), 0);
    return pkgBase(pkg) + extras;
  });
  const grandTotal = packageSubtotals.reduce((s, x) => s + x, 0) + rushFee;
  const deliveryDays = rushEnabled ? 3 : 7;

  // Monthly recurring total (only counts subs that are toggled ON for eligible packages)
  const monthlyTotal = basePackages.reduce((sum, pkg, i) => {
    return sum + (mgmtSubs[i] && isMgmtEligible(pkg) ? mgmtSubPrice(pkg) : 0);
  }, 0);
  const hasAnyMgmtSub = monthlyTotal > 0;
  // First-charge total = setup + first month of any subs
  const firstChargeTotal = grandTotal + monthlyTotal;
  // Total over 3 months = setup + 3x monthly
  const threeMonthTotal = grandTotal + monthlyTotal * 3;

  useEffect(() => {
    const valid = basePackages.every((p) => p.channel && p.tier && PRICES[p.channel]?.[p.tier]);
    if (!valid) router.replace("/packages");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handlePay() {
    if (!name.trim() || !email.trim()) { setError("Please enter your name and email."); return; }
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
            {/* LEFT — order summary + add-ons */}
            <div>
              <h2 className="font-bold text-lg mb-6">
                Order summary
                {isMulti && (
                  <span className="ml-2 text-sm font-normal text-[#6B7280]">
                    ({basePackages.length} packages)
                  </span>
                )}
              </h2>

              {/* Packages */}
              <div className="border border-[#EBEBEB] rounded-2xl overflow-hidden mb-6">
                {basePackages.map((pkg, i) => {
                  const tierLabel = pkg.tier.charAt(0).toUpperCase() + pkg.tier.slice(1);
                  const eligible = eligibleAddOns(pkg);
                  const isLast = i === basePackages.length - 1;
                  return (
                    <div key={`${pkg.channel}-${i}`} className={isLast ? "" : "border-b border-[#EBEBEB]"}>
                      {/* Package row */}
                      <div className="p-5 flex items-start justify-between gap-4">
                        <div>
                          <p className="font-bold">{CHANNEL_NAMES[pkg.channel] ?? pkg.channel}</p>
                          <p className="text-[#6B7280] text-sm mt-0.5">{tierLabel} · {deliveryDays}-day delivery</p>
                        </div>
                        <p className="font-semibold shrink-0">${pkgBase(pkg).toLocaleString()}</p>
                      </div>

                      {/* Per-package add-ons */}
                      {eligible.length > 0 && (
                        <div className="px-5 pb-4 space-y-2">
                          {eligible.map((addon) => {
                            const active = pkgAddOns[i]?.has(addon.key);
                            return (
                              <button
                                key={addon.key}
                                onClick={() => togglePkgAddOn(i, addon.key)}
                                className={`w-full flex items-center justify-between text-left rounded-xl border px-4 py-3 transition-all ${
                                  active
                                    ? "border-[#2563EB] bg-blue-50"
                                    : "border-[#EBEBEB] hover:border-[#BEBEBE]"
                                }`}
                              >
                                <div>
                                  <p className={`text-sm font-semibold ${active ? "text-[#2563EB]" : "text-[#000000]"}`}>
                                    {active ? "✓ " : "+ "}{addon.label}
                                  </p>
                                  <p className="text-xs text-[#6B7280] mt-0.5">{addon.desc}</p>
                                </div>
                                <p className={`text-sm font-bold shrink-0 ml-4 ${active ? "text-[#2563EB]" : "text-[#6B7280]"}`}>
                                  +${addon.price}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* 3-mo management subscription toggle (eligible channels only) */}
                      {isMgmtEligible(pkg) && (
                        <div className="px-5 pb-5">
                          <button
                            onClick={() => toggleMgmtSub(i)}
                            className={`w-full flex items-center justify-between text-left rounded-xl border-2 px-4 py-3 transition-all ${
                              mgmtSubs[i]
                                ? "border-[#2563EB] bg-blue-50"
                                : "border-[#EBEBEB] hover:border-[#BEBEBE]"
                            }`}
                          >
                            <div>
                              <p className={`text-sm font-bold ${mgmtSubs[i] ? "text-[#2563EB]" : "text-[#000000]"}`}>
                                {mgmtSubs[i] ? "✓ " : "+ "}Add 3-month management
                              </p>
                              <p className="text-xs text-[#6B7280] mt-0.5">{MGMT_SUB_INCLUDES[pkg.channel]}</p>
                              <p className="text-[10px] text-[#9CA3AF] mt-1 uppercase tracking-widest font-semibold">
                                Auto-cancels after 3 months · billed monthly
                              </p>
                            </div>
                            <p className={`text-sm font-bold shrink-0 ml-4 text-right ${mgmtSubs[i] ? "text-[#2563EB]" : "text-[#6B7280]"}`}>
                              +${mgmtSubPrice(pkg)}
                              <span className="block text-xs font-normal">/mo · 3 mo</span>
                            </p>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Rush delivery — global toggle */}
                <div className="border-t border-[#EBEBEB] p-5">
                  <button
                    onClick={() => setRushEnabled((v) => !v)}
                    className={`w-full flex items-center justify-between text-left rounded-xl border px-4 py-3 transition-all ${
                      rushEnabled
                        ? "border-[#2563EB] bg-blue-50"
                        : "border-[#EBEBEB] hover:border-[#BEBEBE]"
                    }`}
                  >
                    <div>
                      <p className={`text-sm font-semibold ${rushEnabled ? "text-[#2563EB]" : "text-[#000000]"}`}>
                        {rushEnabled ? "✓ " : "+ "}Rush Delivery
                      </p>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        {rushEnabled
                          ? "3-business-day turnaround on all packages"
                          : "Upgrade to 3-business-day turnaround (all packages)"}
                      </p>
                    </div>
                    <p className={`text-sm font-bold shrink-0 ml-4 ${rushEnabled ? "text-[#2563EB]" : "text-[#6B7280]"}`}>
                      +$299
                    </p>
                  </button>
                </div>

                {/* Grand total */}
                <div className="border-t border-[#EBEBEB] bg-[#F8F8F8] p-5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Setup total{hasAnyMgmtSub ? " (one-time)" : ""}</span>
                    <span className="font-black text-2xl">${grandTotal.toLocaleString()}</span>
                  </div>
                  {hasAnyMgmtSub && (
                    <>
                      <div className="flex justify-between items-center mt-3 text-[#2563EB]">
                        <span className="font-bold">Management</span>
                        <span className="font-black text-lg">${monthlyTotal.toLocaleString()}/mo · 3 mo</span>
                      </div>
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#EBEBEB]">
                        <span className="text-sm text-[#6B7280]">Charged today (setup + first month)</span>
                        <span className="font-bold">${firstChargeTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1 text-xs text-[#9CA3AF]">
                        <span>Total over 3 months</span>
                        <span>${threeMonthTotal.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm text-[#6B7280]">
                {!hasAnyMgmtSub && <p>✓ One-time payment — no subscriptions, no retainers</p>}
                {hasAnyMgmtSub && <p>✓ Setup is one-time. Management auto-cancels after 3 months.</p>}
                <p>✓ Full setup + handoff in {deliveryDays} business days</p>
                <p>✓ You own everything — credentials, assets, accounts</p>
                <p>✓ $79 flat break-fix if anything ever goes sideways</p>
              </div>
            </div>

            {/* RIGHT — contact + pay */}
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
                <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm">
                  <p className="font-semibold text-[#2563EB] mb-1">After you pay</p>
                  <p className="text-[#6B7280]">
                    You&apos;ll fill out a short intake form for each package — one at a time.
                    Takes about 5 minutes each. We kick off all of them in parallel.
                  </p>
                </div>
              )}

              {error && <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>}

              <button
                onClick={handlePay}
                disabled={loading}
                className="mt-6 w-full bg-[#000000] text-white font-bold text-base py-4 rounded-full hover:bg-[#2563EB] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Redirecting to payment…"
                  : hasAnyMgmtSub
                    ? `Pay $${firstChargeTotal.toLocaleString()} today →`
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
