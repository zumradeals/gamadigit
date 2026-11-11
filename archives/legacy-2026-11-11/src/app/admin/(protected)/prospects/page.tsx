import { MessageCircle, Save } from 'lucide-react';
import { updateLeadStatusAction } from '@/app/admin/(protected)/actions';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-ink focus:border-ocean focus:outline-none focus:ring-2 focus:ring-blue-100';

export default async function AdminProspectsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(100)
    : { data: [] };

  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">Commercial</p>
      <h1 className="mt-2 text-3xl font-black text-ink">Demandes et prospects</h1>
      <p className="mt-3 text-slate-600">Qualifiez les demandes, notez les échanges et suivez leur progression commerciale.</p>

      <div className="mt-8 space-y-4">
        {data?.length ? data.map((lead) => (
          <details key={lead.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <summary className="grid cursor-pointer list-none gap-3 marker:content-none sm:grid-cols-[1fr_1fr_auto] sm:items-center">
              <div><p className="font-black text-ink">{lead.full_name}</p><p className="mt-1 text-sm text-slate-500">{lead.phone}{lead.email ? ` · ${lead.email}` : ''}</p></div>
              <div><p className="text-sm font-bold text-slate-700">{lead.customer_type || 'Non précisé'}</p><p className="mt-1 text-xs text-slate-400">{lead.family_slug || 'Besoin à qualifier'} · {new Date(lead.created_at).toLocaleDateString('fr-FR')}</p></div>
              <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-ocean">{lead.status}</span>
            </summary>

            <div className="mt-5 grid gap-6 border-t border-slate-100 pt-5 lg:grid-cols-[1fr_.8fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">Demande</p>
                <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-700">{lead.message}</p>
                {lead.budget_label && <p className="mt-4 text-sm font-bold text-ink">Budget : {lead.budget_label}</p>}
                <a href={`https://wa.me/${String(lead.phone).replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-mint px-4 py-3 text-sm font-black text-white"><MessageCircle className="h-4 w-4" />Répondre sur WhatsApp</a>
              </div>

              <form action={updateLeadStatusAction} className="space-y-4 rounded-2xl bg-cloud p-5">
                <input type="hidden" name="id" value={lead.id} />
                <div><label className="mb-2 block text-xs font-black uppercase tracking-[0.11em] text-slate-500">Statut</label><select name="status" defaultValue={lead.status} className={inputClass}><option value="new">Nouvelle</option><option value="contacted">Contactée</option><option value="quoted">Devis envoyé</option><option value="negotiating">En négociation</option><option value="won">Gagnée</option><option value="lost">Perdue</option></select></div>
                <div><label className="mb-2 block text-xs font-black uppercase tracking-[0.11em] text-slate-500">Notes internes</label><textarea name="notes" defaultValue={lead.notes || ''} rows={5} className={inputClass} /></div>
                <button className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-black text-white"><Save className="h-4 w-4" />Mettre à jour</button>
              </form>
            </div>
          </details>
        )) : <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">Aucune demande enregistrée.</div>}
      </div>
    </div>
  );
}
