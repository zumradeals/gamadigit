import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Handshake, Layers3, Lightbulb, Target } from 'lucide-react';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'À propos',
  description: 'Découvrez DG AFRIQUE, ses activités numériques, son accompagnement de projets et sa démarche de mise en relation et de partenariat pour le développement en Afrique.',
  alternates: { canonical: '/a-propos' },
};

const pillars = [
  { icon: Layers3, title: 'Solutions numériques', text: 'Des logiciels, formations, services web et solutions digitales utiles aux particuliers, professionnels et organisations.' },
  { icon: Lightbulb, title: 'Accompagnement de projets', text: 'Nous aidons à clarifier un besoin, identifier une solution réaliste et structurer les prochaines étapes.' },
  { icon: Handshake, title: 'Mise en relation', text: 'Nous facilitons progressivement les connexions entre porteurs de projets, professionnels, entreprises et partenaires.' },
  { icon: Target, title: 'Développement progressif', text: 'Nous préférons construire des capacités réelles, utiles et durables plutôt que multiplier les promesses.' },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-dgNavy px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-black uppercase tracking-[0.17em] text-dgGold">À propos</p>
          <h1 className="mt-4 text-4xl font-black sm:text-6xl">Développement Global Afrique</h1>
          <p className="mt-6 max-w-4xl text-xl leading-9 text-slate-300">Nous développons des solutions numériques, nous accompagnons des projets, nous mettons en relation des acteurs et nous construisons progressivement un réseau de partenaires pour le développement en Afrique.</p>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-dgGreen">Notre approche</p>
            <h2 className="mt-3 text-3xl font-black text-dgNavy sm:text-5xl">Faire utile aujourd’hui, construire plus grand demain.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">DG AFRIQUE avance à partir de capacités concrètes. Notre pôle numérique constitue aujourd’hui une activité phare, tandis que les opportunités et les partenariats nous permettent de développer progressivement de nouvelles collaborations.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {pillars.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dgIvory text-dgGreen"><Icon className="h-6 w-6" /></div>
                <h3 className="mt-6 text-2xl font-black text-dgNavy">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dgIvory px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-dgGreen">Activité phare</p>
            <h2 className="mt-3 text-3xl font-black text-dgNavy">Le Pôle numérique</h2>
            <p className="mt-4 leading-8 text-slate-600">Logiciels, formations, création web et applicative, hébergement et accompagnement numérique réunis dans une offre lisible.</p>
            <Link href="/pole-numerique" className="mt-6 inline-flex items-center gap-2 font-black text-dgGreen">Découvrir le pôle numérique <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="rounded-[2rem] bg-dgNavy p-8 text-white sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-dgGold">Construire avec nous</p>
            <h2 className="mt-3 text-3xl font-black">Partenariats & opportunités</h2>
            <p className="mt-4 leading-8 text-slate-300">Vous avez un projet, une capacité, une opportunité ou une proposition de collaboration ? DG AFRIQUE peut être un premier point de contact.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/investisseurs-partenaires" className="inline-flex items-center gap-2 rounded-xl bg-dgGold px-5 py-3 font-black text-dgNavy">Devenir partenaire <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/opportunites" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 font-black text-white">Voir les opportunités</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 text-center sm:px-6 lg:px-8"><p className="text-xl font-black text-dgNavy">{siteConfig.tagline}</p></section>
    </>
  );
}
