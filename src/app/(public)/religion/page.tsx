import type { Metadata } from 'next';
import { UniversePage } from '@/components/portal/universe-page';
import { portalUniverses } from '@/lib/portal-universes';

const universe = portalUniverses.religion;
export const metadata: Metadata = { title: `${universe.label} — DG AFRIQUE`, description: universe.description };
export default function ReligionPage() { return <UniversePage universe={universe} />; }
