import type { Metadata } from 'next';
import { ZumraEnrollmentForm } from '@/components/zumra/zumra-enrollment-form';

export const metadata: Metadata = {
  title: 'Mon parcours ZUMRA — DG AFRIQUE',
  description: 'Profil, adhésion et accès au réseau ZUMRA depuis votre espace DG AFRIQUE.',
  robots: { index: false, follow: false },
};

export default function ZumraEnrollmentPage() {
  return <ZumraEnrollmentForm />;
}
