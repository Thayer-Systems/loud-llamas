"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Tier = "starter" | "growth" | "pro";

type SetupChannel = {
  name: string;
  slug: string;
  emoji: string;
  description: string;
  pitch: string;
  setupIncludes: string[];
  subIncludes?: string[];
  starter: { price: number; sub?: number; features: string[] };
  growth: { price: number; sub?: number; features: string[] };
  pro: { price: number; sub?: number; features: string[] };
  mostPopular: Tier;
};

const ONE_TIME_CHANNELS: SetupChannel[] = [
  {
    name: "Website Build",
    slug: "website-build",
    emoji: "🌐",
    description: "A real website that loads fast, looks sharp, and actually shows up on Google.",
    pitch: "Fully custom. No WordPress, no page builders, no templates someone else used last week. Five to twelve pages depending on tier. Built clean, handed over completely. You get the code, the credentials, and the login. We disappear.",
    setupIncludes: [],
    starter: {
      price: 179,
      features: [
        "5 pages",
        "Mobile ready",
        "Contact form that delivers leads to your inbox",
        "Meta titles and descriptions written for search",
        "Clean H1 structure",
        "Schema markup so Google reads it right",
      ],
    },
    growth: {
      price: 299,
      features: [
        "8 pages",
        "Everything in Starter",
        "Image optimization so the site stays fast",
        "Internal linking that helps Google map your content",
        "Google Search Console set up and submitted",
      ],
    },
    pro: {
      price: 449,
      features: [
        "12 pages",
        "Everything in Growth",
        "Page speed optimization with measured before/after",
        "Local SEO signals for businesses with a service area",
        "GA4 connected and tracking from day one",
      ],
    },
    mostPopular: "pro",
  },
  {
    name: "Paid Social Playbook",
    slug: "paid-social",
    emoji: "📣",
    description: "A custom Meta playbook built around your exact customer, offer, and market.",
    pitch: "Not a template. Not a PDF someone else got last week. Built specifically for your ICP, your product or service, and the platform your customer actually uses. You run the ads. We built the entire roadmap.",
    setupIncludes: [],
    starter: {
      price: 59,
      features: [
        "Meta only",
        "Custom campaign framework written for your offer",
        "Audience guide tied to your real ICP",
        "Ad copy templates you can run as-is",
        "Creative brief so you know what assets to make",
      ],
    },
    growth: {
      price: 99,
      features: [
        "Meta plus one extra platform (X, Reddit, or TikTok)",
        "ICP-specific angle for each platform",
        "Custom campaign framework",
        "Audience guide tied to your real ICP",
        "Ad copy templates you can run as-is",
      ],
    },
    pro: {
      price: 149,
      features: [
        "Meta plus two or more platforms",
        "Platforms: X, Reddit, TikTok, Pinterest, LinkedIn",
        "Full multi-platform playbook with sequencing",
        "Platform-specific creative briefs",
        "Sequencing guide so you know what to run first, next, and last",
      ],
    },
    mostPopular: "starter",
  },
];

