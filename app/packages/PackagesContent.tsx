"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CHANNELS = [
  {
    name: "Paid Social Playbook",
    slug: "paid-social",
    emoji: "📣",
    mostPopular: "starter" as const,
    description: "We can't touch your Meta ad account (nobody can — Meta won't allow it). So instead we built something better: a step-by-step guide you execute yourself, built from real campaigns.",
    access: "No account access needed — we deliver a complete guide you run yourself.",
    starter: { price: 149, features: ["Step-by-step guide for 1 platform (Meta, TikTok, etc.)", "How to structure your campaigns", "Who to target and how", "What your ads should look like (brief + examples)", "How to split your budget"] },
    growth: { price: 299, features: ["Step-by-step guides for 2 platforms", "Full campaign setup walkthrough", "Who to target + how to retarget people who already visited", "Ad creative guide with examples", "How to test what's working", "What numbers to aim for (industry benchmarks)"] },
    pro: { price: 499, features: ["All platforms covered", "Full campaign guides for each", "The full customer journey mapped (awareness → purchase)", "Ad creative system you can repeat", "Testing playbook so you keep improving", "How to measure what's actually driving sales", "Competitor breakdown"] },
  },
  {
    name: "Automation",
    slug: "automation",
    emoji: "⚡",
    mostPopular: "pro" as const,
    description: "Tell us what you do manually every day — we build a system that does it for you. New lead comes in? Notify Slack, add to your CRM, send a welcome email. All automatic.",
    access: "We connect to your existing tools — CRM, email, Slack, spreadsheets, and more.",
    starter: { price: 599, features: ["1 automated workflow built", "Connect up to 3 of your tools", "Triggered by one event (e.g. a form submission)", "Basic if/then logic (e.g. if they picked X, do Y)", "Full walkthrough so you know how it works"] },
    growth: { price: 999, features: ["2–3 automated workflows built", "Connect up to 6 of your tools", "Multiple trigger events", "Complex branching (different paths based on different inputs)", "What happens if a step fails (so nothing gets lost)", "Fully tested before we hand it off"] },
    pro: { price: 1799, features: ["Full automation system built", "Connect as many tools as you need", "Multi-step workflows with many connected pieces", "AI-powered decision making inside your workflows", "Alerts set up so you know if anything breaks", "Up to 5 team members", "Full written documentation of everything we built"] },
  },
  {
    name: "Website Build",
    slug: "website-build",
    emoji: "🌐",
    mostPopular: "growth" as const,
    description: "A fast, good-looking website that turns visitors into customers. Built from scratch or rebuilt the right way.",
    access: "You give us access to your current site, or we build a brand new one and hand you the keys.",
    starter: { price: 499, features: ["1–3 pages", "Pre-built design template", "Works on phones & tablets", "Contact form so people can reach you", "Published and live on the internet"] },
    growth: { price: 899, features: ["4–6 pages", "Custom design made for your brand", "Connect a blog or product system you can edit yourself", "Forms that capture visitor info (name, email, etc.)", "Basic setup so Google can find you", "2 rounds of changes"] },
    pro: { price: 1499, features: ["7–10 pages", "Fully custom design", "Connect your other tools (CRM, bookings, payments, etc.)", "Google Analytics installed so you can track visitors", "Full Google-ranking foundation", "Up to 5 team members", "3 rounds of changes"] },
  },
  {
    name: "Organic Social",
    slug: "organic-social",
    emoji: "📱",
    mostPopular: "starter" as const,
    description: "Get your social profiles looking sharp, a bank of ready-to-post content, and a 3-month plan so you always know what to post next.",
    access: "You add us as an admin on your social accounts so we can set everything up.",
    starter: { price: 249, features: ["1 platform (Instagram, LinkedIn, etc.)", "Profile cleaned up and optimized", "10 ready-to-use post templates", "Weekly posting schedule", "Hashtag plan to help people find you"] },
    growth: { price: 499, features: ["2 platforms", "Profile cleaned up and optimized", "20 ready-to-use post templates", "3-month content calendar (so you always know what to post)", "Scheduling tool set up so posts go out automatically", "Bio and profile visuals refreshed"] },
    pro: { price: 899, features: ["3 platforms", "Full profile rebuild", "30+ ready-to-use post templates", "3-month content calendar", "Scheduling tool set up", "Core content themes defined (what your brand talks about)", "Up to 5 team members"] },
  },
  {
    name: "SEM / Google Ads",
    slug: "sem-google-ads",
    emoji: "📊",
    mostPopular: "growth" as const,
    description: "We build your Google Ads account from the ground up — the right keywords, the right structure, tracking set up so you know what's working. Ready to spend on day one.",
    access: "You connect us to your Google Ads account. May require a quick Google identity check (24–48 hrs).",
    starter: { price: 399, features: ["1 ad type set up (e.g. search ads)", "Find the right keywords to bid on", "Write 2 versions of your ad copy", "Set up conversion tracking (know when someone buys or signs up)", "Basic bidding strategy so you don't overspend"] },
    growth: { price: 799, features: ["2 ad types set up", "Full keyword map for your business", "Write 4 versions of your ad copy", "Conversion tracking with specific goals set", "Audience targeting set up", "Block irrelevant searches so you don't waste money"] },
    pro: { price: 1399, features: ["All ad types set up", "Complete account structure built for scale", "Full library of ad copy variations", "Advanced conversion tracking across your whole funnel", "Target multiple audience segments", "Let Google automatically optimize your bids over time", "Monthly report template so you can track results"] },
  },
  {
    name: "Analytics & Tracking",
    slug: "analytics-tracking",
    emoji: "📈",
    mostPopular: "starter" as const,
    description: "Install Google Analytics, Facebook Pixel, and every other tracking tool — then connect them so you can actually see what's driving sales.",
    access: "You add us to your Google Analytics account via email invite. Simple.",
    starter: { price: 199, features: ["Google Analytics 4 installed & configured", "Track key actions (form fills, button clicks, purchases)", "1 ad platform tracking code installed (Facebook, TikTok, etc.)", "Google Tag Manager set up (one place to manage all your tracking)", "Verified it's all working in real time"] },
    growth: { price: 399, features: ["Google Analytics + Tag Manager fully configured", "3 ad platform tracking codes installed", "Every important action on your site tracked", "Custom data points tracked for your specific business", "Dashboard so you can see everything in one place"] },
    pro: { price: 699, features: ["Full tracking stack installed and connected", "All ad platforms tracked", "Advanced event tracking across your whole site", "Custom reports built for your business", "Behind-the-scenes data layer so tracking is reliable long-term", "See which channels are actually driving sales (not just last click)", "Up to 5 team members"] },
  },
  {
    name: "Email / Lifecycle",
    slug: "email-lifecycle",
    emoji: "📧",
    mostPopular: "growth" as const,
    description: "Automated emails that go out at the right time — welcoming new subscribers, re-engaging cold leads, keeping customers coming back. Set up once, runs on its own.",
    access: "You invite us to your email platform (Klaviyo, Mailchimp, etc.) and we set it up for you.",
    starter: { price: 249, features: ["1 automated email series", "Up to 3 emails in the series", "Pre-built email template", "Basic list sorting (e.g. new vs. returning)", "Connected to your email platform"] },
    growth: { price: 499, features: ["2 automated email series", "Up to 5 emails per series", "Emails designed to match your brand", "Sort your list by behavior (clicked, didn't open, etc.)", "Test 2 subject lines to see which gets more opens", "Emails that trigger automatically based on what people do"] },
    pro: { price: 899, features: ["3+ automated email series", "Full email journey mapped out (new lead → loyal customer)", "Smart list sorting based on interests & actions", "Emails that fire based on specific actions (bought, clicked, abandoned)", "Everything automated end-to-end", "Up to 5 team members", "Dashboard so you can see what's working"] },
  },
  {
    name: "SEO / AEO Foundation",
    slug: "seo-aeo",
    emoji: "🔍",
    mostPopular: "growth" as const,
    description: "Get your site found on Google — and now AI tools like ChatGPT. We find the right keywords, fix hidden errors, and set up the tools that track your rankings.",
    access: "We just need read-only access to your Google Search Console and website. No shared passwords.",
    starter: { price: 349, features: ["Find 20 keywords your customers are searching for", "Set up Google Search Console (so Google knows your site exists)", "Add page titles & descriptions that show up in search results", "Create a sitemap (a map of your site that Google can read)", "Check for basic errors hurting your rankings"] },
    growth: { price: 699, features: ["Find 50 keywords your customers are searching for", "Full Google Search Console + Google Analytics setup", "Optimize your existing pages to rank higher", "Fix technical errors found in the audit", "Plan your content so each page targets the right searches", "Add structured data so Google understands your pages better"] },
    pro: { price: 1199, features: ["Find 100+ keywords your customers are searching for", "Deep technical audit with every issue fixed", "Every page optimized for search", "Content plan so you keep ranking over time", "Strategy to get other websites to link to yours", "Optimized to show up in AI search tools like ChatGPT & Perplexity", "Monthly reporting template so you can track progress"] },
  },
];

