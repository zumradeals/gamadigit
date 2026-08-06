insert into public.service_families
  (slug, name, short_name, eyebrow, description, icon, accent, sort_order, status)
values
  ('creation-web-applications', 'Création web et applications', 'Web & applications', 'Concevoir et développer', 'Sites, boutiques et applications web autour de vos objectifs.', 'code', '#0877C9', 10, 'published'),
  ('design-communication', 'Design et communication', 'Design & communication', 'Donner une identité forte', 'Logos, identités et supports cohérents pour votre marque.', 'palette', '#8B5CF6', 20, 'published'),
  ('hebergement-infrastructure', 'Hébergement et infrastructure', 'Cloud & infrastructure', 'Héberger et sécuriser', 'Domaines, hébergement, e-mails, sauvegardes et maintenance.', 'cloud', '#19C2D0', 30, 'published'),
  ('logiciels-abonnements', 'Logiciels et abonnements', 'Logiciels & abonnements', 'Équiper votre activité', 'Solutions logicielles expliquées et accompagnées.', 'package', '#F59E0B', 40, 'published'),
  ('formation-accompagnement', 'Formation et accompagnement', 'Formation', 'Développer les compétences', 'Formations pratiques en ligne, en présentiel ou en entreprise.', 'graduation', '#21C87A', 50, 'published'),
  ('solutions-entreprises', 'Solutions numériques pour entreprises', 'Solutions entreprises', 'Structurer et faire grandir', 'Packs et solutions pour digitaliser les équipes et les opérations.', 'building', '#0F3D5E', 60, 'published')
on conflict (slug) do nothing;

insert into public.blog_categories (slug, name, description, sort_order, status)
values
  ('sites-web', 'Sites web', 'Création, refonte et performance web.', 10, 'published'),
  ('hebergement', 'Hébergement', 'Domaines, cloud, sécurité et maintenance.', 20, 'published'),
  ('formation', 'Formation', 'Compétences numériques et prise en main des outils.', 30, 'published')
on conflict (slug) do nothing;
