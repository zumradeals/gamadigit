import type { Metadata } from 'next';
import { AccountLogin } from '@/components/genesis/account-login';

export const metadata: Metadata = {
  title: 'Connexion — Compte GAMAD | DG AFRIQUE',
  description: 'Connexion au portail DG AFRIQUE avec une identité canonique GAMAD.',
  robots: { index: false, follow: false },
};

export default function GenesisAccountLoginPage() {
  return <AccountLogin />;
}
