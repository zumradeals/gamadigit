import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function AdminServicesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: families } = supabase ? await supabase.from('service_families').select('id, name, slug, status, sort_order').order('sort_order') : { data: [] };
  const { data: services } = supabase ? await supabase.from('services').select('id, name, slug, status, price_label, family_id').order('sort_order') : { data: [] };

  return (
    <div><p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">Catalogue</p><h1 className="mt-2 text-3xl font-black text-ink">Familles et services</h1><div className="mt-8 grid gap-6 xl:grid-cols-2"><section className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-xl font-black text-ink">Familles</h2><div className="mt-5 divide-y divide-slate-100">{families?.map((item) => <div key={item.id} className="flex items-center justify-between py-4"><div><p className="font-bold text-ink">{item.name}</p><p className="text-xs text-slate-400">/{item.slug}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{item.status}</span></div>)}</div></section><section className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-xl font-black text-ink">Services</h2><div className="mt-5 divide-y divide-slate-100">{services?.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 py-4"><div><p className="font-bold text-ink">{item.name}</p><p className="text-xs text-slate-400">{item.price_label || 'Sur devis'}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{item.status}</span></div>)}</div></section></div></div>
  );
}
