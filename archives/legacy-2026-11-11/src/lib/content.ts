import type { BlogPost, ServiceFamily, ServiceItem } from '@/types/content';

export const families: ServiceFamily[] = [
  {
    id: 'fam-web',
    slug: 'creation-web-applications',
    name: 'Création web et applications',
    shortName: 'Web & applications',
    eyebrow: 'Concevoir et développer',
    description:
      'Des sites rapides, des boutiques efficaces et des applications web conçues autour de vos objectifs.',
    icon: 'code',
    accent: '#0877C9',
    status: 'published',
  },
  {
    id: 'fam-design',
    slug: 'design-communication',
    name: 'Design et communication',
    shortName: 'Design & communication',
    eyebrow: 'Donner une identité forte',
    description:
      'Logos, identités visuelles et supports de communication cohérents pour rendre votre activité mémorable.',
    icon: 'palette',
    accent: '#8B5CF6',
    status: 'published',
  },
  {
    id: 'fam-cloud',
    slug: 'hebergement-infrastructure',
    name: 'Hébergement et infrastructure',
    shortName: 'Cloud & infrastructure',
    eyebrow: 'Héberger et sécuriser',
    description:
      'Domaines, hébergement, e-mails professionnels, sauvegardes et maintenance pour une présence fiable.',
    icon: 'cloud',
    accent: '#19C2D0',
    status: 'published',
  },
  {
    id: 'fam-software',
    slug: 'logiciels-abonnements',
    name: 'Logiciels et abonnements',
    shortName: 'Logiciels & abonnements',
    eyebrow: 'Équiper votre activité',
    description:
      'Des solutions logicielles sélectionnées, expliquées et accompagnées avant et après la commande.',
    icon: 'package',
    accent: '#F59E0B',
    status: 'published',
  },
  {
    id: 'fam-training',
    slug: 'formation-accompagnement',
    name: 'Formation et accompagnement',
    shortName: 'Formation',
    eyebrow: 'Développer les compétences',
    description:
      'Des formations pratiques, en ligne ou en présentiel, pour mieux utiliser les outils numériques.',
    icon: 'graduation',
    accent: '#21C87A',
    status: 'published',
  },
  {
    id: 'fam-business',
    slug: 'solutions-entreprises',
    name: 'Solutions numériques pour entreprises',
    shortName: 'Solutions entreprises',
    eyebrow: 'Structurer et faire grandir',
    description:
      'Des packs et solutions sur mesure pour digitaliser les opérations, les équipes et la relation client.',
    icon: 'building',
    accent: '#0F3D5E',
    status: 'published',
  },
];

