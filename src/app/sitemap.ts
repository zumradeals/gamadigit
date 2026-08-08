import type { MetadataRoute } from 'next';
import {
  getPublicBlogPosts,
  getPublicFamilies,
  getPublicSoftwareProducts,
} from '@/lib/public-content';
import { siteConfig } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;
  const now = new Date();
  const [families, posts, products] = await Promise.all([
    getPublicFamilies(),
    getPublicBlogPosts(),
    getPublicSoftwareProducts(),
  ]);

  return [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/a-propos`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/pole-numerique`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/opportunites`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/investisseurs-partenaires`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/logiciels`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/formations`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ...families
      .filter((family) => !['logiciels-abonnements', 'formation-accompagnement'].includes(family.slug))
      .map((family) => ({
        url: `${baseUrl}/services/${family.slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.75,
      })),
    ...products.map((product) => ({
      url: `${baseUrl}/logiciels/${product.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
