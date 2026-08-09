import { Link } from '@inertiajs/react';
import Icon from '../Components/Icon';
const icons = { home: 'home', explore: 'compass', zumra: 'people', projects: 'folder', me: 'person' };
export default function MobileTabBar({ items, current }) {
  return <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-line bg-paper/95 px-1 pb-[env(safe-area-inset-bottom)] pt-1.5 backdrop-blur-xl lg:hidden" aria-label="Navigation principale">
    {items.map((item) => { const active = current === item.id; return <Link key={item.id} href={item.href} className={`dg-focus flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-lg text-[.68rem] font-semibold ${active ? 'text-ink' : 'text-muted'}`}><Icon name={icons[item.id]} size={19} className={active ? 'text-gold' : ''} />{item.label}</Link>; })}
  </nav>;
}
