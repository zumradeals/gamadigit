import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function AdminArticlesPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.from('blog_posts').select('id, title, slug, status, published_at, updated_at').order('updated_at', { ascending: false }) : { data: [] };
  return <div><p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">Publication</p><h1 className="mt-2 text-3xl font-black text-ink">Articles du blog</h1><div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="divide-y divide-slate-100">{data?.length ? data.map((post) => <div key={post.id} className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center"><div><p className="font-black text-ink">{post.title}</p><p className="mt-1 text-xs text-slate-400">/blog/{post.slug}</p></div><span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{post.status}</span></div>) : <p className="p-6 text-slate-500">Aucun article enregistré dans Supabase.</p>}</div></div></div>;
}
