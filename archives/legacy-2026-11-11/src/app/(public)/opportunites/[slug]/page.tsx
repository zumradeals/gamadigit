import { notFound } from 'next/navigation';
import { MapPin, MessageCircle, Search } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { whatsappUrl } from '@/lib/site';

const statusLabels: Record<string,string> = { open: 'Ouverte', partner_search: 'Partenaire recherché', discussion: 'En discussion', closed: 'Clôturée' };

export default async function OpportunityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  if (!supabase) notFound();
  const { data: item } = await supabase.from('opportunities').select('*').eq('slug', slug).eq('publication_status','published').maybeSingle();
  if (!item) notFound();
  const message = item.contact_message || `Bonjour DG AFRIQUE, je suis intéressé par l’opportunité « ${item.title} ». Je souhaite en savoir plus.`;

  return <>
    <section className="bg-dgNavy px-4 py-20 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-dgGold px-3 py-1 text-xs font-black text-dgNavy">{statusLabels[item.status] || item.status}</span><span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold">{item.sector}</span></div><h1 className="mt-6 text-4xl font-black sm:text-6xl">{item.title}</h1><p className="mt-6 max-w-4xl text-xl leading-9 text-slate-300">{item.summary}</p></div></section>
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_.55fr]"><article><h2 className="text-2xl font-black text-dgNavy">Présentation de l’opportunité</h2><p className="mt-5 whitespace-pre-wrap text-lg leading-9 text-slate-600">{item.description || item.summary}</p><div className="mt-8 rounded-2xl bg-dgIvory p-6"><Search className="h-7 w-7 text-dgGreen"/><h3 className="mt-4 font-black text-dgNavy">Ce qui est recherché</h3><p className="mt-3 leading-7 text-slate-600">{item.looking_for}</p></div></article><aside className="h-fit rounded-[1.5rem] border border-slate-200 p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-[0.14em] text-dgGreen">Informations clés</p><div className="mt-5 space-y-4 text-sm"><div><p className="text-slate-400">Secteur</p><p className="font-black text-dgNavy">{item.sector}</p></div><div><p className="text-slate-400">Localisation</p><p className="flex items-center gap-2 font-black text-dgNavy"><MapPin className="h-4 w-4"/>{item.country}{item.city ? ` · ${item.city}` : ''}</p></div><div><p className="text-slate-400">Statut</p><p className="font-black text-dgNavy">{statusLabels[item.status] || item.status}</p></div></div>{item.status !== 'closed' && <a href={whatsappUrl(message)} target="_blank" rel="noreferrer" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-dgGreen px-5 py-4 font-black text-white"><MessageCircle className="h-5 w-5"/>Je suis intéressé</a>}</aside></div></section>
  </>;
}
