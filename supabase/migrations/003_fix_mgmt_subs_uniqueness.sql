-- Fix: a single Stripe subscription can contain multiple recurring line items
-- (one per management package in a multi-channel checkout). The unique
-- constraint on stripe_subscription_id was preventing all but the first row
-- from being inserted, silently losing 90-day sprint records.
--
-- Replace with a regular index for lookups, and an idempotency-safe composite
-- unique on (stripe_subscription_id, order_id) so retries from the webhook
-- can't double-insert.

alter table management_subscriptions
  drop constraint if exists management_subscriptions_stripe_subscription_id_key;

create index if not exists mgmt_subs_stripe_sub_idx
  on management_subscriptions(stripe_subscription_id);

create unique index if not exists mgmt_subs_sub_order_uniq
  on management_subscriptions(stripe_subscription_id, order_id);
