"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  key: string;
  label: string;
  type: "choice" | "multi" | "text" | "textarea" | "yesno";
  options?: string[];
  critical: boolean;
  subtitle?: string;
};

const CHANNEL_QUESTIONS: Record<string, Question[]> = {
  "website-build": [
    { key: "existing_site",   label: "Do you have an existing site to replace?",            type: "yesno",  critical: true  },
    { key: "goal",            label: "What is the primary goal of the site?",                type: "choice", options: ["Generate leads","Drive sales","Portfolio / showcase","Information only"], critical: true  },
    { key: "pages",           label: "How many pages do you need?",                          type: "choice", options: ["1–3 pages","4–6 pages","7–10 pages","10+ pages"],                        critical: true  },
    { key: "copy_ready",      label: "Do you have copy written?",                            type: "choice", options: ["Yes","No","Let The Llamas Decide"],                                       critical: true  },
    { key: "brand_assets",    label: "Do you have brand assets (logo, colors)?",             type: "choice", options: ["Yes","No","Let The Llamas Decide"],                                       critical: true  },
    { key: "target_customer", label: "Who is your target customer?",                         type: "text",   critical: true  },
    { key: "has_domain",      label: "Do you have a domain?",                                type: "yesno",  critical: false },
    { key: "platform_pref",   label: "What platform do you prefer?",                         type: "choice", options: ["Next.js","Webflow","WordPress","No preference"],                         critical: false },
  ],
  "email-lifecycle": [
    { key: "platform",        label: "What email platform are you using?",                   type: "choice", options: ["Klaviyo","Mailchimp","ActiveCampaign","None","Other"],                    critical: true  },
    { key: "goal",            label: "What is the primary goal?",                            type: "choice", options: ["Welcome new subscribers","Recover abandoned carts","Nurture leads","Keep customers coming back"], critical: true },
    { key: "list_size",       label: "How many contacts do you have?",                       type: "choice", options: ["0–1,000","1,000–10,000","10,000+"],                                       critical: true  },
    { key: "business_type",   label: "Do you sell products or services?",                    type: "choice", options: ["Products","Services","Both"],                                             critical: true  },
    { key: "brand_assets",    label: "Do you have brand assets?",                            type: "choice", options: ["Yes","No","Let The Llamas Decide"],                                       critical: true  },
    { key: "target_customer", label: "Who is your target customer?",                         type: "text",   critical: true  },
    { key: "open_rate",       label: "What's your current open rate, if known?",             type: "text",   critical: false },
  ],
  "organic-social": [
    { key: "platforms",       label: "Which platforms?",                                     type: "multi",  options: ["Instagram","LinkedIn","TikTok","Facebook","X (Twitter)","Pinterest"],     critical: true  },
    { key: "goal",            label: "What is the goal?",                                    type: "choice", options: ["Build brand awareness","Generate leads","Grow a community","Drive website traffic"], critical: true },
    { key: "frequency",       label: "How often do you want to post?",                       type: "choice", options: ["Daily","3–5 times per week","1–2 times per week"],                        critical: true  },
    { key: "brand_assets",    label: "Do you have brand assets?",                            type: "choice", options: ["Yes","No","Let The Llamas Decide"],                                       critical: true  },
    { key: "target_customer", label: "Who is your target customer?",                         type: "text",   critical: true  },
    { key: "existing_accounts", label: "Do you have existing accounts?",                     type: "yesno",  critical: false },
    { key: "content_type",    label: "What type of content works best for you?",             type: "choice", options: ["Educational","Behind the scenes","Promotional","Entertainment"],          critical: false },
  ],
  "seo-aeo": [
    { key: "existing_site",   label: "Do you have an existing site?",                        type: "yesno",  critical: true  },
    { key: "keyword_goal",    label: "What is your primary keyword goal?",                   type: "text",   critical: true  },
    { key: "has_gsc",         label: "Do you have Google Search Console set up?",            type: "yesno",  critical: true  },
    { key: "has_ga4",         label: "Do you have Google Analytics (GA4) set up?",           type: "yesno",  critical: true  },
    { key: "content_type",    label: "What's your primary content type?",                    type: "choice", options: ["Blog posts","Product pages","Service pages","Local / location pages"],    critical: true  },
    { key: "target_customer", label: "Who is your target customer?",                         type: "text",   critical: true  },
    { key: "prior_seo",       label: "Have you done any SEO before?",                        type: "choice", options: ["Yes","No","Not sure"],                                                    critical: false },
  ],
  "paid-social": [
    { key: "platforms",       label: "Which platforms?",                                     type: "multi",  options: ["Meta (Facebook / Instagram)","TikTok","LinkedIn","Pinterest"],           critical: true  },
    { key: "budget",          label: "Monthly ad budget",                                    type: "choice", options: ["Under $500","$500–$2,000","$2,000+"],                                     critical: true  },
    { key: "objective",       label: "Campaign objective",                                   type: "choice", options: ["Build awareness","Generate leads","Drive purchases","Increase traffic"],  critical: true  },
    { key: "has_landing_page",label: "Do you have a landing page?",                          type: "yesno",  critical: true  },
    { key: "industry",        label: "Industry / business type",                             type: "text",   critical: true  },
    { key: "target_audience", label: "Describe your target audience",                        type: "text",   critical: false },
    { key: "has_creative",    label: "Do you have creative assets (images / video)?",        type: "choice", options: ["Yes","No","Let The Llamas Decide"],                                       critical: false },
    { key: "competitors",     label: "Any competitor brands to reference?",                  type: "text",   critical: false },
  ],
  "sem-google-ads": [
    { key: "existing_account",label: "Do you have an existing Google Ads account?",          type: "yesno",  critical: true  },
    { key: "budget",          label: "Monthly ad budget",                                    type: "choice", options: ["Under $500","$500–$2,000","$2,000+"],                                     critical: true  },
    { key: "campaign_type",   label: "Campaign type",                                        type: "choice", options: ["Search","Shopping","Display","All of the above"],                         critical: true  },
    { key: "conversion_tracking", label: "Do you have conversion tracking set up?",          type: "choice", options: ["Yes","No","Not sure"],                                                    critical: true  },
    { key: "has_landing_page",label: "Do you have a landing page?",                          type: "yesno",  critical: true  },
    { key: "keywords",        label: "Top 3 keywords or products to target",                 type: "text",   critical: true  },
    { key: "target_customer", label: "Who is your target customer?",                         type: "text",   critical: true  },
  ],
  "analytics-tracking": [
    { key: "platforms",       label: "What platforms need tracking?",                        type: "multi",  options: ["GA4","Meta Pixel","Google Ads","TikTok Pixel","LinkedIn Insight"],        critical: true  },
    { key: "has_gtm",         label: "Do you have Google Tag Manager set up?",               type: "yesno",  critical: true  },
    { key: "conversion_events", label: "What are the key conversion events to track?",       type: "text",   critical: true  },
    { key: "existing_site",   label: "Do you have an existing site?",                        type: "yesno",  critical: true  },
    { key: "platform",        label: "What CMS / platform?",                                 type: "choice", options: ["WordPress","Webflow","Shopify","Next.js","Other"],                        critical: true  },
    { key: "running_ads",     label: "Are you running paid ads currently?",                  type: "yesno",  critical: false },
  ],
  "automation": [
    { key: "platforms",       label: "What platforms do you want to automate?",              type: "multi",  options: ["CRM (HubSpot, Salesforce, etc.)","Email (Klaviyo, Mailchimp)","Zapier / Make","Slack / Teams","Shopify","Custom API"], critical: true },
    { key: "trigger",         label: "What triggers the automation?",                        type: "choice", options: ["Form submission","Purchase","Lead stage change","Time-based","Manual trigger","Other"], critical: true },
    { key: "goal",            label: "What is the goal of this automation?",                 type: "choice", options: ["Save time on repetitive tasks","Notify the right people","Move data between systems","Follow up with leads","Other"], critical: true },
    { key: "existing_tools",  label: "What tools are you currently using?",                  type: "text",   critical: true  },
    { key: "tell_us_more",    label: "Tell us more",                                         type: "textarea", subtitle: "Sometimes automations can be hard to explain in a few clicks. Use this space to describe what you're trying to accomplish in plain language — what triggers it, what should happen, and what the end result looks like.", critical: false },
  ],
};

