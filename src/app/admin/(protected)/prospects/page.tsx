import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function AdminProspectsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.from('leads').select('id, full_name, phone, customer_type, family_slug, status, created_at').order('created_at', { ascending: false }).limit(100) : { data: [] };
  return <div><p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">Commercial</p><h1 className="mt-2 text-3xl font-black text-ink">Demandes et prospects</h1><div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="divide-y divide-slate-100">{data?.length ? data.map((lead) => <div key={lead.id} className="grid gap-3 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-center"><div><p className="font-black text-ink">{lead.full_name}</p><p className="mt-1 text-sm text-slate-500">{lead.phone}</p></div><div><p className="text-sm font-bold text-slate-700">{lead.customer_type || 'Non précisé'}</p><p className="mt-1 text-xs text-slate-400">{lead.family_slug || 'Besoin à qualifier'}</p></div><span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-ocean">{lead.status}</span></div>) : <p className="p-6 text-slate-500">Aucune demande enregistrée.</p>}</div></div></div>;
}
