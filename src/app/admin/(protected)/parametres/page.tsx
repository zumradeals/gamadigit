import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function AdminSettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.from('site_settings').select('payload, updated_at').eq('id', 'main').maybeSingle() : { data: null };
  const payload = (data?.payload || {}) as Record<string, string>;
  const entries = Object.entries(payload);
  return <div><p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">Configuration</p><h1 className="mt-2 text-3xl font-black text-ink">Paramètres du site</h1><p className="mt-3 text-slate-600">Lecture actuelle des paramètres publics. L’édition sécurisée sera ajoutée au prochain lot.</p><div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="divide-y divide-slate-100">{entries.length ? entries.map(([key, value]) => <div key={key} className="grid gap-2 py-4 sm:grid-cols-[14rem_1fr]"><p className="text-sm font-black text-slate-500">{key}</p><p className="font-semibold text-ink">{String(value)}</p></div>) : <p className="text-slate-500">Aucun paramètre chargé.</p>}</div></div></div>;
}
