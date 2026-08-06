insert into public.menus (name, location, status)
values
  ('Navigation principale', 'header', 'published'),
  ('Navigation du pied de page', 'footer', 'published')
on conflict (location) do nothing;

with header_menu as (
  select id from public.menus where location = 'header'
)
insert into public.menu_items (menu_id, parent_id, label, url, sort_order, status)
select header_menu.id, null::uuid, values_table.label, values_table.url, values_table.sort_order, 'published'::public.publication_status
from header_menu
cross join (
  values
    ('Accueil', '/', 10),
    ('Services', '#services', 20),
    ('Blog', '/blog', 30),
    ('Contact', '/contact', 40)
) as values_table(label, url, sort_order);

with header_menu as (
  select id from public.menus where location = 'header'
), parent_item as (
  select id, menu_id from public.menu_items
  where label = 'Services' and menu_id = (select id from header_menu)
  order by created_at asc
  limit 1
)
insert into public.menu_items (menu_id, parent_id, label, url, sort_order, status)
select parent_item.menu_id, parent_item.id, values_table.label, values_table.url, values_table.sort_order, 'published'::public.publication_status
from parent_item
cross join (
  values
    ('Web & applications', '/services/creation-web-applications', 10),
    ('Design & communication', '/services/design-communication', 20),
    ('Cloud & infrastructure', '/services/hebergement-infrastructure', 30),
    ('Logiciels & abonnements', '/services/logiciels-abonnements', 40),
    ('Formation', '/services/formation-accompagnement', 50),
    ('Solutions entreprises', '/services/solutions-entreprises', 60)
) as values_table(label, url, sort_order);

with footer_menu as (
  select id from public.menus where location = 'footer'
)
insert into public.menu_items (menu_id, parent_id, label, url, sort_order, status)
select footer_menu.id, null::uuid, values_table.label, values_table.url, values_table.sort_order, 'published'::public.publication_status
from footer_menu
cross join (
  values
    ('Blog', '/blog', 10),
    ('Demander un devis', '/contact', 20),
    ('Administration', '/admin', 30)
) as values_table(label, url, sort_order);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "gamadigit_media_public_read"
on storage.objects for select
using (bucket_id = 'media');

create policy "gamadigit_media_admin_insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'media' and public.is_admin());

create policy "gamadigit_media_admin_update"
on storage.objects for update
to authenticated
using (bucket_id = 'media' and public.is_admin())
with check (bucket_id = 'media' and public.is_admin());

create policy "gamadigit_media_admin_delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'media' and public.is_admin());
