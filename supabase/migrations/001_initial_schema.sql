-- Loud Llamas — Initial Schema
-- Run in Supabase SQL editor or via: supabase db push

-- ============================================================
-- orders
-- ============================================================
create table if not exists orders (
  id                    uuid default gen_random_uuid() primary key,
  channel               text not null,
  tier                  text not null,
  price                 integer not null, -- in cents
  add_ons               jsonb default '[]',
  stripe_session_id     text,
  stripe_payment_status text default 'pending',
  delivery_days         integer default 7,
  status                text default 'pending', -- pending → paid → intake_complete
  customer_email        text,
  customer_name         text,
  created_at            timestamp with time zone default now(),
  updated_at            timestamp with time zone default now()
);

-- ============================================================
-- intake_answers
-- ============================================================
create table if not exists intake_answers (
  id            uuid default gen_random_uuid() primary key,
  order_id      uuid references orders(id) on delete cascade,
  question_key  text not null,
  answer        text,
  llamas_decide boolean default false,
  is_critical   boolean default false,
  created_at    timestamp with time zone default now()
);

-- ============================================================
-- files
-- ============================================================
create table if not exists files (
  id         uuid default gen_random_uuid() primary key,
  order_id   uuid references orders(id) on delete cascade,
  file_name  text,
  file_url   text,
  file_type  text,
  created_at timestamp with time zone default now()
);

-- ============================================================
-- updated_at trigger for orders
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- ============================================================
-- RLS policies
-- orders and intake_answers: readable by service role only
-- files: readable by service role only
-- ============================================================
alter table orders enable row level security;
alter table intake_answers enable row level security;
alter table files enable row level security;

-- Service role bypass (default Supabase behaviour for service_role key)
-- No additional policies needed — service role bypasses RLS by default.
-- If you add anon/authenticated policies later, add them here.
