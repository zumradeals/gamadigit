create table if not exists public.dg_person_profiles (
  core_identity_reference text primary key,
  display_name text,
  country text,
  city text,
  phone text,
  current_activity text,
  education text,
  skills text[] not null default '{}',
  no_skills_yet boolean not null default false,
  learning_goals text[] not null default '{}',
  sectors text[] not null default '{}',
  intentions text[] not null default '{}',
  participation_mode text check (participation_mode is null or participation_mode in ('physical', 'digital', 'both')),
  open_to_recommendations boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.dg_person_profiles is
  'Profil metier DG Afrique attache a une identite personnelle canonique GAMAD Core. Il existe independamment de toute adhesion ZUMRA.';

comment on column public.dg_person_profiles.core_identity_reference is
  'Reference IDN-PER canonique fournie par GAMAD Core. Aucune identite membre parallele n est creee dans Supabase.';

alter table public.dg_person_profiles enable row level security;

insert into public.dg_person_profiles (
  core_identity_reference,
  display_name,
  country,
  city,
  phone,
  current_activity,
  education,
  skills,
  no_skills_yet,
  learning_goals,
  sectors,
  intentions,
  participation_mode,
  open_to_recommendations,
  created_at,
  updated_at
)
select
  core_identity_reference,
  display_name,
  country,
  city,
  phone,
  current_activity,
  education,
  skills,
  no_skills_yet,
  learning_goals,
  sectors,
  intentions,
  participation_mode,
  open_to_recommendations,
  created_at,
  updated_at
from public.zumra_member_profiles
on conflict (core_identity_reference) do nothing;
