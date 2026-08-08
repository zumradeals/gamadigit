import type { Metadata } from 'next';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { alternates: { canonical: `/opportunites/${slug}` } };

  const { data: item } = await supabase
    .from('opportunities')
    .select('title,summary')
    .eq('slug', slug)
    .eq('publication_status', 'published')
    .maybeSingle();

  return {
    title: item?.title || 'Opportunité',
    description: item?.summary || 'Découvrez cette opportunité publiée sur DG AFRIQUE.',
    alternates: { canonical: `/opportunites/${slug}` },
  };
}

export default function OpportunityDetailLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