export const services: ServiceItem[] = [
  {
    id: 'srv-site-vitrine',
    slug: 'site-vitrine-professionnel',
    familySlug: 'creation-web-applications',
    name: 'Site vitrine professionnel',
    excerpt: 'Présentez clairement votre activité et recevez des demandes depuis le web.',
    description:
      'Une présence web moderne, adaptée au mobile et structurée pour transformer les visiteurs en prospects.',
    priceLabel: 'Sur devis',
    deliveryLabel: 'Délai selon le projet',
    features: ['3 à 5 pages essentielles', 'Formulaire et WhatsApp', 'SEO technique de base'],
    featured: true,
    status: 'published',
  },
  {
    id: 'srv-logo',
    slug: 'logo-identite-visuelle',
    familySlug: 'design-communication',
    name: 'Logo et identité visuelle',
    excerpt: 'Construisez une image professionnelle, cohérente et reconnaissable.',
    description:
      'Un système visuel utilisable sur le web, les réseaux sociaux, les documents et les supports imprimés.',
    priceLabel: 'Sur devis',
    deliveryLabel: 'Délai selon le pack',
    features: ['Logo principal', 'Palette et typographies', 'Déclinaisons essentielles'],
    featured: true,
    status: 'published',
  },
  {
    id: 'srv-hosting',
    slug: 'domaine-hebergement-email',
    familySlug: 'hebergement-infrastructure',
    name: 'Domaine, hébergement et e-mail',
    excerpt: 'Une base fiable pour publier votre site et communiquer au nom de votre entreprise.',
    description:
      'Nous préparons les éléments essentiels de votre présence en ligne et vous accompagnons dans leur gestion.',
    priceLabel: 'Sur devis',
    deliveryLabel: 'Mise en service accompagnée',
    features: ['Nom de domaine', 'SSL et hébergement', 'Adresse e-mail professionnelle'],
    featured: true,
    status: 'published',
  },
  {
    id: 'srv-software',
    slug: 'logiciels-professionnels',
    familySlug: 'logiciels-abonnements',
    name: 'Logiciels professionnels',
    excerpt: 'Choisissez une solution adaptée à votre métier, votre appareil et votre usage.',
    description:
      'Chaque demande est vérifiée avant paiement : compatibilité, durée, utilisateurs, installation et support.',
    priceLabel: 'Catalogue et devis',
    deliveryLabel: 'Selon disponibilité',
    features: ['Conseil avant achat', 'Conditions précisées', 'Assistance en français'],
    featured: true,
    status: 'published',
  },
  {
    id: 'srv-training',
    slug: 'formation-pratique',
    familySlug: 'formation-accompagnement',
    name: 'Formation pratique',
    excerpt: 'Apprenez avec un programme concret, des exercices et un accompagnement humain.',
    description:
      'Des initiations et parcours ciblés pour particuliers, professionnels, équipes et organisations.',
    priceLabel: 'Sur devis',
    deliveryLabel: 'En ligne ou en présentiel',
    features: ['Programme défini', 'Exercices pratiques', 'Attestation de participation'],
    featured: true,
    status: 'published',
  },
  {
    id: 'srv-business',
    slug: 'pack-presence-numerique',
    familySlug: 'solutions-entreprises',
    name: 'Pack présence numérique',
    excerpt: 'Regroupez site, identité, e-mails et assistance dans une offre cohérente.',
    description:
      'Une solution minimale pour permettre à une entreprise de se présenter, communiquer et être contactée en ligne.',
    priceLabel: 'Sur devis',
    deliveryLabel: 'Planning personnalisé',
    features: ['Site professionnel', 'Identité essentielle', 'E-mails et accompagnement'],
    featured: true,
    status: 'published',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: 'post-site',
    slug: 'pourquoi-entreprise-besoin-site-web',
    title: 'Pourquoi votre entreprise a besoin d’un site web professionnel',
    excerpt:
      'Un site ne remplace pas vos réseaux sociaux : il devient le point central de votre présence numérique.',
    category: 'Sites web',
    publishedAt: '6 août 2026',
    readTime: '5 min',
    content: [
      'Un site web professionnel donne à votre activité une adresse stable, accessible à tout moment et indépendante des changements d’une plateforme sociale.',
      'Il permet de présenter vos offres avec clarté, de rassurer les prospects et de recueillir des demandes grâce à des formulaires, WhatsApp ou d’autres canaux.',
      'La bonne première version n’est pas forcément complexe : quelques pages utiles, un message clair et une expérience mobile soignée peuvent déjà produire de la valeur.',
    ],
    status: 'published',
  },
  {
    id: 'post-hosting',
    slug: 'choisir-hebergement-web',
    title: 'Comment choisir un hébergement web sans se compliquer la vie',
    excerpt:
      'Performance, sauvegardes, sécurité et accompagnement : les critères essentiels avant le prix.',
    category: 'Hébergement',
    publishedAt: '6 août 2026',
    readTime: '4 min',
    content: [
      'Un bon hébergement doit être adapté au type de site, au volume de visiteurs et aux besoins de maintenance.',
      'Il faut vérifier la présence du certificat SSL, la fréquence des sauvegardes, la disponibilité du support et les conditions de renouvellement.',
      'Pour une petite entreprise, une offre simple mais bien administrée est souvent préférable à un serveur puissant laissé sans surveillance.',
    ],
    status: 'published',
  },
  {
    id: 'post-training',
    slug: 'logiciel-formation-pack-complet',
    title: 'Logiciel et formation : pourquoi le pack complet est souvent plus rentable',
    excerpt:
      'L’outil crée de la valeur seulement lorsqu’il est compris, adopté et utilisé dans les vrais projets.',
    category: 'Formation',
    publishedAt: '6 août 2026',
    readTime: '4 min',
    content: [
      'Acheter un outil sans prévoir sa prise en main peut entraîner des blocages, une mauvaise utilisation ou un abandon rapide.',
      'Une initiation ciblée réduit ce risque et permet de relier immédiatement les fonctions du logiciel aux besoins du métier.',
      'Le meilleur accompagnement combine conseil avant achat, installation, formation pratique et support après la session.',
    ],
    status: 'published',
  },
];

export function familyBySlug(slug: string) {
  return families.find((family) => family.slug === slug && family.status === 'published');
}

export function servicesByFamily(slug: string) {
  return services.filter(
    (service) => service.familySlug === slug && service.status === 'published'
  );
}

export function blogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug && post.status === 'published');
}
