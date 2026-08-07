import { blogPosts as fallbackPosts, families as fallbackFamilies, services as fallbackServices } from '@/lib/content';
import { siteConfig } from '@/lib/site';
import { createSupabasePublicClient } from '@/lib/supabase/public';
import type {
  BlogPost,
  ServiceFamily,
  ServiceItem,
  ServiceMedia,
  SoftwareCategory,
  TrainingCategory,
  TrainingProgram,
} from '@/types/content';

export type PublicSiteSettings = typeof siteConfig;

function normalizeMedia(value: unknown): ServiceMedia[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
    .map((item) => ({
      url: typeof item.url === 'string' ? item.url : undefined,
      publicUrl: typeof item.publicUrl === 'string'
        ? item.publicUrl
        : typeof item.public_url === 'string'
          ? item.public_url
          : undefined,
      alt: typeof item.alt === 'string'
        ? item.alt
        : typeof item.alt_text === 'string'
          ? item.alt_text
          : undefined,
    }));
}

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

export async function getPublicSoftwareCategories(): Promise<SoftwareCategory[]> {
  const supabase = createSupabasePublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('software_categories')
    .select('*')
    .eq('status', 'published')
    .order('sort_order');
  if (error || !data?.length) return [];
  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description || '',
    accent: row.accent || '#0877C9',
    sortOrder: Number(row.sort_order || 0),
    status: 'published',
  }));
}

export async function getPublicTrainingCategories(): Promise<TrainingCategory[]> {
  const supabase = createSupabasePublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('training_categories')
    .select('*')
    .eq('status', 'published')
    .order('sort_order');
  if (error || !data?.length) return [];
  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description || '',
    accent: row.accent || '#0877C9',
    sortOrder: Number(row.sort_order || 0),
    status: 'published',
  }));
}

export async function getPublicTrainingPrograms(): Promise<TrainingProgram[]> {
  const supabase = createSupabasePublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('training_programs')
    .select('*, training_categories!inner(id, slug, name, accent, sort_order)')
    .eq('status', 'published')
    .order('sort_order');
  if (error || !data?.length) return [];

  return data.map((row) => {
    const category = Array.isArray(row.training_categories)
      ? row.training_categories[0]
      : row.training_categories;
    return {
      id: row.id,
      categoryId: category?.id || row.category_id,
      categorySlug: category?.slug || '',
      categoryName: category?.name || 'Formation',
      categoryAccent: category?.accent || '#0877C9',
      slug: row.slug,
      name: row.name,
      kind: row.kind === 'career_pack' ? 'career_pack' : 'software',
      excerpt: row.excerpt,
      description: row.description,
      priceLabel: row.show_price && row.price_label ? row.price_label : undefined,
      showPrice: Boolean(row.show_price),
      formatLabel: row.format_label || undefined,
      durationLabel: row.duration_label || undefined,
      highlights: Array.isArray(row.highlights) ? row.highlights.map(String) : [],
      media: normalizeMedia(row.media),
      whatsappMessage: row.whatsapp_message || undefined,
      partnerLabel: row.partner_label || undefined,
      featured: Boolean(row.is_featured),
      sortOrder: Number(row.sort_order || 0),
      status: 'published',
    };
  });
}

export async function getPublicServices(): Promise<ServiceItem[]> {
  const supabase = createSupabasePublicClient();
  if (!supabase) return fallbackServices;
  const { data, error } = await supabase
    .from('services')
    .select('*, service_families!inner(slug), software_categories(slug, name, accent, sort_order)')
    .eq('status', 'published')
    .order('sort_order');
  if (error || !data?.length) return fallbackServices;
  return data.map((row) => {
    const family = Array.isArray(row.service_families) ? row.service_families[0] : row.service_families;
    const category = Array.isArray(row.software_categories) ? row.software_categories[0] : row.software_categories;
    return {
      id: row.id,
      slug: row.slug,
      familySlug: family?.slug || '',
      name: row.name,
      excerpt: row.excerpt,
      description: row.description,
      priceLabel: row.price_label || 'Sur devis',
      deliveryLabel: row.delivery_label || 'Délai selon le projet',
      features: Array.isArray(row.features) ? row.features.map(String) : [],
      featured: Boolean(row.is_featured),
      status: 'published',
      productCode: row.product_code || undefined,
      categorySlug: category?.slug || undefined,
      categoryName: category?.name || undefined,
      categoryAccent: category?.accent || undefined,
      categorySortOrder: category ? Number(category.sort_order || 0) : undefined,
      whatsappMessage: row.whatsapp_message || undefined,
      media: normalizeMedia(row.media),
    };
  });
}

export async function getPublicSoftwareProducts(): Promise<ServiceItem[]> {
  const services = await getPublicServices();
  return services.filter((service) => service.familySlug === 'logiciels-abonnements');
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
