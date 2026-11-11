import { createSupabaseServerClient } from '@/lib/supabase/server';

export type HeroContent = {
  badge: string;
  title: string;
  highlight: string;
  description: string;
  primaryLabel: string;
  primaryMessage: string;
  secondaryLabel: string;
};

export type ProcessStep = {
  number: string;
  title: string;
  text: string;
};

export type HomepageSectionName =
  | 'hero'
  | 'promises'
  | 'process'
  | 'familiesIntro'
  | 'softwareIntro'
  | 'offersIntro'
  | 'blogIntro'
  | 'finalCta';

export type HomepageContent = {
  hero: HeroContent;
  promises: { items: string[] };
  process: { eyebrow: string; title: string; steps: ProcessStep[] };
  familiesIntro: { eyebrow: string; title: string; description: string };
  softwareIntro: {
    eyebrow: string;
    title: string;
    description: string;
    linkLabel: string;
    whatsappLabel: string;
    whatsappMessage: string;
  };
  offersIntro: { eyebrow: string; title: string; linkLabel: string };
  blogIntro: { eyebrow: string; title: string; description: string };
  finalCta: { title: string; description: string; buttonLabel: string; whatsappMessage: string };
  visible: Record<HomepageSectionName, boolean>;
};

const defaultVisibility: Record<HomepageSectionName, boolean> = {
  hero: true,
  promises: true,
  process: true,
  familiesIntro: true,
  softwareIntro: true,
  offersIntro: true,
  blogIntro: true,
  finalCta: true,
};

export const defaultHomepageContent: HomepageContent = {
  hero: {
    badge: 'Un satellite de l’écosystème GAMAD',
    title: 'Le numérique qui fait avancer vos projets.',
    highlight: 'vos projets.',
    description:
      'Sites web, applications, design, hébergement, logiciels et formations : une équipe unique pour transformer vos besoins en solutions concrètes.',
    primaryLabel: 'Démarrer mon projet',
    primaryMessage: 'Bonjour GamaDigit, je souhaite discuter de mon projet numérique.',
    secondaryLabel: 'Explorer nos solutions',
  },
  promises: {
    items: ['Conseil avant engagement', 'Devis clair', 'Accompagnement en français'],
  },
  process: {
    eyebrow: 'Votre projet, bien orienté',
    title: 'Une solution cohérente, pas une accumulation d’outils.',
    steps: [
      { number: '01', title: 'Comprendre', text: 'Votre besoin, votre public et votre priorité.' },
      { number: '02', title: 'Concevoir', text: 'Une offre adaptée, expliquée et chiffrée.' },
      { number: '03', title: 'Déployer', text: 'Mise en ligne, formation et suivi.' },
    ],
  },
  familiesIntro: {
    eyebrow: 'Six familles, une seule direction',
    title: 'Tout ce qu’il faut pour construire une présence numérique utile.',
    description:
      'La version minimale démarre avec des offres simples dans chaque famille, puis évolue selon les besoins réels des clients.',
  },
  softwareIntro: {
    eyebrow: 'Logiciels et abonnements',
    title: 'Équipez-vous pour apprendre, pratiquer et travailler.',
    description:
      'Découvrez une sélection de logiciels professionnels pour le bâtiment, l’architecture, la structure et l’industrie. Contactez-nous sur WhatsApp pour connaître la formule disponible, le tarif et la formation associée.',
    linkLabel: 'Voir tous les logiciels',
    whatsappLabel: 'Demander conseil sur WhatsApp',
    whatsappMessage: 'Bonjour GamaDigit, je recherche un logiciel professionnel et je souhaite être conseillé.',
  },
  offersIntro: {
    eyebrow: 'Commencer simplement',
    title: 'Nos premières offres essentielles',
    linkLabel: 'Demander une orientation',
  },
  blogIntro: {
    eyebrow: 'Conseils et ressources',
    title: 'Le blog GamaDigit',
    description:
      'Des explications simples pour mieux choisir, lancer et faire évoluer vos outils numériques.',
  },
  finalCta: {
    title: 'Un projet à lancer ou à structurer ?',
    description:
      'Expliquez-nous votre objectif. Nous vous orientons vers la première solution utile, sans vous imposer une offre trop complexe.',
    buttonLabel: 'Présenter mon projet',
    whatsappMessage: 'Bonjour GamaDigit, voici le projet que je souhaite lancer : ',
  },
  visible: defaultVisibility,
};

const sectionMap = {
  hero: 'hero',
  promises: 'promises',
  process: 'process',
  families_intro: 'familiesIntro',
  software_intro: 'softwareIntro',
  offers_intro: 'offersIntro',
  blog_intro: 'blogIntro',
  final_cta: 'finalCta',
} as const;

export async function getHomepageContent(): Promise<HomepageContent> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return structuredClone(defaultHomepageContent);

  const { data, error } = await supabase
    .from('page_sections')
    .select('section_key, payload')
    .eq('page_slug', 'home')
    .eq('status', 'published')
    .order('sort_order');

  if (error) return structuredClone(defaultHomepageContent);

  const result: HomepageContent = structuredClone(defaultHomepageContent);
  result.visible = {
    hero: false,
    promises: false,
    process: false,
    familiesIntro: false,
    softwareIntro: false,
    offersIntro: false,
    blogIntro: false,
    finalCta: false,
  };

  for (const row of data || []) {
    const target = sectionMap[row.section_key as keyof typeof sectionMap];
    if (!target || !row.payload || typeof row.payload !== 'object') continue;
    Object.assign(result[target], row.payload);
    result.visible[target] = true;
  }
  return result;
}

export async function getAllHomepageSections() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_slug', 'home')
    .order('sort_order');
  return data || [];
}
