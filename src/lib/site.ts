export const siteConfig = {
  name: 'GamaDigit',
  tagline: 'Le numérique qui fait avancer vos projets.',
  description:
    'Sites web, applications, design, hébergement, logiciels, formations et solutions numériques pour particuliers, professionnels et entreprises.',
  location: 'Abidjan, Côte d’Ivoire',
  email: 'contact@gamadigit.com',
  phone: '+225 07 18 71 37 81',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2250718713781',
  ecosystem: 'Un satellite de l’écosystème GAMAD',
};

export function whatsappUrl(message: string) {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}
