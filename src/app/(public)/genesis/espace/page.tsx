import type { Metadata } from 'next';
import { AccountSpace } from '@/components/genesis/account-space';

export const metadata: Metadata = {
  title: 'Mon espace — Compte GAMAD | DG AFRIQUE',
  description: 'Espace personnel du portail DG AFRIQUE relié au GAMAD Core.',
  robots: { index: false, follow: false },
};

export default function GenesisAccountSpacePage() {
  return <AccountSpace />;
}
