"use client";

import { useState } from "react";
import Link from "next/link";

type QuestionType = "grid" | "multiselect" | "text";

type Question = {
  key: string;
  question: string;
  type: QuestionType;
  options?: string[];
  critical: boolean;
};

type ChannelConfig = {
  name: string;
  description: string;
  tiers: { name: string; price: number }[];
  questions: Question[];
};

const CHANNEL_CONFIGS: Record<string, ChannelConfig> = {
  "website-build": {
    name: "Website Build",
    description: "A fast, modern website that converts. Built fresh or rebuilt right.",
    tiers: [{ name: "Starter", price: 499 }, { name: "Growth", price: 899 }, { name: "Pro", price: 1499 }],
    questions: [
      { key: "existing_site", question: "Do you have an existing site to replace?", type: "grid", options: ["Yes", "No"], critical: true },
      { key: "goal", question: "What is the primary goal of the site?", type: "grid", options: ["Leads", "Sales", "Portfolio", "Info"], critical: true },
      { key: "pages", question: "How many pages do you need?", type: "grid", options: ["1–3", "4–6", "7–10", "10+"], critical: true },
      { key: "copy_written", question: "Do you have copy written?", type: "grid", options: ["Yes", "No"], critical: true },
      { key: "brand_assets", question: "Do you have brand assets (logo, colors)?", type: "grid", options: ["Yes", "No"], critical: true },
      { key: "domain", question: "Do you have a domain?", type: "grid", options: ["Yes", "No"], critical: false },
      { key: "platform", question: "What platform do you prefer?", type: "grid", options: ["Next.js", "Webflow", "WordPress", "No preference"], critical: false },
      { key: "target_customer", question: "Who is your target customer?", type: "text", critical: true },
    ],
  },
  "email-lifecycle": {
    name: "Email / Lifecycle",
    description: "Welcome series, cart recovery, nurture flows. Set up once, runs forever.",
    tiers: [{ name: "Starter", price: 249 }, { name: "Growth", price: 499 }, { name: "Pro", price: 899 }],
    questions: [
      { key: "platform", question: "What email platform are you using?", type: "grid", options: ["Klaviyo", "Mailchimp", "ActiveCampaign", "None", "Other"], critical: true },
      { key: "goal", question: "What is the primary goal?", type: "grid", options: ["Welcome series", "Cart recovery", "Nurture", "Retention"], critical: true },
      { key: "contacts", question: "How many contacts do you have?", type: "grid", options: ["0–1k", "1k–10k", "10k+"], critical: true },
      { key: "business_type", question: "Do you sell products or services?", type: "grid", options: ["Products", "Services", "Both"], critical: true },
      { key: "brand_assets", question: "Do you have brand assets?", type: "grid", options: ["Yes", "No"], critical: true },
      { key: "open_rate", question: "What's your current open rate, if known?", type: "text", critical: false },
      { key: "target_customer", question: "Who is your target customer?", type: "text", critical: true },
    ],
  },
  "organic-social": {
    name: "Organic Social",
    description: "Profile optimization, content templates, and a 90-day posting system.",
    tiers: [{ name: "Starter", price: 249 }, { name: "Growth", price: 499 }, { name: "Pro", price: 899 }],
    questions: [
      { key: "platforms", question: "Which platforms?", type: "multiselect", options: ["Instagram", "LinkedIn", "TikTok", "Facebook", "X", "Pinterest"], critical: true },
      { key: "goal", question: "What is the goal?", type: "grid", options: ["Brand awareness", "Leads", "Community", "Traffic"], critical: true },
      { key: "posting_freq", question: "How often do you want to post?", type: "grid", options: ["Daily", "3–5x/week", "1–2x/week"], critical: true },
      { key: "brand_assets", question: "Do you have brand assets?", type: "grid", options: ["Yes", "No"], critical: true },
      { key: "existing_accounts", question: "Do you have existing accounts?", type: "grid", options: ["Yes", "No"], critical: false },
      { key: "content_type", question: "What type of content works best for you?", type: "grid", options: ["Educational", "Behind-the-scenes", "Promotional", "Entertainment"], critical: false },
      { key: "target_customer", question: "Who is your target customer?", type: "text", critical: true },
    ],
  },
  "seo-aeo": {
    name: "SEO / AEO Foundation",
    description: "Keyword strategy, technical audit, and GSC setup. Built to rank.",
    tiers: [{ name: "Starter", price: 349 }, { name: "Growth", price: 699 }, { name: "Pro", price: 1199 }],
    questions: [
      { key: "existing_site", question: "Do you have an existing site?", type: "grid", options: ["Yes", "No"], critical: true },
      { key: "keyword_goal", question: "What is your primary keyword goal?", type: "text", critical: true },
      { key: "done_seo", question: "Have you done any SEO before?", type: "grid", options: ["Yes", "No", "Not sure"], critical: false },
      { key: "gsc_setup", question: "Do you have Google Search Console set up?", type: "grid", options: ["Yes", "No"], critical: true },
      { key: "ga4_setup", question: "Do you have Google Analytics set up?", type: "grid", options: ["Yes", "No"], critical: true },
      { key: "content_type", question: "What's your primary content type?", type: "grid", options: ["Blog", "Product pages", "Service pages", "Local"], critical: true },
      { key: "target_customer", question: "Who is your target customer?", type: "text", critical: true },
    ],
  },
  "paid-social": {
    name: "Paid Social Playbook",
    description: "No ad account access needed. A complete playbook built from real campaigns.",
    tiers: [{ name: "Starter", price: 149 }, { name: "Growth", price: 299 }, { name: "Pro", price: 499 }],
    questions: [
      { key: "platforms", question: "Which platforms?", type: "multiselect", options: ["Meta", "TikTok", "LinkedIn", "Pinterest"], critical: true },
      { key: "budget", question: "Monthly ad budget", type: "grid", options: ["Under $500", "$500–$2k", "$2k+"], critical: true },
      { key: "objective", question: "Campaign objective", type: "grid", options: ["Awareness", "Leads", "Purchases", "Traffic"], critical: true },
      { key: "creative_assets", question: "Do you have creative assets?", type: "grid", options: ["Yes", "No"], critical: false },
      { key: "landing_page", question: "Do you have a landing page?", type: "grid", options: ["Yes", "No"], critical: true },
      { key: "target_audience", question: "Describe your target audience", type: "text", critical: false },
      { key: "competitors", question: "Competitor brands to reference (optional)", type: "text", critical: false },
    ],
  },
  "sem-google-ads": {
    name: "SEM / Google Ads",
    description: "Account structure, keyword targeting, and conversion tracking. Ready to spend.",
    tiers: [{ name: "Starter", price: 399 }, { name: "Growth", price: 799 }, { name: "Pro", price: 1399 }],
    questions: [
      { key: "existing_account", question: "Do you have an existing Google Ads account?", type: "grid", options: ["Yes", "No"], critical: true },
      { key: "budget", question: "Monthly ad budget", type: "grid", options: ["Under $500", "$500–$2k", "$2k+"], critical: true },
      { key: "campaign_type", question: "Campaign type", type: "grid", options: ["Search", "Shopping", "Display", "All"], critical: true },
      { key: "conversion_tracking", question: "Do you have conversion tracking set up?", type: "grid", options: ["Yes", "No", "Not sure"], critical: true },
      { key: "landing_page", question: "Do you have a landing page?", type: "grid", options: ["Yes", "No"], critical: true },
      { key: "keywords", question: "Top 3 keywords or products to target", type: "text", critical: true },
      { key: "target_customer", question: "Who is your target customer?", type: "text", critical: true },
    ],
  },
  "analytics-tracking": {
    name: "Analytics & Tracking",
    description: "GA4, GTM, pixels, and conversion events. See what's actually working.",
    tiers: [{ name: "Starter", price: 199 }, { name: "Growth", price: 399 }, { name: "Pro", price: 699 }],
    questions: [
      { key: "platforms", question: "What platforms need tracking?", type: "multiselect", options: ["GA4", "Meta Pixel", "Google Ads", "TikTok", "LinkedIn"], critical: true },
      { key: "gtm", question: "Do you have GTM set up?", type: "grid", options: ["Yes", "No"], critical: true },
      { key: "conversion_events", question: "What are your key conversion events?", type: "text", critical: true },
      { key: "existing_site", question: "Do you have an existing site?", type: "grid", options: ["Yes", "No"], critical: true },
      { key: "cms", question: "What CMS / platform?", type: "grid", options: ["WordPress", "Webflow", "Shopify", "Next.js", "Other"], critical: true },
      { key: "running_ads", question: "Are you running paid ads currently?", type: "grid", options: ["Yes", "No"], critical: false },
    ],
  },
  "automation": {
    name: "Automation",
    description: "Custom AI-powered workflows to automate the processes slowing you down.",
    tiers: [{ name: "Starter", price: 599 }, { name: "Growth", price: 999 }, { name: "Pro", price: 1799 }],
    questions: [
      { key: "process", question: "What process do you want to automate?", type: "text", critical: true },
      { key: "tools", question: "What tools are involved?", type: "multiselect", options: ["CRM", "Email", "Slack", "Google Sheets", "Zapier / Make", "Airtable", "Notion", "Custom API", "Other"], critical: true },
      { key: "trigger", question: "What triggers the automation?", type: "grid", options: ["Form submission", "Schedule / cron", "New record", "Webhook", "Manual"], critical: true },
      { key: "outcome", question: "What's the desired outcome?", type: "text", critical: true },
      { key: "existing_automations", question: "Do you have existing automations to replace or extend?", type: "grid", options: ["Yes", "No"], critical: true },
      { key: "tech_level", question: "How technical is your team?", type: "grid", options: ["Not technical", "Somewhat", "Very technical"], critical: false },
    ],
  },
};

