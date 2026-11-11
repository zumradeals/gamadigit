import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AccountSpace } from '@/components/genesis/account-space';
import {
  federationContinuePath,
  federationReturnCookie,
  isFederationSatelliteKey,
} from '@/lib/federation/satellites';

export const metadata: Metadata = {
  title: 'Mon espace — DG AFRIQUE',
  description: 'Votre espace personnel DG AFRIQUE.',
  robots: { index: false, follow: false },
};

export default async function AccountSpacePage() {
  const jar = await cookies();
  const pendingSatellite = jar.get(federationReturnCookie.name)?.value;

  if (isFederationSatelliteKey(pendingSatellite)) {
    redirect(federationContinuePath(pendingSatellite));
  }

  return <AccountSpace />;
}
