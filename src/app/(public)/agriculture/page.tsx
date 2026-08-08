import type { Metadata } from 'next';
import { UniversePage } from '@/components/portal/universe-page';
import { portalUniverses } from '@/lib/portal-universes';

const universe = portalUniverses.agriculture;

export const metadata: Metadata = {
  title: `${universe.label} — DG AFRIQUE`,
  description: universe.description,
};

export default function AgriculturePage() {
  return <UniversePage universe={universe} />;
}
