# LOUD LLAMAS — Project Spec
> Read this file at the start of every session. It is the source of truth for this project.

---

## What Is This

Loud Llamas is a sprint-based marketing setup storefront. Customers pick a marketing channel, choose a package tier, pay, fill out an intake form, and receive a fully configured marketing setup in 5-7 business days. No retainers. No calls. No subscriptions.

Sister company to Thayer Systems.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework |
| Tailwind CSS | Styling |
| Supabase | Database + Auth |
| Stripe | Payments |
| Resend | Transactional email |
| n8n | Order fulfillment webhook |
| Vercel | Hosting |
| GitHub | Version control |

---

## Brand

| Token | Value |
|---|---|
| Primary Blue | #2563EB |
| Dark | #1F2937 |
| Gray | #6B7280 |
| Light Gray | #F3F4F6 |
| Mid Gray | #E5E7EB |
| White | #FFFFFF |

**Voice:** Confident, playful, zero corporate fluff. Short sentences. Direct. A little cheeky.
**Logo:** Two laughing llamas facing outward with burst lines. Blue and white. Place in top left of nav.

---

## Pricing

### Packages

| Channel | Starter | Growth | Pro |
|---|---|---|---|
| Website Build | $499 | $899 | $1,499 |
| Email / Lifecycle | $249 | $499 | $899 |
| Organic Social | $249 | $499 | $899 |
| SEO / AEO Foundation | $349 | $699 | $1,199 |
| Paid Social Playbook | $149 | $299 | $499 |
| SEM / Google Ads Setup | $399 | $799 | $1,399 |
| Analytics & Tracking | $199 | $399 | $699 |

### Tiers

| Tier | Users | Scope |
|---|---|---|
| Starter | 1 | Single use case, template-based, minimal integrations |
| Growth | 2-3 | Multiple use cases, basic automations, light integrations |
| Pro | Up to 5 | Full feature setup, advanced config, integrations |

### Add-Ons

| Add-On | Price |
|---|---|
| Automation Upgrade | +$499 per channel |
| Rush Delivery | +$299 (3 days instead of 5-7) |
| Paid Social Playbook Bundle | +$99 when added to any setup package |
| Troubleshooting / Break Fix | $79 per incident |

---

## Channel Access Policy

| Channel | Access Model | Notes |
|---|---|---|
| Website Build | Client provides CMS/hosting login or we build fresh | Prefer fresh build on Vercel |
| Email / Lifecycle | Client invites via platform admin role | ESP must support team access |
| Organic Social | Client invites as admin | LinkedIn Pages / TikTok Business supported |
| SEO / AEO Foundation | Read-only GSC access + CMS access | No login sharing required |
| Paid Social Playbook | No access required | Playbook only — see below |
| SEM / Google Ads Setup | Client creates MCC link | May trigger Google ID verification (24-48hr) |
| Analytics & Tracking | Client adds GA4 user | Simple email invite |

---

## Site Architecture

```
/                         → Homepage
/packages                 → Full package menu
/configure/[channel]      → Dynamic configurator per channel
/checkout                 → Stripe checkout + order summary
/intake/[orderId]         → Post-purchase intake form
/confirmation/[orderId]   → Delivery date + checklist
/support                  → Contact form (routes to email)
```

---

## Database Schema (Supabase)

### orders
```sql
create table orders (
  id uuid default gen_random_uuid() primary key,
  channel text not null,
  tier text not null,
  price integer not null,
  add_ons jsonb default '[]',
  stripe_session_id text,
  stripe_payment_status text default 'pending',
  delivery_days integer default 7,
  status text default 'pending',
  customer_email text,
  customer_name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### intake_answers
```sql
create table intake_answers (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade,
  question_key text not null,
  answer text,
  llamas_decide boolean default false,
  is_critical boolean default false,
  created_at timestamp with time zone default now()
);
```

### files
```sql
create table files (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade,
  file_name text,
  file_url text,
  file_type text,
  created_at timestamp with time zone default now()
);
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=

# n8n
N8N_WEBHOOK_URL=

