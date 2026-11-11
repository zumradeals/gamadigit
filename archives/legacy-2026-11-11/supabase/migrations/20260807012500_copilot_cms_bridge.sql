alter table public.services
  add column if not exists target_audience jsonb not null default '[]'::jsonb;

alter table public.services
  add column if not exists key_points jsonb not null default '[]'::jsonb;

alter table public.services
  add column if not exists social_content jsonb not null default '{}'::jsonb;

alter table public.services
  add column if not exists source_generation_id uuid references public.ai_generations(id) on delete set null;

alter table public.blog_posts
  add column if not exists social_content jsonb not null default '{}'::jsonb;

alter table public.blog_posts
  add column if not exists source_generation_id uuid references public.ai_generations(id) on delete set null;

alter table public.ai_generations
  add column if not exists target_type text check (target_type in ('service', 'blog_post'));

alter table public.ai_generations
  add column if not exists target_id uuid;

alter table public.ai_generations
  add column if not exists target_url text;

create index if not exists services_source_generation_id_idx
  on public.services(source_generation_id);

create index if not exists blog_posts_source_generation_id_idx
  on public.blog_posts(source_generation_id);

create index if not exists ai_generations_target_idx
  on public.ai_generations(target_type, target_id);
