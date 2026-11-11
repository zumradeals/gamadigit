import Link from 'next/link';
import { ArrowRight, Globe2, Handshake, Network, Target } from 'lucide-react';
import { submitRelationshipInquiryAction } from './actions';

const profiles = [
  { title: 'Partenaires commerciaux', text: 'Développer un marché, rechercher un fournisseur, un acheteur, un distributeur ou un relais local.', icon: Handshake },
  { title: 'Partenaires techniques', text: 'Apporter une technologie, une expertise, un savoir-faire ou une capacité opérationnelle autour d’un besoin concret.', icon: Network },
  { title: 'Réseaux & acteurs internationaux', text: 'Créer des passerelles entre entreprises, experts, institutions et réseaux intéressés par des collaborations en Afrique.', icon: Globe2 },
  { title: 'Investisseurs', text: 'Présenter des secteurs, pays ou critères d’intérêt afin d’identifier progressivement des projets ou opportunités compatibles.', icon: Target },
];

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-dgNavy focus:border-dgGreen focus:outline-none focus:ring-2 focus:ring-emerald-100';

function RelationshipForm({ type }: { type: 'investor' | 'partner' }) {
  const investor = type === 'investor';
  return <form action={submitRelationshipInquiryAction} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <input type="hidden" name="inquiry_type" value={type}/>
    <p className="text-xs font-black uppercase tracking-[0.15em] text-dgGreen">{investor ? 'Investissement' : 'Partenariat'}</p>
    <h2 className="mt-3 text-2xl font-black text-dgNavy">{investor ? 'Présenter mes critères' : 'Proposer une collaboration'}</h2>
    <p className="mt-3 text-sm leading-6 text-slate-500">{investor ? 'Décrivez simplement les secteurs et types de projets qui vous intéressent.' : 'Présentez votre organisation, ce que vous apportez et le type de collaboration recherché.'}</p>
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <input required name="organization" placeholder="Organisation / entreprise" className={inputClass}/>
      <input required name="full_name" placeholder="Nom et prénom" className={inputClass}/>
      <input required name="phone" placeholder="Téléphone / WhatsApp" className={inputClass}/>
      <input name="email" type="email" placeholder="E-mail" className={inputClass}/>
      <input required name="country" placeholder="Pays" className={inputClass}/>
      <input name="sectors" placeholder="Secteurs d’intérêt" className={inputClass}/>
    </div>
    <textarea name="criteria" rows={3} placeholder={investor ? 'Pays, secteurs, taille ou type de projets recherchés' : 'Type de partenariat, marchés, expertise ou capacités proposées'} className={`${inputClass} mt-4`}/>
    <textarea required name="message" rows={5} placeholder="Présentez ce que vous souhaitez construire avec DG AFRIQUE." className={`${inputClass} mt-4`}/>
    <button className="mt-5 rounded-xl bg-dgGreen px-6 py-4 font-black text-white">Envoyer à DG AFRIQUE</button>
  </form>;
}

export default function InvestorsPartnersPage() {
  return <>
    <section className="relative overflow-hidden bg-dgNavy px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
      <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-dgGold/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-sm font-black uppercase tracking-[0.17em] text-dgGold">Partenariats</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-6xl">Construire progressivement un réseau de partenaires utiles.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">DG AFRIQUE est ouvert aux entreprises, experts, institutions, réseaux et investisseurs qui souhaitent explorer des collaborations concrètes autour du numérique, des projets et des opportunités en Afrique.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#proposer" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 font-black text-dgNavy">Proposer un partenariat <ArrowRight className="h-4 w-4" /></a>
            <Link href="/opportunites" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3.5 font-black text-white">Voir les opportunités</Link>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl"><p className="text-sm font-black uppercase tracking-[0.16em] text-dgGold">Avec qui collaborer ?</p><h2 className="mt-3 text-3xl font-black text-dgNavy sm:text-4xl">Des relations simples, basées sur un besoin réel.</h2><p className="mt-4 leading-8 text-slate-600">Nous ne cherchons pas à multiplier les partenariats pour le nombre. Nous privilégions les relations où les deux parties comprennent ce qu’elles peuvent construire ensemble.</p></div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">{profiles.map(({title,text,icon:Icon})=><article key={title} className="rounded-2xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:shadow-md"><Icon className="h-9 w-9 text-dgGreen"/><h3 className="mt-5 text-2xl font-black text-dgNavy">{title}</h3><p className="mt-4 leading-8 text-slate-600">{text}</p></article>)}</div>
      </div>
    </section>

    <section id="proposer" className="bg-dgIvory px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl"><p className="text-sm font-black uppercase tracking-[0.16em] text-dgGreen">Prendre contact</p><h2 className="mt-3 text-3xl font-black text-dgNavy sm:text-4xl">Présentez votre organisation et votre intention.</h2><p className="mt-4 leading-8 text-slate-600">Les demandes sont examinées avant toute mise en relation. Utilisez le parcours qui correspond le mieux à votre situation ; aucun partenariat n’est automatique.</p></div>
        <div className="grid gap-6 lg:grid-cols-2"><RelationshipForm type="partner"/><RelationshipForm type="investor"/></div>
      </div>
    </section>
  </>;
}
