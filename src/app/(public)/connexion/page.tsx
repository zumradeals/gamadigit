import type { Metadata } from 'next';
import { AccountLogin } from '@/components/genesis/account-login';

export const metadata: Metadata = {
  title: 'Mon espace — DG AFRIQUE',
  description: 'Créez votre compte ou connectez-vous à votre espace DG AFRIQUE.',
  robots: { index: false, follow: false },
};

export default function AccountLoginPage() {
  return <AccountLogin />;
}
