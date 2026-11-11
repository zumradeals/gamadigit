import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AccountLogin } from '@/components/genesis/account-login';
import { safeAccountReturnPath } from '@/lib/gamad-core/account-flow';
import { parsePortalSession, portalAccountCookie } from '@/lib/gamad-core/account';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mon espace — DG AFRIQUE',
  description: 'Créez votre compte ou connectez-vous à votre espace DG AFRIQUE.',
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams?: Promise<{ next?: string | string[] }>;
};

export default async function AccountLoginPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : undefined;
  const rawNext = Array.isArray(params?.next) ? params?.next[0] : params?.next;
  const returnPath = safeAccountReturnPath(rawNext);

  const jar = await cookies();
  const session = parsePortalSession(jar.get(portalAccountCookie.name)?.value);

  if (session) {
    redirect(returnPath);
  }

  return <AccountLogin returnPath={returnPath} />;
}
