-- Loud Llamas — Burnrate signups + management subscriptions
-- Run after 001_initial_schema.sql

-- ============================================================
-- burnrate_subscriptions
-- Tracks paid Burnrate subscription signups. One row per Stripe sub.
-- ============================================================
create table if not exists burnrate_subscriptions (
  id                       uuid default gen_random_uuid() primary key,
  stripe_session_id        text unique,
  stripe_subscription_id   text unique,
  stripe_customer_id       text,
  customer_email           text,
  plan                     text not null, -- 'standard' | 'founder'
  status                   text default 'active', -- active | canceled
  is_founder               boolean default false,
  created_at               timestamp with time zone default now(),
  updated_at               timestamp with time zone default now()
);

create index if not exists burnrate_subs_email_idx on burnrate_subscriptions(customer_email);
create index if not exists burnrate_subs_status_idx on burnrate_subscriptions(status);

create trigger burnrate_subs_updated_at
  before update on burnrate_subscriptions
  for each row execute function update_updated_at();

alter table burnrate_subscriptions enable row level security;

-- ============================================================
-- management_subscriptions
-- Tracks 3-month management subscriptions on SEM / Analytics / Email.
-- Linked back to the parent setup order.
-- ============================================================
create table if not exists management_subscriptions (
  id                       uuid default gen_random_uuid() primary key,
  order_id                 uuid references orders(id) on delete set null,
  stripe_session_id        text,
  stripe_subscription_id   text unique,
  channel                  text not null,
  tier                     text not null,
  monthly_amount           integer not null, -- in cents
  status                   text default 'active', -- active | canceled
  created_at               timestamp with time zone default now(),
  updated_at               timestamp with time zone default now()
);

create index if not exists mgmt_subs_order_idx on management_subscriptions(order_id);

create trigger mgmt_subs_updated_at
  before update on management_subscriptions
  for each row execute function update_updated_at();

alter table management_subscriptions enable row level security;
