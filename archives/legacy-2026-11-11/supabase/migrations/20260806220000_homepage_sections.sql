create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_slug text not null,
  section_key text not null,
  payload jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  status public.publication_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_slug, section_key)
);

create trigger page_sections_touch
before update on public.page_sections
for each row execute function public.touch_updated_at();

alter table public.page_sections enable row level security;

create policy "page_sections_public_read"
on public.page_sections for select
using (status = 'published');

create policy "page_sections_admin_all"
on public.page_sections for all
using (public.is_admin())
with check (public.is_admin());

insert into public.page_sections (page_slug, section_key, payload, sort_order, status)
values
  (
    'home',
    'hero',
    jsonb_build_object(
      'badge', 'Un satellite de l’écosystème GAMAD',
      'title', 'Le numérique qui fait avancer vos projets.',
      'highlight', 'vos projets.',
      'description', 'Sites web, applications, design, hébergement, logiciels et formations : une équipe unique pour transformer vos besoins en solutions concrètes.',
      'primaryLabel', 'Démarrer mon projet',
      'primaryMessage', 'Bonjour GamaDigit, je souhaite discuter de mon projet numérique.',
      'secondaryLabel', 'Explorer nos solutions'
    ),
    10,
    'published'
  ),
  (
    'home',
    'promises',
    jsonb_build_object(
      'items', jsonb_build_array(
        'Conseil avant engagement',
        'Devis clair',
        'Accompagnement en français'
      )
    ),
    20,
    'published'
  ),
  (
    'home',
    'process',
    jsonb_build_object(
      'eyebrow', 'Votre projet, bien orienté',
      'title', 'Une solution cohérente, pas une accumulation d’outils.',
      'steps', jsonb_build_array(
        jsonb_build_object('number', '01', 'title', 'Comprendre', 'text', 'Votre besoin, votre public et votre priorité.'),
        jsonb_build_object('number', '02', 'title', 'Concevoir', 'text', 'Une offre adaptée, expliquée et chiffrée.'),
        jsonb_build_object('number', '03', 'title', 'Déployer', 'text', 'Mise en ligne, formation et suivi.')
      )
    ),
    30,
    'published'
  ),
  (
    'home',
    'families_intro',
    jsonb_build_object(
      'eyebrow', 'Six familles, une seule direction',
      'title', 'Tout ce qu’il faut pour construire une présence numérique utile.',
      'description', 'La version minimale démarre avec des offres simples dans chaque famille, puis évolue selon les besoins réels des clients.'
    ),
    40,
    'published'
  ),
  (
    'home',
    'offers_intro',
    jsonb_build_object(
      'eyebrow', 'Commencer simplement',
      'title', 'Nos premières offres essentielles',
      'linkLabel', 'Demander une orientation'
    ),
    50,
    'published'
  ),
  (
    'home',
    'blog_intro',
    jsonb_build_object(
      'eyebrow', 'Conseils et ressources',
      'title', 'Le blog GamaDigit',
      'description', 'Des explications simples pour mieux choisir, lancer et faire évoluer vos outils numériques.'
    ),
    60,
    'published'
  ),
  (
    'home',
    'final_cta',
    jsonb_build_object(
      'title', 'Un projet à lancer ou à structurer ?',
      'description', 'Expliquez-nous votre objectif. Nous vous orientons vers la première solution utile, sans vous imposer une offre trop complexe.',
      'buttonLabel', 'Présenter mon projet',
      'whatsappMessage', 'Bonjour GamaDigit, voici le projet que je souhaite lancer : '
    ),
    70,
    'published'
  )
on conflict (page_slug, section_key) do nothing;
