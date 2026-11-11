import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { alternates: { canonical: `/logiciels/${slug}` } };
}

export default function SoftwareDetailLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
