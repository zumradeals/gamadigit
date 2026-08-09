import type { Metadata } from 'next';
import { ZumraGroupDashboard } from '@/components/zumra/zumra-group-dashboard';

export const metadata: Metadata = {
  title: 'Ma Zumra — Mon espace',
  description: 'Suivez les membres, responsabilités et la progression de votre Zumra.',
  robots: { index: false, follow: false },
};

export default async function ZumraGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ZumraGroupDashboard groupId={id} />;
}
