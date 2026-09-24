-- FoodFlow user + operations schema.
-- Run this in the Supabase SQL Editor (Dashboard → SQL).
-- The publishable key cannot create tables; this SQL does.

create extension if not exists "pgcrypto";

drop table if exists public.activity_events cascade;
drop table if exists public.assignments cascade;
drop table if exists public.matches cascade;
drop table if exists public.donations cascade;
drop table if exists public.volunteers cascade;
drop table if exists public.recipients cascade;
drop table if exists public.organizations cascade;
drop table if exists public.profiles cascade;

drop type if exists public.user_role cascade;
drop type if exists public.donation_status cascade;
drop type if exists public.food_category cascade;
drop type if exists public.dietary_type cascade;
drop type if exists public.urgency_level cascade;
drop type if exists public.volunteer_status cascade;
drop type if exists public.recipient_status cascade;
drop type if exists public.vehicle_type cascade;
drop type if exists public.match_status cascade;
drop type if exists public.assignment_status cascade;
drop type if exists public.activity_type cascade;
drop type if exists public.org_type cascade;
drop type if exists public.recipient_kind cascade;

create type public.user_role as enum ('operations', 'donor', 'shelter', 'volunteer');
create type public.org_type as enum ('restaurant', 'cafeteria', 'grocer', 'bakery', 'catering', 'ngo');
create type public.donation_status as enum (
  'needs_match',
  'matched',
  'driver_assigned',
  'pickup_in_progress',
  'delivered',
  'at_risk'
);
create type public.food_category as enum ('prepared', 'produce', 'bakery', 'dairy', 'packaged', 'beverages');
create type public.dietary_type as enum ('vegetarian', 'vegan', 'non_vegetarian', 'halal', 'gluten_free');
create type public.urgency_level as enum ('low', 'medium', 'high', 'critical');
create type public.volunteer_status as enum ('available', 'on_pickup', 'offline');
create type public.recipient_status as enum ('accepting', 'near_capacity', 'full', 'closed');
create type public.recipient_kind as enum ('shelter', 'ngo', 'food_bank', 'community_kitchen');
create type public.vehicle_type as enum ('car', 'bike', 'scooter', 'van', 'on_foot');
create type public.match_status as enum ('proposed', 'accepted', 'rejected', 'completed');
create type public.assignment_status as enum ('assigned', 'en_route', 'picked_up', 'delivered');
create type public.activity_type as enum ('posted', 'analyzed', 'matched', 'assigned', 'pickup', 'delivered');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text not null default 'New user',
  role public.user_role not null default 'operations',
  organization_name text,
  phone text,
  avatar_initials text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.org_type not null default 'restaurant',
  address text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.recipients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.recipient_kind not null default 'shelter',
  address text,
  capacity integer not null default 0,
  current_load integer not null default 0,
  preferences public.dietary_type[] not null default '{}',
  status public.recipient_status not null default 'accepting',
  last_delivery_at timestamptz,
  meals_received_today integer not null default 0,
  contact text,
  phone text,
  map_x double precision,
  map_y double precision,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.volunteers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete set null,
  name text not null,
  status public.volunteer_status not null default 'available',
  vehicle public.vehicle_type not null default 'car',
  distance_km numeric,
  completed_pickups integer not null default 0,
  rating numeric not null default 5,
  eta_minutes integer,
  current_assignment text,
  phone text,
  map_x double precision,
  map_y double precision,
  created_at timestamptz not null default now()
);