const ADD_ONS = [
  {
    id: "automation",
    name: "Automation Upgrade",
    price: "+$499",
    per: "per channel",
    description: "Add automation to ANY channel package — turn your setup into a hands-free machine. Advanced sequences, conditional logic, and multi-step workflows built on top of whatever you're getting done.",
  },
  {
    id: "rush",
    name: "Rush Delivery",
    price: "+$299",
    per: "one-time",
    description: "Need it faster? Rush gets you a 3-business-day turnaround instead of the standard 5–7.",
  },
  {
    id: "playbook",
    name: "Paid Social Playbook Bundle",
    price: "+$99",
    per: "add to any package",
    description: "Add the complete Paid Social Playbook to any other setup package. Years of paid social experience, packaged for you to execute.",
  },
  {
    id: "break-fix",
    name: "Troubleshooting / Break Fix",
    price: "$79",
    per: "per incident",
    description: "Something broke after handoff? Flat-fee fix. No drama, no retainer, no guessing.",
  },
];

const TIERS = [
  { name: "Starter", color: "border-[#E5E7EB]", badge: "bg-[#F3F4F6] text-[#6B7280]", users: "1 user", scope: "Single use case, template-based, minimal integrations" },
  { name: "Growth", color: "border-[#2563EB]", badge: "bg-blue-50 text-[#2563EB]", users: "2–3 users", scope: "Multiple use cases, basic automations, light integrations" },
  { name: "Pro", color: "border-[#000000]", badge: "bg-[#000000] text-white", users: "Up to 5 users", scope: "Full feature setup, advanced config, integrations" },
];

