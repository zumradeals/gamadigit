import type { MetadataRoute } from 'next';
import { getPublicBlogPosts, getPublicFamilies } from '@/lib/public-content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gamadigit.com';
  const now = new Date();
  const [families, posts] = await Promise.all([
    getPublicFamilies(),
    getPublicBlogPosts(),
  ]);

  return [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/logiciels`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    ...families
      .filter((family) => family.slug !== 'logiciels-abonnements')
      .map((family) => ({
        url: `${baseUrl}/services/${family.slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
