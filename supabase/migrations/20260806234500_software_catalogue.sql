create table if not exists public.software_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  accent text not null default '#0877C9',
  sort_order integer not null default 0,
  status public.publication_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.services
  add column if not exists software_category_id uuid references public.software_categories(id) on delete set null;

alter table public.services
  add column if not exists product_code text;

create index if not exists services_software_category_id_idx
  on public.services(software_category_id);

create index if not exists software_categories_status_sort_idx
  on public.software_categories(status, sort_order);

drop trigger if exists software_categories_touch on public.software_categories;
create trigger software_categories_touch
before update on public.software_categories
for each row execute function public.touch_updated_at();

alter table public.software_categories enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'software_categories'
      and policyname = 'software_categories_public_read'
  ) then
    create policy "software_categories_public_read"
      on public.software_categories
      for select
      using (status = 'published');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'software_categories'
      and policyname = 'software_categories_admin_all'
  ) then
    create policy "software_categories_admin_all"
      on public.software_categories
      for all
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end
$$;

insert into public.software_categories (slug, name, description, accent, sort_order, status)
values
  ('offre-phare', 'Offre phare', 'Notre sélection principale pour équiper rapidement les professionnels et futurs apprenants.', '#F4B942', 10, 'published'),
  ('cao-bim-3d', 'CAO, BIM, architecture et 3D', 'Logiciels de conception, modélisation, calcul, rendu et documentation technique.', '#0877C9', 20, 'published'),
  ('microsoft-windows', 'Microsoft et Windows', 'Solutions bureautiques, Microsoft 365, Office et systèmes Windows.', '#17A9E6', 30, 'published'),
  ('intelligence-artificielle', 'Intelligence artificielle', 'Assistants IA et outils de prototypage, voix et productivité.', '#6D5CE7', 40, 'published'),
  ('creation-design', 'Création et design', 'Graphisme, montage vidéo, communication visuelle et production de contenus.', '#F28C28', 50, 'published'),
  ('formation-carriere', 'Formation et carrière', 'Plateformes d’apprentissage, organisation et développement professionnel.', '#1DAA8A', 60, 'published'),
  ('divertissement', 'Divertissement', 'Abonnements de streaming et plateformes de contenus.', '#E6504F', 70, 'published'),
  ('securite-vpn', 'Sécurité, antivirus et VPN', 'Protection des appareils, confidentialité et sécurité de la connexion.', '#284A7E', 80, 'published')
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    accent = excluded.accent,
    sort_order = excluded.sort_order,
    status = excluded.status,
    updated_at = now();
