import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Handshake, Search, Send } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { submitOpportunityAction } from './actions';

const statusLabels: Record<string, string> = {
  open: 'Ouverte',
  partner_search: 'Partenaire recherché',
  discussion: 'En discussion',
  closed: 'Clôturée',
};

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-dgNavy outline-none transition focus:border-dgGreen focus:ring-2 focus:ring-emerald-100';

type PageProps = {
  searchParams: Promise<{ secteur?: string; pays?: string; statut?: string; depot?: string }>;
};

export default async function OpportunitiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: opportunities } = supabase
    ? await supabase.from('opportunities').select('*').eq('publication_status', 'published').order('sort_order').order('created_at', { ascending: false })
    : { data: [] };

  const all = opportunities || [];
  const sectors = [...new Set(all.map((item) => item.sector).filter(Boolean))].sort();
  const countries = [...new Set(all.map((item) => item.country).filter(Boolean))].sort();
  const filtered = all.filter((item) => {
    if (params.secteur && item.sector !== params.secteur) return false;
    if (params.pays && item.country !== params.pays) return false;
    if (params.statut && item.status !== params.statut) return false;
    return true;
  });

  return <>
    <section className="relative overflow-hidden bg-dgNavy px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
      <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-dgGold/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-sm font-black uppercase tracking-[0.17em] text-dgGold">Opportunités</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-6xl">Des besoins et possibilités de collaboration à découvrir.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">DG AFRIQUE rassemble progressivement des offres, projets, recherches de partenaires, fournisseurs et autres opportunités utiles. Chaque proposition publique passe d’abord par une validation.</p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold text-slate-300">
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-dgGold" /> Publication après validation</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-dgGold" /> Contact et mise en relation ciblés</span>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 p-6"><BriefcaseBusiness className="h-8 w-8 text-dgGreen"/><h2 className="mt-5 text-xl font-black text-dgNavy">Affaires & besoins</h2><p className="mt-3 leading-7 text-slate-600">Fournisseurs, acheteurs, prestations, besoins professionnels et recherches commerciales.</p></div>
        <div className="rounded-2xl border border-slate-200 p-6"><Handshake className="h-8 w-8 text-dgGreen"/><h2 className="mt-5 text-xl font-black text-dgNavy">Partenariats</h2><p className="mt-3 leading-7 text-slate-600">Collaborations commerciales, techniques, stratégiques ou locales autour d’un besoin précis.</p></div>
        <div className="rounded-2xl border border-slate-200 p-6"><Search className="h-8 w-8 text-dgGreen"/><h2 className="mt-5 text-xl font-black text-dgNavy">Projets à connecter</h2><p className="mt-3 leading-7 text-slate-600">Des projets qui recherchent une expertise, un relais, une capacité d’exécution ou un partenaire.</p></div>
      </div>
    </section>

    <section className="bg-dgIvory px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div><p className="text-sm font-black uppercase tracking-[0.16em] text-dgGreen">À découvrir</p><h2 className="mt-3 text-3xl font-black text-dgNavy sm:text-4xl">Opportunités publiées</h2><p className="mt-3 max-w-2xl leading-7 text-slate-600">Utilisez les filtres pour trouver les publications correspondant à votre secteur, votre pays ou leur état d’avancement.</p></div>
          <Link href="/investisseurs-partenaires" className="font-black text-dgGreen">Découvrir les partenariats →</Link>
        </div>

        <form method="get" className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_1fr_1fr_auto]">
          <select name="secteur" defaultValue={params.secteur || ''} className={inputClass}><option value="">Tous les secteurs</option>{sectors.map((sector) => <option key={sector} value={sector}>{sector}</option>)}</select>
          <select name="pays" defaultValue={params.pays || ''} className={inputClass}><option value="">Tous les pays</option>{countries.map((country) => <option key={country} value={country}>{country}</option>)}</select>
          <select name="statut" defaultValue={params.statut || ''} className={inputClass}><option value="">Tous les statuts</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
          <button className="rounded-xl bg-dgNavy px-5 py-3 text-sm font-black text-white">Filtrer</button>
        </form>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">{filtered.length ? filtered.map((item) => <article key={item.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-7"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-dgIvory px-3 py-1 text-xs font-black text-dgGreen">{statusLabels[item.status] || item.status}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{item.sector}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{item.country}{item.city ? ` · ${item.city}` : ''}</span></div><h3 className="mt-5 text-2xl font-black text-dgNavy">{item.title}</h3><p className="mt-4 leading-8 text-slate-600">{item.summary}</p><p className="mt-4 text-sm font-bold text-dgNavy">Recherche : {item.looking_for}</p><Link href={`/opportunites/${item.slug}`} className="mt-6 inline-flex items-center gap-2 font-black text-dgGreen">Voir la fiche <ArrowRight className="h-4 w-4"/></Link></article>) : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-slate-600 lg:col-span-2"><p className="font-black text-dgNavy">Aucune opportunité ne correspond actuellement à ces critères.</p><p className="mt-2">Modifiez les filtres ou proposez une opportunité à DG AFRIQUE pour étude.</p></div>}</div>
      </div>
    </section>

    <section id="deposer" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.75fr_1.25fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-dgGreen">Proposer une opportunité</p>
          <h2 className="mt-3 text-3xl font-black text-dgNavy sm:text-4xl">Vous avez une offre, un besoin ou un projet à faire connaître ?</h2>
          <p className="mt-5 leading-8 text-slate-600">Transmettez les informations essentielles. La proposition reste privée jusqu’à son examen et n’est jamais publiée automatiquement.</p>
          <div className="mt-6 rounded-2xl bg-dgIvory p-5 text-sm leading-6 text-slate-600"><strong className="text-dgNavy">Ce que nous privilégions :</strong> une demande claire, un besoin identifiable et des coordonnées permettant de vérifier la proposition avant publication.</div>
          {params.depot === 'ok' && <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 font-bold text-emerald-800">Votre opportunité a bien été transmise. Elle est en attente de validation.</div>}
          {params.depot === 'erreur' && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-800">La demande n’a pas pu être enregistrée. Vérifiez les informations et réessayez.</div>}
        </div>

        <form action={submitOpportunityAction} className="grid gap-4 rounded-[2rem] border border-slate-200 bg-dgIvory p-5 sm:grid-cols-2 sm:p-8">
          <div className="sm:col-span-2"><label className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-slate-500">Titre de l’opportunité</label><input name="title" required minLength={5} className={inputClass} placeholder="Ex. Recherche distributeur pour équipements industriels" /></div>
          <div><label className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-slate-500">Secteur</label><input name="sector" required className={inputClass} placeholder="Agriculture, BTP, numérique..." /></div>
          <div><label className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-slate-500">Type</label><select name="opportunity_type" required defaultValue="partnership" className={inputClass}><option value="business">Affaire / commerce</option><option value="project">Projet</option><option value="supplier">Recherche fournisseur</option><option value="buyer">Recherche acheteur</option><option value="investment">Opportunité d’investissement</option><option value="partnership">Partenariat</option></select></div>
          <div><label className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-slate-500">Pays</label><input name="country" required className={inputClass} placeholder="Côte d’Ivoire" /></div>
          <div><label className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-slate-500">Ville</label><input name="city" className={inputClass} placeholder="Optionnel" /></div>
          <div className="sm:col-span-2"><label className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-slate-500">Résumé public</label><textarea name="summary" required minLength={10} rows={3} className={inputClass} placeholder="Présentez l’opportunité en quelques phrases." /></div>
          <div className="sm:col-span-2"><label className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-slate-500">Ce que vous recherchez</label><textarea name="looking_for" required minLength={5} rows={3} className={inputClass} placeholder="Acheteur, fournisseur, partenaire technique, investisseur..." /></div>
          <div className="sm:col-span-2"><label className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-slate-500">Détails complémentaires</label><textarea name="description" rows={4} className={inputClass} placeholder="Volumes, capacités, échéances, conditions ou informations utiles." /></div>
          <div><label className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-slate-500">Votre nom</label><input name="submitter_name" required className={inputClass} /></div>
          <div><label className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-slate-500">Organisation</label><input name="submitter_organization" className={inputClass} placeholder="Entreprise / structure" /></div>
          <div><label className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-slate-500">Téléphone / WhatsApp</label><input name="submitter_phone" required minLength={6} className={inputClass} /></div>
          <div><label className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-slate-500">E-mail</label><input name="submitter_email" type="email" className={inputClass} /></div>
          <div className="sm:col-span-2"><button className="inline-flex items-center gap-2 rounded-xl bg-dgGreen px-6 py-4 font-black text-white"><Send className="h-4 w-4" /> Soumettre pour validation</button></div>
        </form>
      </div>
    </section>
  </>;
}
