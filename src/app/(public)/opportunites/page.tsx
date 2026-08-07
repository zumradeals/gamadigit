import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, Globe2, Handshake, MessageCircle } from 'lucide-react';
import { whatsappUrl } from '@/lib/site';

const cards = [
  { title: 'Je cherche un fournisseur ou un acheteur', text: 'Présentez votre besoin, votre produit, votre marché cible et les volumes recherchés.', icon: Globe2 },
  { title: 'Je recherche un partenaire', text: 'Partenaire commercial, technique, industriel ou stratégique en Afrique ou à l’international.', icon: Handshake },
  { title: 'J’ai un projet à développer', text: 'Décrivez le projet, son secteur, son stade d’avancement et le type d’appui recherché.', icon: BriefcaseBusiness },
];

export default function OpportunitiesPage() {
  return (
    <>
      <section className="bg-dgNavy px-4 py-20 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl"><p className="text-sm font-black uppercase tracking-[0.17em] text-dgGold">Opportunités</p><h1 className="mt-4 text-4xl font-black sm:text-6xl">Connecter une offre, un besoin et le bon partenaire.</h1><p className="mt-6 max-w-4xl text-xl leading-9 text-slate-300">Cette page devient le point d’entrée des opportunités commerciales, projets, recherches de partenaires, fournisseurs, acheteurs et collaborations sectorielles.</p></div></section>
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="grid gap-6 lg:grid-cols-3">{cards.map(({title,text,icon:Icon})=><article key={title} className="rounded-2xl border border-slate-200 p-7"><Icon className="h-9 w-9 text-dgGreen"/><h2 className="mt-6 text-2xl font-black text-dgNavy">{title}</h2><p className="mt-4 leading-8 text-slate-600">{text}</p><a href={whatsappUrl(`Bonjour DG AFRIQUE, ${title.toLowerCase()}. Je souhaite vous présenter mon besoin.`)} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 font-black text-dgGreen"><MessageCircle className="h-4 w-4"/>Présenter mon besoin</a></article>)}</div></div></section>
      <section className="bg-dgIvory px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><p className="text-sm font-black uppercase tracking-[0.16em] text-dgGreen">Place de marché B2B — prochaine évolution</p><h2 className="mt-3 max-w-3xl text-3xl font-black text-dgNavy">Des opportunités qualifiées pourront être publiées ici.</h2><p className="mt-5 max-w-4xl leading-8 text-slate-600">Le futur espace permettra d’afficher des opportunités avec un statut clair : ouverte, partenariat recherché, en discussion ou clôturée. La publication restera administrée par DG AFRIQUE.</p><Link href="/investisseurs-partenaires" className="mt-7 inline-flex items-center gap-2 font-black text-dgGreen">Découvrir l’espace partenaires <ArrowRight className="h-4 w-4"/></Link></div></section>
    </>
  );
}
