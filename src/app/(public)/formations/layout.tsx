import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/formations' },
};

export default function TrainingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
