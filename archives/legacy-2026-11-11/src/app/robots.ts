import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/connexion',
          '/espace',
          '/genesis/',
          '/economie',
          '/technologie',
          '/education',
          '/sante',
          '/agriculture',
          '/politique',
          '/religion',
          '/societe',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
