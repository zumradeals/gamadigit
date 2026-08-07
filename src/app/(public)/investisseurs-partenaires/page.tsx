import { Globe2, Handshake, Network, Target } from 'lucide-react';
import { submitRelationshipInquiryAction } from './actions';

const profiles = [
  { title: 'Investisseurs', text: 'Présentez vos secteurs, pays, tailles de projets et critères de recherche afin d’identifier des opportunités pertinentes.', icon: Target },
  { title: 'Partenaires commerciaux', text: 'Développez des marchés, recherchez un distributeur, un fournisseur, un acheteur ou un relais local.', icon: Handshake },
  { title: 'Partenaires techniques', text: 'Apportez une technologie, une expertise, un savoir-faire ou une capacité opérationnelle autour de projets africains.', icon: Network },
  { title: 'Partenaires internationaux', text: 'Construisez des passerelles entre entreprises africaines et acteurs internationaux dans une logique B2B.', icon: Globe2 },
];

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-dgNavy focus:border-dgGreen focus:outline-none focus:ring-2 focus:ring-emerald-100';

function RelationshipForm({ type }: { type: 'investor' | 'partner' }) {
  const investor = type === 'investor';
  return <form action={submitRelationshipInquiryAction} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <input type="hidden" name="inquiry_type" value={type}/>
    <p className="text-xs font-black uppercase tracking-[0.15em] text-dgGreen">{investor ? 'Profil investisseur' : 'Profil partenaire'}</p>
    <h2 className="mt-3 text-2xl font-black text-dgNavy">{investor ? 'Présenter mes critères d’investissement' : 'Proposer un partenariat'}</h2>
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <input required name="organization" placeholder="Organisation / entreprise" className={inputClass}/>
      <input required name="full_name" placeholder="Nom et prénom" className={inputClass}/>
      <input required name="phone" placeholder="Téléphone / WhatsApp" className={inputClass}/>
      <input name="email" type="email" placeholder="E-mail" className={inputClass}/>
      <input required name="country" placeholder="Pays" className={inputClass}/>
      <input name="sectors" placeholder="Secteurs d’intérêt" className={inputClass}/>
    </div>
    <textarea name="criteria" rows={3} placeholder={investor ? 'Pays, taille de projets, niveau d’avancement ou critères recherchés' : 'Type de partenariat, marchés, expertise ou capacités proposées'} className={`${inputClass} mt-4`}/>
    <textarea required name="message" rows={5} placeholder="Présentez votre recherche et ce que vous souhaitez construire avec DG AFRIQUE." className={`${inputClass} mt-4`}/>
    <button className="mt-5 rounded-xl bg-dgGreen px-6 py-4 font-black text-white">Envoyer à DG AFRIQUE</button>
  </form>;
}

export default function InvestorsPartnersPage() {
  return <>
    <section className="bg-dgNavy px-4 py-20 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl"><p className="text-sm font-black uppercase tracking-[0.17em] text-dgGold">Investisseurs & partenaires</p><h1 className="mt-4 text-4xl font-black sm:text-6xl">Construire des connexions utiles entre l’Afrique et l’international.</h1><p className="mt-6 max-w-4xl text-xl leading-9 text-slate-300">DG AFRIQUE facilite la mise en relation entre porteurs de projets, entreprises, investisseurs et partenaires stratégiques selon la nature des opportunités.</p></div></section>
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="grid gap-6 md:grid-cols-2">{profiles.map(({title,text,icon:Icon})=><article key={title} className="rounded-2xl border border-slate-200 p-7"><Icon className="h-9 w-9 text-dgGreen"/><h2 className="mt-5 text-2xl font-black text-dgNavy">{title}</h2><p className="mt-4 leading-8 text-slate-600">{text}</p></article>)}</div></div></section>
    <section className="bg-dgIvory px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="mb-10 max-w-3xl"><p className="text-sm font-black uppercase tracking-[0.16em] text-dgGreen">Entrer dans notre réseau</p><h2 className="mt-3 text-3xl font-black text-dgNavy sm:text-4xl">Deux parcours, une qualification claire.</h2><p className="mt-4 leading-8 text-slate-600">Les investisseurs et les partenaires disposent désormais de formulaires distincts. Chaque profil arrive séparément dans le dashboard DG AFRIQUE pour être étudié et mis en relation.</p></div><div className="grid gap-6 lg:grid-cols-2"><RelationshipForm type="investor"/><RelationshipForm type="partner"/></div></div></section>
  </>;
}