# App
NEXT_PUBLIC_APP_URL=https://loudllamas.org
FULFILLMENT_EMAIL=
```

---

## Configurator Question Sets

All questions have a "Let The Llamas Decide" toggle on critical fields. Renders as button grid, not dropdown.

### Website Build
| Question | Input | Critical |
|---|---|---|
| Do you have an existing site to replace? | Yes / No | YES |
| What is the primary goal of the site? | Multiple choice: leads / sales / portfolio / info | YES |
| How many pages do you need? | Multiple choice: 1-3 / 4-6 / 7-10 / 10+ | YES |
| Do you have copy written? | Yes / No / Let The Llamas Decide | YES |
| Do you have brand assets (logo, colors)? | Yes / No / Let The Llamas Decide | YES |
| Do you have a domain? | Yes / No | NO |
| What platform do you prefer? | Multiple choice: Next.js / Webflow / WordPress / No preference | NO |
| Who is your target customer? | Text | YES |

### Email / Lifecycle
| Question | Input | Critical |
|---|---|---|
| What email platform are you using? | Multiple choice: Klaviyo / Mailchimp / ActiveCampaign / None / Other | YES |
| What is the primary goal? | Multiple choice: welcome series / cart recovery / nurture / retention | YES |
| How many contacts do you have? | Multiple choice: 0-1k / 1k-10k / 10k+ | YES |
| Do you sell products or services? | Products / Services / Both | YES |
| Do you have brand assets? | Yes / No / Let The Llamas Decide | YES |
| What's your current open rate if known? | Text (optional) | NO |
| Who is your target customer? | Text | YES |

### Organic Social
| Question | Input | Critical |
|---|---|---|
| Which platforms? | Multi-select: Instagram / LinkedIn / TikTok / Facebook / X / Pinterest | YES |
| What is the goal? | Multiple choice: brand awareness / leads / community / traffic | YES |
| How often do you want to post? | Multiple choice: daily / 3-5x week / 1-2x week | YES |
| Do you have brand assets? | Yes / No / Let The Llamas Decide | YES |
| Do you have existing accounts? | Yes / No | NO |
| What type of content works best for you? | Multiple choice: educational / behind-the-scenes / promotional / entertainment | NO |
| Who is your target customer? | Text | YES |

### SEO / AEO Foundation
| Question | Input | Critical |
|---|---|---|
| Do you have an existing site? | Yes / No | YES |
| What is your primary keyword goal? | Text | YES |
| Have you done any SEO before? | Yes / No / Not Sure | NO |
| Do you have Google Search Console set up? | Yes / No | YES |
| Do you have Google Analytics set up? | Yes / No | YES |
| What's your primary content type? | Multiple choice: blog / product pages / service pages / local | YES |
| Who is your target customer? | Text | YES |

### Paid Social Playbook
> No platform access required. Meta makes it nearly impossible for third parties to configure ad accounts on behalf of clients. We're not going to pretend otherwise. Instead we deliver a complete implementation playbook built from years of paid social experience. You execute. We built the roadmap.

| Question | Input | Critical |
|---|---|---|
| Which platforms? | Multi-select: Meta / TikTok / LinkedIn / Pinterest | YES |
| Monthly ad budget | Multiple choice: under $500 / $500-2,000 / $2,000+ | YES |
| Campaign objective | Multiple choice: awareness / leads / purchases / traffic | YES |
| Do you have creative assets? | Yes / No / Let The Llamas Decide | NO |
| Target audience description | Text | NO |
| Do you have a landing page? | Yes / No | YES |
| Industry / business type | Multiple choice | YES |
| Competitor brands to reference | Text | NO |

### SEM / Google Ads Setup
| Question | Input | Critical |
|---|---|---|
| Do you have an existing Google Ads account? | Yes / No | YES |
| Monthly ad budget | Multiple choice: under $500 / $500-2,000 / $2,000+ | YES |
| Campaign type | Multiple choice: search / shopping / display / all | YES |
| Do you have conversion tracking set up? | Yes / No / Not Sure | YES |
| Do you have a landing page? | Yes / No | YES |
| Top 3 keywords or products to target | Text | YES |
| Who is your target customer? | Text | YES |

### Analytics & Tracking
| Question | Input | Critical |
|---|---|---|
| What platforms need tracking? | Multi-select: GA4 / Meta Pixel / Google Ads / TikTok / LinkedIn | YES |
| Do you have GTM set up? | Yes / No | YES |
| What are the key conversion events? | Text | YES |
| Do you have an existing site? | Yes / No | YES |
| What CMS / platform? | Multiple choice: WordPress / Webflow / Shopify / Next.js / Other | YES |
| Are you running paid ads currently? | Yes / No | NO |

---

## Page Specs

### / (Homepage)

Sections in order:
1. **Nav** — Logo (top left), links: Packages / How It Works / FAQ, CTA button: "Get started"
2. **Hero** — Headline: "Stop stalling. Start marketing." Subhead: "Pick your channel. Pay once. Get it done in 5-7 days." CTA: "Build your setup"
3. **Problem block** — "You know you need to do it. You've been putting it off. We get it. Here's what we do: set it all up, hand you the keys, and get out of your way."
4. **Pull quote** — "We're not your agency. We're your launch crew."
5. **How it works** — 3 steps: Pick your package → Fill out your intake → We build it, you own it
6. **Package preview** — Cards for each of the 7 channels. Click goes to /packages
7. **Positioning block** — "No retainers. No monthly fees. No 18-month contracts. Just a clean setup and a handoff."
8. **Paid Social Callout** — "Honest talk about Meta. Look, Meta makes it nearly impossible for anyone outside their walled garden to configure ad accounts on behalf of clients. We're not going to pretend otherwise. So instead of a half-baked setup, we built something better: The Paid Social Playbook. Years of paid social experience packaged into a step-by-step implementation guide. You run it. We built it. Same outcome, no access headaches."
9. **FAQ** — See FAQ section below
10. **Footer CTA** — "Stop stalling. Let the llamas handle it." CTA: "Build your setup"
11. **Footer** — Logo, tagline, links, "A Thayer Systems Company"

### FAQ Copy

**Do I need to know exactly what I want?**
Not really. That's what the configurator is for. If you're stuck on something, check the box. Let The Llamas Decide. You can update it later.

**How long does it take?**
5-7 business days standard. 3 days if you add rush at checkout.

**What if something breaks after handoff?**
Flat $79 troubleshooting fee. No drama.

**Do you offer ongoing management?**
No. But we can refer you to someone who does.

**What platforms do you use?**
We recommend the best tool for your budget and situation. Every recommendation comes with affiliate pricing where available, which helps keep our setup fees low.

**Can I buy more than one package?**
Oh, we hope you do. It helps feed the llamas. Each one is its own sprint. Mix and match.

**Why is Paid Social a playbook instead of a setup?**
Because Meta makes it nearly impossible for third parties to properly access and configure ad accounts on behalf of clients. Rather than promise something we cannot cleanly deliver, we built a better product. The playbook gives you everything you need to launch it yourself.

---

## Email Templates

### Order Confirmation (to customer)
Subject: You're in. Setup starts soon.
Body: Order summary, delivery window (created_at + delivery_days), next step (fill out intake), support link.

### Intake Complete (to fulfillment team)
Subject: New order ready — [channel] [tier] — [customer name]
Body: Full order JSON, intake answers, file links, customer contact info.

### Support Auto-Reply (to customer)
Subject: Got it. We'll be in touch.
Body: Confirmation they submitted, expected reply time (1 business day), order link.

---

## Build Order

Follow this sequence. Do not build UI before the data layer is ready.

1. Project scaffold (Next.js 14, Tailwind, ESLint, TypeScript)
2. Environment variables (.env.local template)
3. Supabase client setup + schema migrations
4. Stripe products creation script + webhook handler
5. Resend email setup
6. Homepage (/)
7. /packages page
8. /configure/[channel] — build one channel first, then replicate
9. /checkout
10. /intake/[orderId]
11. /confirmation/[orderId]
12. /support
13. n8n webhook integration
14. End-to-end test: homepage → configure → checkout → intake → confirmation → fulfillment email

---

*Last updated: April 2026*
*Thayer Systems / Loud Llamas*
