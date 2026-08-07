alter table public.opportunities
  add column if not exists submitter_name text,
  add column if not exists submitter_organization text,
  add column if not exists submitter_phone text,
  add column if not exists submitter_email text,
  add column if not exists submission_source text not null default 'admin'
    check (submission_source in ('admin', 'public'));

create policy "opportunities_public_insert_draft" on public.opportunities
for insert with check (
  publication_status = 'draft' and
  status = 'open' and
  submission_source = 'public' and
  published_at is null and
  char_length(title) >= 5 and
  char_length(summary) >= 10 and
  char_length(sector) >= 2 and
  char_length(country) >= 2 and
  char_length(looking_for) >= 5 and
  char_length(coalesce(submitter_name, '')) >= 2 and
  char_length(coalesce(submitter_phone, '')) >= 6
);

create index if not exists opportunities_submission_source_idx
  on public.opportunities(submission_source, publication_status, created_at desc);
