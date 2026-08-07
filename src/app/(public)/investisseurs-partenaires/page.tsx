import { Globe2, Handshake, Network, Target } from 'lucide-react';
import { whatsappUrl } from '@/lib/site';

const profiles = [
  { title: 'Investisseurs', text: 'Présentez vos secteurs, pays, tailles de projets et critères de recherche afin d’identifier des opportunités pertinentes.', icon: Target },
  { title: 'Partenaires commerciaux', text: 'Développez des marchés, recherchez un distributeur, un fournisseur, un acheteur ou un relais local.', icon: Handshake },
  { title: 'Partenaires techniques', text: 'Apportez une technologie, une expertise, un savoir-faire ou une capacité opérationnelle autour de projets africains.', icon: Network },
  { title: 'Partenaires internationaux', text: 'Construisez des passerelles entre entreprises africaines et acteurs internationaux dans une logique B2B.', icon: Globe2 },
];

export default function InvestorsPartnersPage() {
  return (
    <>
      <section className="bg-dgNavy px-4 py-20 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl"><p className="text-sm font-black uppercase tracking-[0.17em] text-dgGold">Investisseurs & partenaires</p><h1 className="mt-4 text-4xl font-black sm:text-6xl">Construire des connexions utiles entre l’Afrique et l’international.</h1><p className="mt-6 max-w-4xl text-xl leading-9 text-slate-300">DG AFRIQUE facilite la mise en relation entre porteurs de projets, entreprises, investisseurs et partenaires stratégiques selon la nature des opportunités.</p></div></section>
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="grid gap-6 md:grid-cols-2">{profiles.map(({title,text,icon:Icon})=><article key={title} className="rounded-2xl border border-slate-200 p-7"><Icon className="h-9 w-9 text-dgGreen"/><h2 className="mt-5 text-2xl font-black text-dgNavy">{title}</h2><p className="mt-4 leading-8 text-slate-600">{text}</p></article>)}</div></div></section>
      <section className="bg-dgIvory px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-8 shadow-sm sm:p-12"><p className="text-sm font-black uppercase tracking-[0.16em] text-dgGreen">Entrer en relation</p><h2 className="mt-3 text-3xl font-black text-dgNavy">Présentez votre profil ou votre recherche.</h2><p className="mt-5 max-w-3xl leading-8 text-slate-600">Indiquez votre organisation, votre pays, les secteurs concernés et le type de collaboration recherché. DG AFRIQUE pourra ensuite étudier la mise en relation adaptée.</p><a href={whatsappUrl('Bonjour DG AFRIQUE, je souhaite vous présenter mon profil d’investisseur ou de partenaire et discuter d’opportunités de collaboration.')} target="_blank" rel="noreferrer" className="mt-7 inline-flex rounded-xl bg-dgGreen px-6 py-4 font-black text-white">Proposer un partenariat</a></div></section>
    </>
  );
}
