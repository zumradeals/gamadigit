import { Link } from '@inertiajs/react';
import Icon from '../Components/Icon';

const icons = { home: 'home', explore: 'compass', zumra: 'people', projects: 'folder', me: 'person' };

export default function NavRail({ items, current }) {
  return <nav className="sticky top-16 hidden h-[calc(100vh-4rem)] w-24 shrink-0 flex-col items-center border-r border-line py-5 lg:flex" aria-label="Navigation principale">
    {items.map((item) => {
      const active = current === item.id;
      return <Link key={item.id} href={item.href} aria-current={active ? 'page' : undefined} className={`dg-focus mb-1 flex w-[4.75rem] flex-col items-center gap-1.5 rounded-tile py-3 text-[.67rem] font-semibold ${active ? 'bg-paper-warm text-ink' : 'text-muted hover:bg-paper-warm'}`}><Icon name={icons[item.id]} size={19} className={active ? 'text-gold' : ''} />{item.label}</Link>;
    })}
    <div className="flex-1" />
    <button className="dg-focus grid h-12 w-12 place-items-center rounded-2xl border border-gold-line bg-gold-100 text-gold"><Icon name="plus" /></button>
  </nav>;
}