create table public.donations (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  created_by uuid references public.profiles (id) on delete set null,
  organization_id uuid references public.organizations (id) on delete set null,
  donor_name text not null,
  donor_type public.org_type not null default 'restaurant',
  donor_address text,
  food_name text not null,
  category public.food_category not null default 'prepared',
  quantity numeric not null,
  unit text not null default 'meals',
  dietary public.dietary_type[] not null default '{}',
  prepared_at timestamptz,
  safe_until timestamptz,
  description text,
  handling_notes text,
  status public.donation_status not null default 'needs_match',
  urgency public.urgency_level not null default 'medium',
  distance_km numeric,
  recipient_id uuid references public.recipients (id) on delete set null,
  volunteer_id uuid references public.volunteers (id) on delete set null,
  match_score numeric,
  map_x double precision,
  map_y double precision,
  created_at timestamptz not null default now()
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid not null references public.donations (id) on delete cascade,
  recipient_id uuid not null references public.recipients (id) on delete cascade,
  distance_km numeric,
  score numeric,
  capacity_fit integer,
  dietary_compatible boolean not null default true,
  window_compatible boolean not null default true,
  suggested_volunteer_id uuid references public.volunteers (id) on delete set null,
  reasons jsonb not null default '[]'::jsonb,
  status public.match_status not null default 'proposed',
  created_at timestamptz not null default now()
);

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid not null references public.donations (id) on delete cascade,
  volunteer_id uuid not null references public.volunteers (id) on delete cascade,
  eta_minutes integer,
  status public.assignment_status not null default 'assigned',
  assigned_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.activity_events (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid references public.donations (id) on delete cascade,
  actor_id uuid references public.profiles (id) on delete set null,
  label text not null,
  type public.activity_type not null,
  created_at timestamptz not null default now()
);

create index if not exists donations_created_by_idx on public.donations (created_by);
create index if not exists donations_status_idx on public.donations (status);
create index if not exists activity_donation_idx on public.activity_events (donation_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  raw_name text;
  raw_role text;
  initials text;
begin
  raw_name := coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1));
  raw_role := coalesce(new.raw_user_meta_data->>'role', 'operations');
  initials := upper(left(coalesce(raw_name, 'U'), 2));

  insert into public.profiles (id, email, display_name, role, organization_name, avatar_initials)
  values (
    new.id,
    new.email,
    raw_name,
    case
      when raw_role in ('operations', 'donor', 'shelter', 'volunteer')
        then raw_role::public.user_role
      else 'operations'::public.user_role
    end,
    new.raw_user_meta_data->>'organization_name',
    initials
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.recipients enable row level security;
alter table public.volunteers enable row level security;
alter table public.donations enable row level security;
alter table public.matches enable row level security;
alter table public.assignments enable row level security;
alter table public.activity_events enable row level security;

create policy "profiles_select_authenticated"
  on public.profiles for select to authenticated using (true);
create policy "profiles_insert_own"
  on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profiles_update_own"
  on public.profiles for update to authenticated using (id = auth.uid());

create policy "orgs_select_authenticated"
  on public.organizations for select to authenticated using (true);
create policy "orgs_write_authenticated"
  on public.organizations for all to authenticated using (true) with check (true);

create policy "recipients_select_authenticated"
  on public.recipients for select to authenticated using (true);
create policy "recipients_write_authenticated"
  on public.recipients for all to authenticated using (true) with check (true);

create policy "volunteers_select_authenticated"
  on public.volunteers for select to authenticated using (true);
create policy "volunteers_write_authenticated"
  on public.volunteers for all to authenticated using (true) with check (true);

create policy "donations_select_authenticated"
  on public.donations for select to authenticated using (true);
create policy "donations_write_authenticated"
  on public.donations for all to authenticated using (true) with check (true);

create policy "matches_select_authenticated"
  on public.matches for select to authenticated using (true);
create policy "matches_write_authenticated"
  on public.matches for all to authenticated using (true) with check (true);

create policy "assignments_select_authenticated"
  on public.assignments for select to authenticated using (true);
create policy "assignments_write_authenticated"
  on public.assignments for all to authenticated using (true) with check (true);

create policy "activity_select_authenticated"
  on public.activity_events for select to authenticated using (true);
create policy "activity_write_authenticated"
  on public.activity_events for all to authenticated using (true) with check (true);
