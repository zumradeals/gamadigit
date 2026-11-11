import type { Metadata } from 'next';
import { ZumraPaymentStatus } from '@/components/zumra/zumra-payment-status';

export const metadata: Metadata = {
  title: 'Paiement ZUMRA — Sandbox',
  description: 'Confirmation du paiement d’adhesion au Programme ZUMRA.',
  robots: { index: false, follow: false },
};

export default function ZumraPaymentPage() {
  return <ZumraPaymentStatus />;
}
