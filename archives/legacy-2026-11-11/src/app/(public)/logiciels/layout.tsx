import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/logiciels' },
};

export default function SoftwareLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
