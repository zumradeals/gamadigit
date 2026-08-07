create table if not exists public.ai_providers (
  provider_key text primary key check (provider_key in ('deepseek', 'openai', 'anthropic')),
  display_name text not null,
  api_style text not null check (api_style in ('openai_chat', 'openai_responses', 'anthropic_messages')),
  base_url text not null,
  model text not null,
  enabled boolean not null default false,
  priority integer not null default 100,
  secret_id uuid,
  last_tested_at timestamptz,
  last_test_status text check (last_test_status in ('success', 'error')),
  last_test_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_settings (
  id text primary key default 'main',
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  content_type text not null check (content_type in ('product', 'article', 'social')),
  language text not null default 'fr',
  tone text not null default 'commercial',
  provider_key text not null references public.ai_providers(provider_key) on delete restrict,
  model text not null,
  brief text not null,
  result jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

insert into public.ai_providers (provider_key, display_name, api_style, base_url, model, enabled, priority)
values
  ('deepseek', 'DeepSeek', 'openai_chat', 'https://api.deepseek.com', 'deepseek-v4-flash', false, 10),
  ('openai', 'OpenAI', 'openai_responses', 'https://api.openai.com/v1', 'gpt-5-mini', false, 20),
  ('anthropic', 'Claude / Anthropic', 'anthropic_messages', 'https://api.anthropic.com/v1', 'claude-sonnet-4-20250514', false, 30)
on conflict (provider_key) do nothing;

insert into public.ai_settings (id, payload)
values (
  'main',
  jsonb_build_object(
    'brandName', 'GamaDigit',
    'defaultLanguage', 'fr',
    'defaultTone', 'commercial',
    'brandVoice', 'Clair, professionnel, rassurant, accessible et orienté vers WhatsApp.',
    'businessContext', 'GamaDigit vend des logiciels et abonnements, propose des formations professionnelles et réalise des services numériques.',
    'editorialRules', 'Ne jamais inventer un prix, une durée, une disponibilité, une certification, un nombre d’appareils ou une condition commerciale. Utiliser uniquement les faits fournis dans le brief.'
  )
)
on conflict (id) do nothing;

create trigger ai_providers_touch before update on public.ai_providers
for each row execute function public.touch_updated_at();

create trigger ai_settings_touch before update on public.ai_settings
for each row execute function public.touch_updated_at();

alter table public.ai_providers enable row level security;
alter table public.ai_settings enable row level security;
alter table public.ai_generations enable row level security;

create policy "ai_providers_admin_all" on public.ai_providers
for all using (public.is_admin()) with check (public.is_admin());

create policy "ai_settings_admin_all" on public.ai_settings
for all using (public.is_admin()) with check (public.is_admin());

create policy "ai_generations_admin_all" on public.ai_generations
for all using (public.is_admin()) with check (public.is_admin());

create or replace function public.admin_set_ai_provider_secret(
  p_provider_key text,
  p_secret text
)
returns boolean
language plpgsql
security definer
set search_path = public, vault, pg_temp
as $$
declare
  v_secret_id uuid;
  v_secret_name text;
begin
  if not public.is_admin() then
    raise exception 'Accès administrateur requis.';
  end if;

  if p_secret is null or char_length(trim(p_secret)) < 8 then
    raise exception 'La clé API fournie est invalide.';
  end if;

  select secret_id into v_secret_id
  from public.ai_providers
  where provider_key = p_provider_key
  for update;

  if not found then
    raise exception 'Fournisseur IA inconnu.';
  end if;

  v_secret_name := 'gamadigit_ai_' || p_provider_key;

  if v_secret_id is null then
    select id into v_secret_id
    from vault.secrets
    where name = v_secret_name
    limit 1;
  end if;

  if v_secret_id is null then
    select vault.create_secret(
      trim(p_secret),
      v_secret_name,
      'Clé API du fournisseur ' || p_provider_key || ' pour GamaDigit Copilote'
    ) into v_secret_id;
  else
    perform vault.update_secret(
      v_secret_id,
      trim(p_secret),
      v_secret_name,
      'Clé API du fournisseur ' || p_provider_key || ' pour GamaDigit Copilote'
    );
  end if;

  update public.ai_providers
  set secret_id = v_secret_id,
      last_tested_at = null,
      last_test_status = null,
      last_test_message = null
  where provider_key = p_provider_key;

  return true;
end;
$$;

create or replace function public.admin_delete_ai_provider_secret(
  p_provider_key text
)
returns boolean
language plpgsql
security definer
set search_path = public, vault, pg_temp
as $$
declare
  v_secret_id uuid;
begin
  if not public.is_admin() then
    raise exception 'Accès administrateur requis.';
  end if;

  select secret_id into v_secret_id
  from public.ai_providers
  where provider_key = p_provider_key
  for update;

  if not found then
    raise exception 'Fournisseur IA inconnu.';
  end if;

  update public.ai_providers
  set secret_id = null,
      enabled = false,
      last_tested_at = null,
      last_test_status = null,
      last_test_message = null
  where provider_key = p_provider_key;

  if v_secret_id is not null then
    delete from vault.secrets where id = v_secret_id;
  end if;

  return true;
end;
$$;

create or replace function public.admin_get_ai_provider_runtime(
  p_provider_key text default null
)
returns table (
  provider_key text,
  display_name text,
  api_style text,
  base_url text,
  model text,
  api_key text
)
language plpgsql
security definer
set search_path = public, vault, pg_temp
as $$
begin
  if not public.is_admin() then
    raise exception 'Accès administrateur requis.';
  end if;

  return query
  select
    p.provider_key,
    p.display_name,
    p.api_style,
    p.base_url,
    p.model,
    s.decrypted_secret
  from public.ai_providers p
  left join vault.decrypted_secrets s on s.id = p.secret_id
  where (p_provider_key is null and p.enabled = true)
     or (p_provider_key is not null and p.provider_key = p_provider_key)
  order by p.priority asc
  limit 1;
end;
$$;

revoke all on function public.admin_set_ai_provider_secret(text, text) from public;
revoke all on function public.admin_delete_ai_provider_secret(text) from public;
revoke all on function public.admin_get_ai_provider_runtime(text) from public;

grant execute on function public.admin_set_ai_provider_secret(text, text) to authenticated;
grant execute on function public.admin_delete_ai_provider_secret(text) to authenticated;
grant execute on function public.admin_get_ai_provider_runtime(text) to authenticated;
