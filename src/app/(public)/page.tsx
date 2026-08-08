import type { Metadata } from 'next';
import { PortalShell } from '@/components/genesis/portal-shell';

export const metadata: Metadata = {
  title: 'DG AFRIQUE — Le portail',
  description: 'Information, opportunités, technologies, organisations et services réunis dans une même porte d’entrée professionnelle pour l’Afrique.',
};

export default function HomePage() {
  return <PortalShell />;
}
