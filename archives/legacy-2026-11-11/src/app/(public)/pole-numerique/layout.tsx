import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/pole-numerique' },
};

export default function DigitalPoleLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
