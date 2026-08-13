'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CircleUserRound, Cloud, Home, Network, Settings } from 'lucide-react';

const items = [
  { label: 'Tableau de bord', href: '/espace', icon: Home, exact: true },
  { label: 'Mon profil', href: '/espace/profil', icon: CircleUserRound },
  { label: 'ZUMRA', href: '/espace/zumra', icon: Network },
  { label: 'GamaDrive', href: '/federation/continue/gamadrive', icon: Cloud, prefetch: false },
  { label: 'Paramètres', href: '/espace#parametres', icon: Settings, exact: true },
];

export function WorkspaceNav() {
  const pathname = usePathname();

  return (
    <aside aria-label="Navigation de Mon espace" className="border-b border-border bg-white lg:min-h-[calc(100vh-4.5rem)] lg:border-b-0 lg:border-r">
      <div className="px-4 py-4 lg:sticky lg:top-[4.5rem] lg:px-5 lg:py-7">
        <p className="hidden px-3 text-xs font-extrabold uppercase tracking-[0.15em] text-muted lg:block">Mon espace</p>
        <nav className="mt-0 flex gap-2 overflow-x-auto pb-1 lg:mt-4 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
          {items.map(({ label, href, icon: Icon, exact, prefetch }) => {
            const active = exact ? pathname === href : pathname.startsWith(href.split('#')[0]);
            return (
              <Link
                key={label}
                href={href}
                prefetch={prefetch}
                aria-current={active ? 'page' : undefined}
                className={`focus-ring flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-extrabold transition lg:w-full ${active ? 'bg-cloud text-ocean' : 'text-copy hover:bg-cloud hover:text-ink'}`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-cyan' : 'text-muted'}`} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
