import { Head, Link } from '@inertiajs/react';
import AppShell from '../../Layouts/AppShell';
import Icon from '../../Components/Icon';

export default function Home({ poles = [] }) {
  return <AppShell><Head title="Portail" />
    <section className="relative overflow-hidden border-b border-line">
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold-100/60 blur-3xl" />
      <div className="dg-container relative grid min-h-[72vh] items-center gap-10 py-14 lg:grid-cols-[1.1fr_.9fr] lg:py-24">
        <div className="max-w-3xl animate-float-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-line bg-white px-3 py-1.5 font-mono text-[.68rem] uppercase tracking-[.1em] text-gold"><span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-gold" />DG Afrique V2.0 · écosystème GAMAD</div>
          <h1 className="font-display text-hero">Des capacités humaines.<br/><span className="italic text-gold">Des projets qui prennent vie.</span></h1>
          <p className="mt-7 max-w-2xl text-[1.08rem] leading-8 text-ink-500">Découvrez, apprenez, trouvez des personnes et des services, rejoignez ZUMRA et transformez progressivement une capacité en action, puis une action en projet.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/app" className="dg-focus inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-paper">Entrer dans la Super App <Icon name="arrow" size={16}/></Link><Link href="#poles" className="dg-focus inline-flex min-h-12 items-center rounded-full border border-line-strong bg-white px-6 text-sm font-semibold">Explorer les pôles</Link></div>
        </div>
        <div className="dg-panel relative min-h-[24rem] overflow-hidden bg-ink p-7 text-paper shadow-lift">
          <span className="dg-eyebrow text-gold-400">Graphe de capacités</span>
          <h2 className="mt-3 max-w-sm font-display text-[2rem] leading-tight">Un portail qui devient personnel quand votre identité est connue.</h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {['Je sais faire', 'Je veux apprendre', 'Je cherche une équipe', 'Je veux construire'].map((label, i) => <div key={label} className={`rounded-2xl border p-4 ${i === 0 ? 'border-gold-line bg-gold-100 text-ink' : 'border-white/10 bg-white/5 text-paper'}`}><div className="text-[.7rem] uppercase tracking-[.1em] opacity-60">Capacité {String(i+1).padStart(2,'0')}</div><div className="mt-2 font-semibold">{label}</div></div>)}
          </div>
        </div>
      </div>
    </section>
    <section id="poles" className="dg-container py-14 lg:py-20"><div className="mb-8 max-w-2xl"><span className="dg-eyebrow">Production & autonomie</span><h2 className="mt-2 font-display text-display">Quatre pôles pour commencer à produire.</h2><p className="mt-4 text-body text-ink-500">Le numérique est transversal, mais DG Afrique reste ancré dans l’économie réelle.</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{poles.map((pole, index) => <article key={pole.id} className="group rounded-card border border-line bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-gold-line hover:shadow-card"><div className="mb-8 flex items-center justify-between"><span className="font-mono text-[.67rem] uppercase tracking-[.1em] text-gold">0{index+1}</span><Icon name="arrow" size={17} className="text-muted transition group-hover:translate-x-1 group-hover:text-gold"/></div><div className="text-meta font-semibold text-muted">{pole.kicker}</div><h3 className="mt-1 font-display text-title">{pole.name}</h3><p className="mt-3 text-body text-ink-500">{pole.description}</p></article>)}</div></section>
    <section className="bg-ink text-paper"><div className="dg-container grid gap-8 py-14 lg:grid-cols-2 lg:items-center lg:py-20"><div><span className="dg-eyebrow text-gold-400">Programme ZUMRA</span><h2 className="mt-3 font-display text-display">Apprendre · Transmettre · Agir</h2><p className="mt-4 max-w-2xl text-body text-ink-200">ZUMRA devient le réseau humain transversal de la Super App : aujourd’hui espaces collectifs et projets, demain fil d’activité, messagerie, commentaires et partage conçus pour provoquer des actions utiles.</p></div><div className="grid gap-3 sm:grid-cols-3">{['Apprendre ensemble','Trouver les bonnes capacités','Construire des projets'].map((x) => <div key={x} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-semibold">{x}</div>)}</div></div></section>
  </AppShell>;
}
