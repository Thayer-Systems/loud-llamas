# Loud Llamas

Sprint-based marketing setup storefront. Pick a channel, pay once, get it done in 5–7 days.

A [Thayer Systems](https://thayersystems.com) company.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Supabase (database + storage)
- Stripe (payments)
- Resend (transactional email)
- n8n (fulfillment webhook)
- Vercel (hosting)

## Getting Started

```bash
cp .env.local.template .env.local
# Fill in your API keys, then:
npm install
npm run dev
```

## Database

Run `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor.
