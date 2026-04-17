"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type QuestionType = "grid" | "multiselect" | "text";

type Question = {
  key: string;
  question: string;
  subtitle?: string;
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
    description: "A fast, good-looking website that turns visitors into customers. Built from scratch or rebuilt the right way.",
    tiers: [{ name: "Starter", price: 499 }, { name: "Growth", price: 899 }, { name: "Pro", price: 1499 }],
    questions: [
      { key: "existing_site", question: "Do you have an existing website we're replacing?", type: "grid", options: ["Yes", "No — starting fresh"], critical: true },
      { key: "goal", question: "What do you want the site to do for your business?", type: "grid", options: ["Get people to contact me", "Sell products online", "Show off my work / portfolio", "Share information about my business"], critical: true },
      { key: "pages", question: "Roughly how many pages do you need?", type: "grid", options: ["1–3 pages", "4–6 pages", "7–10 pages", "10+ pages"], critical: true },
      { key: "copy_written", question: "Do you have the words/text for the site already written?", type: "grid", options: ["Yes, I have copy ready", "No, I need help with that"], critical: true },
      { key: "brand_assets", question: "Do you have a logo and brand colors?", type: "grid", options: ["Yes", "No"], critical: true },
      { key: "domain", question: "Do you have a domain name already? (e.g. yourcompany.com)", type: "grid", options: ["Yes", "No — I need one"], critical: false },
      { key: "platform", question: "Do you have a preference for how the site is built?", type: "grid", options: ["Next.js (fastest, technical)", "Webflow (easy to edit visually)", "WordPress (most popular)", "No preference — you decide"], critical: false },
      { key: "target_customer", question: "Describe your ideal customer in a sentence or two.", type: "text", critical: true },
    ],
  },
  "email-lifecycle": {
    name: "Email / Lifecycle",
    description: "Automated emails that go out at the right time. Set up once, runs on its own.",
    tiers: [{ name: "Starter", price: 249 }, { name: "Growth", price: 499 }, { name: "Pro", price: 899 }],
    questions: [
      { key: "platform", question: "What email tool are you using?", type: "grid", options: ["Klaviyo", "Mailchimp", "ActiveCampaign", "I don't have one yet", "Something else"], critical: true },
      { key: "goal", question: "What's the main thing you want these emails to do?", type: "grid", options: ["Welcome new subscribers / customers", "Remind people who didn't finish buying", "Stay in touch with leads until they're ready to buy", "Keep existing customers coming back"], critical: true },
      { key: "contacts", question: "How many people are on your email list?", type: "grid", options: ["Under 1,000", "1,000–10,000", "Over 10,000"], critical: true },
      { key: "business_type", question: "What does your business sell?", type: "grid", options: ["Physical products", "Services", "Both"], critical: true },
      { key: "brand_assets", question: "Do you have a logo and brand colors?", type: "grid", options: ["Yes", "No"], critical: true },
      { key: "open_rate", question: "If you're already sending emails, what's your average open rate? (Leave blank if unsure)", type: "text", critical: false },
      { key: "target_customer", question: "Describe your ideal customer in a sentence or two.", type: "text", critical: true },
    ],
  },
  "organic-social": {
    name: "Organic Social",
    description: "Sharp profiles, ready-to-post content, and a 3-month plan so you always know what to post.",
    tiers: [{ name: "Starter", price: 249 }, { name: "Growth", price: 499 }, { name: "Pro", price: 899 }],
    questions: [
      { key: "platforms", question: "Which platforms do you want to be active on?", type: "multiselect", options: ["Instagram", "LinkedIn", "TikTok", "Facebook", "X (Twitter)", "Pinterest"], critical: true },
      { key: "goal", question: "What's the main goal of your social media?", type: "grid", options: ["Get my brand in front of more people", "Generate leads / inquiries", "Build a community around my brand", "Drive traffic to my website"], critical: true },
      { key: "posting_freq", question: "How often do you want to post?", type: "grid", options: ["Every day", "3–5 times a week", "1–2 times a week"], critical: true },
      { key: "brand_assets", question: "Do you have a logo and brand colors?", type: "grid", options: ["Yes", "No"], critical: true },
      { key: "existing_accounts", question: "Do you already have accounts on these platforms?", type: "grid", options: ["Yes", "No — starting from scratch"], critical: false },
      { key: "content_type", question: "What kind of content do you think your audience would enjoy most?", type: "grid", options: ["Tips and education", "Behind the scenes", "Promotions and offers", "Entertaining / fun content"], critical: false },
      { key: "target_customer", question: "Describe your ideal customer in a sentence or two.", type: "text", critical: true },
    ],
  },
  "seo-aeo": {
    name: "SEO / AEO Foundation",
    description: "Get your site found on Google — and AI tools like ChatGPT. We handle the research, fixes, and setup.",
    tiers: [{ name: "Starter", price: 349 }, { name: "Growth", price: 699 }, { name: "Pro", price: 1199 }],
    questions: [
      { key: "existing_site", question: "Do you have an existing website?", type: "grid", options: ["Yes", "No — building a new one"], critical: true },
      { key: "keyword_goal", question: "What would you want someone to Google to find you? (e.g. 'best plumber in Austin')", type: "text", critical: true },
      { key: "done_seo", question: "Have you done any work to improve your Google ranking before?", type: "grid", options: ["Yes", "No", "Not sure"], critical: false },
      { key: "gsc_setup", question: "Is your site connected to Google Search Console? (This is what tells Google your site exists)", type: "grid", options: ["Yes", "No", "Not sure"], critical: true },
      { key: "ga4_setup", question: "Do you have Google Analytics installed on your site?", type: "grid", options: ["Yes", "No", "Not sure"], critical: true },
      { key: "content_type", question: "What kind of pages does your site mainly have?", type: "grid", options: ["Blog articles", "Product pages", "Service pages", "Local business pages"], critical: true },
      { key: "target_customer", question: "Describe your ideal customer in a sentence or two.", type: "text", critical: true },
    ],
  },
  "paid-social": {
    name: "Paid Social Playbook",
    description: "A complete step-by-step guide to run your own social ads — built from real campaigns.",
    tiers: [{ name: "Starter", price: 149 }, { name: "Growth", price: 299 }, { name: "Pro", price: 499 }],
    questions: [
      { key: "platforms", question: "Which platforms do you want to run ads on?", type: "multiselect", options: ["Facebook / Instagram (Meta)", "TikTok", "LinkedIn", "Pinterest"], critical: true },
      { key: "budget", question: "How much are you planning to spend on ads per month?", type: "grid", options: ["Under $500", "$500–$2,000", "Over $2,000"], critical: true },
      { key: "objective", question: "What do you want your ads to do?", type: "grid", options: ["Get my brand in front of new people", "Collect leads (name, email, etc.)", "Get people to buy something", "Send people to my website"], critical: true },
      { key: "creative_assets", question: "Do you have photos or videos to use in your ads?", type: "grid", options: ["Yes", "No — I'll need to create them"], critical: false },
      { key: "landing_page", question: "Do you have a page for people to land on after clicking your ad?", type: "grid", options: ["Yes", "No"], critical: true },
      { key: "target_audience", question: "Who are you trying to reach with your ads? (e.g. women 25–40 interested in fitness)", type: "text", critical: false },
      { key: "competitors", question: "Any competitor brands you admire or want us to reference? (optional)", type: "text", critical: false },
    ],
  },
  "sem-google-ads": {
    name: "SEM / Google Ads",
    description: "We build your Google Ads account from scratch — the right keywords, the right setup, tracking so you know what's working.",
    tiers: [{ name: "Starter", price: 399 }, { name: "Growth", price: 799 }, { name: "Pro", price: 1399 }],
    questions: [
      { key: "existing_account", question: "Do you already have a Google Ads account?", type: "grid", options: ["Yes", "No — starting fresh"], critical: true },
      { key: "budget", question: "How much are you planning to spend on Google Ads per month?", type: "grid", options: ["Under $500", "$500–$2,000", "Over $2,000"], critical: true },
      { key: "campaign_type", question: "What type of Google Ads do you want to run?", type: "grid", options: ["Search ads (show up when people Google something)", "Shopping ads (show your products with photos & prices)", "Display ads (banner ads on other websites)", "All of the above"], critical: true },
      { key: "conversion_tracking", question: "Do you currently track what happens after someone clicks your ad? (e.g. did they buy, sign up, call you?)", type: "grid", options: ["Yes", "No", "Not sure"], critical: true },
      { key: "landing_page", question: "Do you have a page for people to land on after clicking your ad?", type: "grid", options: ["Yes", "No"], critical: true },
      { key: "keywords", question: "What are the top 3 things people would Google to find your business?", type: "text", critical: true },
      { key: "target_customer", question: "Describe your ideal customer in a sentence or two.", type: "text", critical: true },
    ],
  },
  "analytics-tracking": {
    name: "Analytics & Tracking",
    description: "Install Google Analytics, ad tracking codes, and connect everything — so you can see what's actually driving results.",
    tiers: [{ name: "Starter", price: 199 }, { name: "Growth", price: 399 }, { name: "Pro", price: 699 }],
    questions: [
      { key: "platforms", question: "Which platforms do you want to track? (Select all that apply)", type: "multiselect", options: ["Google Analytics", "Facebook / Instagram tracking", "Google Ads tracking", "TikTok tracking", "LinkedIn tracking"], critical: true },
      { key: "gtm", question: "Do you have Google Tag Manager installed? (A free tool that manages all your tracking in one place)", type: "grid", options: ["Yes", "No", "Not sure"], critical: true },
      { key: "conversion_events", question: "What actions do you want to track on your site? (e.g. purchases, form fills, phone calls, button clicks)", type: "text", critical: true },
      { key: "existing_site", question: "Do you have an existing website?", type: "grid", options: ["Yes", "No — building one"], critical: true },
      { key: "cms", question: "What platform is your website built on?", type: "grid", options: ["WordPress", "Webflow", "Shopify", "Next.js", "Something else"], critical: true },
      { key: "running_ads", question: "Are you currently running any paid ads (Google, Facebook, etc.)?", type: "grid", options: ["Yes", "No"], critical: false },
    ],
  },
  "automation": {
    name: "Automation",
    description: "Tell us what you do manually every day — we build a system that does it for you automatically.",
    tiers: [{ name: "Starter", price: 599 }, { name: "Growth", price: 999 }, { name: "Pro", price: 1799 }],
    questions: [
      { key: "process", question: "What's the task or process you want to stop doing manually? Describe it in plain terms.", type: "text", critical: true },
      { key: "tools", question: "What tools or apps are involved in this process?", type: "multiselect", options: ["CRM (e.g. HubSpot, Salesforce)", "Email (e.g. Gmail, Mailchimp)", "Slack", "Google Sheets / Excel", "Zapier or Make", "Airtable", "Notion", "Custom system / API", "Other"], critical: true },
      { key: "trigger", question: "What should kick off the automation?", type: "grid", options: ["Someone fills out a form", "At a set time / schedule", "A new entry appears in a spreadsheet or database", "An incoming message or webhook", "I trigger it manually"], critical: true },
      { key: "outcome", question: "What should happen at the end? What's the result you want?", type: "text", critical: true },
      { key: "existing_automations", question: "Do you have any existing automations you want us to replace or add to?", type: "grid", options: ["Yes", "No — starting from scratch"], critical: true },
      { key: "tech_level", question: "How comfortable is your team with tech?", type: "grid", options: ["Not very — keep it simple", "Somewhat comfortable", "Very technical — go deep"], critical: false },
      { key: "tell_us_more", question: "Tell us more", subtitle: "Automations can be hard to explain in a few words. Give us as much detail as you can — walk us through it like you're telling a coworker. The more we know, the better we build it. Let's make your systems run without you having to babysit.", type: "text", critical: false },
    ],
  },
};

