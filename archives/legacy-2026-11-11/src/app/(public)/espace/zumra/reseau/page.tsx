import type { Metadata } from 'next';
import { ZumraNetworkDashboard } from '@/components/zumra/zumra-network-dashboard';

export const metadata: Metadata = {
  title: 'Réseau ZUMRA — Mon espace',
  description: 'Créez, rejoignez et faites progresser vos Zumra depuis votre espace DG Afrique.',
  robots: { index: false, follow: false },
};

export default function ZumraNetworkPage() {
  return <ZumraNetworkDashboard />;
}
