export const siteConfig = {
  name: 'DG AFRIQUE',
  longName: 'Développement Global Afrique',
  url: 'https://www.dgafrique.com',
  tagline: 'Des solutions pour faire avancer l’Afrique.',
  description:
    'DG AFRIQUE développe des solutions numériques, accompagne des projets, met en relation des acteurs et construit progressivement un réseau de partenaires pour le développement en Afrique.',
  location: 'Abidjan, Côte d’Ivoire',
  email: 'contact@dgafrique.com',
  phone: '+225 07 18 71 37 81',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2250718713781',
  ecosystem: 'Développement Global Afrique',
};

export const dgAfricaColors = {
  navy: '#0B1F33',
  gold: '#C89B3C',
  green: '#2E6B4A',
  ivory: '#F7F5EF',
};

export const digitalPoleConfig = {
  name: 'Pôle numérique',
  tagline: 'Le numérique au service de vos projets.',
  description:
    'Le pôle numérique de DG AFRIQUE rassemble logiciels, abonnements, formations, web, applications, design, hébergement et solutions numériques.',
};

// Alias temporaire pour préserver la compatibilité interne pendant la migration du code.
export const gamadigitConfig = digitalPoleConfig;

export function whatsappUrl(message: string) {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}
