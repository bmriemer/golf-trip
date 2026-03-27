-- Wheelbarrow Invitational — Supabase Schema
-- Run this in your Supabase SQL editor to set up the database

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Players ──────────────────────────────────────────────────────────────────
create table if not exists players (
  id          text primary key,
  name        text not null,
  nickname    text,
  handicap    int not null default 18,
  hometown    text,
  emoji       text default '🏌️',
  wins        int default 0,
  trips       int default 1,
  bio         text,
  created_at  timestamptz default now()
);

-- ─── Courses ──────────────────────────────────────────────────────────────────
create table if not exists courses (
  id              text primary key,
  name            text not null,
  description     text,
  location        text,
  par             int not null default 72,
  difficulty      int default 7,
  yards           int,
  booking_link    text,
  emoji           text default '⛳',
  hole_pars       int[] not null,
  course_rating   numeric(4,1),
  slope_rating    int,
  created_at      timestamptz default now()
);

-- ─── Rounds ───────────────────────────────────────────────────────────────────
create table if not exists rounds (
  id            text primary key,
  course_id     text references courses(id),
  round_number  int not null,
  date          text,
  tee_time      text,
  created_at    timestamptz default now()
);

-- ─── Scorecards ───────────────────────────────────────────────────────────────
create table if not exists scorecards (
  id          uuid primary key default uuid_generate_v4(),
  player_id   text references players(id),
  round_id    text references rounds(id),
  scores      int[] not null,  -- 18 hole scores
  total       int,
  to_par      int,
  created_at  timestamptz default now(),
  unique (player_id, round_id)
);

-- ─── Polls ────────────────────────────────────────────────────────────────────
create table if not exists polls (
  id          text primary key,
  question    text not null,
  type        text default 'general',
  is_open     boolean default true,
  created_at  timestamptz default now()
);

-- ─── Poll Options ─────────────────────────────────────────────────────────────
create table if not exists poll_options (
  id          text primary key,
  poll_id     text references polls(id) on delete cascade,
  text        text not null,
  created_at  timestamptz default now()
);

-- ─── Votes ────────────────────────────────────────────────────────────────────
create table if not exists votes (
  id          uuid primary key default uuid_generate_v4(),
  poll_id     text references polls(id) on delete cascade,
  option_id   text references poll_options(id) on delete cascade,
  voter_name  text not null,
  created_at  timestamptz default now(),
  unique (poll_id, voter_name)  -- one vote per person per poll
);

-- ─── RLS Policies ─────────────────────────────────────────────────────────────
-- Allow public reads
alter table players enable row level security;
alter table courses enable row level security;
alter table rounds enable row level security;
alter table scorecards enable row level security;
alter table polls enable row level security;
alter table poll_options enable row level security;
alter table votes enable row level security;

create policy "Public read" on players for select using (true);
create policy "Public read" on courses for select using (true);
create policy "Public read" on rounds for select using (true);
create policy "Public read" on scorecards for select using (true);
create policy "Public read" on polls for select using (true);
create policy "Public read" on poll_options for select using (true);
create policy "Public read" on votes for select using (true);

-- Allow inserts for votes (authenticated via app password)
create policy "Allow vote insert" on votes for insert with check (true);
create policy "Allow vote delete" on votes for delete using (true);
create policy "Allow scorecard insert" on scorecards for insert with check (true);
create policy "Allow scorecard update" on scorecards for update using (true);

-- Allow poll management
create policy "Allow poll insert" on polls for insert with check (true);
create policy "Allow poll update" on polls for update using (true);
create policy "Allow option insert" on poll_options for insert with check (true);
