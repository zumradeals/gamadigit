'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { BriefcaseBusiness, CircleUserRound, Grid2X2, Menu } from 'lucide-react';
import { Logo } from '@/components/brand/logo';

const menuItems = [
  { label: 'Pôle numérique', href: '/pole-numerique' },
  { label: 'Opportunités', href: '/opportunites' },
  { label: 'Services', href: '/pole-numerique' },
  { label: 'Articles', href: '/blog' },
];

export function SiteHeader({ logoUrl }: { logoUrl?: string }) {
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  const closeMenu = () => {
    if (mobileMenuRef.current) mobileMenuRef.current.open = false;
  };

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/95 text-white shadow-sm backdrop-blur">
      <div className="dg-container flex min-h-[4.5rem] items-center justify-between gap-3 py-2">
        <Link href="/" aria-label="Accueil DG AFRIQUE" onClick={closeMenu} className="min-w-0 shrink"><Logo src={logoUrl} /></Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-5 text-sm font-bold text-white/80 lg:flex">
          {menuItems.map((item) => <Link key={item.label} href={item.href} className="focus-ring rounded-md transition hover:text-white">{item.label}</Link>)}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/pole-numerique" className="dg-button-primary hidden xl:inline-flex">
            <BriefcaseBusiness className="h-4 w-4" /> Trouver une solution
          </Link>
          <Link href="/pole-numerique" aria-label="Voir les services DG Afrique" className="focus-ring hidden min-h-11 min-w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white sm:inline-flex">
            <Grid2X2 className="h-5 w-5" />
          </Link>
          <Link href="/espace" className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-white/10">
            <CircleUserRound className="h-4 w-4" /> <span className="hidden sm:inline">Mon espace</span>
          </Link>
          <details ref={mobileMenuRef} className="group relative lg:hidden">
            <summary className="focus-ring flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center rounded-full border border-white/15 bg-white/5 text-white marker:content-none" aria-label="Ouvrir le menu"><Menu className="h-5 w-5" /></summary>
            <div className="absolute right-0 top-14 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-border bg-white p-3 text-ink shadow-floating">
              {menuItems.map((item) => <Link key={item.label} href={item.href} onClick={closeMenu} className="focus-ring block rounded-xl px-4 py-3 font-bold hover:bg-cloud">{item.label}</Link>)}
              <Link href="/pole-numerique" onClick={closeMenu} className="mt-2 flex items-center gap-2 rounded-xl bg-sand px-4 py-3 font-black text-ink"><BriefcaseBusiness className="h-4 w-4" /> Trouver une solution</Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
