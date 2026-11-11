import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partenaires',
  description: 'Entreprises, experts, réseaux, institutions et investisseurs peuvent présenter une proposition de collaboration à DG AFRIQUE.',
  alternates: { canonical: '/investisseurs-partenaires' },
};

export default function PartnersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