const LLAMAS_DECIDE = "Let The Llamas Decide";

type Answers = Record<string, string | string[]>;

export default function ConfigureForm({ channel }: { channel: string }) {
  const config = CHANNEL_CONFIGS[channel];
  const [tier, setTier] = useState<string>("");
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);

  if (!config) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <p className="text-2xl font-bold text-[#0D0D0D] mb-4">Channel not found.</p>
        <Link href="/packages" className="text-[#2563EB] font-semibold underline">
          Back to packages
        </Link>
      </div>
    );
  }

  const setAnswer = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const toggleMulti = (key: string, value: string) => {
    setAnswers((prev) => {
      const existing = (prev[key] as string[]) || [];
      if (existing.includes(value)) {
        return { ...prev, [key]: existing.filter((v) => v !== value) };
      }
      return { ...prev, [key]: [...existing, value] };
    });
  };

  const criticalQuestions = config.questions.filter((q) => q.critical);
  const answeredCritical = criticalQuestions.filter((q) => {
    const ans = answers[q.key];
    if (!ans) return false;
    if (Array.isArray(ans)) return ans.length > 0;
    return ans.trim().length > 0;
  });
  const allCriticalAnswered = tier && answeredCritical.length === criticalQuestions.length;

  if (submitted) {
    const selectedTier = config.tiers.find((t) => t.name === tier);
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-4">
          You&apos;re in
        </p>
        <h2
          className="font-black text-[#0D0D0D] mb-4"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
        >
          Setup received.
        </h2>
        <p className="text-[#6B7280] text-lg max-w-md mb-8">
          You picked <strong className="text-[#0D0D0D]">{config.name} — {tier}</strong> starting at{" "}
          <strong className="text-[#0D0D0D]">${selectedTier?.price}</strong>. We&apos;ll be in
          touch to confirm and kick off your sprint.
        </p>
        <Link
          href="/packages"
          className="bg-[#0D0D0D] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#2563EB] transition-colors"
        >
          See other packages
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-12 py-16">
      {/* Channel header */}
      <p className="text-sm font-semibold tracking-widest uppercase text-[#2563EB] mb-3">
        Configure
      </p>
      <h1
        className="font-black text-[#0D0D0D] mb-3"
        style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
      >
        {config.name}
      </h1>
      <p className="text-[#6B7280] mb-12 text-lg">{config.description}</p>

      {/* Tier selector */}
      <div className="mb-12">
        <p className="font-bold text-[#0D0D0D] mb-4">Choose your tier</p>
        <div className="grid grid-cols-3 gap-3">
          {config.tiers.map((t) => (
            <button
              key={t.name}
              onClick={() => setTier(t.name)}
              className={`border-2 rounded-2xl p-4 text-left transition-all ${
                tier === t.name
                  ? "border-[#2563EB] bg-blue-50"
                  : "border-[#EBEBEB] hover:border-[#BEBEBE]"
              }`}
            >
              <p className={`font-bold text-sm ${tier === t.name ? "text-[#2563EB]" : "text-[#0D0D0D]"}`}>
                {t.name}
              </p>
              <p className="text-[#6B7280] text-sm mt-1">${t.price}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-10">
        {config.questions.map((q) => (
          <div key={q.key}>
            <p className="font-bold text-[#0D0D0D] mb-3">
              {q.question}
              {q.critical && (
                <span className="ml-2 text-xs font-semibold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full">
                  required
                </span>
              )}
            </p>

            {q.type === "text" ? (
              <textarea
                className="w-full border-2 border-[#EBEBEB] rounded-xl p-4 text-[#0D0D0D] placeholder-[#BEBEBE] focus:border-[#2563EB] focus:outline-none transition-colors resize-none"
                rows={3}
                placeholder="Type your answer here…"
                value={(answers[q.key] as string) || ""}
                onChange={(e) => setAnswer(q.key, e.target.value)}
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {q.options?.map((opt) => {
                  const isMulti = q.type === "multiselect";
                  const selected = isMulti
                    ? ((answers[q.key] as string[]) || []).includes(opt)
                    : answers[q.key] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() =>
                        isMulti ? toggleMulti(q.key, opt) : setAnswer(q.key, opt)
                      }
                      className={`px-5 py-2.5 rounded-full border-2 font-medium text-sm transition-all ${
                        selected
                          ? "border-[#2563EB] bg-[#2563EB] text-white"
                          : "border-[#EBEBEB] text-[#0D0D0D] hover:border-[#2563EB]"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
                {/* Let The Llamas Decide — only on critical fields */}
                {q.critical && (
                  <button
                    onClick={() =>
                      q.type === "multiselect"
                        ? toggleMulti(q.key, LLAMAS_DECIDE)
                        : setAnswer(q.key, LLAMAS_DECIDE)
                    }
                    className={`px-5 py-2.5 rounded-full border-2 font-semibold text-sm transition-all ${
                      (q.type === "multiselect"
                        ? ((answers[q.key] as string[]) || []).includes(LLAMAS_DECIDE)
                        : answers[q.key] === LLAMAS_DECIDE)
                        ? "border-[#0D0D0D] bg-[#0D0D0D] text-white"
                        : "border-[#0D0D0D] text-[#0D0D0D] hover:bg-[#0D0D0D] hover:text-white"
                    }`}
                  >
                    Let The Llamas Decide
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress + submit */}
      <div className="mt-14 pt-8 border-t border-[#EBEBEB]">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#6B7280]">
            {answeredCritical.length} of {criticalQuestions.length} required fields answered
          </p>
          {!tier && (
            <p className="text-sm text-[#EF4444] font-medium">Select a tier above</p>
          )}
        </div>

        <button
          disabled={!allCriticalAnswered}
          onClick={() => setSubmitted(true)}
          className={`w-full py-4 rounded-full font-bold text-lg transition-all ${
            allCriticalAnswered
              ? "bg-[#0D0D0D] text-white hover:bg-[#2563EB]"
              : "bg-[#F3F4F6] text-[#BEBEBE] cursor-not-allowed"
          }`}
        >
          Build my setup →
        </button>
        <p className="text-xs text-[#6B7280] text-center mt-3">
          We&apos;ll confirm the details and kick off your sprint within 1 business day.
        </p>
      </div>
    </div>
  );
}
