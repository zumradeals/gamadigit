import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Network, UsersRound, Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Programme ZUMRA',
  description: 'Un programme de developpement humain fonde sur la formation, le partage de connaissances, le travail collectif et la creation progressive de Zumra.',
  alternates: { canonical: '/programme-zumra' },
};

const principles = [
  { icon: BookOpen, title: 'Apprendre', text: 'Aucun diplome n’est exige. Une Zumra peut commencer de zero et construire progressivement ses competences.' },
  { icon: UsersRound, title: 'Transmettre', text: 'La connaissance acquise a vocation a circuler. Les membres apprennent les uns des autres et partagent leurs savoir-faire.' },
  { icon: Wrench, title: 'Agir', text: 'Les membres peuvent travailler sur des projets communs, des activites locales ou des initiatives entierement numeriques.' },
];

export default function ProgrammeZumraPage() {
  return <main className="bg-white">
    <section className="bg-dgNavy px-4 py-20 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-dgGold"><Network className="h-7 w-7" /></div><p className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-dgGold">Programme ZUMRA</p><h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.04em] sm:text-6xl">Apprendre. Transmettre. Agir ensemble.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">ZUMRA est un programme de developpement humain qui permet a des personnes de se former, de partager leurs capacites, de constituer des groupes de travail et de faire evoluer des initiatives utiles.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/espace/zumra" className="inline-flex items-center gap-2 rounded-xl bg-dgGold px-5 py-3 text-sm font-black text-dgNavy">Rejoindre le programme <ArrowRight className="h-4 w-4" /></Link><Link href="/programme-zumra/charte" className="rounded-xl border border-white/20 px-5 py-3 text-sm font-black text-white hover:bg-white/5">Lire la Charte</Link></div></div></section>

    <section className="px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl"><div className="grid gap-5 md:grid-cols-3">{principles.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-[2rem] border border-slate-200 p-7"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-dgIvory text-dgNavy"><Icon className="h-5 w-5" /></div><h2 className="mt-5 text-xl font-black text-dgNavy">{title}</h2><p className="mt-3 leading-7 text-slate-600">{text}</p></article>)}</div>

    <div className="mt-12 grid gap-6 lg:grid-cols-2"><article className="rounded-[2rem] bg-slate-50 p-8"><p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">Pour tous les parcours</p><h2 className="mt-3 text-2xl font-black text-dgNavy">L’humain avant le diplome</h2><p className="mt-4 leading-7 text-slate-600">Artisan, agriculteur, plombier, commercant, etudiant, autodidacte, association de quartier ou personne souhaitant simplement apprendre : chacun peut apporter une capacite ou commencer a en construire une.</p></article><article className="rounded-[2rem] bg-dgIvory p-8"><p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">Physique ou numerique</p><h2 className="mt-3 text-2xl font-black text-dgNavy">Une Zumra peut depasser les frontieres</h2><p className="mt-4 leading-7 text-slate-600">Les membres peuvent vivre dans la meme localite ou dans plusieurs pays. Le groupe se construit autour d’un domaine, d’un apprentissage, d’une activite ou d’un projet commun.</p></article></div>

    <div className="mt-12 rounded-[2rem] border border-slate-200 p-8 sm:p-10"><p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">Activation progressive</p><h2 className="mt-3 text-3xl font-black text-dgNavy">Une Zumra devient active a partir de 5 membres.</h2><p className="mt-4 max-w-3xl leading-7 text-slate-600">Le reseau sera construit progressivement : adhesion, Carte ZUMRA, profil de capacites, creation ou integration d’une Zumra, formation et projets. Les mecanismes de contribution et de financement seront ajoutes avec leurs propres regles de transparence et de gouvernance.</p></div></div></section>
  </main>;
}