const SETUP_PLUS_SUB_CHANNELS: SetupChannel[] = [
  {
    name: "SEM / Google Ads",
    slug: "sem-google-ads",
    emoji: "📊",
    description: "Google Ads that bring in calls instead of just spending your budget.",
    pitch: "We build the campaign structure, write the ads, set up conversion tracking, and make sure the right people are seeing you at the right moment. You will know exactly what is working and what is not before we hand it off.",
    setupIncludes: [
      "Campaign structure built for your service or product",
      "Keyword research with negatives included",
      "Ad copy variations written and loaded",
      "Conversion tracking verified and firing",
    ],
    subIncludes: [
      "Weekly search term review",
      "Bid adjustments based on conversion data",
      "One structural change per week",
      "Monthly plain-language report. No jargon. No fluff.",
    ],
    starter: {
      price: 149, sub: 99, features: [
        "Campaign structure built for one core service or product",
        "Keyword research with negatives included",
        "Three ad variations written and loaded",
        "Conversion tracking verified and firing",
        "Search terms report walkthrough video recorded and delivered",
      ],
    },
    growth: {
      price: 249, sub: 149, features: [
        "Everything in Starter",
        "Two campaign types (Search plus one additional)",
        "Five ad variations per campaign",
        "Audience signal setup",
        "Monthly performance summary template delivered",
      ],
    },
    pro: {
      price: 399, sub: 199, features: [
        "Everything in Growth",
        "Full account structure across all core services",
        "Competitor gap analysis included",
        "Quality score audit and fixes before handoff",
        "30-minute recorded walkthrough of the full account",
      ],
    },
    mostPopular: "growth",
  },
  {
    name: "Analytics & Tracking",
    slug: "analytics-tracking",
    emoji: "📈",
    description: "Know which ads are making you money and which ones are just costing you money.",
    pitch: "GA4 fully configured, conversion events firing correctly, and a dashboard that shows you what actually matters. No more guessing. No more looking at numbers that do not connect to revenue.",
    setupIncludes: [
      "GA4 property configured",
      "Five core conversion events set up and verified",
      "Dashboard with traffic, leads, and top pages",
    ],
    subIncludes: [
      "Monthly review",
      "Alert monitoring",
      "Dashboard updates",
      "Plain-language summary of what changed and why",
    ],
    starter: {
      price: 99, sub: 49, features: [
        "GA4 property configured",
        "Five core conversion events set up and verified",
        "Basic dashboard with traffic, leads, and top pages",
      ],
    },
    growth: {
      price: 179, sub: 79, features: [
        "Everything in Starter",
        "Source and medium attribution configured",
        "Ecommerce or lead tracking depending on business type",
        "Custom dashboard with revenue or lead metrics front and center",
      ],
    },
    pro: {
      price: 279, sub: 99, features: [
        "Everything in Growth",
        "Full funnel tracking from ad click to conversion",
        "Audience segments built for retargeting",
        "30-minute recorded walkthrough",
      ],
    },
    mostPopular: "pro",
  },
  {
    name: "Email / Lifecycle",
    slug: "email-lifecycle",
    emoji: "📧",
    description: "A welcome sequence that converts leads while you sleep.",
    pitch: "Platform configured, list segmented, welcome flow live. The first impression a new lead gets from you will be automatic, on-brand, and actually move them toward a purchase. Built once. Runs forever.",
    setupIncludes: [
      "Platform configured and domain authenticated",
      "Welcome sequence written, designed, and live",
      "List segmented by lead source",
    ],
    subIncludes: [
      "Deliverability monitoring weekly",
      "One new email written and added per month",
      "Monthly performance review with open rate and click rate benchmarks",
    ],
    starter: {
      price: 99, sub: 49, features: [
        "Platform configured and domain authenticated",
        "Welcome sequence: three emails written, designed, and live",
        "List segmented by lead source",
      ],
    },
    growth: {
      price: 179, sub: 79, features: [
        "Everything in Starter",
        "Five-email welcome sequence",
        "One additional sequence (abandoned, re-engagement, or post-purchase depending on business)",
        "Lead magnet delivery configured if applicable",
      ],
    },
    pro: {
      price: 279, sub: 99, features: [
        "Everything in Growth",
        "Seven-email welcome sequence",
        "Two additional sequences",
        "Behavioral trigger setup",
        "30-minute recorded walkthrough",
      ],
    },
    mostPopular: "starter",
  },
];

const TIERS: { key: Tier; name: string; users: string; scope: string; color: string; badge: string }[] = [
  { key: "starter", name: "Starter", color: "border-[#E5E7EB]", badge: "bg-[#F3F4F6] text-[#6B7280]", users: "Solo / 1 use case", scope: "Single use case, lean setup" },
  { key: "growth", name: "Growth", color: "border-[#2563EB]", badge: "bg-blue-50 text-[#2563EB]", users: "Small team", scope: "Multiple use cases, more depth" },
  { key: "pro", name: "Pro", color: "border-[#000000]", badge: "bg-[#000000] text-white", users: "Full team", scope: "Full feature setup, advanced config" },
];

