import { blogPosts as fallbackPosts, families as fallbackFamilies, services as fallbackServices } from '@/lib/content';
import { siteConfig } from '@/lib/site';
import { createSupabasePublicClient } from '@/lib/supabase/public';
import type { BlogPost, ServiceFamily, ServiceItem } from '@/types/content';

export type PublicSiteSettings = typeof siteConfig;

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  const supabase = createSupabasePublicClient();
  if (!supabase) return siteConfig;
  const { data, error } = await supabase.from('site_settings').select('payload').eq('id', 'main').maybeSingle();
  if (error || !data?.payload) return siteConfig;
  const payload = data.payload as Record<string, string>;
  return {
    ...siteConfig,
    name: payload.name || siteConfig.name,
    tagline: payload.tagline || siteConfig.tagline,
    location: payload.location || siteConfig.location,
    email: payload.email || siteConfig.email,
    phone: payload.phone || siteConfig.phone,
    whatsapp: payload.whatsappNumber || siteConfig.whatsapp,
    ecosystem: payload.ecosystemLabel || siteConfig.ecosystem,
  };
}

export async function getPublicFamilies(): Promise<ServiceFamily[]> {
  const supabase = createSupabasePublicClient();
  if (!supabase) return fallbackFamilies;
  const { data, error } = await supabase
    .from('service_families')
    .select('*')
    .eq('status', 'published')
    .order('sort_order');
  if (error || !data?.length) return fallbackFamilies;
  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortName: row.short_name,
    eyebrow: row.eyebrow || '',
    description: row.description,
    icon: row.icon as ServiceFamily['icon'],
    accent: row.accent || '#0877C9',
    status: 'published',
  }));
}

export async function getPublicServices(): Promise<ServiceItem[]> {
  const supabase = createSupabasePublicClient();
  if (!supabase) return fallbackServices;
  const { data, error } = await supabase
    .from('services')
    .select('*, service_families!inner(slug)')
    .eq('status', 'published')
    .order('sort_order');
  if (error || !data?.length) return fallbackServices;
  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    familySlug: row.service_families.slug,
    name: row.name,
    excerpt: row.excerpt,
    description: row.description,
    priceLabel: row.price_label || 'Sur devis',
    deliveryLabel: row.delivery_label || 'Délai selon le projet',
    features: Array.isArray(row.features) ? row.features.map(String) : [],
    featured: Boolean(row.is_featured),
    status: 'published',
  }));
}

export async function getPublicBlogPosts(): Promise<BlogPost[]> {
  const supabase = createSupabasePublicClient();
  if (!supabase) return fallbackPosts;
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*, blog_categories(name)')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });
  if (error || !data?.length) return fallbackPosts;
  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.blog_categories?.name || 'Conseils numériques',
    publishedAt: row.published_at
      ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(row.published_at))
      : '',
    readTime: row.read_time || '5 min',
    content: Array.isArray(row.content) ? row.content.map(String) : [],
    status: 'published',
  }));
}

export async function getPublicFamilyBySlug(slug: string) {
  const families = await getPublicFamilies();
  return families.find((family) => family.slug === slug);
}

export async function getPublicServicesByFamily(slug: string) {
  const services = await getPublicServices();
  return services.filter((service) => service.familySlug === slug);
}

export async function getPublicBlogPostBySlug(slug: string) {
  const posts = await getPublicBlogPosts();
  return posts.find((post) => post.slug === slug);
}
