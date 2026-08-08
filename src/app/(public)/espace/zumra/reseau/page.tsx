import type { Metadata } from 'next';
import { ZumraNetworkDashboard } from '@/components/zumra/zumra-network-dashboard';

export const metadata: Metadata = {
  title: 'Reseau ZUMRA — Mon espace',
  description: 'Creez, rejoignez et developpez vos groupes de travail ZUMRA.',
  robots: { index: false, follow: false },
};

export default function ZumraNetworkPage() {
  return <ZumraNetworkDashboard />;
}
