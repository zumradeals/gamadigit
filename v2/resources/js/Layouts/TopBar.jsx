import { Link, router } from '@inertiajs/react';
import Avatar from '../Components/Avatar';
import Icon from '../Components/Icon';

export default function TopBar({ user }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-xl">
      <div className="dg-container flex h-16 items-center gap-4">
        <Link href="/" className="dg-focus rounded-lg font-display text-xl tracking-[-.03em]">DG <span className="text-gold">Afrique</span></Link>
        <button type="button" onClick={() => router.visit('/app/explorer')} className="dg-focus mx-auto hidden h-10 w-full max-w-lg items-center gap-2 rounded-full border border-line bg-white px-4 text-left text-sm text-muted md:flex">
          <Icon name="compass" size={16} /><span>Rechercher une capacité, une Zumra, un projet…</span>
        </button>
        <div className="ml-auto flex items-center gap-2">
          {user ? <>
            <button className="dg-focus relative grid h-10 w-10 place-items-center rounded-full border border-line bg-white"><Icon name="bell" size={17} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-gold" /></button>
            <Link href="/app/moi" className="dg-focus flex items-center gap-2 rounded-full border border-line bg-white p-1 pr-3"><Avatar initials={user.initials || 'DG'} size="sm" /><span className="hidden text-sm font-semibold sm:block">{user.firstName || 'Moi'}</span></Link>
          </> : <Link href="/connexion" className="dg-focus rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper">Se connecter</Link>}
        </div>
      </div>
    </header>
  );
}
