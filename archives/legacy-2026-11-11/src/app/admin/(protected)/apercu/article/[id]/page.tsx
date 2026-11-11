import { ArrowLeft, Pencil } from 'lucide-react';
import { notFound } from 'next/navigation';
import { BlogContentRenderer } from '@/components/content/blog-content-renderer';
import { normalizeBlogContentItems } from '@/lib/blog-content';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function AdminArticlePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: post } = supabase
    ? await supabase.from('blog_posts').select('*, blog_categories(name)').eq('id', id).maybeSingle()
    : { data: null };
  if (!post) notFound();

  const category = Array.isArray(post.blog_categories) ? post.blog_categories[0] : post.blog_categories;
  const content = normalizeBlogContentItems(post.content);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <a href="/admin/articles" className="inline-flex items-center gap-2 text-sm font-black text-ocean"><ArrowLeft className="h-4 w-4" />Retour aux articles</a>
        <a href="/admin/articles" className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-black text-white"><Pencil className="h-4 w-4" />Modifier l’article</a>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">Prévisualisation privée — statut actuel : <strong>{post.status}</strong>. L’article ne devient public qu’après validation.</div>

      <article className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
        <header className="bg-ink px-6 py-16 text-white sm:px-10">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.17em] text-cyan">{category?.name || 'Conseils numériques'}</p>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">{post.title}</h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">{post.excerpt}</p>
            <p className="mt-6 text-sm font-bold text-slate-400">{post.author_name || 'Équipe GamaDigit'} · {post.read_time || '5 min'}</p>
          </div>
        </header>
        <div className="mx-auto max-w-3xl px-6 py-14 sm:px-10"><BlogContentRenderer content={content} /></div>
      </article>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-ink">Aperçu SEO</h2>
        <p className="mt-4 text-lg font-black text-blue-700">{post.seo_title || post.title}</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{post.seo_description || post.excerpt}</p>
      </section>
    </div>
  );
}
