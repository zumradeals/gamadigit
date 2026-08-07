create table if not exists public.training_categories (
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

create table if not exists public.training_programs (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.training_categories(id) on delete restrict,
  slug text not null unique,
  name text not null,
  kind text not null default 'software' check (kind in ('software', 'career_pack')),
  excerpt text not null,
  description text not null,
  price_label text,
  show_price boolean not null default false,
  format_label text,
  duration_label text,
  highlights jsonb not null default '[]'::jsonb,
  media jsonb not null default '[]'::jsonb,
  whatsapp_message text,
  partner_label text,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  status public.publication_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists training_categories_status_sort_idx
  on public.training_categories(status, sort_order);
create index if not exists training_programs_category_idx
  on public.training_programs(category_id);
create index if not exists training_programs_status_sort_idx
  on public.training_programs(status, sort_order);

create trigger training_categories_touch
before update on public.training_categories
for each row execute function public.touch_updated_at();

create trigger training_programs_touch
before update on public.training_programs
for each row execute function public.touch_updated_at();

alter table public.training_categories enable row level security;
alter table public.training_programs enable row level security;

create policy "training_categories_public_read"
  on public.training_categories for select
  using (status = 'published');
create policy "training_categories_admin_all"
  on public.training_categories for all
  using (public.is_admin()) with check (public.is_admin());

create policy "training_programs_public_read"
  on public.training_programs for select
  using (status = 'published');
create policy "training_programs_admin_all"
  on public.training_programs for all
  using (public.is_admin()) with check (public.is_admin());

insert into public.training_categories (slug, name, description, accent, sort_order, status)
values
  ('architecture-bim', 'Architecture et BIM', 'Conception architecturale, documentation, coordination et modélisation BIM.', '#0877C9', 10, 'published'),
  ('genie-civil-vrd', 'Génie civil et VRD', 'Conception de projets routiers, terrassements, réseaux et infrastructures.', '#1DAA8A', 20, 'published'),
  ('structure-calcul', 'Structure et calcul', 'Modélisation, analyse et conception des structures en béton et en acier.', '#6D5CE7', 30, 'published'),
  ('industrie-mecanique', 'Industrie et mécanique', 'Conception mécanique, simulation et développement de produits industriels.', '#F28C28', 40, 'published'),
  ('visualisation-rendu', 'Visualisation et rendu', 'Modélisation 3D, images de synthèse et présentation visuelle des projets.', '#17A9E6', 50, 'published'),
  ('electricite-installations', 'Électricité et installations', 'Études techniques des installations, éclairage et systèmes du bâtiment.', '#F4B942', 60, 'published'),
  ('usines-metal', 'Usines et structures métalliques', 'Tuyauterie industrielle, installations d’usine et charpente métallique.', '#284A7E', 70, 'published'),
  ('packs-metiers-premium', 'Packs métiers premium', 'Parcours complets orientés vers une fonction et des compétences professionnelles.', '#E6504F', 80, 'published')
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  accent = excluded.accent,
  sort_order = excluded.sort_order,
  status = excluded.status,
  updated_at = now();

with seed(name, slug, category_slug, kind, sort_order, is_featured) as (
  values
    ('AutoCAD', 'formation-autocad', 'architecture-bim', 'software', 10, true),
    ('Revit Architecture', 'formation-revit-architecture', 'architecture-bim', 'software', 20, true),
    ('ArchiCAD', 'formation-archicad', 'architecture-bim', 'software', 30, false),
    ('SketchUp', 'formation-sketchup', 'architecture-bim', 'software', 40, true),
    ('Navisworks', 'formation-navisworks', 'architecture-bim', 'software', 50, false),
    ('AutoCAD Civil 3D', 'formation-autocad-civil-3d', 'genie-civil-vrd', 'software', 10, true),
    ('Covadis', 'formation-covadis', 'genie-civil-vrd', 'software', 20, false),
    ('Revit Structure', 'formation-revit-structure', 'structure-calcul', 'software', 10, true),
    ('Tekla Structures', 'formation-tekla-structures', 'structure-calcul', 'software', 20, true),
    ('ETABS', 'formation-etabs', 'structure-calcul', 'software', 30, false),
    ('Robot Structural Analysis', 'formation-robot-structural-analysis', 'structure-calcul', 'software', 40, false),
    ('Tekla Structural Designer', 'formation-tekla-structural-designer', 'structure-calcul', 'software', 50, false),
    ('SolidWorks', 'formation-solidworks', 'industrie-mecanique', 'software', 10, true),
    ('CATIA', 'formation-catia', 'industrie-mecanique', 'software', 20, false),
    ('Fusion 360', 'formation-fusion-360', 'industrie-mecanique', 'software', 30, false),
    ('MIDAS NFX', 'formation-midas-nfx', 'industrie-mecanique', 'software', 40, false),
    ('Autodesk Inventor', 'formation-autodesk-inventor', 'industrie-mecanique', 'software', 50, false),
    ('3ds Max', 'formation-3ds-max', 'visualisation-rendu', 'software', 10, false),
    ('Lumion', 'formation-lumion', 'visualisation-rendu', 'software', 20, true),
    ('D5 Render', 'formation-d5-render', 'visualisation-rendu', 'software', 30, false),
    ('Blender', 'formation-blender', 'visualisation-rendu', 'software', 40, false),
    ('Revit MEP', 'formation-revit-mep', 'electricite-installations', 'software', 10, false),
    ('DIALux', 'formation-dialux', 'electricite-installations', 'software', 20, false),
    ('AutoCAD Plant 3D', 'formation-autocad-plant-3d', 'usines-metal', 'software', 10, true),
    ('Advance Steel', 'formation-advance-steel', 'usines-metal', 'software', 20, false),
    ('Dessinateur Projeteur BTP', 'pack-dessinateur-projeteur-btp', 'packs-metiers-premium', 'career_pack', 10, true),
    ('Dessinateur Projeteur Structure', 'pack-dessinateur-projeteur-structure', 'packs-metiers-premium', 'career_pack', 20, false),
    ('Expert BIM Manager', 'pack-expert-bim-manager', 'packs-metiers-premium', 'career_pack', 30, true),
    ('Ingénieur Structure Expert', 'pack-ingenieur-structure-expert', 'packs-metiers-premium', 'career_pack', 40, true),
    ('Dessinateur Industriel Expert', 'pack-dessinateur-industriel-expert', 'packs-metiers-premium', 'career_pack', 50, false),
    ('Expert Bureau d’Études Global', 'pack-expert-bureau-etudes-global', 'packs-metiers-premium', 'career_pack', 60, true)
)
insert into public.training_programs (
  category_id, slug, name, kind, excerpt, description, price_label, show_price,
  highlights, whatsapp_message, partner_label, is_featured, sort_order, status, published_at
)
select
  c.id,
  s.slug,
  s.name,
  s.kind,
  case when s.kind = 'career_pack'
    then 'Un parcours métier structuré autour de compétences professionnelles complémentaires.'
    else 'Une formation professionnelle dédiée à ' || s.name || ', avec orientation et inscription sur WhatsApp.'
  end,
  case when s.kind = 'career_pack'
    then 'Ce pack métier est présenté par GamaDigit avec notre partenaire formateur. Le programme détaillé, la durée, le format et les prochaines disponibilités sont communiqués avant toute inscription.'
    else 'Cette formation est proposée par GamaDigit avec notre partenaire formateur spécialisé. Le programme détaillé, la durée, le format et les prochaines disponibilités sont communiqués avant toute inscription.'
  end,
  null,
  false,
  jsonb_build_array('Information claire avant inscription', 'Échange direct sur WhatsApp', 'Modalités confirmées avec le conseiller'),
  'Bonjour GamaDigit, je souhaite recevoir les informations et les modalités d’inscription pour ' || s.name || '.',
  'Programme proposé par GamaDigit avec notre partenaire formateur spécialisé.',
  s.is_featured,
  s.sort_order,
  'published',
  now()
from seed s
join public.training_categories c on c.slug = s.category_slug
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  kind = excluded.kind,
  excerpt = excluded.excerpt,
  description = excluded.description,
  highlights = excluded.highlights,
  whatsapp_message = excluded.whatsapp_message,
  partner_label = excluded.partner_label,
  is_featured = excluded.is_featured,
  sort_order = excluded.sort_order,
  status = excluded.status,
  published_at = excluded.published_at,
  updated_at = now();

update public.menu_items
set sort_order = case
  when label = 'Blog' then 50
  when label = 'Contact' then 60
  else sort_order
end,
updated_at = now()
where menu_id = (select id from public.menus where location = 'header')
  and parent_id is null
  and label in ('Blog', 'Contact');

insert into public.menu_items (menu_id, parent_id, label, url, target, sort_order, status)
select m.id, null, 'Formations', '/formations', '_self', 40, 'published'
from public.menus m
where m.location = 'header'
  and not exists (
    select 1 from public.menu_items mi
    where mi.menu_id = m.id and mi.parent_id is null and mi.url = '/formations'
  );

update public.menu_items
set status = 'archived', updated_at = now()
where url = '/services/formation-accompagnement'
  and status <> 'archived';