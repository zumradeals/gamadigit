export const siteConfig = {
  name: 'DG AFRIQUE',
  longName: 'Développement Global Afrique',
  tagline: 'Des solutions pour faire avancer l’Afrique.',
  description:
    'DG AFRIQUE est une structure multisectorielle orientée commerce, courtage international, investissements, services et développement, avec GamaDigit comme pôle numérique.',
  location: 'Abidjan, Côte d’Ivoire',
  email: 'contact@gamadigit.com',
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

export const gamadigitConfig = {
  name: 'GamaDigit',
  tagline: 'Le numérique qui fait avancer vos projets.',
  description:
    'Le pôle numérique de DG AFRIQUE : logiciels, abonnements, formations, web, applications, design, hébergement et solutions numériques.',
};

export function whatsappUrl(message: string) {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}
