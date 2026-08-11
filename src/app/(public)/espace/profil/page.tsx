import type { Metadata } from 'next';
import { CapabilityProfileForm } from '@/components/profile/capability-profile-form';

export const metadata: Metadata = {
  title: 'Mon profil — DG AFRIQUE',
  description: 'Décrivez ce que vous savez faire, ce que vous voulez apprendre et ce que vous cherchez à accomplir.',
  robots: { index: false, follow: false },
};

export default function CapabilityProfilePage() {
  return <CapabilityProfileForm />;
}
