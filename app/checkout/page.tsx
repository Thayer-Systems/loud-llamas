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

function CheckoutContent() {
  const params = useSearchParams();
  const router = useRouter();

  const channel = params.get("channel") ?? "";
  const tier    = params.get("tier") ?? "";
  const addOns  = params.get("addons")?.split(",").filter(Boolean) ?? [];
  const queue   = params.get("queue") ?? "";

  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const basePrice   = PRICES[channel]?.[tier] ?? 0;
  const addOnTotal  = addOns.reduce((s, a) => s + (ADD_ON_PRICES[a] ?? 0), 0);
  const totalPrice  = basePrice + addOnTotal;
  const deliveryDays = addOns.includes("rush") ? 3 : 7;
  const channelName  = CHANNEL_NAMES[channel] ?? channel;
  const tierLabel    = tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : "";

  useEffect(() => {
    if (!channel || !tier || !basePrice) router.replace("/packages");
  }, [channel, tier, basePrice, router]);

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
        body: JSON.stringify({ channel, tier, addOns, customerName: name, customerEmail: email, queue }),
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
              <h2 className="font-bold text-lg mb-6">Order summary</h2>

              <div className="border border-[#EBEBEB] rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-[#EBEBEB]">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#6B7280] mb-1">Channel</p>
                  <p className="font-bold text-lg">{channelName}</p>
                  <p className="text-[#6B7280] text-sm mt-0.5">{tierLabel} tier · {deliveryDays} business day delivery</p>
                  <p className="font-semibold mt-3">${basePrice.toLocaleString()}</p>
                </div>

                {addOns.length > 0 && (
                  <div className="p-6 border-b border-[#EBEBEB] space-y-3">
                    {addOns.map((a) => (
                      <div key={a} className="flex justify-between text-sm">
                        <span className="text-[#6B7280]">{ADD_ON_NAMES[a] ?? a}</span>
                        <span className="font-semibold">+${ADD_ON_PRICES[a]}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-6 bg-[#F8F8F8] flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <span className="font-black text-2xl">${totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 space-y-2 text-sm text-[#6B7280]">
                <p>✓ One-time payment — no subscriptions, no retainers</p>
                <p>✓ Full setup + handoff in {deliveryDays} business days</p>
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
                  <p className="text-xs text-[#9CA3AF] mt-1.5">Your order confirmation and intake link go here.</p>
                </div>
              </div>

              {error && (
                <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>
              )}

              <button
                onClick={handlePay}
                disabled={loading}
                className="mt-8 w-full bg-[#000000] text-white font-bold text-base py-4 rounded-full hover:bg-[#2563EB] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Redirecting to payment…" : `Pay $${totalPrice.toLocaleString()} →`}
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-[#6B7280]">Loading…</p></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
