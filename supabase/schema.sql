-- নিশ্চিত | Supabase production schema
-- Supabase SQL Editor-এ পুরো ফাইলটি একবার চালান।
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  business_name text not null default 'আমার স্টোর',
  phone text,
  plan text not null default 'trial' check (plan in ('trial','growth','pro')),
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text not null,
  area text,
  total_orders integer not null default 0,
  delivered_orders integer not null default 0,
  returned_orders integer not null default 0,
  created_at timestamptz not null default now(),
  unique(owner_id, phone)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  order_code text not null,
  customer_name text not null,
  phone text not null,
  area text,
  amount numeric(12,2) not null check (amount >= 0),
  status text not null default 'pending' check (status in ('pending','confirmed','packed','shipped','delivered','returned','cancelled')),
  risk_level text not null default 'medium' check (risk_level in ('low','medium','high')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_id, order_code)
);

create table if not exists public.verification_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid not null references public.orders(id) on delete cascade,
  channel text not null check(channel in ('manual','sms','whatsapp','call')),
  event_type text not null check(event_type in ('queued','sent','confirmed','failed','call_logged')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.verification_events enable row level security;

create policy "own profile" on public.profiles for all using (id = auth.uid()) with check (id = auth.uid());
create policy "own customers" on public.customers for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "own orders" on public.orders for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "own events" on public.verification_events for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- নতুন user-এর profile স্বয়ংক্রিয়ভাবে তৈরি হয়।
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into public.profiles (id, business_name) values (new.id, coalesce(new.raw_user_meta_data ->> 'business_name', 'আমার স্টোর')); return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create index if not exists orders_owner_status_idx on public.orders(owner_id, status, created_at desc);
create index if not exists customers_owner_phone_idx on public.customers(owner_id, phone);
