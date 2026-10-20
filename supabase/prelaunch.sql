-- First-product pre-launch progress.
-- Safe to re-run in the Supabase SQL editor.
--
-- Counts are written only with the server secret key (SUPABASE_SECRET_KEY).
-- The browser never inserts rows or reads email addresses.
-- RLS is on and there are no anon/authenticated policies on purpose.

create table if not exists public.prelaunch_batches (
  id text primary key,
  goal integer not null check (goal > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.prelaunch_reservations (
  id uuid primary key default gen_random_uuid(),
  batch_id text not null references public.prelaunch_batches (id) on delete cascade,
  email text not null,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint prelaunch_reservations_email_check check (
    email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  ),
  constraint prelaunch_reservations_batch_email_key unique (batch_id, email)
);

alter table public.prelaunch_batches enable row level security;
alter table public.prelaunch_reservations enable row level security;

revoke all on table public.prelaunch_batches from anon, authenticated;
revoke all on table public.prelaunch_reservations from anon, authenticated;

insert into public.prelaunch_batches (id, goal)
values ('golden-glow', 120)
on conflict (id) do nothing;

update public.prelaunch_reservations
set batch_id = 'golden-glow'
where batch_id = 'bali-gold';

delete from public.prelaunch_batches
where id = 'bali-gold';