type SelectedPackage = { slug: string; tier: "starter" | "growth" | "pro"; name: string; price: number };

export default function PackagesContent() {
  const router = useRouter();
  const [selected, setSelected] = useState<SelectedPackage[]>([]);

  function togglePackage(slug: string, tier: "starter" | "growth" | "pro", name: string, price: number) {
    setSelected((prev) => {
      const exists = prev.find((p) => p.slug === slug && p.tier === tier);
      if (exists) return prev.filter((p) => !(p.slug === slug && p.tier === tier));
      // Remove any other tier of the same channel
      const filtered = prev.filter((p) => p.slug !== slug);
      return [...filtered, { slug, tier, name, price }];
    });
  }

  function isSelected(slug: string, tier: "starter" | "growth" | "pro") {
    return selected.some((p) => p.slug === slug && p.tier === tier);
  }

  function handleConfigure() {
    if (selected.length === 0) return;
    const [first, ...rest] = selected;
    const queue = rest.map((p) => `${p.slug}:${p.tier}`).join(",");
    const url = `/configure/${first.slug}?tier=${first.tier}${queue ? `&queue=${encodeURIComponent(queue)}` : ""}`;
    router.push(url);
  }

  const totalSelected = selected.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="min-h-screen bg-white text-[#000000]">
      {/* HEADER */}
      <section className="bg-[#000000] text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">All packages</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            8 channels. 3 tiers each. One-time price. Full setup in 5–7 business days.
            Pick what you need. Pay once. Own it forever.
          </p>
        </div>
      </section>

      {/* TIER LEGEND */}
      <section className="bg-[#F3F4F6] border-b border-[#E5E7EB] py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-4">
            {TIERS.map((tier) => (
              <div key={tier.name} className={`bg-white rounded-xl p-5 border-2 ${tier.color}`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded ${tier.badge}`}>
                    {tier.name}
                  </span>
                  <span className="text-sm text-[#6B7280]">{tier.users}</span>
                </div>
                <p className="text-sm text-[#6B7280]">{tier.scope}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHANNEL CARDS */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col gap-16">
          {CHANNELS.map((ch) => (
            <div key={ch.slug} id={ch.slug}>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{ch.emoji}</span>
                  <h2 className="text-2xl font-extrabold">{ch.name}</h2>
                </div>
                <p className="text-[#6B7280] mb-1">{ch.description}</p>
                <p className="text-xs text-[#6B7280]">
                  <span className="font-semibold">Access:</span> {ch.access}
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                {(["starter", "growth", "pro"] as const).map((tier) => {
                  const data = ch[tier];
                  const isPopular = ch.mostPopular === tier;
                  const sel = isSelected(ch.slug, tier);
                  const tierStyles = {
                    starter: {
                      border: sel ? "border-[#2563EB]" : "border-[#E5E7EB]",
                      badge: "bg-[#F3F4F6] text-[#6B7280]",
                      btn: sel
                        ? "bg-[#2563EB] text-white border-2 border-[#2563EB]"
                        : "border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white",
                    },
                    growth: {
                      border: sel ? "border-[#2563EB]" : "border-[#2563EB]",
                      badge: "bg-blue-50 text-[#2563EB]",
                      btn: sel
                        ? "bg-[#000000] text-white border-2 border-[#000000]"
                        : "bg-[#2563EB] text-white hover:bg-blue-700",
                    },
                    pro: {
                      border: sel ? "border-[#2563EB]" : "border-[#000000]",
                      badge: "bg-[#000000] text-white",
                      btn: sel
                        ? "bg-[#2563EB] text-white border-2 border-[#2563EB]"
                        : "border-2 border-[#000000] text-[#000000] hover:bg-[#000000] hover:text-white",
                    },
                  };
                  const styles = tierStyles[tier];

                  return (
                    <div
                      key={tier}
                      className={`border-2 ${styles.border} rounded-2xl p-6 flex flex-col relative transition-all duration-200 ${sel ? "ring-2 ring-[#2563EB] ring-offset-2" : ""}`}
                    >
                      {isPopular && !sel && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="bg-[#2563EB] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
                            Most popular
                          </span>
                        </div>
                      )}
                      {sel && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="bg-[#2563EB] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-1">
                            ✓ Selected
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded ${styles.badge}`}>
                          {tier.charAt(0).toUpperCase() + tier.slice(1)}
                        </span>
                        <span className="text-2xl font-extrabold">${data.price}</span>
                      </div>
                      <ul className="flex flex-col gap-2 mb-6 flex-1">
                        {data.features.map((f) => (
                          <li key={f} className="text-sm text-[#6B7280] flex items-start gap-2">
                            <span className="text-[#2563EB] mt-0.5">✓</span> {f}
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-2">
                        <button
                          onClick={() => togglePackage(ch.slug, tier, ch.name, data.price)}
                          className={`flex-1 font-bold py-2.5 rounded-xl transition-colors text-sm ${styles.btn}`}
                        >
                          {sel ? "Remove" : "Add to selection"}
                        </button>
                        <Link
                          href={`/configure/${ch.slug}?tier=${tier}`}
                          className="px-3 py-2.5 rounded-xl border-2 border-[#E5E7EB] text-[#6B7280] hover:border-[#000000] hover:text-[#000000] transition-colors text-sm font-medium"
                          title="Configure now"
                        >
                          →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ADD-ONS */}
      <section className="bg-[#F3F4F6] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold mb-2">Add-ons</h2>
          <p className="text-[#6B7280] mb-10">Stack these on top of any package at checkout.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ADD_ONS.map((addon) => (
              <div key={addon.id} className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
                <p className="font-bold text-lg mb-1">{addon.name}</p>
                <p className="text-[#2563EB] font-extrabold text-xl mb-1">{addon.price}</p>
                <p className="text-xs text-[#6B7280] mb-3">{addon.per}</p>
                <p className="text-sm text-[#6B7280] leading-relaxed">{addon.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#2563EB] py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Not sure where to start?
          </h2>
          <p className="text-blue-100 mb-8">
            Use the configurator. Answer a few questions. Get a quote. If you&apos;re stuck — let the llamas decide.
          </p>
          <Link
            href="/packages#paid-social"
            className="inline-block bg-white text-[#2563EB] font-bold text-lg px-10 py-4 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Pick a channel above
          </Link>
        </div>
      </section>

      {/* STICKY SELECTION BAR */}
      {selected.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-[#2563EB] shadow-2xl">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-[#2563EB] mb-1">
                {selected.length} package{selected.length !== 1 ? "s" : ""} selected
              </p>
              <div className="flex flex-wrap gap-2">
                {selected.map((p) => (
                  <span
                    key={`${p.slug}-${p.tier}`}
                    className="text-xs bg-[#F3F4F6] text-[#000000] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5"
                  >
                    {p.name} — {p.tier.charAt(0).toUpperCase() + p.tier.slice(1)}
                    <button
                      onClick={() => togglePackage(p.slug, p.tier, p.name, p.price)}
                      className="text-[#6B7280] hover:text-red-500 transition-colors leading-none ml-0.5"
                      aria-label={`Remove ${p.name}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-[#6B7280]">Total from</p>
                <p className="text-xl font-extrabold">${totalSelected.toLocaleString()}</p>
              </div>
              <button
                onClick={handleConfigure}
                className="bg-[#2563EB] text-white font-bold px-7 py-3 rounded-full hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
              >
                Configure {selected.length > 1 ? "all" : "it"} →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom padding so content isn't hidden behind sticky bar */}
      {selected.length > 0 && <div className="h-28" />}
    </div>
  );
}
