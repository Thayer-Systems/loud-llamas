import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Resources — Loud Llamas",
  description: "Free marketing checklists, templates, and guides for small business owners.",
};

const GUIDES = [
  {
    title: "The Marketing Setup Checklist",
    description: "Everything a small business needs to have in place before spending a dollar on ads. GA4, GSC, email list, pixel, social profiles — all covered.",
    category: "Checklist",
    icon: "✅",
    cta: "View checklist",
    href: "/blog/seo-basics-small-business",
  },
  {
    title: "Email Platform Comparison Guide",
    description: "Klaviyo vs Mailchimp vs ActiveCampaign. Which one is right for your business size, budget, and use case. No affiliate bias.",
    category: "Guide",
    icon: "📧",
    cta: "Read the guide",
    href: "/blog/email-marketing-welcome-series",
  },
  {
    title: "Google Analytics 4 Setup Guide",
    description: "Step-by-step GA4 setup. From creating the property to verifying conversions are tracking correctly. No jargon.",
    category: "Guide",
    icon: "📊",
    cta: "Read the guide",
    href: "/blog/how-to-set-up-google-analytics-4",
  },
  {
    title: "5-Email Welcome Series Template",
    description: "The exact welcome sequence structure we use for e-commerce and service businesses. Copy the framework, fill in your details.",
    category: "Template",
    icon: "📝",
    cta: "Read the guide",
    href: "/blog/email-marketing-welcome-series",
  },
  {
    title: "SEO Quick Wins for Small Business",
    description: "The five highest-leverage SEO moves for a business under $5M revenue. Ranked by impact-to-effort ratio.",
    category: "Guide",
    icon: "🔍",
    cta: "Read the guide",
    href: "/blog/seo-basics-small-business",
  },
  {
    title: "Website Conversion Audit",
    description: "A 10-point checklist to diagnose why your website isn't generating leads. Fix the right things first.",
    category: "Checklist",
    icon: "🌐",
    cta: "Read the guide",
    href: "/blog/why-your-website-isnt-getting-leads",
  },
];

const CHANNEL_GUIDES = [
  { name: "Website Build", slug: "website-build", emoji: "🌐", desc: "What's included, how it works, what you need to provide." },
  { name: "Email / Lifecycle", slug: "email-lifecycle", emoji: "📧", desc: "Platform options, sequence types, what we need from you." },
  { name: "Organic Social", slug: "organic-social", emoji: "📱", desc: "Platform strategy, content templates, posting systems." },
  { name: "SEO / AEO Foundation", slug: "seo-aeo", emoji: "🔍", desc: "Keyword research, technical setup, content structure." },
  { name: "Paid Social Playbook", slug: "paid-social", emoji: "📣", desc: "Why a playbook, what's included, how to execute it." },
  { name: "SEM / Google Ads", slug: "sem-google-ads", emoji: "📊", desc: "Account structure, campaign types, tracking setup." },
  { name: "Analytics & Tracking", slug: "analytics-tracking", emoji: "📈", desc: "What gets tracked, how it connects, what you'll see." },
];

const FAQS = [
  {
    q: "What do I need to provide before we start?",
    a: "It depends on the channel. Generally: access credentials or an invite, your brand assets (logo, colors, fonts), and answers to the intake questionnaire. We'll walk you through exactly what's needed after purchase.",
  },
  {
    q: "Do you work with any industry or niche?",
    a: "Yes. We've set up marketing systems for e-commerce, professional services, local businesses, SaaS, and more. The setup process is the same — the intake questions help us tailor it to your context.",
  },
  {
    q: "What if I don't have brand assets yet?",
    a: "Check the \"Let The Llamas Decide\" box on the intake form. We'll make reasonable decisions and document them so you can refine later. For Website Build, we can work with a simple brief.",
  },
  {
    q: "Can I see examples of past work?",
    a: "We're keeping client work confidential, but the deliverables for each package are documented in detail on the packages page. You know exactly what you're getting before you pay.",
  },
  {
    q: "What happens after the handoff?",
    a: "You own everything. All logins, all assets, all configurations. We provide documentation on how to use what we built. For ongoing support, use the break-fix option ($79/incident).",
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white text-[#1F2937]" style={{ fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}>
      <Nav />

      {/* HEADER */}
      <section className="bg-[#1F2937] text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Resources</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Free guides, checklists, and templates to help you set up your marketing right —
            whether you use us or do it yourself.
          </p>
        </div>
      </section>

      {/* FREE RESOURCES GRID */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-extrabold mb-2">Free guides &amp; checklists</h2>
          <p className="text-[#6B7280] mb-10">No email required. No gated PDFs. Just useful stuff.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {GUIDES.map((guide) => (
              <Link
                key={guide.title}
                href={guide.href}
                className="group bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:border-[#2563EB] hover:shadow-md transition-all flex flex-col"
              >
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-3xl flex-shrink-0">{guide.icon}</span>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest bg-[#F3F4F6] text-[#6B7280] px-2 py-1 rounded-full">
                      {guide.category}
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-[#2563EB] transition-colors leading-snug">
                  {guide.title}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed flex-1 mb-4">{guide.description}</p>
                <span className="text-sm font-semibold text-[#2563EB]">{guide.cta} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CHANNEL GUIDES */}
      <section className="bg-[#F3F4F6] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-extrabold mb-2">Channel guides</h2>
          <p className="text-[#6B7280] mb-10">
            What&apos;s included in each channel, how the setup works, and what you need to provide.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {CHANNEL_GUIDES.map((ch) => (
              <Link
                key={ch.slug}
                href={`/packages#${ch.slug}`}
                className="group bg-white rounded-2xl p-5 border border-[#E5E7EB] hover:border-[#2563EB] hover:shadow-md transition-all"
              >
                <span className="text-2xl mb-3 block">{ch.emoji}</span>
                <h3 className="font-bold mb-1 group-hover:text-[#2563EB] transition-colors">{ch.name}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{ch.desc}</p>
                <p className="text-sm font-semibold text-[#2563EB] mt-3">See package details →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-extrabold mb-10">Common questions</h2>
          <div className="flex flex-col gap-5">
            {FAQS.map((faq) => (
              <div key={faq.q} className="bg-[#F3F4F6] rounded-2xl p-6">
                <p className="font-bold text-[#1F2937] mb-2">{faq.q}</p>
                <p className="text-[#6B7280] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#2563EB] py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ready to stop reading and start building?
          </h2>
          <p className="text-blue-100 mb-8">
            Pick a channel. Pay once. We&apos;ll handle the setup.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/packages"
              className="inline-block bg-white text-[#2563EB] font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors"
            >
              See all packages
            </Link>
            <Link
              href="/support"
              className="inline-block border-2 border-white text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-600 transition-colors"
            >
              Talk to us first
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
