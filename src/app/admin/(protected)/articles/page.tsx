import { Plus, Save } from 'lucide-react';
import { saveBlogPostAction } from '@/app/admin/(protected)/actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-ink focus:border-ocean focus:outline-none focus:ring-2 focus:ring-blue-100';
const labelClass = 'mb-2 block text-xs font-black uppercase tracking-[0.11em] text-slate-500';

function ArticleForm({ post, categories }: { post?: Record<string, any>; categories: Record<string, any>[] }) {
  const content = Array.isArray(post?.content) ? post.content.join('\n\n') : '';
  return (
    <form action={saveBlogPostAction} className="space-y-4">
      {post?.id && <input type="hidden" name="id" value={post.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={labelClass}>Titre</label><input name="title" defaultValue={post?.title || ''} required className={inputClass} /></div>
        <div><label className={labelClass}>Slug</label><input name="slug" defaultValue={post?.slug || ''} placeholder="automatique si vide" className={inputClass} /></div>
      </div>
      <div><label className={labelClass}>Résumé</label><textarea name="excerpt" defaultValue={post?.excerpt || ''} required rows={3} className={inputClass} /></div>
      <div><label className={labelClass}>Contenu — séparer les paragraphes par une ligne vide</label><textarea name="content" defaultValue={content} required rows={10} className={inputClass} /></div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className={labelClass}>Catégorie</label><select name="category_id" defaultValue={post?.category_id || ''} className={inputClass}><option value="">Sans catégorie</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
        <div><label className={labelClass}>Auteur</label><input name="author_name" defaultValue={post?.author_name || 'Équipe GamaDigit'} className={inputClass} /></div>
        <div><label className={labelClass}>Temps de lecture</label><input name="read_time" defaultValue={post?.read_time || '5 min'} className={inputClass} /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={labelClass}>Titre SEO</label><input name="seo_title" defaultValue={post?.seo_title || ''} className={inputClass} /></div>
        <div><label className={labelClass}>Description SEO</label><input name="seo_description" defaultValue={post?.seo_description || ''} className={inputClass} /></div>
      </div>
      <div><label className={labelClass}>Statut</label><select name="status" defaultValue={post?.status || 'draft'} className={inputClass}><option value="draft">Brouillon</option><option value="published">Publié</option><option value="archived">Archivé</option></select></div>
      <button className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 font-black text-white"><Save className="h-4 w-4" />{post ? 'Mettre à jour' : 'Enregistrer l’article'}</button>
    </form>
  );
}

export default async function AdminArticlesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: categories } = supabase ? await supabase.from('blog_categories').select('*').order('sort_order') : { data: [] };
  const { data: posts } = supabase ? await supabase.from('blog_posts').select('*').order('updated_at', { ascending: false }) : { data: [] };
  const safeCategories = categories || [];

  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">Publication</p>
      <h1 className="mt-2 text-3xl font-black text-ink">Articles du blog</h1>
      <p className="mt-3 text-slate-600">Rédigez, enregistrez en brouillon puis publiez vos conseils depuis le back-office.</p>

      <details open className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <summary className="flex cursor-pointer list-none items-center gap-2 font-black text-ink marker:content-none"><Plus className="h-5 w-5 text-ocean" />Nouvel article</summary>
        <div className="mt-6"><ArticleForm categories={safeCategories} /></div>
      </details>

      <div className="mt-6 space-y-4">
        {posts?.length ? posts.map((post) => (
          <details key={post.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 marker:content-none">
              <div><p className="font-black text-ink">{post.title}</p><p className="mt-1 text-xs text-slate-400">/blog/{post.slug}</p></div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{post.status}</span>
            </summary>
            <div className="mt-6 border-t border-slate-100 pt-5"><ArticleForm post={post} categories={safeCategories} /></div>
          </details>
        )) : <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">Aucun article enregistré dans Supabase.</div>}
      </div>
    </div>
  );
}
