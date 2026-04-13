import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const CHANNELS = [
  {
    name: "Website Build",
    slug: "website-build",
    emoji: "🌐",
    description: "A fast, modern website that converts. Built fresh or rebuilt right.",
    access: "Client provides CMS/hosting login, or we build fresh on Vercel.",
    starter: { price: 499, features: ["1–3 pages", "Template-based design", "Mobile responsive", "Basic contact form", "Deploy to Vercel"] },
    growth: { price: 899, features: ["4–6 pages", "Custom design", "CMS integration", "Lead capture forms", "Basic SEO setup", "2 revision rounds"] },
    pro: { price: 1499, features: ["7–10 pages", "Full custom design", "Advanced integrations", "Analytics setup", "Full SEO foundation", "Up to 5 team members", "3 revision rounds"] },
  },
  {
    name: "Email / Lifecycle",
    slug: "email-lifecycle",
    emoji: "📧",
    description: "Welcome series, cart recovery, nurture flows. Set up once, runs forever.",
    access: "Client invites via platform admin role.",
    starter: { price: 249, features: ["1 email sequence", "Up to 3 emails", "Template design", "Basic segmentation", "Single ESP setup"] },
    growth: { price: 499, features: ["2 email sequences", "Up to 5 emails each", "Custom branded design", "Audience segmentation", "A/B subject line testing", "Automations setup"] },
    pro: { price: 899, features: ["3+ email sequences", "Full lifecycle mapping", "Advanced segmentation", "Behavioral triggers", "Full automation build", "Up to 5 team members", "Analytics dashboard"] },
  },
  {
    name: "Organic Social",
    slug: "organic-social",
    emoji: "📱",
    description: "Profile optimization, content templates, and a 90-day posting system.",
    access: "Client invites as admin (LinkedIn Pages / TikTok Business supported).",
    starter: { price: 249, features: ["1 platform", "Profile optimization", "10 content templates", "Posting schedule", "Hashtag strategy"] },
    growth: { price: 499, features: ["2 platforms", "Profile optimization", "20 content templates", "90-day content calendar", "Scheduling tool setup", "Bio and branding refresh"] },
    pro: { price: 899, features: ["3 platforms", "Full profile overhaul", "30+ content templates", "90-day content calendar", "Scheduling setup", "Content pillars doc", "Up to 5 team members"] },
  },
  {
    name: "SEO / AEO Foundation",
    slug: "seo-aeo",
    emoji: "🔍",
    description: "Keyword strategy, technical audit, and GSC setup. Built to rank.",
    access: "Read-only GSC access + CMS access. No login sharing required.",
    starter: { price: 349, features: ["Keyword research (20 terms)", "Google Search Console setup", "Meta tags on key pages", "XML sitemap", "Basic technical audit"] },
    growth: { price: 699, features: ["Keyword research (50 terms)", "Full GSC + GA4 setup", "On-page optimization", "Technical audit + fixes", "Content structure plan", "Schema markup"] },
    pro: { price: 1199, features: ["Keyword research (100+ terms)", "Full technical SEO audit", "Complete on-page optimization", "Content calendar", "Link building strategy", "AEO / AI search optimization", "Monthly reporting setup"] },
  },
  {
    name: "Paid Social Playbook",
    slug: "paid-social",
    emoji: "📣",
    description: "No ad account access needed. A complete implementation playbook built from real campaigns.",
    access: "No platform access required — playbook delivery only.",
    starter: { price: 149, features: ["1 platform playbook", "Campaign structure guide", "Audience targeting map", "Ad creative brief", "Budget allocation guide"] },
    growth: { price: 299, features: ["2 platform playbooks", "Full campaign architecture", "Audience + retargeting map", "Creative brief + examples", "Testing framework", "KPI benchmarks"] },
    pro: { price: 499, features: ["All platforms", "Full campaign playbooks", "Funnel architecture", "Creative system", "Testing + iteration guide", "Measurement framework", "Competitor analysis"] },
  },
  {
    name: "SEM / Google Ads",
    slug: "sem-google-ads",
    emoji: "📊",
    description: "Account structure, keyword targeting, and conversion tracking. Ready to spend.",
    access: "Client creates MCC link. May trigger Google ID verification (24–48hr).",
    starter: { price: 399, features: ["1 campaign type", "Keyword research", "Ad copy (2 variants)", "Conversion tracking", "Basic bid strategy"] },
    growth: { price: 799, features: ["2 campaign types", "Full keyword map", "Ad copy (4 variants)", "Conversion tracking + goals", "Audience setup", "Negative keyword list"] },
    pro: { price: 1399, features: ["All campaign types", "Full account structure", "Ad copy library", "Advanced conversion tracking", "Audience layering", "Automated bidding setup", "Monthly reporting template"] },
  },
  {
    name: "Analytics & Tracking",
    slug: "analytics-tracking",
    emoji: "📈",
    description: "GA4, GTM, pixels, and conversion events. See what's actually working.",
    access: "Client adds GA4 user via email invite.",
    starter: { price: 199, features: ["GA4 setup", "Basic conversion events", "1 platform pixel", "GTM container setup", "Realtime verification"] },
    growth: { price: 399, features: ["GA4 + GTM full setup", "3 platform pixels", "Full conversion event map", "Custom dimensions", "Dashboard setup"] },
    pro: { price: 699, features: ["Full analytics stack", "All platform pixels", "Advanced event tracking", "Custom reporting", "Data layer setup", "Attribution model config", "Up to 5 team members"] },
  },
  {
    name: "Automation",
    slug: "automation",
    emoji: "⚡",
    description: "Custom AI-powered workflows to automate whatever process is slowing you down.",
    access: "We connect to your existing tools — CRM, email, Slack, spreadsheets, and more.",
    starter: { price: 599, features: ["1 automation workflow", "Up to 3 connected tools", "Single trigger type", "Basic conditional logic", "Handoff + documentation"] },
    growth: { price: 999, features: ["2–3 automation workflows", "Up to 6 connected tools", "Multiple trigger types", "Advanced branching logic", "Error handling", "Test + deploy"] },
    pro: { price: 1799, features: ["Full workflow system", "Unlimited tool connections", "Multi-step orchestration", "AI decision nodes", "Monitoring setup", "Up to 5 team members", "Full documentation"] },
  },
];

