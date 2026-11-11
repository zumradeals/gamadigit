import type { Metadata } from 'next';
import { ZumraInviteAccept } from '@/components/zumra/zumra-invite-accept';

export const metadata: Metadata = {
  title: 'Invitation ZUMRA — Mon espace',
  description: 'Consultez une invitation et rejoignez une Zumra depuis votre espace DG Afrique.',
  robots: { index: false, follow: false },
};

export default async function ZumraInvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <ZumraInviteAccept token={token} />;
}
