import { Save } from 'lucide-react';
import { saveSettingsAction } from '@/app/admin/(protected)/actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-ink focus:border-ocean focus:outline-none focus:ring-2 focus:ring-blue-100';
const labelClass = 'mb-2 block text-xs font-black uppercase tracking-[0.11em] text-slate-500';

export default async function AdminSettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase.from('site_settings').select('payload, updated_at').eq('id', 'main').maybeSingle()
    : { data: null };
  const payload = (data?.payload || {}) as Record<string, string>;

  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">Configuration</p>
      <h1 className="mt-2 text-3xl font-black text-ink">Paramètres du site</h1>
      <p className="mt-3 text-slate-600">Modifiez l’identité publique, les coordonnées et le canal WhatsApp principal.</p>

      <form action={saveSettingsAction} className="mt-8 max-w-4xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <section>
          <h2 className="text-xl font-black text-ink">Identité</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div><label className={labelClass}>Nom</label><input name="name" defaultValue={payload.name || 'GamaDigit'} required className={inputClass} /></div>
            <div><label className={labelClass}>Signature</label><input name="tagline" defaultValue={payload.tagline || 'Le numérique qui fait avancer vos projets.'} required className={inputClass} /></div>
          </div>
          <div className="mt-5"><label className={labelClass}>Mention écosystème</label><input name="ecosystemLabel" defaultValue={payload.ecosystemLabel || 'Un satellite de l’écosystème GAMAD'} required className={inputClass} /></div>
        </section>

        <section className="border-t border-slate-100 pt-6">
          <h2 className="text-xl font-black text-ink">Coordonnées</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div><label className={labelClass}>Numéro WhatsApp sans +</label><input name="whatsappNumber" defaultValue={payload.whatsappNumber || '2250718713781'} required className={inputClass} /></div>
            <div><label className={labelClass}>Téléphone affiché</label><input name="phone" defaultValue={payload.phone || '+225 07 18 71 37 81'} required className={inputClass} /></div>
            <div><label className={labelClass}>E-mail</label><input name="email" type="email" defaultValue={payload.email || 'contact@gamadigit.com'} required className={inputClass} /></div>
            <div><label className={labelClass}>Localisation</label><input name="location" defaultValue={payload.location || 'Abidjan, Côte d’Ivoire'} required className={inputClass} /></div>
          </div>
        </section>

        <button className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 font-black text-white"><Save className="h-4 w-4" />Enregistrer les paramètres</button>
      </form>
    </div>
  );
}
