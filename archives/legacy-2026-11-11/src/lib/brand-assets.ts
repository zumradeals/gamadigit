import { createSupabasePublicClient } from '@/lib/supabase/public';

export type BrandAssets = {
  logoUrl: string;
  faviconUrl: string;
  socialImageUrl: string | null;
};

export const defaultBrandAssets: BrandAssets = {
  logoUrl: '/brand/dg-afrique.svg',
  faviconUrl: '/favicon.svg',
  socialImageUrl: null,
};

function value(payload: Record<string, unknown>, key: string) {
  const raw = payload[key];
  return typeof raw === 'string' && raw.trim() ? raw.trim() : null;
}

export async function getBrandAssets(): Promise<BrandAssets> {
  const supabase = createSupabasePublicClient();
  if (!supabase) return defaultBrandAssets;

  const { data, error } = await supabase
    .from('site_settings')
    .select('payload')
    .eq('id', 'main')
    .maybeSingle();

  if (error || !data?.payload) return defaultBrandAssets;
  const payload = data.payload as Record<string, unknown>;

  return {
    logoUrl: value(payload, 'logoUrl') || defaultBrandAssets.logoUrl,
    faviconUrl: value(payload, 'faviconUrl') || defaultBrandAssets.faviconUrl,
    socialImageUrl: value(payload, 'socialImageUrl'),
  };
}
