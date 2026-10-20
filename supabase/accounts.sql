-- Customer accounts, order snapshots, and team fulfillment.
-- Safe to re-run in the Supabase SQL editor.
--
-- Browser uses the publishable key only.
-- Payment status, amounts, ownership, and fulfillment are written with the
-- server secret key (SUPABASE_SECRET_KEY). That key must never use a VITE_ name.
--
-- Stripe webhook (signature required):
--   http://localhost:3001/api/stripe/webhook
--   https://www.jivalivin.com/api/stripe/webhook
-- Events: checkout.session.completed, checkout.session.async_payment_succeeded,
--   checkout.session.async_payment_failed, checkout.session.expired, charge.refunded

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text not null default '',
  phone text,
  address_line1 text,
  address_line2 text,
  address_city text,
  address_state text,
  address_postal_code text,
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  email text,
  stripe_session_id text not null unique,
  stripe_payment_intent_id text,
  payment_status text not null default 'pending',
  payment_event_created bigint,
  fulfillment_status text,
  fulfillment_type text,
  delivery_zip text,
  pickup_location text,
  shipping_address text,
  ship_line1 text,
  ship_line2 text,
  ship_city text,
  ship_state text,
  ship_postal_code text,
  phone text,
  delivery_window text,
  notes text,
  amount_total integer,
  amount_refunded integer not null default 0,
  currency text not null default 'usd',
  items jsonb not null default '[]'::jsonb,
  tracking_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_address_requests (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.stripe_events (
  id text primary key,
  event_type text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists address_line1 text;
alter table public.profiles add column if not exists address_line2 text;
alter table public.profiles add column if not exists address_city text;
alter table public.profiles add column if not exists address_state text;
alter table public.profiles add column if not exists address_postal_code text;
alter table public.profiles add column if not exists marketing_opt_in boolean not null default false;

alter table public.orders add column if not exists stripe_payment_intent_id text;
alter table public.orders add column if not exists payment_status text;
alter table public.orders add column if not exists payment_event_created bigint;
alter table public.orders add column if not exists fulfillment_status text;
alter table public.orders add column if not exists ship_line1 text;
alter table public.orders add column if not exists ship_line2 text;
alter table public.orders add column if not exists ship_city text;
alter table public.orders add column if not exists ship_state text;
alter table public.orders add column if not exists ship_postal_code text;
alter table public.orders add column if not exists amount_refunded integer not null default 0;
alter table public.orders add column if not exists tracking_url text;
alter table public.orders add column if not exists updated_at timestamptz not null default now();
alter table public.orders add column if not exists order_kind text;

alter table public.orders drop constraint if exists orders_order_kind_check;
alter table public.orders
  add constraint orders_order_kind_check
  check (order_kind is null or order_kind in ('preorder'));

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'orders' and column_name = 'status'
  ) then
    execute $backfill$
      update public.orders
      set payment_status = coalesce(
        payment_status,
        case when status = 'paid' then 'paid' else 'pending' end
      )
      where payment_status is null
    $backfill$;
    alter table public.orders drop column status;
  end if;
end $$;

update public.orders set payment_status = 'pending' where payment_status is null;
alter table public.orders alter column payment_status set default 'pending';
alter table public.orders alter column payment_status set not null;

alter table public.orders drop constraint if exists orders_payment_status_check;
alter table public.orders
  add constraint orders_payment_status_check
  check (payment_status in ('pending', 'paid', 'failed', 'partially_refunded', 'refunded'));

alter table public.orders drop constraint if exists orders_fulfillment_status_check;
alter table public.orders
  add constraint orders_fulfillment_status_check
  check (
    fulfillment_status is null
    or fulfillment_status in ('preparing', 'ready_for_pickup', 'shipped', 'delivered', 'picked_up')
  );

alter table public.order_address_requests drop constraint if exists order_address_requests_status_check;
alter table public.order_address_requests
  add constraint order_address_requests_status_check
  check (status in ('pending', 'approved', 'declined'));

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_guest_email_idx on public.orders (lower(email)) where user_id is null;
create index if not exists orders_payment_intent_idx on public.orders (stripe_payment_intent_id);
create index if not exists order_address_requests_user_idx on public.order_address_requests (user_id);
create index if not exists order_address_requests_order_idx on public.order_address_requests (order_id);

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to supabase_auth_admin, service_role;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row
  execute function public.set_updated_at();

-- Signed-in customers cannot rewrite their login email on the profile row.
-- Email changes go through Supabase Auth, which confirms the new address first.
create or replace function public.protect_profile_identity()
returns trigger
language plpgsql
as $$
begin
  if auth.role() in ('anon', 'authenticated') then
    new.id := old.id;
    new.email := old.email;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_identity on public.profiles;
create trigger profiles_protect_identity
  before update on public.profiles
  for each row
  execute function public.protect_profile_identity();

-- Customers have no update policy. This still blocks a future policy from
-- letting the browser change money, ownership, payment, or the original address.
create or replace function public.protect_order_record()
returns trigger
language plpgsql
as $$
begin
  if auth.role() in ('anon', 'authenticated') then
    raise exception 'Orders can only be changed by the server';
  end if;
  return new;
end;
$$;

drop trigger if exists orders_protect_record on public.orders;
create trigger orders_protect_record
  before update on public.orders
  for each row
  execute function public.protect_order_record();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, marketing_opt_in)
  values (
    new.id,
    new.email,
    coalesce(
      nullif(new.raw_user_meta_data->>'full_name', ''),
      nullif(new.raw_user_meta_data->>'name', ''),
      ''
    ),
    coalesce((new.raw_user_meta_data->>'marketing_opt_in') = 'true', false)
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function private.handle_new_user();

create or replace function private.sync_profile_from_auth()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
    set email = new.email
    where id = new.id
      and email is distinct from new.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row
  execute function private.sync_profile_from_auth();

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.protect_profile_identity() from public, anon, authenticated;
revoke all on function public.protect_order_record() from public, anon, authenticated;
revoke all on function private.handle_new_user() from public, anon, authenticated;
revoke all on function private.sync_profile_from_auth() from public, anon, authenticated;

grant execute on function public.set_updated_at() to authenticated, service_role;
grant execute on function public.protect_profile_identity() to authenticated, service_role;
grant execute on function public.protect_order_record() to service_role;
grant execute on function private.handle_new_user() to supabase_auth_admin;
grant execute on function private.sync_profile_from_auth() to supabase_auth_admin;

alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_address_requests enable row level security;
alter table public.stripe_events enable row level security;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
  on public.profiles for select to authenticated
  using (auth.uid() = id);

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users read own orders" on public.orders;
create policy "Users read own orders"
  on public.orders for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "Users read own address requests" on public.order_address_requests;
create policy "Users read own address requests"
  on public.order_address_requests for select to authenticated
  using (user_id = auth.uid());

revoke all on public.profiles from anon;
grant select, insert, update on public.profiles to authenticated;

revoke all on public.orders from anon, authenticated;
grant select on public.orders to authenticated;

revoke all on public.order_address_requests from anon, authenticated;
grant select on public.order_address_requests to authenticated;

revoke all on public.stripe_events from anon, authenticated;
