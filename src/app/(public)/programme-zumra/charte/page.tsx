import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Charte des Zumra',
  description: 'Principes de participation au Programme ZUMRA.',
  alternates: { canonical: '/programme-zumra/charte' },
};

const rules = [
  ['1. Dignite humaine', 'Chaque membre est respecte independamment de son niveau d’etude, de son origine sociale, de son metier ou de sa situation economique.'],
  ['2. Formation', 'Une Zumra peut commencer sans competence particuliere. L’apprentissage, l’autoformation et la progression font partie de sa mission.'],
  ['3. Transmission', 'Un membre qui possede ou acquiert une connaissance est encourage a la partager avec les autres membres selon ses capacites.'],
  ['4. Travail collectif', 'La Zumra privilegie la cooperation, la responsabilite, l’entraide et la realisation d’activites utiles.'],
  ['5. Integrite', 'Fraude, detournement, exploitation des membres, violence, manipulation et activites illegales sont incompatibles avec le Programme ZUMRA.'],
  ['6. Activites admissibles', 'Une Zumra ne peut exercer, financer ou promouvoir une activite incompatible avec la dignite humaine, l’ethique du programme et ses regles. Une liste d’activites non admissibles pourra completer la presente Charte.'],
  ['7. Responsabilite collective', 'Chaque membre respecte la Charte et contribue, selon ses moyens, son role et ses capacites, au developpement de sa Zumra.'],
];

export default function ZumraCharterPage() {
  return <main className="bg-slate-50 px-4 py-12 sm:px-6 lg:px-8"><article className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-10"><Link href="/programme-zumra" className="inline-flex items-center gap-2 text-sm font-black text-dgNavy"><ArrowLeft className="h-4 w-4" /> Programme ZUMRA</Link><p className="mt-8 text-xs font-black uppercase tracking-[0.18em] text-dgGold">Version 1.0</p><h1 className="mt-3 text-4xl font-black text-dgNavy">Charte des Zumra</h1><p className="mt-4 leading-7 text-slate-600">Cette premiere version fixe les principes essentiels du programme. Les regles operationnelles sur la creation des Zumra, les responsabilites, les contributions, les projets et le financement seront precisees progressivement.</p><div className="mt-8 space-y-4">{rules.map(([title, text]) => <section key={title} className="rounded-2xl bg-slate-50 p-6"><h2 className="font-black text-dgNavy">{title}</h2><p className="mt-2 leading-7 text-slate-600">{text}</p></section>)}</div></article></main>;
}
