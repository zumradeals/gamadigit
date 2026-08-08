export type PortalUniverse = {
  slug: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  themes: string[];
  primaryHref?: string;
  primaryLabel?: string;
};

export const portalUniverses: Record<string, PortalUniverse> = {
  economie: {
    slug: 'economie',
    label: 'Économie',
    eyebrow: 'Entreprises, marchés & développement',
    title: 'Comprendre les dynamiques économiques et trouver les bonnes opportunités.',
    description: 'Un espace consacré aux entreprises, aux marchés, au commerce, à l’investissement productif et aux initiatives qui créent de la valeur en Afrique.',
    themes: ['Entreprises', 'Commerce', 'Investissement', 'Marchés', 'PME & entrepreneuriat', 'Industrie'],
    primaryHref: '/opportunites',
    primaryLabel: 'Voir les opportunités',
  },
  technologie: {
    slug: 'technologie',
    label: 'Technologie',
    eyebrow: 'Innovation & transformation numérique',
    title: 'Relier les usages africains aux technologies qui peuvent les accélérer.',
    description: 'Innovation, numérique, logiciels, intelligence artificielle, infrastructures, compétences et solutions adaptées aux besoins des organisations et des particuliers.',
    themes: ['Logiciels', 'IA', 'Cloud', 'Cybersécurité', 'Infrastructures', 'Compétences numériques'],
    primaryHref: '/pole-numerique',
    primaryLabel: 'Découvrir les solutions numériques',
  },
  education: {
    slug: 'education',
    label: 'Éducation',
    eyebrow: 'Apprendre, transmettre, progresser',
    title: 'Mettre la connaissance, les compétences et la formation à portée de chacun.',
    description: 'Éducation, formation professionnelle, compétences, recherche, transmission et initiatives qui renforcent le capital humain africain.',
    themes: ['Formation', 'Compétences', 'Écoles & universités', 'Recherche', 'Orientation', 'Apprentissage'],
    primaryHref: '/formations',
    primaryLabel: 'Voir les formations',
  },
  sante: {
    slug: 'sante',
    label: 'Santé',
    eyebrow: 'Prévention, soins & innovation',
    title: 'Mieux comprendre les enjeux de santé et les solutions disponibles.',
    description: 'Prévention, systèmes de santé, innovation médicale, santé publique, initiatives locales et ressources utiles pour mieux informer les publics.',
    themes: ['Prévention', 'Santé publique', 'Innovation médicale', 'Accès aux soins', 'Bien-être', 'Systèmes de santé'],
  },
  agriculture: {
    slug: 'agriculture',
    label: 'Agriculture',
    eyebrow: 'Production, transformation & territoires',
    title: 'Valoriser les chaînes agricoles et les opportunités des territoires africains.',
    description: 'Production, transformation, distribution, agrotechnologies, marchés agricoles et initiatives qui renforcent les chaînes de valeur locales.',
    themes: ['Production', 'Transformation', 'Agro-industrie', 'AgTech', 'Marchés agricoles', 'Logistique'],
    primaryHref: '/opportunites',
    primaryLabel: 'Explorer les opportunités',
  },
  politique: {
    slug: 'politique',
    label: 'Politique',
    eyebrow: 'Institutions & politiques publiques',
    title: 'Suivre les institutions, les politiques publiques et les grandes décisions.',
    description: 'Un univers d’information consacré aux institutions, à la gouvernance, aux politiques publiques et aux transformations qui structurent les sociétés africaines.',
    themes: ['Institutions', 'Politiques publiques', 'Gouvernance', 'Territoires', 'Diplomatie', 'Vie publique'],
  },
  religion: {
    slug: 'religion',
    label: 'Religion',
    eyebrow: 'Spiritualité, connaissance & société',
    title: 'Un espace respectueux pour la connaissance religieuse et le dialogue social.',
    description: 'Spiritualité, enseignement, histoire, initiatives, dialogue et place du religieux dans les sociétés africaines, avec une approche informative et respectueuse.',
    themes: ['Spiritualité', 'Enseignement', 'Histoire', 'Dialogue', 'Société', 'Initiatives'],
  },
  societe: {
    slug: 'societe',
    label: 'Société',
    eyebrow: 'Culture, jeunesse & initiatives',
    title: 'Observer les transformations sociales et mettre en lumière les initiatives utiles.',
    description: 'Culture, jeunesse, diaspora, tendances, initiatives locales, créativité et sujets de société qui racontent les transformations du continent.',
    themes: ['Culture', 'Jeunesse', 'Diaspora', 'Initiatives', 'Création', 'Vie quotidienne'],
  },
};

export const portalUniverseList = Object.values(portalUniverses);
