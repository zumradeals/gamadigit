import Link from 'next/link';
import { ArrowRight, Globe2, Handshake, Layers3, Target } from 'lucide-react';
import { siteConfig } from '@/lib/site';

export default function AboutPage() {
  return (
    <>
      <section className="bg-dgNavy px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl"><p className="text-sm font-black uppercase tracking-[0.17em] text-dgGold">À propos</p><h1 className="mt-4 text-4xl font-black sm:text-6xl">Développement Global Afrique</h1><p className="mt-6 max-w-4xl text-xl leading-9 text-slate-300">DG AFRIQUE est une entreprise multisectorielle ivoirienne qui développe, structure et connecte des opportunités dans plusieurs domaines stratégiques.</p></div>
      </section>
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_.9fr]"><div><h2 className="text-3xl font-black text-dgNavy">Notre raison d’être</h2><div className="mt-6 space-y-5 text-lg leading-8 text-slate-600"><p>À travers le commerce international, le courtage et l’intermédiation d’affaires, les partenariats, les services aux entreprises, l’agriculture, les mines, le BTP et les solutions numériques, DG AFRIQUE accompagne entrepreneurs, entreprises, investisseurs et partenaires dans la réalisation de leurs projets.</p><p>Notre approche repose sur une conviction simple : une opportunité prend réellement de la valeur lorsqu’elle rencontre les bonnes compétences, les bons marchés et les bons partenaires.</p><p>DG AFRIQUE agit comme un point de convergence entre besoins locaux et opportunités internationales, avec la volonté de créer des relations commerciales durables et des solutions adaptées aux réalités africaines.</p></div></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">{[[Globe2,'Ouverture internationale'],[Handshake,'Partenariats durables'],[Layers3,'Pôles spécialisés'],[Target,'Approche orientée projet']].map(([Icon,label])=>{const C=Icon as typeof Globe2;return <div key={label as string} className="rounded-2xl bg-dgIvory p-6"><C className="h-7 w-7 text-dgGreen"/><h3 className="mt-4 font-black text-dgNavy">{label as string}</h3></div>})}</div></div></section>
      <section className="bg-dgIvory px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-8 shadow-sm sm:p-10"><p className="text-sm font-black uppercase tracking-[0.16em] text-dgGreen">Notre pôle numérique</p><h2 className="mt-3 text-3xl font-black text-dgNavy">Pôle numérique de DG AFRIQUE</h2><p className="mt-4 max-w-3xl leading-8 text-slate-600">Il rassemble les logiciels et abonnements professionnels, les formations, les services web et applicatifs, l’hébergement ainsi que les solutions de digitalisation pour les entreprises et les professionnels.</p><Link href="/pole-numerique" className="mt-6 inline-flex items-center gap-2 font-black text-dgGreen">Découvrir le pôle numérique <ArrowRight className="h-4 w-4"/></Link></div></section>
      <section className="bg-white px-4 py-16 text-center sm:px-6 lg:px-8"><p className="text-xl font-black text-dgNavy">{siteConfig.tagline}</p></section>
    </>
  );
}
