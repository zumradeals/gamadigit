import Icon from '../../Components/Icon';

const kindLabel = { need: 'Besoin', learning: 'Apprentissage', project: 'Projet', event: 'Activité' };

export default function ActivityPreview({ items = [] }) {
  return <section className="dg-panel overflow-hidden">
    <div className="flex items-end justify-between gap-4 border-b border-line px-5 py-4">
      <div><span className="dg-eyebrow">Réseau vivant</span><h2 className="mt-1 font-display text-title">Activité utile</h2></div>
      <span className="max-w-[14rem] text-right text-meta text-muted">Le futur fil ZUMRA : communication au service de l’action.</span>
    </div>
    <div className="divide-y divide-line-soft">
      {items.map((item, index) => <article key={`${item.title}-${index}`} className="group flex gap-4 px-5 py-4 transition hover:bg-paper-warm/60">
        <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold-50 text-gold"><Icon name={item.kind === 'project' ? 'folder' : item.kind === 'need' ? 'spark' : 'people'} size={17} /></span>
        <div className="min-w-0 flex-1"><div className="mb-1 text-[.67rem] font-semibold uppercase tracking-[.1em] text-gold">{kindLabel[item.kind] || 'Activité'}</div><h3 className="text-sm font-semibold leading-snug">{item.title}</h3><p className="mt-1 text-meta text-muted">{item.meta}</p></div>
        <Icon name="arrow" size={16} className="mt-3 shrink-0 text-muted transition group-hover:translate-x-1 group-hover:text-gold" />
      </article>)}
    </div>
  </section>;
}
