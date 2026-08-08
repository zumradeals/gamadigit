import type { Metadata } from 'next';
import { ZumraEnrollmentForm } from '@/components/zumra/zumra-enrollment-form';

export const metadata: Metadata = {
  title: 'Programme ZUMRA — Mon espace',
  description: 'Adhesion et profil personnel du Programme ZUMRA.',
  robots: { index: false, follow: false },
};

export default function ZumraEnrollmentPage() {
  return <ZumraEnrollmentForm />;
}
