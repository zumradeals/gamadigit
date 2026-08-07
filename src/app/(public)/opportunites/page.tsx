import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, Globe2, Handshake } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const statusLabels: Record<string,string> = { open: 'Ouverte', partner_search: 'Partenaire recherché', discussion: 'En discussion', closed: 'Clôturée' };

export default async function OpportunitiesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: opportunities } = supabase ? await supabase.from('opportunities').select('*').eq('publication_status','published').order('sort_order').order('created_at',{ ascending:false }) : { data: [] };

  return <>
    <section className="bg-dgNavy px-4 py-20 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl"><p className="text-sm font-black uppercase tracking-[0.17em] text-dgGold">Opportunités</p><h1 className="mt-4 text-4xl font-black sm:text-6xl">Une place de marché B2B pour connecter les bons acteurs.</h1><p className="mt-6 max-w-4xl text-xl leading-9 text-slate-300">DG AFRIQUE publie des besoins et opportunités qualifiés : marchés, fournisseurs, acheteurs, projets et recherches de partenaires.</p></div></section>

    <section className="bg-white px-4 py-14 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 p-6"><Globe2 className="h-8 w-8 text-dgGreen"/><h2 className="mt-5 text-xl font-black text-dgNavy">Commerce & courtage</h2><p className="mt-3 leading-7 text-slate-600">Fournisseurs, acheteurs, import-export et opportunités de marché.</p></div>
      <div className="rounded-2xl border border-slate-200 p-6"><Handshake className="h-8 w-8 text-dgGreen"/><h2 className="mt-5 text-xl font-black text-dgNavy">Partenariats</h2><p className="mt-3 leading-7 text-slate-600">Partenaires commerciaux, techniques, industriels ou stratégiques.</p></div>
      <div className="rounded-2xl border border-slate-200 p-6"><BriefcaseBusiness className="h-8 w-8 text-dgGreen"/><h2 className="mt-5 text-xl font-black text-dgNavy">Projets</h2><p className="mt-3 leading-7 text-slate-600">Projets recherchant une expertise, un partenaire ou une capacité d’exécution.</p></div>
    </div></section>

    <section className="bg-dgIvory px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-sm font-black uppercase tracking-[0.16em] text-dgGreen">Place de marché DG AFRIQUE</p><h2 className="mt-3 text-3xl font-black text-dgNavy sm:text-4xl">Opportunités publiées</h2></div><Link href="/investisseurs-partenaires" className="font-black text-dgGreen">Rejoindre notre réseau →</Link></div>
      <div className="mt-10 grid gap-5 lg:grid-cols-2">{opportunities?.length ? opportunities.map((item) => <article key={item.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-dgIvory px-3 py-1 text-xs font-black text-dgGreen">{statusLabels[item.status] || item.status}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{item.sector}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{item.country}{item.city ? ` · ${item.city}` : ''}</span></div><h3 className="mt-5 text-2xl font-black text-dgNavy">{item.title}</h3><p className="mt-4 leading-8 text-slate-600">{item.summary}</p><p className="mt-4 text-sm font-bold text-dgNavy">Recherche : {item.looking_for}</p><Link href={`/opportunites/${item.slug}`} className="mt-6 inline-flex items-center gap-2 font-black text-dgGreen">Voir la fiche <ArrowRight className="h-4 w-4"/></Link></article>) : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-slate-600 lg:col-span-2"><p className="font-black text-dgNavy">Les premières opportunités sont en préparation.</p><p className="mt-2">L’espace est opérationnel : les nouvelles fiches publiées depuis le dashboard apparaîtront automatiquement ici.</p></div>}</div>
    </div></section>
  </>;
}
