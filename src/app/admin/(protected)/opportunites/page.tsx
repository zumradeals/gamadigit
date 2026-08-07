import { Save } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { saveOpportunityAction, updateInquiryAction } from './actions';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-ink focus:border-dgGreen focus:outline-none focus:ring-2 focus:ring-emerald-100';
const statusLabels: Record<string,string> = { open: 'Ouverte', partner_search: 'Partenaire recherché', discussion: 'En discussion', closed: 'Clôturée' };

export default async function AdminOpportunitiesPage() {
  const supabase = await createSupabaseServerClient();
  const [{ data: opportunities }, { data: inquiries }] = supabase ? await Promise.all([
    supabase.from('opportunities').select('*').order('sort_order').order('created_at', { ascending: false }),
    supabase.from('partnership_inquiries').select('*').order('created_at', { ascending: false }).limit(100),
  ]) : [{ data: [] }, { data: [] }];

  return <div>
    <p className="text-sm font-black uppercase tracking-[0.16em] text-dgGreen">DG AFRIQUE</p>
    <h1 className="mt-2 text-3xl font-black text-dgNavy">Opportunités & relations</h1>
    <p className="mt-3 text-slate-600">Publiez les opportunités de la place de marché et qualifiez séparément les profils investisseurs et partenaires.</p>

    <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-dgNavy">Nouvelle opportunité</h2>
      <form action={saveOpportunityAction} className="mt-5 grid gap-4 lg:grid-cols-2">
        <input name="title" required placeholder="Titre de l’opportunité" className={inputClass}/>
        <input name="sector" required placeholder="Secteur : agriculture, BTP, mines..." className={inputClass}/>
        <input name="country" required placeholder="Pays" className={inputClass}/>
        <input name="city" placeholder="Ville / zone (facultatif)" className={inputClass}/>
        <select name="opportunity_type" className={inputClass}><option value="business">Affaire commerciale</option><option value="project">Projet</option><option value="supplier">Recherche fournisseur</option><option value="buyer">Recherche acheteur</option><option value="investment">Opportunité d’investissement</option><option value="partnership">Partenariat</option></select>
        <select name="status" className={inputClass}><option value="open">Ouverte</option><option value="partner_search">Partenaire recherché</option><option value="discussion">En discussion</option><option value="closed">Clôturée</option></select>
        <textarea name="summary" required rows={3} placeholder="Résumé public" className={`${inputClass} lg:col-span-2`}/>
        <textarea name="description" rows={5} placeholder="Description détaillée" className={`${inputClass} lg:col-span-2`}/>
        <input name="looking_for" required placeholder="Ce que DG AFRIQUE recherche" className={inputClass}/>
        <input name="contact_message" placeholder="Message WhatsApp conseillé" className={inputClass}/>
        <select name="publication_status" className={inputClass}><option value="draft">Brouillon</option><option value="published">Publier</option></select>
        <input name="sort_order" type="number" defaultValue="0" className={inputClass}/>
        <button className="inline-flex w-fit items-center gap-2 rounded-xl bg-dgNavy px-5 py-3 font-black text-white"><Save className="h-4 w-4"/>Enregistrer</button>
      </form>
    </section>

    <section className="mt-8">
      <h2 className="text-xl font-black text-dgNavy">Fiches d’opportunité</h2>
      <div className="mt-4 space-y-4">{opportunities?.length ? opportunities.map((item) => <details key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><summary className="cursor-pointer list-none marker:content-none"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-black text-dgNavy">{item.title}</p><p className="mt-1 text-sm text-slate-500">{item.sector} · {item.country}</p></div><div className="flex gap-2"><span className="rounded-full bg-dgIvory px-3 py-1 text-xs font-bold text-dgGreen">{statusLabels[item.status] || item.status}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{item.publication_status}</span></div></div></summary><form action={saveOpportunityAction} className="mt-5 grid gap-4 border-t border-slate-100 pt-5 lg:grid-cols-2"><input type="hidden" name="id" value={item.id}/><input name="title" defaultValue={item.title} className={inputClass}/><input name="sector" defaultValue={item.sector} className={inputClass}/><input name="country" defaultValue={item.country} className={inputClass}/><input name="city" defaultValue={item.city || ''} className={inputClass}/><input name="slug" defaultValue={item.slug} className={inputClass}/><select name="status" defaultValue={item.status} className={inputClass}><option value="open">Ouverte</option><option value="partner_search">Partenaire recherché</option><option value="discussion">En discussion</option><option value="closed">Clôturée</option></select><textarea name="summary" defaultValue={item.summary} rows={3} className={`${inputClass} lg:col-span-2`}/><textarea name="description" defaultValue={item.description} rows={5} className={`${inputClass} lg:col-span-2`}/><input name="looking_for" defaultValue={item.looking_for} className={inputClass}/><input name="contact_message" defaultValue={item.contact_message || ''} className={inputClass}/><select name="opportunity_type" defaultValue={item.opportunity_type} className={inputClass}><option value="business">Affaire commerciale</option><option value="project">Projet</option><option value="supplier">Recherche fournisseur</option><option value="buyer">Recherche acheteur</option><option value="investment">Investissement</option><option value="partnership">Partenariat</option></select><select name="publication_status" defaultValue={item.publication_status} className={inputClass}><option value="draft">Brouillon</option><option value="published">Publié</option><option value="archived">Archivé</option></select><input name="sort_order" type="number" defaultValue={item.sort_order} className={inputClass}/><button className="inline-flex w-fit items-center gap-2 rounded-xl bg-dgNavy px-5 py-3 font-black text-white"><Save className="h-4 w-4"/>Mettre à jour</button></form></details>) : <div className="rounded-2xl bg-white p-6 text-slate-500">Aucune opportunité pour le moment.</div>}</div>
    </section>

    <section className="mt-10">
      <h2 className="text-xl font-black text-dgNavy">Investisseurs & partenaires reçus</h2>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">{inquiries?.length ? inquiries.map((item) => <article key={item.id} className="rounded-2xl bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><span className="rounded-full bg-dgIvory px-3 py-1 text-xs font-black uppercase text-dgGreen">{item.inquiry_type === 'investor' ? 'Investisseur' : 'Partenaire'}</span><h3 className="mt-3 font-black text-dgNavy">{item.organization}</h3><p className="mt-1 text-sm text-slate-500">{item.full_name} · {item.country} · {item.phone}</p></div></div><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">{item.message}</p><form action={updateInquiryAction} className="mt-4 space-y-3 rounded-xl bg-slate-50 p-4"><input type="hidden" name="id" value={item.id}/><select name="status" defaultValue={item.status} className={inputClass}><option value="new">Nouveau</option><option value="reviewing">À étudier</option><option value="contacted">Contacté</option><option value="matched">Mise en relation</option><option value="closed">Clôturé</option></select><textarea name="notes" defaultValue={item.notes || ''} rows={3} placeholder="Notes internes" className={inputClass}/><button className="rounded-xl bg-dgGreen px-4 py-2.5 text-sm font-black text-white">Mettre à jour</button></form></article>) : <div className="rounded-2xl bg-white p-6 text-slate-500">Aucun profil reçu.</div>}</div>
    </section>
  </div>;
}
