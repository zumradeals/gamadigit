import type { Metadata } from 'next';
import './globals.css';
import { getBrandAssets } from '@/lib/brand-assets';
import { siteConfig } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrandAssets();

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} — ${siteConfig.tagline}`,
      template: `%s — ${siteConfig.name}`,
    },
    description: siteConfig.description,
    applicationName: siteConfig.name,
    icons: { icon: brand.faviconUrl },
    openGraph: {
      type: 'website',
      locale: 'fr_CI',
      siteName: siteConfig.name,
      url: siteConfig.url,
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
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    alternateName: siteConfig.longName,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Abidjan',
      addressCountry: 'CI',
    },
    description: siteConfig.description,
  };

  return (
    <html lang="fr">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
