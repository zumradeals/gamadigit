import { Head } from '@inertiajs/react';
import AppShell from '../../../Layouts/AppShell';
import ActivityPreview from '../../../Features/Zumra/ActivityPreview';

export default function ZumraIndex({ membership, activity = [] }) {
  return <AppShell current="zumra"><Head title="ZUMRA" />
    <section className="bg-ink text-paper"><div className="dg-container grid gap-8 py-10 lg:grid-cols-[1fr_.8fr] lg:items-end lg:py-14"><div><span className="dg-eyebrow text-gold-400">Réseau ZUMRA</span><h1 className="mt-3 font-display text-display">Un réseau social d’action, pas de distraction.</h1><p className="mt-4 max-w-2xl text-body text-ink-200">ZUMRA peut devenir pleinement social : activité, messagerie, commentaires, partage et relations entre membres — mais chaque interaction reste reliée à une capacité, un apprentissage, un besoin, une Zumra ou un projet.</p></div><div className="rounded-2xl border border-white/10 bg-white/5 p-5"><div className="text-meta uppercase tracking-[.1em] text-gold-400">Adhésion</div><div className="mt-2 font-display text-title">{membership?.status === 'active' ? 'Membre actif' : 'Découvrir le programme'}</div><p className="mt-2 text-sm leading-6 text-ink-200">Votre identité, votre Carte ZUMRA et vos espaces collectifs restent distincts des fonctions sociales.</p></div></div></section>
    <div className="dg-container grid gap-6 py-8 xl:grid-cols-[1.15fr_.85fr]"><ActivityPreview items={activity} /><section className="dg-panel p-6"><span className="dg-eyebrow">À venir</span><h2 className="mt-2 font-display text-title">Le social au service du réel</h2><div className="mt-5 grid gap-3">{['Fil d’activité contextuel','Messagerie personne ↔ Zumra ↔ projet','Commentaires et contributions','Partage de besoins, formations et projets'].map((x) => <div key={x} className="rounded-xl border border-line-soft bg-paper p-4 text-sm font-semibold">{x}</div>)}</div></section></div>
  </AppShell>;
}
