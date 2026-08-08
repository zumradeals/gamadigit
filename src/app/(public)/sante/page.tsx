import type { Metadata } from 'next';
import { UniversePage } from '@/components/portal/universe-page';
import { portalUniverses } from '@/lib/portal-universes';

const universe = portalUniverses.sante;

export const metadata: Metadata = {
  title: `${universe.label} — DG AFRIQUE`,
  description: universe.description,
};

export default function SantePage() {
  return <UniversePage universe={universe} />;
}