const LLAMAS_DECIDE = "Let The Llamas Decide";

type Answers = Record<string, string | string[]>;

export default function ConfigureForm({ channel }: { channel: string }) {
  const config = CHANNEL_CONFIGS[channel];
  const router = useRouter();
  const [tier, setTier] = useState<string>("");
  const [answers, setAnswers] = useState<Answers>({});

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

  function handleGoToCheckout() {
    router.push(`/checkout?channel=${channel}&tier=${tier.toLowerCase()}`);
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
            <p className="font-bold text-[#0D0D0D] mb-1">
              {q.question}
              {q.critical && (
                <span className="ml-2 text-xs font-semibold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full">
                  required
                </span>
              )}
            </p>
            {q.subtitle && (
              <p className="text-sm text-[#6B7280] leading-relaxed mb-3">{q.subtitle}</p>
            )}
            {!q.subtitle && <div className="mb-3" />}

            {q.type === "text" ? (
              <textarea
                className="w-full border-2 border-[#EBEBEB] rounded-xl p-4 text-[#0D0D0D] placeholder-[#BEBEBE] focus:border-[#2563EB] focus:outline-none transition-colors resize-none"
                rows={q.key === "tell_us_more" ? 6 : 3}
                placeholder={q.key === "tell_us_more" ? "Walk us through it — the more detail, the better…" : "Type your answer here…"}
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
          onClick={handleGoToCheckout}
          className={`w-full py-4 rounded-full font-bold text-lg transition-all ${
            allCriticalAnswered
              ? "bg-[#0D0D0D] text-white hover:bg-[#2563EB]"
              : "bg-[#F3F4F6] text-[#BEBEBE] cursor-not-allowed"
          }`}
        >
          Continue to checkout →
        </button>
        <p className="text-xs text-[#6B7280] text-center mt-3">
          Review your order before paying. One-time payment, no surprises.
        </p>
      </div>
    </div>
  );
}
