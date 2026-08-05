-- Run once in Supabase SQL Editor to enable no-code events management.
-- Then open the Table Editor (or /admin/events) to add / delete rows.
-- Past events auto-hide when ends_at is before now.

create table if not exists public.events (
  id text primary key,
  date_label text not null,
  title text not null,
  location text not null default 'TBA',
  image_url text not null default '',
  summary text not null default '',
  details jsonb not null default '[]'::jsonb,
  time_label text not null default 'TBA',
  capacity text not null default 'Open event',
  price_label text not null default 'Free entry',
  ends_at timestamptz not null,
  expectations jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- Public read for upcoming events (anon key). Writes require service role or admin API.
alter table public.events enable row level security;

drop policy if exists "Public can read events" on public.events;
create policy "Public can read events"
  on public.events
  for select
  to anon, authenticated
  using (true);

-- Seed the four calendar events (safe to re-run).
insert into public.events (
  id, date_label, title, location, image_url, summary, details,
  time_label, capacity, price_label, ends_at, expectations
) values
(
  'melrose-farmers-market',
  'AUG 6',
  'Melrose Farmers Market',
  'Melrose, MA',
  '',
  'Find Jiva at Melrose Farmers Market for an afternoon of fresh sips and local energy.',
  '["Stop by for a taste, meet the team, and stock up while you shop the market.","Come say hi, grab a cold can, and take a little ritual into the rest of your week."]'::jsonb,
  '2:30PM - 6:30PM',
  'Open market',
  'Free entry',
  '2026-08-06T18:30:00-04:00',
  '[{"title":"Market Pop-Up","description":"Sip and shop on site."},{"title":"Jiva Tastings","description":"Try our signature drinks."},{"title":"Local Vibes","description":"Meet the makers and community."}]'::jsonb
),
(
  'lowell-market',
  'AUG 7',
  'Lowell Market',
  'Lowell, MA',
  '',
  'We are pouring at Lowell Market — come through for a four-hour window of Jiva energy.',
  '["Swing by between 1 PM and 5 PM for cold cans, quick taste notes, and a warm hello from the team.","Perfect for a Friday market stroll with friends, family, or a solo reset."]'::jsonb,
  '1:00PM - 5:00PM',
  'Open market',
  'Free entry',
  '2026-08-07T17:00:00-04:00',
  '[{"title":"Afternoon Pour","description":"Four hours of Jiva on site."},{"title":"Taste & Take","description":"Sample, then grab a can to go."},{"title":"Community Stop","description":"Chat wellness, rituals, and flavor."}]'::jsonb
),
(
  'east-longmeadow-farmers-market',
  'AUG 8',
  'East Longmeadow Farmers'' Market',
  'East Longmeadow, MA',
  '',
  'Morning market energy with Jiva — pending final booth details, still on the calendar.',
  '["Join us Saturday morning for fresh air, local goods, and a revitalizing sip to start the weekend.","Status is pending confirmation; check back or email us if you plan to meet us there."]'::jsonb,
  '9:00AM - 1:00PM',
  'Open market',
  'Free entry',
  '2026-08-08T13:00:00-04:00',
  '[{"title":"Pending Pop-Up","description":"Booth confirmation in progress."},{"title":"Morning Market","description":"9 AM to 1 PM window."},{"title":"Weekend Reset","description":"Light, bright, community-first."}]'::jsonb
),
(
  'barre-groove-pop-up',
  'AUG 11',
  'Barre Groove Pop Up',
  'Barre, MA',
  '',
  'An all-day barre groove pop-up — movement, music, and Jiva poured for the full day.',
  '["Spend the day with groove-forward energy: flow, connect, and fuel with Jiva whenever you need a lift.","All-day presence means you can drop in on your own schedule and still catch the team."]'::jsonb,
  'All day',
  'Open event',
  'Free entry',
  '2026-08-11T23:59:59-04:00',
  '[{"title":"All-Day Pop-Up","description":"Come anytime on Aug 11."},{"title":"Barre Groove","description":"Music-led movement energy."},{"title":"Jiva On Site","description":"Drinks to match the rhythm."}]'::jsonb
)
on conflict (id) do update set
  date_label = excluded.date_label,
  title = excluded.title,
  location = excluded.location,
  summary = excluded.summary,
  details = excluded.details,
  time_label = excluded.time_label,
  capacity = excluded.capacity,
  price_label = excluded.price_label,
  ends_at = excluded.ends_at,
  expectations = excluded.expectations;
