import type { Metadata } from 'next';
import './globals.css';
import { getBrandAssets } from '@/lib/brand-assets';
import { siteConfig } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrandAssets();

  return {
    title: {
      default: `${siteConfig.name} — ${siteConfig.tagline}`,
      template: `%s — ${siteConfig.name}`,
    },
    description: siteConfig.description,
    icons: { icon: brand.faviconUrl },
    openGraph: {
      type: 'website',
      locale: 'fr_CI',
      siteName: siteConfig.name,
      title: `${siteConfig.name} — ${siteConfig.tagline}`,
      description: siteConfig.description,
      images: brand.socialImageUrl ? [{ url: brand.socialImageUrl }] : undefined,
    },
    twitter: {
      card: brand.socialImageUrl ? 'summary_large_image' : 'summary',
      title: `${siteConfig.name} — ${siteConfig.tagline}`,
      description: siteConfig.description,
      images: brand.socialImageUrl ? [brand.socialImageUrl] : undefined,
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
