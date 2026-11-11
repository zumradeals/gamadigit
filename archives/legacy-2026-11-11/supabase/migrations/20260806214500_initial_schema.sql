create extension if not exists pgcrypto;

create type public.publication_status as enum ('draft', 'published', 'archived');
create type public.lead_status as enum ('new', 'contacted', 'quoted', 'negotiating', 'won', 'lost');

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  id text primary key default 'main',
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.menus (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null unique,
  status public.publication_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references public.menus(id) on delete cascade,
  parent_id uuid references public.menu_items(id) on delete cascade,
  label text not null,
  url text not null,
  target text not null default '_self' check (target in ('_self', '_blank')),
  sort_order integer not null default 0,
  status public.publication_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.service_families (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_name text not null,
  eyebrow text,
  description text not null,
  icon text,
  accent text,
  seo_title text,
  seo_description text,
  sort_order integer not null default 0,
  status public.publication_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.service_families(id) on delete restrict,
  slug text not null unique,
  name text not null,
  excerpt text not null,
  description text not null,
  price_label text,
  delivery_label text,
  features jsonb not null default '[]'::jsonb,
  media jsonb not null default '[]'::jsonb,
  whatsapp_message text,
  seo_title text,
  seo_description text,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  status public.publication_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order integer not null default 0,
  status public.publication_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.blog_categories(id) on delete set null,
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content jsonb not null default '[]'::jsonb,
  cover_image jsonb,
  author_name text,
  read_time text,
  seo_title text,
  seo_description text,
  status public.publication_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  customer_type text,
  family_slug text,
  service_slug text,
  budget_label text,
  message text not null,
  source text not null default 'website',
  status public.lead_status not null default 'new',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  public_url text,
  alt_text text,
  mime_type text,
  size_bytes bigint,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
create trigger settings_touch before update on public.site_settings for each row execute function public.touch_updated_at();
create trigger menus_touch before update on public.menus for each row execute function public.touch_updated_at();
create trigger menu_items_touch before update on public.menu_items for each row execute function public.touch_updated_at();
create trigger families_touch before update on public.service_families for each row execute function public.touch_updated_at();
create trigger services_touch before update on public.services for each row execute function public.touch_updated_at();
create trigger blog_categories_touch before update on public.blog_categories for each row execute function public.touch_updated_at();
create trigger blog_posts_touch before update on public.blog_posts for each row execute function public.touch_updated_at();
create trigger leads_touch before update on public.leads for each row execute function public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.menus enable row level security;
alter table public.menu_items enable row level security;
alter table public.service_families enable row level security;
alter table public.services enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blog_posts enable row level security;
alter table public.leads enable row level security;
alter table public.media_assets enable row level security;

create policy "profiles_self_read" on public.profiles for select using (user_id = auth.uid() or public.is_admin());
create policy "profiles_admin_all" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

create policy "settings_public_read" on public.site_settings for select using (true);
create policy "settings_admin_all" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

create policy "menus_public_read" on public.menus for select using (status = 'published');
create policy "menus_admin_all" on public.menus for all using (public.is_admin()) with check (public.is_admin());
create policy "menu_items_public_read" on public.menu_items for select using (status = 'published');
create policy "menu_items_admin_all" on public.menu_items for all using (public.is_admin()) with check (public.is_admin());

create policy "families_public_read" on public.service_families for select using (status = 'published');
create policy "families_admin_all" on public.service_families for all using (public.is_admin()) with check (public.is_admin());
create policy "services_public_read" on public.services for select using (status = 'published');
create policy "services_admin_all" on public.services for all using (public.is_admin()) with check (public.is_admin());

create policy "blog_categories_public_read" on public.blog_categories for select using (status = 'published');
create policy "blog_categories_admin_all" on public.blog_categories for all using (public.is_admin()) with check (public.is_admin());
create policy "blog_posts_public_read" on public.blog_posts for select using (status = 'published' and published_at <= now());
create policy "blog_posts_admin_all" on public.blog_posts for all using (public.is_admin()) with check (public.is_admin());

create policy "leads_public_insert" on public.leads for insert with check (char_length(full_name) >= 2 and char_length(phone) >= 6 and char_length(message) >= 5);
create policy "leads_admin_all" on public.leads for all using (public.is_admin()) with check (public.is_admin());

create policy "media_public_read" on public.media_assets for select using (public_url is not null);
create policy "media_admin_all" on public.media_assets for all using (public.is_admin()) with check (public.is_admin());

insert into public.site_settings (id, payload)
values (
  'main',
  jsonb_build_object(
    'name', 'GamaDigit',
    'tagline', 'Le numérique qui fait avancer vos projets.',
    'ecosystemLabel', 'Un satellite de l’écosystème GAMAD',
    'whatsappNumber', '2250718713781',
    'phone', '+225 07 18 71 37 81',
    'email', 'contact@gamadigit.com',
    'location', 'Abidjan, Côte d’Ivoire'
  )
)
on conflict (id) do nothing;
