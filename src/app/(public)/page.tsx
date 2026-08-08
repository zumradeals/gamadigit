import type { Metadata } from 'next';
import { PortalShell } from '@/components/genesis/portal-shell';

export const metadata: Metadata = {
  title: 'DG AFRIQUE — Des solutions pour faire avancer l’Afrique',
  description: 'DG AFRIQUE développe des solutions numériques, accompagne des projets, met en relation des acteurs et construit progressivement un réseau de partenaires pour le développement en Afrique.',
};

export default function HomePage() {
  return <PortalShell />;
}
