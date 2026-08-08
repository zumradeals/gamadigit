create extension if not exists pgcrypto;

create table if not exists public.zumra_memberships (
  id uuid primary key default gen_random_uuid(),
  core_identity_reference text not null unique,
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'active', 'suspended', 'closed')),
  charter_version text not null,
  charter_accepted_at timestamptz not null,
  member_since timestamptz,
  contribution_status text not null default 'not_started'
    check (contribution_status in ('not_started', 'up_to_date', 'grace', 'late')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.zumra_member_profiles (
  core_identity_reference text primary key
    references public.zumra_memberships(core_identity_reference) on delete cascade,
  country text not null,
  city text not null,
  phone text not null,
  skills text[] not null default '{}'::text[],
  no_skills_yet boolean not null default false,
  learning_goals text[] not null default '{}'::text[],
  current_activity text,
  education text,
  sectors text[] not null default '{}'::text[],
  intentions text[] not null default '{}'::text[],
  participation_mode text not null
    check (participation_mode in ('physical', 'digital', 'both')),
  open_to_recommendations boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists zumra_memberships_status_idx
  on public.zumra_memberships(status);
create index if not exists zumra_member_profiles_country_city_idx
  on public.zumra_member_profiles(country, city);
create index if not exists zumra_member_profiles_sectors_gin_idx
  on public.zumra_member_profiles using gin(sectors);
create index if not exists zumra_member_profiles_skills_gin_idx
  on public.zumra_member_profiles using gin(skills);

create or replace function public.zumra_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists zumra_memberships_touch_updated_at on public.zumra_memberships;
create trigger zumra_memberships_touch_updated_at
before update on public.zumra_memberships
for each row execute function public.zumra_touch_updated_at();

drop trigger if exists zumra_member_profiles_touch_updated_at on public.zumra_member_profiles;
create trigger zumra_member_profiles_touch_updated_at
before update on public.zumra_member_profiles
for each row execute function public.zumra_touch_updated_at();

alter table public.zumra_memberships enable row level security;
alter table public.zumra_member_profiles enable row level security;

comment on table public.zumra_memberships is
  'Adhesion au Programme ZUMRA rattachee a une identite canonique GAMAD Core.';
comment on table public.zumra_member_profiles is
  'Donnees metier ZUMRA: capacites, apprentissages, secteurs et preferences de participation.';
comment on column public.zumra_memberships.core_identity_reference is
  'Reference canonique IDN-PER fournie par GAMAD Core. Aucune seconde identite n est creee.';