const AUTOMATION_RANGES = [
  {
    name: "Simple",
    range: "$79–$149",
    desc: "One trigger, one action.",
    examples: "Lead notification, form to CRM, welcome email trigger.",
  },
  {
    name: "Medium",
    range: "$199–$349",
    desc: "Multi-step flows.",
    examples: "Onboarding sequence, review request chain, appointment reminders.",
  },
  {
    name: "Complex",
    range: "$399–$599",
    desc: "Cross-platform, conditional logic, multiple triggers and actions.",
    examples: "Anything you've been hand-stitching across 4+ tools.",
  },
];

type Selection = { slug: string; tier: Tier; name: string; price: number };

export default function PackagesContent() {
  const router = useRouter();
  const [selected, setSelected] = useState<Selection[]>([]);
  // Single-expand accordion: only one channel open at a time.
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  function toggle(channel: SetupChannel, tier: Tier) {
    const data = channel[tier];
    setSelected((prev) => {
      const exists = prev.find((p) => p.slug === channel.slug && p.tier === tier);
      if (exists) return prev.filter((p) => !(p.slug === channel.slug && p.tier === tier));
      const filtered = prev.filter((p) => p.slug !== channel.slug);
      return [...filtered, { slug: channel.slug, tier, name: channel.name, price: data.price }];
    });
    // Keep this channel open when a tier inside it is selected
    setExpandedSlug(channel.slug);
  }

  function toggleExpanded(slug: string) {
    setExpandedSlug((prev) => (prev === slug ? null : slug));
  }

  function isSelected(slug: string, tier: Tier) {
    return selected.some((p) => p.slug === slug && p.tier === tier);
  }

  function handleConfigure() {
    if (selected.length === 0) return;
    if (selected.length === 1) {
      router.push(`/configure/${selected[0].slug}?tier=${selected[0].tier}`);
    } else {
      const packagesParam = selected.map((p) => `${p.slug}:${p.tier}`).join(",");
      router.push(`/checkout?packages=${encodeURIComponent(packagesParam)}`);
    }
  }

  const totalSelected = selected.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="min-h-screen bg-white text-[#000000]">
      {/* HEADER */}
      <section className="bg-[#000000] text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-sm font-bold tracking-widest uppercase text-[#2563EB] mb-4">All packages</p>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[0.95]">
            One-time setups.<br />
            <span className="text-[#2563EB]">Zero ongoing nonsense.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
            Pick what you need. Pay once. Own it forever. Optional 90-day sprint on a few channels. Clearly priced. Never hidden.
          </p>
        </div>
      </section>

      {/* TIER LEGEND */}
      <section className="bg-[#F3F4F6] border-b border-[#E5E7EB] py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-4">
            {TIERS.map((tier) => (
              <div key={tier.key} className={`bg-white rounded-xl p-5 border-2 ${tier.color}`}>
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

      {/* GROUP 1 — ONE TIME FOREVER */}
      <GroupHeader
        eyebrow="Group 1"
        title="One-time. Forever."
        description="Pay once. Get it. Own it. No subscription. No monthly invoice. Done."
      />
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col gap-3">
          {ONE_TIME_CHANNELS.map((ch) => (
            <ChannelBlock
              key={ch.slug}
              channel={ch}
              isSelected={isSelected}
              onToggle={toggle}
              isExpanded={expandedSlug === ch.slug}
              onToggleExpanded={toggleExpanded}
            />
          ))}
        </div>
      </section>

      {/* GROUP 2 — SETUP + OPTIONAL 90-DAY SPRINT */}
      <div className="bg-[#F8F8F8]">
        <GroupHeader
          eyebrow="Group 2"
          title="Still finding your footing? We can stay for 90 days."
          description="Most clients take the setup and run. That is the whole point. But if you have never run Google Ads before, or you want someone watching the numbers while you figure out the rhythm, we offer a 90-day sprint. We stay hands-on, make weekly adjustments, and walk you through what we are doing so that by day 90 you do not need us at all. Completely optional. We genuinely do not care if you use it. We just want the setup to actually work for you. From $49/mo. Ends at 90 days. No renewal. No pressure."
          dark={false}
        />
        <section className="pb-16">
          <div className="max-w-6xl mx-auto px-6 flex flex-col gap-3">
            {SETUP_PLUS_SUB_CHANNELS.map((ch) => (
              <ChannelBlock
                key={ch.slug}
                channel={ch}
                isSelected={isSelected}
                onToggle={toggle}
                isExpanded={expandedSlug === ch.slug}
                onToggleExpanded={toggleExpanded}
              />
            ))}
          </div>
        </section>
      </div>

      {/* GROUP 3 — CUSTOM (AUTOMATION) */}
      <GroupHeader
        eyebrow="Group 3"
        title="Custom. Built to your problem."
        description="Automation isn't a template. Tell us what's eating your time. We scope it, quote it, build it."
      />
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="border-2 border-[#000000] rounded-3xl overflow-hidden">
            <div className="bg-[#000000] text-white p-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">⚡</span>
                <h2 className="text-2xl font-extrabold">Automation</h2>
                <span className="bg-[#2563EB] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">Custom Quote</span>
              </div>
              <p className="text-gray-300 max-w-2xl">
                Walk us through what you do manually every day. We&apos;ll build a system that does it for you and tell you the price upfront.
              </p>
            </div>
            <div className="p-8 grid md:grid-cols-3 gap-5 bg-white">
              {AUTOMATION_RANGES.map((r) => (
                <div key={r.name} className="border border-[#E5E7EB] rounded-2xl p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#2563EB] mb-2">{r.name}</p>
                  <p className="text-2xl font-black mb-3">{r.range}</p>
                  <p className="font-semibold text-sm mb-2">{r.desc}</p>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{r.examples}</p>
                </div>
              ))}
            </div>
            <div className="bg-white border-t border-[#EBEBEB] p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[#6B7280] text-sm">No off-the-shelf packages. Real quote in 24 hours.</p>
              <Link
                href="/support?topic=automation"
                className="bg-[#2563EB] text-white font-bold px-7 py-3 rounded-full hover:bg-blue-700 transition-colors"
              >
                Tell us what&apos;s eating your time →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* GROUP 4 — RECURRING (BURNRATE) */}
      <div className="bg-[#000000] text-white">
        <GroupHeader
          eyebrow="Group 4"
          title="Your 24/7 paid media monitor. Burnrate."
          description="The one thing on this site you pay monthly. Watches your ads while you sleep so you stop bleeding budget."
          dark
        />
        <section className="pb-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-[#0A0A0A] border-2 border-[#2563EB] rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#2563EB] mb-3">24/7 ad monitor · Standalone or add-on</p>
                <h2 className="text-4xl md:text-5xl font-black mb-4 leading-[0.95]">Burnrate</h2>
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  Connects Google Ads and Meta. Runs weekly waste detection. Flags paid/organic keyword overlap. Sends you a prioritized fix list.
                </p>
                <ul className="space-y-2 text-gray-300 text-sm mb-6">
                  <li className="flex items-start gap-2"><span className="text-[#2563EB]">✓</span> OAuth onboarding. No manual uploads, no calls.</li>
                  <li className="flex items-start gap-2"><span className="text-[#2563EB]">✓</span> First report in 24 hours</li>
                  <li className="flex items-start gap-2"><span className="text-[#2563EB]">✓</span> Cancel anytime</li>
                </ul>
              </div>
              <div className="bg-black border border-[#1F2937] rounded-2xl p-6 space-y-4">
                <div className="flex items-baseline justify-between border-b border-[#1F2937] pb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Standard</p>
                    <p className="text-3xl font-black">$29<span className="text-base font-bold text-gray-400">/mo</span></p>
                  </div>
                  <p className="text-xs text-gray-500">Cancel anytime</p>
                </div>
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#2563EB] mb-1">Founder · First 100</p>
                    <p className="text-3xl font-black text-[#2563EB]">$17.99<span className="text-base font-bold text-blue-400">/mo</span></p>
                    <p className="text-xs text-gray-400 mt-1">Locked forever</p>
                  </div>
                </div>
                <Link
                  href="/burnrate"
                  className="block w-full text-center bg-[#2563EB] text-white font-bold py-3 rounded-full hover:bg-blue-700 transition-colors"
                >
                  See Burnrate →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* CTA */}
      <section className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-4 leading-[0.95]">
            Pick a channel.<br />Get on with your day.
          </h2>
          <p className="text-[#6B7280] mb-8 text-lg">
            Not sure where to start? Just pick the one that&apos;s been sitting on your to-do list the longest.
          </p>
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
                    {p.name} · {p.tier.charAt(0).toUpperCase() + p.tier.slice(1)}
                    <button
                      onClick={() => setSelected((prev) => prev.filter((x) => !(x.slug === p.slug && x.tier === p.tier)))}
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
                <p className="text-xs text-[#6B7280]">Setup total</p>
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

      {selected.length > 0 && <div className="h-28" />}
    </div>
  );
}

