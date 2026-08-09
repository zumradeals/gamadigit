import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AccountLogin } from '@/components/genesis/account-login';
import { parsePortalSession, portalAccountCookie } from '@/lib/gamad-core/account';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mon espace — DG AFRIQUE',
  description: 'Créez votre compte ou connectez-vous à votre espace DG AFRIQUE.',
  robots: { index: false, follow: false },
};

export default async function AccountLoginPage() {
  const jar = await cookies();
  const session = parsePortalSession(jar.get(portalAccountCookie.name)?.value);

  if (session) {
    redirect('/espace');
  }

  return <AccountLogin />;
}
