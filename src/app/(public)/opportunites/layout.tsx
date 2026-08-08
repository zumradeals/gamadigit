import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Opportunités',
  description: 'Découvrez des opportunités, besoins, projets et recherches de partenaires publiés sur DG AFRIQUE, ou proposez une opportunité pour validation.',
  alternates: { canonical: '/opportunites' },
};

export default function OpportunitiesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
