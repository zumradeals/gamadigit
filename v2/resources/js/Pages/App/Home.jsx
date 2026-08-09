import { Head, Link } from '@inertiajs/react';
import AppShell from '../../Layouts/AppShell';
import Icon from '../../Components/Icon';

const intents = [
  ['Apprendre', 'Développer une capacité', 'spark'],
  ['Explorer', 'Trouver personnes, services et pôles', 'compass'],
  ['Construire', 'Former une équipe et faire avancer un projet', 'folder'],
  ['Produire', 'Accéder aux pôles et activités économiques', 'arrow'],
];

export default function Home({ profile, poles = [] }) {
  return <AppShell current="home"><Head title="Accueil" />
    <div className="dg-container py-8 lg:py-12">
      <div className="mb-8 max-w-3xl"><span className="dg-eyebrow">Votre parcours</span><h1 className="mt-2 font-display text-display">Bonjour {profile?.firstName || ''}.<br/>Que voulez-vous faire aujourd’hui ?</h1></div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{intents.map(([title, desc, icon], i) => <button key={title} className={`dg-focus group min-h-[11rem] rounded-card border p-5 text-left transition hover:-translate-y-1 hover:shadow-card ${i === 0 ? 'border-gold-line bg-gold-50' : 'border-line bg-white'}`}><Icon name={icon} className={i === 0 ? 'text-gold' : 'text-ink-500'} /><h2 className="mt-8 font-display text-title">{title}</h2><p className="mt-2 text-sm leading-6 text-ink-500">{desc}</p></button>)}</div>
      <div className="mt-8 grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <section className="dg-panel p-6"><span className="dg-eyebrow">Prochaine action utile</span><h2 className="mt-2 font-display text-title">Continuez votre profil de capacités</h2><p className="mt-3 max-w-xl text-body text-ink-500">{profile?.nextAction}</p><div className="mt-6 h-2 overflow-hidden rounded-full bg-paper-warm"><div className="h-full rounded-full bg-gold" style={{ width: `${profile?.profileCompletion || 0}%` }} /></div><div className="mt-2 text-meta text-muted">Profil complété à {profile?.profileCompletion || 0}%</div></section>
        <section className="rounded-card bg-ink p-6 text-paper"><span className="dg-eyebrow text-gold-400">ZUMRA</span><h2 className="mt-2 font-display text-title">Votre réseau d’action</h2><p className="mt-3 text-body text-ink-200">Découvrez l’activité utile du réseau, vos invitations, les besoins et les projets qui pourraient vous concerner.</p><Link href="/app/zumra" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-400">Ouvrir ZUMRA <Icon name="arrow" size={16}/></Link></section>
      </div>
      <section className="mt-10"><div className="mb-4 flex items-end justify-between"><div><span className="dg-eyebrow">Pôles</span><h2 className="mt-1 font-display text-title">Produire dans l’écosystème</h2></div><Link href="/app/explorer" className="text-sm font-semibold text-gold">Tout explorer</Link></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{poles.map((pole) => <article key={pole.id} className="rounded-2xl border border-line bg-white p-4 font-semibold">{pole.name}</article>)}</div></section>
    </div>
  </AppShell>;
}