const ADD_ONS = [
  {
    name: "Automation Upgrade",
    price: "+$499",
    per: "per channel",
    description: "Advanced automation sequences, conditional logic, and multi-step workflows layered on top of any package.",
  },
  {
    name: "Rush Delivery",
    price: "+$299",
    per: "one-time",
    description: "Need it faster? Rush gets you a 3-business-day turnaround instead of the standard 5–7.",
  },
  {
    name: "Paid Social Playbook Bundle",
    price: "+$99",
    per: "add to any package",
    description: "Add the complete Paid Social Playbook to any other setup package. Years of paid social experience, packaged for you to execute.",
  },
  {
    name: "Troubleshooting / Break Fix",
    price: "$79",
    per: "per incident",
    description: "Something broke after handoff? Flat-fee fix. No drama, no retainer, no guessing.",
  },
];

const TIERS = [
  { name: "Starter", color: "border-[#E5E7EB]", badge: "bg-[#F3F4F6] text-[#6B7280]", users: "1 user", scope: "Single use case, template-based, minimal integrations" },
  { name: "Growth", color: "border-[#2563EB]", badge: "bg-blue-50 text-[#2563EB]", users: "2–3 users", scope: "Multiple use cases, basic automations, light integrations" },
  { name: "Pro", color: "border-[#1F2937]", badge: "bg-[#1F2937] text-white", users: "Up to 5 users", scope: "Full feature setup, advanced config, integrations" },
];

export const metadata = {
  title: "Packages — Loud Llamas",
  description: "8 marketing channels. 3 tiers each. One-time price. Full setup in 5–7 days.",
};

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-white text-[#1F2937]" style={{ fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}>
      <Nav />

      {/* HEADER */}
      <section className="bg-[#1F2937] text-white py-16">
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
                {/* Starter */}
                <div className="border-2 border-[#E5E7EB] rounded-2xl p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest bg-[#F3F4F6] text-[#6B7280] px-2 py-1 rounded">Starter</span>
                    <span className="text-2xl font-extrabold">${ch.starter.price}</span>
                  </div>
                  <ul className="flex flex-col gap-2 mb-6 flex-1">
                    {ch.starter.features.map((f) => (
                      <li key={f} className="text-sm text-[#6B7280] flex items-start gap-2">
                        <span className="text-[#2563EB] mt-0.5">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/configure/${ch.slug}?tier=starter`}
                    className="block text-center border-2 border-[#2563EB] text-[#2563EB] font-bold py-2.5 rounded-xl hover:bg-[#2563EB] hover:text-white transition-colors"
                  >
                    Get started
                  </Link>
                </div>
                {/* Growth */}
                <div className="border-2 border-[#2563EB] rounded-2xl p-6 flex flex-col relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#2563EB] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">Most popular</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest bg-blue-50 text-[#2563EB] px-2 py-1 rounded">Growth</span>
                    <span className="text-2xl font-extrabold">${ch.growth.price}</span>
                  </div>
                  <ul className="flex flex-col gap-2 mb-6 flex-1">
                    {ch.growth.features.map((f) => (
                      <li key={f} className="text-sm text-[#6B7280] flex items-start gap-2">
                        <span className="text-[#2563EB] mt-0.5">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/configure/${ch.slug}?tier=growth`}
                    className="block text-center bg-[#2563EB] text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Get started
                  </Link>
                </div>
                {/* Pro */}
                <div className="border-2 border-[#1F2937] rounded-2xl p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest bg-[#1F2937] text-white px-2 py-1 rounded">Pro</span>
                    <span className="text-2xl font-extrabold">${ch.pro.price}</span>
                  </div>
                  <ul className="flex flex-col gap-2 mb-6 flex-1">
                    {ch.pro.features.map((f) => (
                      <li key={f} className="text-sm text-[#6B7280] flex items-start gap-2">
                        <span className="text-[#2563EB] mt-0.5">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/configure/${ch.slug}?tier=pro`}
                    className="block text-center border-2 border-[#1F2937] text-[#1F2937] font-bold py-2.5 rounded-xl hover:bg-[#1F2937] hover:text-white transition-colors"
                  >
                    Get started
                  </Link>
                </div>
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
              <div key={addon.name} className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
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
            href="/packages#website-build"
            className="inline-block bg-white text-[#2563EB] font-bold text-lg px-10 py-4 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Pick a channel above
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
