-- =============================================
-- TAW (طوع) — Supabase Database Schema (MVP)
-- =============================================
-- Run this in the Supabase SQL Editor after creating your project.

-- ── 1. Profiles (extends auth.users) ──
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  avatar_url text,
  points integer default 0 not null,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ── 2. Auto-create profile on signup (trigger) ──
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── 3. Interests (lookup table) ──
create table public.interests (
  id serial primary key,
  name text unique not null,
  icon text -- Material icon name (e.g. 'forest', 'menu_book')
);

alter table public.interests enable row level security;

create policy "Interests are publicly readable"
  on public.interests for select
  using (true);

-- Seed the interest categories from the app
insert into public.interests (name, icon) values
  ('Environment', 'forest'),
  ('Elderly Care', 'assist_walker'),
  ('Education', 'menu_book'),
  ('Health', 'monitor_heart'),
  ('Animal Welfare', 'pets'),
  ('Social Welfare', 'groups'),
  ('Advocacy', 'campaign'),
  ('Arts & Culture', 'palette'),
  ('Food Security', 'soup_kitchen');

-- ── 4. User Interests (junction table) ──
create table public.user_interests (
  id serial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  interest_name text not null,
  created_at timestamptz default now() not null,
  unique(user_id, interest_name)
);

alter table public.user_interests enable row level security;

create policy "Users can view own interests"
  on public.user_interests for select
  using (auth.uid() = user_id);

create policy "Users can insert own interests"
  on public.user_interests for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own interests"
  on public.user_interests for delete
  using (auth.uid() = user_id);

-- ── 5. Opportunities ──
create table public.opportunities (
  id serial primary key,
  title text not null,
  description text,
  category text,
  location text,
  date date,
  hours numeric(4,1),
  points integer default 0,
  image_url text,
  icon text,
  created_at timestamptz default now() not null
);

alter table public.opportunities enable row level security;

create policy "Opportunities are publicly readable"
  on public.opportunities for select
  using (true);

-- ── 6. Opportunity Signups ──
create table public.opportunity_signups (
  id serial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  opportunity_id integer references public.opportunities(id) on delete cascade not null,
  checked_in boolean default false,
  checked_in_at timestamptz,
  created_at timestamptz default now() not null,
  unique(user_id, opportunity_id)
);

alter table public.opportunity_signups enable row level security;

create policy "Users can view own signups"
  on public.opportunity_signups for select
  using (auth.uid() = user_id);

create policy "Users can sign up for opportunities"
  on public.opportunity_signups for insert
  with check (auth.uid() = user_id);

create policy "Users can update own signups"
  on public.opportunity_signups for update
  using (auth.uid() = user_id);

-- ── 7. Rewards ──
create table public.rewards (
  id serial primary key,
  title text not null,
  brand_name text,
  category text,
  description text,
  points integer not null,
  image_url text,
  logo_html text,
  expires date,
  usage_type text default 'One-time Use',
  terms text[],
  created_at timestamptz default now() not null
);

alter table public.rewards enable row level security;

create policy "Rewards are publicly readable"
  on public.rewards for select
  using (true);

-- ── 8. Point Ledger ──
create table public.point_ledger (
  id serial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  amount integer not null, -- positive = earned, negative = spent
  reason text, -- e.g. 'reward_redemption', 'volunteer_checkin'
  reference_id integer, -- FK to opportunity or reward id
  created_at timestamptz default now() not null
);

alter table public.point_ledger enable row level security;

create policy "Users can view own ledger"
  on public.point_ledger for select
  using (auth.uid() = user_id);

-- ── 9. Reward Redemption RPC (atomic point deduction) ──
create or replace function public.redeem_reward(reward_id integer)
returns json as $$
declare
  v_user_id uuid := auth.uid();
  v_cost integer;
  v_balance integer;
begin
  -- Get reward cost
  select points into v_cost from public.rewards where id = reward_id;
  if v_cost is null then
    return json_build_object('success', false, 'error', 'Reward not found');
  end if;

  -- Get user balance
  select points into v_balance from public.profiles where id = v_user_id;
  if v_balance < v_cost then
    return json_build_object('success', false, 'error', 'Insufficient points');
  end if;

  -- Deduct points
  update public.profiles set points = points - v_cost where id = v_user_id;

  -- Record transaction
  insert into public.point_ledger (user_id, amount, reason, reference_id)
  values (v_user_id, -v_cost, 'reward_redemption', reward_id);

  return json_build_object('success', true, 'new_balance', v_balance - v_cost);
end;
$$ language plpgsql security definer;


-- =============================================
-- POINTS ECONOMY — Migrations applied 2026-04-01
-- =============================================

-- ── Migration 1: point_transactions + point_balances ──

create type transaction_type as enum (
  'earn_base', 'earn_bonus_firsttime', 'earn_bonus_skills',
  'earn_bonus_repeat_org', 'earn_bonus_urgent', 'earn_bonus_group',
  'redeem', 'expire', 'admin_adjust'
);

