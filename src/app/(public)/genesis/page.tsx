import type { Metadata } from 'next';
import { PortalShell } from '@/components/genesis/portal-shell';

export const metadata: Metadata = {
  title: 'Portal Genesis',
  description: 'Prototype du futur portail DG AFRIQUE connecté progressivement à l’écosystème GAMAD.',
};

export default function GenesisPage() {
  return <PortalShell />;
}
