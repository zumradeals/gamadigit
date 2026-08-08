import type { Metadata } from 'next';
import { AccountSpace } from '@/components/genesis/account-space';

export const metadata: Metadata = {
  title: 'Mon espace — DG AFRIQUE',
  description: 'Votre espace personnel DG AFRIQUE.',
  robots: { index: false, follow: false },
};

export default function AccountSpacePage() {
  return <AccountSpace />;
}