create table point_transactions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  amount        integer not null,
  type          transaction_type not null,
  session_id    uuid,        -- FK to volunteer_sessions(id) — added in migration 6
  redemption_id uuid,        -- FK to redemptions(id) — added in migration 6
  note          text,
  created_at    timestamptz not null default now()
);
alter table point_transactions enable row level security;
create policy "Users see own transactions" on point_transactions for select using (auth.uid() = user_id);
create policy "Service role inserts" on point_transactions for insert with check (auth.role() = 'service_role');

create table point_balances (
  user_id           uuid primary key references auth.users(id) on delete cascade,
  current_balance   integer not null default 0,
  lifetime_points   integer not null default 0,
  last_activity_at  timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
alter table point_balances enable row level security;
create policy "Users see own balance" on point_balances for select using (auth.uid() = user_id);

-- ── Migration 2: opportunities enhancements (geofencing + urgency) ──

alter table opportunities
  add column if not exists is_urgent  boolean not null default false,
  add column if not exists latitude   numeric(9,6),
  add column if not exists longitude  numeric(9,6);

-- ── Migration 3: volunteer_sessions ──

create type session_status as enum ('checked_in', 'confirmed', 'disputed', 'cancelled');

create table volunteer_sessions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  opportunity_id      integer not null references opportunities(id),
  org_id              uuid not null,
  status              session_status not null default 'checked_in',
  checked_in_at       timestamptz not null default now(),
  confirmed_at        timestamptz,
  hours               numeric(4,1),
  is_skilled          boolean default false,
  points_awarded      integer,
  flagged_for_review  boolean not null default false,
  created_at          timestamptz not null default now()
);
alter table volunteer_sessions enable row level security;
create policy "Users see own sessions"    on volunteer_sessions for select using (auth.uid() = user_id);
create policy "Orgs see their sessions"   on volunteer_sessions for select using (auth.uid() = org_id);
create policy "Orgs confirm their sessions" on volunteer_sessions for update using (auth.uid() = org_id) with check (org_id = auth.uid());

-- ── Migration 4: tiers ──

create table tiers (
  id                  serial primary key,
  name_en             text not null,
  name_ar             text not null,
  min_lifetime_points integer not null,
  multiplier          numeric(3,2) not null default 1.0,
  badge_color         text not null
);
insert into tiers (name_en, name_ar, min_lifetime_points, multiplier, badge_color) values
  ('Beginner',      'مبتدئ',  0,     1.00, '6B8A94'),
  ('Active',        'نشيط',   500,   1.00, '0A7C8C'),
  ('Distinguished', 'متميز',  1500,  1.00, 'F5A623'),
  ('Ambassador',    'سفير',   4000,  1.00, '0D2E3E');

-- ── Migration 5: deals + redemptions ──

create type deal_status as enum ('active', 'paused', 'rejected', 'expired');

create table deals (
  id              uuid primary key default gen_random_uuid(),
  business_id     uuid not null references auth.users(id),
  title           text not null,
  description     text,
  points_cost     integer not null,
  min_tier        integer references tiers(id) default 1,
  status          deal_status not null default 'active',
  total_redeemed  integer not null default 0,
  max_redemptions integer,
  expires_at      timestamptz,
  created_at      timestamptz not null default now()
);
alter table deals enable row level security;
create policy "Anyone can view active deals" on deals for select using (status = 'active');

create table redemptions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  deal_id       uuid not null references deals(id),
  points_spent  integer not null,
  redeemed_at   timestamptz not null default now(),
  expires_at    timestamptz not null,
  used_at       timestamptz
);
alter table redemptions enable row level security;
create policy "Users see own redemptions" on redemptions for select using (auth.uid() = user_id);

-- ── Migration 6: FK constraints from point_transactions to sessions + redemptions ──

alter table point_transactions
  add constraint fk_pt_session    foreign key (session_id)    references volunteer_sessions(id),
  add constraint fk_pt_redemption foreign key (redemption_id) references redemptions(id);

-- ── Monitoring queries ──

-- Redemption rate (target: 40-60%)
-- select
--   count(*) filter (where amount < 0 and type = 'redeem') as redemptions,
--   count(*) filter (where amount > 0) as earns,
--   round(count(*) filter (where amount < 0 and type = 'redeem')::numeric /
--     nullif(count(*) filter (where amount > 0), 0) * 100, 1) as redemption_rate_pct
-- from point_transactions
-- where created_at > now() - interval '30 days';

-- Top earners
-- select u.email, pb.current_balance, pb.lifetime_points
-- from point_balances pb join auth.users u on u.id = pb.user_id
-- order by pb.lifetime_points desc limit 20;

-- Flagged sessions
-- select * from volunteer_sessions where flagged_for_review = true order by confirmed_at desc;
