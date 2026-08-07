create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  description text not null default '',
  sector text not null,
  country text not null,
  city text,
  opportunity_type text not null default 'business' check (opportunity_type in ('business','project','supplier','buyer','investment','partnership')),
  looking_for text not null,
  status text not null default 'open' check (status in ('open','partner_search','discussion','closed')),
  publication_status public.publication_status not null default 'draft',
  contact_message text,
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.partnership_inquiries (
  id uuid primary key default gen_random_uuid(),
  inquiry_type text not null check (inquiry_type in ('investor','partner')),
  organization text not null,
  full_name text not null,
  phone text not null,
  email text,
  country text not null,
  sectors text,
  criteria text,
  message text not null,
  status text not null default 'new' check (status in ('new','reviewing','contacted','matched','closed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger opportunities_touch before update on public.opportunities for each row execute function public.touch_updated_at();
create trigger partnership_inquiries_touch before update on public.partnership_inquiries for each row execute function public.touch_updated_at();

alter table public.opportunities enable row level security;
alter table public.partnership_inquiries enable row level security;

create policy "opportunities_public_read" on public.opportunities
for select using (publication_status = 'published' and (published_at is null or published_at <= now()));

create policy "opportunities_admin_all" on public.opportunities
for all using (public.is_admin()) with check (public.is_admin());

create policy "partnership_inquiries_public_insert" on public.partnership_inquiries
for insert with check (
  char_length(organization) >= 2 and
  char_length(full_name) >= 2 and
  char_length(phone) >= 6 and
  char_length(country) >= 2 and
  char_length(message) >= 10
);

create policy "partnership_inquiries_admin_all" on public.partnership_inquiries
for all using (public.is_admin()) with check (public.is_admin());

create index opportunities_status_idx on public.opportunities(publication_status, status, sort_order);
create index opportunities_sector_idx on public.opportunities(sector);
create index opportunities_country_idx on public.opportunities(country);
create index partnership_inquiries_type_status_idx on public.partnership_inquiries(inquiry_type, status, created_at desc);