function GroupHeader({
  eyebrow,
  title,
  description,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  dark?: boolean;
}) {
  return (
    <section className="pt-16 pb-10">
      <div className="max-w-6xl mx-auto px-6">
        <p className={`text-xs font-bold tracking-widest uppercase mb-3 ${dark ? "text-[#2563EB]" : "text-[#2563EB]"}`}>
          {eyebrow}
        </p>
        <h2 className={`text-3xl md:text-4xl font-black mb-3 ${dark ? "text-white" : "text-[#000000]"}`}>
          {title}
        </h2>
        <p className={`max-w-2xl ${dark ? "text-gray-300" : "text-[#6B7280]"}`}>{description}</p>
      </div>
    </section>
  );
}

function ChannelBlock({
  channel,
  isSelected,
  onToggle,
  isExpanded,
  onToggleExpanded,
}: {
  channel: SetupChannel;
  isSelected: (slug: string, tier: Tier) => boolean;
  onToggle: (channel: SetupChannel, tier: Tier) => void;
  isExpanded: boolean;
  onToggleExpanded: (slug: string) => void;
}) {
  const hasSub = !!channel.starter.sub;
  const minPrice = Math.min(channel.starter.price, channel.growth.price, channel.pro.price);
  const maxPrice = Math.max(channel.starter.price, channel.growth.price, channel.pro.price);
  const priceRange = minPrice === maxPrice ? `$${minPrice}` : `$${minPrice}–$${maxPrice}`;

  return (
    <div
      id={channel.slug}
      className={`bg-white border rounded-2xl overflow-hidden transition-colors ${isExpanded ? "border-[#2563EB]" : "border-[#E5E7EB]"}`}
    >
      {/* Accordion header */}
      <button
        onClick={() => onToggleExpanded(channel.slug)}
        aria-expanded={isExpanded}
        aria-controls={`${channel.slug}-panel`}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-[#FAFAFA] transition-colors"
      >
        <div className="flex items-center gap-3 flex-wrap min-w-0">
          <span className="text-2xl shrink-0">{channel.emoji}</span>
          <h2 className="text-lg sm:text-xl font-extrabold">{channel.name}</h2>
          {hasSub && (
            <span className="bg-blue-50 text-[#2563EB] text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
              + Optional 90-day sprint
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">From</p>
            <p className="font-extrabold text-[#000000]">{priceRange}</p>
          </div>
          <span
            className={`text-2xl text-[#6B7280] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            ⌄
          </span>
        </div>
      </button>

      {isExpanded && (
        <div id={`${channel.slug}-panel`} className="border-t border-[#E5E7EB] p-5 md:p-6">
          <p className="text-[#000000] mb-1 font-medium">{channel.description}</p>
          <p className="text-sm text-[#6B7280]">{channel.pitch}</p>

          {channel.setupIncludes.length > 0 && (
            <div className="mt-5 grid md:grid-cols-2 gap-4">
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-[#000000] mb-2">Setup includes</p>
                <ul className="text-sm text-[#6B7280] space-y-1">
                  {channel.setupIncludes.map((s) => (
                    <li key={s} className="flex items-start gap-2"><span className="text-[#2563EB]">✓</span>{s}</li>
                  ))}
                </ul>
              </div>
              {channel.subIncludes && (
                <div className="bg-white border border-[#2563EB] rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#2563EB] mb-2">90-day sprint includes</p>
                  <ul className="text-sm text-[#6B7280] space-y-1">
                    {channel.subIncludes.map((s) => (
                      <li key={s} className="flex items-start gap-2"><span className="text-[#2563EB]">✓</span>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-5 mt-6">
        {(["starter", "growth", "pro"] as const).map((tier) => {
          const data = channel[tier];
          const isPopular = channel.mostPopular === tier;
          const sel = isSelected(channel.slug, tier);
          const tierStyles = {
            starter: { border: sel ? "border-[#2563EB]" : "border-[#E5E7EB]", badge: "bg-[#F3F4F6] text-[#6B7280]", btn: sel ? "bg-[#2563EB] text-white border-2 border-[#2563EB]" : "border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white" },
            growth:  { border: sel ? "border-[#2563EB]" : "border-[#2563EB]", badge: "bg-blue-50 text-[#2563EB]",   btn: sel ? "bg-[#000000] text-white border-2 border-[#000000]" : "bg-[#2563EB] text-white hover:bg-blue-700" },
            pro:     { border: sel ? "border-[#2563EB]" : "border-[#000000]", badge: "bg-[#000000] text-white",      btn: sel ? "bg-[#2563EB] text-white border-2 border-[#2563EB]" : "border-2 border-[#000000] text-[#000000] hover:bg-[#000000] hover:text-white" },
          };
          const styles = tierStyles[tier];

          return (
            <div
              key={tier}
              className={`bg-white border-2 ${styles.border} rounded-2xl p-6 flex flex-col relative transition-all duration-200 ${sel ? "ring-2 ring-[#2563EB] ring-offset-2" : ""}`}
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
                <div className="text-right">
                  <p className="text-2xl font-extrabold">${data.price}</p>
                  {data.sub !== undefined && (
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      <span className="font-semibold text-[#000000]">+ optional</span> ${data.sub}/mo · 90-day sprint
                    </p>
                  )}
                </div>
              </div>
              {data.features.length > 0 && (
                <ul className="flex flex-col gap-2 mb-6 flex-1">
                  {data.features.map((f) => (
                    <li key={f} className="text-sm text-[#6B7280] flex items-start gap-2">
                      <span className="text-[#2563EB] mt-0.5">✓</span> {f}
                    </li>
                  ))}
                </ul>
              )}
              {data.features.length === 0 && <div className="flex-1" />}
              <div className="flex gap-2">
                <button
                  onClick={() => onToggle(channel, tier)}
                  className={`flex-1 font-bold py-2.5 rounded-xl transition-colors text-sm ${styles.btn}`}
                >
                  {sel ? "Remove" : "Add to selection"}
                </button>
                <Link
                  href={`/configure/${channel.slug}?tier=${tier}`}
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
      )}
    </div>
  );
}
