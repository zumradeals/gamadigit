import { Plus, Save } from 'lucide-react';
import { saveBlogCategoryAction } from '@/app/admin/(protected)/content-actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-ink focus:border-ocean focus:outline-none focus:ring-2 focus:ring-blue-100';
const labelClass = 'mb-2 block text-xs font-black uppercase tracking-[0.11em] text-slate-500';

function CategoryForm({ category }: { category?: Record<string, unknown> }) {
  return (
    <form action={saveBlogCategoryAction} className="space-y-4">
      {category?.id ? <input type="hidden" name="id" value={String(category.id)} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={labelClass}>Nom</label><input name="name" defaultValue={String(category?.name || '')} required className={inputClass} /></div>
        <div><label className={labelClass}>Slug</label><input name="slug" defaultValue={String(category?.slug || '')} placeholder="automatique si vide" className={inputClass} /></div>
      </div>
      <div><label className={labelClass}>Description</label><textarea name="description" defaultValue={String(category?.description || '')} rows={3} className={inputClass} /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={labelClass}>Ordre</label><input name="sort_order" type="number" defaultValue={Number(category?.sort_order || 0)} className={inputClass} /></div>
        <div><label className={labelClass}>Statut</label><select name="status" defaultValue={String(category?.status || 'draft')} className={inputClass}><option value="draft">Brouillon</option><option value="published">Publié</option><option value="archived">Archivé</option></select></div>
      </div>
      <button className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 font-black text-white"><Save className="h-4 w-4" />{category ? 'Mettre à jour' : 'Enregistrer la catégorie'}</button>
    </form>
  );
}

export default async function AdminCategoriesPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase.from('blog_categories').select('*').order('sort_order')
    : { data: [] };

  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">Publication</p>
      <h1 className="mt-2 text-3xl font-black text-ink">Catégories du blog</h1>
      <p className="mt-3 text-slate-600">Organisez les articles par thèmes compréhensibles pour les lecteurs et les moteurs de recherche.</p>

      <details open className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <summary className="flex cursor-pointer list-none items-center gap-2 font-black text-ink marker:content-none"><Plus className="h-5 w-5 text-ocean" />Nouvelle catégorie</summary>
        <div className="mt-6"><CategoryForm /></div>
      </details>

      <div className="mt-6 space-y-4">
        {data?.map((category) => (
          <details key={category.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 marker:content-none"><div><p className="font-black text-ink">{category.name}</p><p className="mt-1 text-xs text-slate-400">/{category.slug}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{category.status}</span></summary>
            <div className="mt-6 border-t border-slate-100 pt-5"><CategoryForm category={category} /></div>
          </details>
        ))}
      </div>
    </div>
  );
}
