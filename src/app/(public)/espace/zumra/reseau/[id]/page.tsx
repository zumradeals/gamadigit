import type { Metadata } from 'next';
import { ZumraGroupDashboard } from '@/components/zumra/zumra-group-dashboard';

export const metadata: Metadata = {
  title: 'Ma Zumra — Mon espace',
  description: 'Gestion de votre groupe de travail ZUMRA.',
  robots: { index: false, follow: false },
};

export default async function ZumraGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ZumraGroupDashboard groupId={id} />;
}
