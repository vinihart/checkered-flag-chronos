-- Idempotent migration to fix storage policies and ensure all objects exist
create extension if not exists pgcrypto;

-- Ensure enum and tables exist
do $$ begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'moderator', 'user');
  end if;
end $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  );
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  tag text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Drop and recreate policies to avoid duplicates
drop policy if exists "Profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

create or replace function public.update_updated_at_column()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.teams enable row level security;

drop policy if exists "Teams are viewable by everyone" on public.teams;
drop policy if exists "Team owners can insert" on public.teams;
drop policy if exists "Team owners can update" on public.teams;
drop policy if exists "Team owners can delete" on public.teams;

create policy "Teams are viewable by everyone" on public.teams for select using (true);
create policy "Team owners can insert" on public.teams for insert with check (auth.uid() = owner_id);
create policy "Team owners can update" on public.teams for update using (auth.uid() = owner_id);
create policy "Team owners can delete" on public.teams for delete using (auth.uid() = owner_id);

create or replace trigger update_teams_updated_at before update on public.teams
for each row execute function public.update_updated_at_column();

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  unique (team_id, user_id)
);

alter table public.team_members enable row level security;

drop policy if exists "Membership view for members" on public.team_members;
drop policy if exists "Owner can insert members" on public.team_members;
drop policy if exists "Owner can update members" on public.team_members;
drop policy if exists "Owner can delete members" on public.team_members;

create policy "Membership view for members" on public.team_members for select using (
  auth.uid() = user_id
  or exists (select 1 from public.teams t where t.id = team_id and t.owner_id = auth.uid())
  or public.has_role(auth.uid(), 'admin')
);
create policy "Owner can insert members" on public.team_members for insert with check (
  exists (select 1 from public.teams t where t.id = team_id and t.owner_id = auth.uid())
);
create policy "Owner can update members" on public.team_members for update using (
  exists (select 1 from public.teams t where t.id = team_id and t.owner_id = auth.uid())
);
create policy "Owner can delete members" on public.team_members for delete using (
  exists (select 1 from public.teams t where t.id = team_id and t.owner_id = auth.uid())
);

create table if not exists public.tracks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  record_time_ms integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tracks enable row level security;

drop policy if exists "Tracks are viewable by everyone" on public.tracks;
drop policy if exists "Only admins can write tracks" on public.tracks;

create policy "Tracks are viewable by everyone" on public.tracks for select using (true);
create policy "Only admins can write tracks" on public.tracks for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create or replace trigger update_tracks_updated_at before update on public.tracks
for each row execute function public.update_updated_at_column();

create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  class text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cars enable row level security;

drop policy if exists "Cars are viewable by everyone" on public.cars;
drop policy if exists "Only admins can write cars" on public.cars;

create policy "Cars are viewable by everyone" on public.cars for select using (true);
create policy "Only admins can write cars" on public.cars for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create or replace trigger update_cars_updated_at before update on public.cars
for each row execute function public.update_updated_at_column();

create table if not exists public.lap_times (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  track_id uuid not null references public.tracks(id) on delete cascade,
  car_id uuid not null references public.cars(id) on delete cascade,
  lap_time_ms integer not null,
  status text not null default 'valid',
  position_change integer default 0,
  reviewed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.lap_times enable row level security;

drop policy if exists "Lap times viewable by everyone" on public.lap_times;
drop policy if exists "Users can insert their lap times" on public.lap_times;
drop policy if exists "Users manage own lap times" on public.lap_times;
drop policy if exists "Users delete own lap times" on public.lap_times;
drop policy if exists "Admins manage all lap times" on public.lap_times;

create policy "Lap times viewable by everyone" on public.lap_times for select using (true);
create policy "Users can insert their lap times" on public.lap_times for insert with check (auth.uid() = user_id);
create policy "Users manage own lap times" on public.lap_times for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users delete own lap times" on public.lap_times for delete using (auth.uid() = user_id);
create policy "Admins manage all lap times" on public.lap_times for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create or replace trigger update_lap_times_updated_at before update on public.lap_times
for each row execute function public.update_updated_at_column();

create table if not exists public.team_announcements (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.team_announcements enable row level security;

drop policy if exists "Announcements are viewable by everyone" on public.team_announcements;
drop policy if exists "Only team owner can write announcements" on public.team_announcements;

create policy "Announcements are viewable by everyone" on public.team_announcements for select using (true);
create policy "Only team owner can write announcements" on public.team_announcements for all using (
  exists (select 1 from public.teams t where t.id = team_id and t.owner_id = auth.uid())
) with check (
  exists (select 1 from public.teams t where t.id = team_id and t.owner_id = auth.uid())
);

create table if not exists public.team_events (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  title text not null,
  description text,
  event_date timestamptz not null,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.team_events enable row level security;

drop policy if exists "Events are viewable by everyone" on public.team_events;
drop policy if exists "Only team owner can write events" on public.team_events;

create policy "Events are viewable by everyone" on public.team_events for select using (true);
create policy "Only team owner can write events" on public.team_events for all using (
  exists (select 1 from public.teams t where t.id = team_id and t.owner_id = auth.uid())
) with check (
  exists (select 1 from public.teams t where t.id = team_id and t.owner_id = auth.uid())
);

create table if not exists public.team_chat_messages (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.team_chat_messages enable row level security;

drop policy if exists "Team members can read chat" on public.team_chat_messages;
drop policy if exists "Team members can write chat" on public.team_chat_messages;

create policy "Team members can read chat" on public.team_chat_messages for select using (
  exists (select 1 from public.team_members tm where tm.team_id = team_id and tm.user_id = auth.uid())
  or exists (select 1 from public.teams t where t.id = team_id and t.owner_id = auth.uid())
  or public.has_role(auth.uid(), 'admin')
);
create policy "Team members can write chat" on public.team_chat_messages for insert with check (
  exists (select 1 from public.team_members tm where tm.team_id = team_id and tm.user_id = auth.uid())
  or exists (select 1 from public.teams t where t.id = team_id and t.owner_id = auth.uid())
  or public.has_role(auth.uid(), 'admin')
);

-- Realtime
alter table public.lap_times replica identity full;
alter table public.team_chat_messages replica identity full;

-- May error if already added; wrap in DO blocks
do $$ begin
  perform 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='lap_times';
  if not found then
    execute 'alter publication supabase_realtime add table public.lap_times';
  end if;
end $$;

do $$ begin
  perform 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='team_chat_messages';
  if not found then
    execute 'alter publication supabase_realtime add table public.team_chat_messages';
  end if;
end $$;

-- Storage bucket and policies
insert into storage.buckets (id, name, public)
values ('team-logos', 'team-logos', true)
on conflict (id) do nothing;

-- Drop existing policies for idempotency
drop policy if exists "Public can read team logos" on storage.objects;
drop policy if exists "Authenticated can upload team logos" on storage.objects;
drop policy if exists "Owners can update their logos" on storage.objects;
drop policy if exists "Owners can delete their logos" on storage.objects;

create policy "Public can read team logos" on storage.objects
for select using (bucket_id = 'team-logos');

create policy "Authenticated can upload team logos" on storage.objects
for insert to authenticated with check (bucket_id = 'team-logos');

create policy "Owners can update their logos" on storage.objects
for update to authenticated using (bucket_id = 'team-logos');

create policy "Owners can delete their logos" on storage.objects
for delete to authenticated using (bucket_id = 'team-logos');

-- Auto-create profile and base role on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  insert into public.user_roles (user_id, role) values (new.id, 'user') on conflict do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();