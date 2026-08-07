export const siteConfig = {
  name: 'DG AFRIQUE',
  longName: 'Développement Global Afrique',
  tagline: 'Des solutions pour faire avancer l’Afrique.',
  description:
    'DG AFRIQUE structure et développe des solutions, services et pôles spécialisés pour accompagner les projets, les professionnels et les entreprises en Afrique.',
  location: 'Abidjan, Côte d’Ivoire',
  email: 'contact@gamadigit.com',
  phone: '+225 07 18 71 37 81',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2250718713781',
  ecosystem: 'Développement Global Afrique',
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