type AnswerState = Record<string, { answer?: string; llamas_decide?: boolean; is_critical: boolean }>;

export default function IntakeForm({
  orderId,
  channel,
  nextOrders,
}: {
  orderId: string;
  channel: string;
  nextOrders?: string;
}) {
  const router = useRouter();
  const questions = CHANNEL_QUESTIONS[channel] ?? [];
  const [answers, setAnswers] = useState<AnswerState>(() =>
    Object.fromEntries(questions.map((q) => [q.key, { is_critical: q.critical }]))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const criticalQuestions = questions.filter((q) => q.critical);
  const answeredCritical = criticalQuestions.filter((q) => {
    const a = answers[q.key];
    return a?.llamas_decide || (a?.answer && a.answer.trim().length > 0);
  });
  const allCriticalAnswered = answeredCritical.length === criticalQuestions.length;

  function setAnswer(key: string, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: { ...prev[key], answer: value, llamas_decide: false } }));
  }

  function toggleMulti(key: string, option: string) {
    const current = answers[key]?.answer ? answers[key].answer!.split(", ") : [];
    const updated = current.includes(option) ? current.filter((o) => o !== option) : [...current, option];
    setAnswer(key, updated.join(", "));
  }

  function setLlamasDecide(key: string) {
    setAnswers((prev) => ({ ...prev, [key]: { ...prev[key], answer: undefined, llamas_decide: true } }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/intake/${orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) throw new Error("Submission failed");
      // If more packages purchased together, chain to the next intake
      if (nextOrders) {
        const [nextId, ...rest] = decodeURIComponent(nextOrders).split(",");
        const remaining = rest.join(",");
        router.push(`/intake/${nextId}${remaining ? `?nextOrders=${encodeURIComponent(remaining)}` : ""}`);
      } else {
        router.push(`/confirmation/${orderId}`);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      {questions.map((q, i) => {
        const a = answers[q.key];
        const answered = a?.llamas_decide || (a?.answer && a.answer.trim().length > 0);

        return (
          <div key={q.key} className="border-t border-[#EBEBEB] pt-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[#9CA3AF]">{String(i + 1).padStart(2, "0")}</span>
                  {q.critical && <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full">Required</span>}
                </div>
                <p className="font-semibold text-[#000000]">{q.label}</p>
                {q.subtitle && <p className="text-sm text-[#6B7280] mt-1 max-w-lg leading-relaxed">{q.subtitle}</p>}
              </div>
              {answered && <span className="text-green-500 text-lg shrink-0">✓</span>}
            </div>

            {q.type === "choice" && (
              <div className="flex flex-wrap gap-2">
                {q.options!.map((opt) => {
                  const isLlamas = opt === "Let The Llamas Decide";
                  const selected = isLlamas ? a?.llamas_decide : a?.answer === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => isLlamas ? setLlamasDecide(q.key) : setAnswer(q.key, opt)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                        selected
                          ? isLlamas
                            ? "bg-[#2563EB] text-white border-[#2563EB]"
                            : "bg-[#000000] text-white border-[#000000]"
                          : "bg-white text-[#000000] border-[#DEDEDE] hover:border-[#000000]"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === "yesno" && (
              <div className="flex gap-2">
                {["Yes", "No"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAnswer(q.key, opt)}
                    className={`px-6 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                      a?.answer === opt
                        ? "bg-[#000000] text-white border-[#000000]"
                        : "bg-white text-[#000000] border-[#DEDEDE] hover:border-[#000000]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
                {q.critical && (
                  <button
                    onClick={() => setLlamasDecide(q.key)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                      a?.llamas_decide
                        ? "bg-[#2563EB] text-white border-[#2563EB]"
                        : "bg-white text-[#6B7280] border-[#DEDEDE] hover:border-[#2563EB] hover:text-[#2563EB]"
                    }`}
                  >
                    Let The Llamas Decide
                  </button>
                )}
              </div>
            )}

            {q.type === "multi" && (
              <div className="flex flex-wrap gap-2">
                {q.options!.map((opt) => {
                  const selected = a?.answer?.split(", ").includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleMulti(q.key, opt)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                        selected
                          ? "bg-[#000000] text-white border-[#000000]"
                          : "bg-white text-[#000000] border-[#DEDEDE] hover:border-[#000000]"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === "text" && (
              <input
                type="text"
                value={a?.answer ?? ""}
                onChange={(e) => setAnswer(q.key, e.target.value)}
                className="w-full max-w-xl border border-[#DEDEDE] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] transition-colors"
                placeholder="Your answer…"
              />
            )}

            {q.type === "textarea" && (
              <textarea
                value={a?.answer ?? ""}
                onChange={(e) => setAnswer(q.key, e.target.value)}
                rows={6}
                className="w-full max-w-xl border border-[#DEDEDE] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563EB] transition-colors resize-none"
                placeholder="Describe what you're trying to build or automate…"
              />
            )}
          </div>
        );
      })}

      <div className="border-t border-[#EBEBEB] pt-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#6B7280]">
            <span className="font-bold text-[#000000]">{answeredCritical.length}/{criticalQuestions.length}</span> required questions answered
          </p>
        </div>

        {error && <p className="text-sm text-red-600 font-medium mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={!allCriticalAnswered || loading}
          className="bg-[#000000] text-white font-bold px-10 py-4 rounded-full hover:bg-[#2563EB] transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting…" : "Submit intake →"}
        </button>
        <p className="text-xs text-[#9CA3AF] mt-3">
          Stuck on something? Mark it &ldquo;Let The Llamas Decide&rdquo; &mdash; we&apos;ll figure it out.
        </p>
      </div>
    </div>
  );
}
