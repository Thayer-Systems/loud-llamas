export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  body: string;
};

export const posts: BlogPost[] = [
  {
    slug: "how-to-set-up-google-analytics-4",
    title: "How to Set Up Google Analytics 4 for Your Small Business",
    description: "GA4 looks intimidating. It's not. Here's exactly what to do, in order, with zero jargon.",
    date: "April 10, 2026",
    readTime: "6 min read",
    category: "Analytics",
    body: `
Google Analytics 4 replaced Universal Analytics in 2023. If you're still running on the old version — or nothing at all — here's how to get GA4 set up correctly.

## Step 1: Create a Google Analytics Account

Go to analytics.google.com. Sign in with your Google account. Click "Start measuring." Give your account a name (your business name works fine).

## Step 2: Create a Property

A property is your website. Name it, set your time zone and currency. Make sure you select "Web" as the platform.

## Step 3: Add Your Data Stream

This is where you connect your website. Enter your URL. Give the stream a name. Leave enhanced measurement on — it auto-tracks scrolls, outbound clicks, and video engagement.

## Step 4: Install the Tracking Code

You have two options:

**Option A: Google Tag Manager (recommended)**
If you're running GTM, add a new GA4 Configuration tag, paste in your Measurement ID (starts with G-), and publish. Done.

**Option B: Direct code**
Copy the gtag.js snippet from the setup screen and paste it into the \`<head>\` of every page on your site. Most CMS platforms have a "header scripts" field for exactly this.

## Step 5: Verify It's Working

Use the Realtime report in GA4. Open your website in another tab. If you see an active user, the setup worked.

## What to Do Next

Set up conversion events. At minimum: form submissions, phone clicks, and purchase completions. Without conversion tracking, you're flying blind on what's actually working.

---

If this is taking more time than you have, our [Analytics & Tracking setup](/configure/analytics-tracking) handles all of it — GA4, GTM, conversion events — in 5–7 business days.
    `.trim(),
  },
  {
    slug: "email-marketing-welcome-series",
    title: "The 5-Email Welcome Series Every Small Business Needs",
    description: "Most welcome emails are a waste. Here's the sequence that actually builds a relationship and drives a second purchase.",
    date: "April 7, 2026",
    readTime: "7 min read",
    category: "Email",
    body: `
Your welcome series is the most important email you'll ever send. New subscribers are paying attention right now. Don't blow it with a generic "Thanks for signing up."

Here's the 5-email sequence that works.

## Email 1: Deliver the goods (send immediately)

If someone signed up for a lead magnet, send it. If they just created an account, confirm it and show them the one thing to do next. Keep it short. One action. Nothing else.

**Subject line formula:** "Here's what you asked for" or "Your [thing] is inside"

## Email 2: The story (Day 2)

Tell them why you started this business. Not a corporate mission statement. The actual reason. The problem you had. The solution you built. People buy from people they understand.

**Subject line formula:** "Why I started [business name]"

## Email 3: Social proof (Day 4)

One customer story. Real name if you have permission. What they were struggling with before, what changed after. A screenshot of a review works too.

**Subject line formula:** "What [customer name] did with [your product/service]"

## Email 4: The offer (Day 6)

Now you've earned it. Make an offer. First-time discount, a bundle, a service they haven't tried. One offer. One CTA. No distractions.

**Subject line formula:** "Something for you" or "A welcome gift"

## Email 5: The value anchor (Day 10)

Useful content. A tip, a checklist, a how-to. No pitch. This one exists to remind them why they subscribed. It keeps you out of the spam folder and builds goodwill for future sends.

**Subject line formula:** "Quick tip: [specific outcome]"

---

Building this yourself takes time. Our [Email / Lifecycle setup](/configure/email-lifecycle) includes a complete welcome series, fully configured in your ESP, ready to go in 5–7 days.
    `.trim(),
  },
  {
    slug: "seo-basics-small-business",
    title: "SEO for Small Businesses: What Actually Matters in 2026",
    description: "Forget the 200-point checklists. Here are the 5 things that actually move the needle for a small business with a local or niche audience.",
    date: "April 3, 2026",
    readTime: "8 min read",
    category: "SEO",
    body: `
The SEO industry loves complexity. Most of it doesn't matter for small businesses. Here's what does.

## 1. Get your Google Business Profile right

If you serve local customers, this is the highest-leverage thing you can do. Fill out every field. Add photos. Collect reviews. Post updates. Google treats this as a separate signal from your website — and for local searches, it often shows up above your site anyway.

## 2. Write pages that answer specific questions

Google's job is to answer questions. Your job is to answer the questions your customers are actually typing. Use Google Search Console to find out what queries are already sending you traffic, then build pages that answer those questions more completely than anyone else.

## 3. Fix your technical basics

You don't need to go deep on technical SEO. But you do need:
- A fast-loading website (Core Web Vitals)
- An XML sitemap
- Proper title tags and meta descriptions on every page
- No broken links or redirect chains

That's it. The rest is diminishing returns until you've done these four things.

## 4. Get links from real places

One link from a local business journal, a niche newsletter, or a relevant directory is worth more than 50 low-quality directory submissions. Think about where your customers read things. Get mentioned there.

## 5. Be consistent

SEO compounds. The businesses that win aren't necessarily the best — they're the ones who kept publishing, kept fixing issues, kept collecting reviews when everyone else gave up after three months.

---

If you want a real SEO foundation — technical audit, keyword map, content structure, and GSC set up correctly — our [SEO / AEO Foundation setup](/configure/seo-aeo) gets it done in 5–7 days.
    `.trim(),
  },
  {
    slug: "why-your-website-isnt-getting-leads",
    title: "Why Your Website Isn't Getting Leads (And What to Fix First)",
    description: "Traffic without conversions is just noise. Here's how to diagnose the problem and fix the right thing.",
    date: "March 28, 2026",
    readTime: "5 min read",
    category: "Website",
    body: `
You have a website. People visit it. Nobody contacts you. Here's why, and what to do about it.

## Problem 1: Your headline doesn't say what you do

Your homepage has 3 seconds to answer one question: "Am I in the right place?" If your headline is "Empowering businesses to reach their full potential" — you've failed. Be specific. "Custom kitchen cabinets for Seattle homeowners" is infinitely better.

## Problem 2: There's no clear next step

Every page should have one obvious action. Not five. One. What do you want someone to do after reading this page? Call you? Fill out a form? Book a demo? Pick one and make it impossible to miss.

## Problem 3: Your contact form is too long

Every additional field cuts conversion rates. Name, email, and one question about what they need. That's the form. First and last name as separate fields? Company size? How did you hear about us? Kill it. Get the lead first, ask questions later.

## Problem 4: There's no proof

A claim without proof is just noise. Add customer names, photos, case studies, or at minimum a Google review widget. Real humans saying real things. Even three good testimonials will move the needle.

## Problem 5: It's slow

If your site takes more than 3 seconds to load on mobile, most people are gone before they read a word. Test your speed at pagespeed.web.dev. If you're below 70 on mobile, that's your first fix.

---

If your website needs a proper rebuild, not a patch job, our [Website Build setup](/configure/website-build) starts at $499.
    `.trim(),
  },
  {
    slug: "organic-social-content-strategy",
    title: "How to Build a Social Media Content Strategy in One Afternoon",
    description: "You don't need a 30-page content calendar. You need a simple system you'll actually stick to.",
    date: "March 22, 2026",
    readTime: "6 min read",
    category: "Social",
    body: `
Most social media content strategies fail because they're too complicated to maintain. Here's a version you can build in an afternoon and actually keep up with.

## Step 1: Pick two platforms

Not five. Two. Where do your customers actually spend time? If you sell B2B services, LinkedIn and nothing else is a legitimate strategy. If you sell consumer products with strong visual appeal, Instagram and TikTok. Pick two and commit.

## Step 2: Decide your content mix

Use the 70/20/10 rule:
- **70%** useful content (tips, how-tos, insights, behind the scenes)
- **20%** shared content (industry news, other people's work you respect)
- **10%** promotional (your products, services, offers)

Most businesses do this backwards. They post 70% promotional and wonder why nobody engages.

## Step 3: Create a simple content bank

Spend two hours writing down 20 content ideas. Not scripting them — just the topics. Use this framework: "What are the 20 questions my customers ask before buying?" Answer each one of those in a post.

## Step 4: Batch your content

Pick one day a week to create content for the next 7 days. Don't create and post on the same day — you'll run out of steam. Batch creation is the single biggest difference between accounts that last and accounts that disappear.

## Step 5: Set a cadence you can maintain

Posting 5x per week for a month then disappearing is worse than posting 2x per week forever. Consistency beats intensity. Start with what you can actually maintain.

---

If you want a full organic social setup — profile optimization, content templates, scheduling system, and a 90-day content plan — our [Organic Social setup](/configure/organic-social) handles it.
    `.trim(),
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
