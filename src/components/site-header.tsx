'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { CircleUserRound, Menu } from 'lucide-react';
import { Logo } from '@/components/brand/logo';

const menuItems = [
  { label: 'Accueil', href: '/' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Pôle numérique', href: '/pole-numerique' },
  { label: 'Services', href: '/#services' },
  { label: 'Opportunités', href: '/opportunites' },
  { label: 'Partenaires', href: '/investisseurs-partenaires' },
  { label: 'Actualités', href: '/blog' },
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
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Accueil DG AFRIQUE" onClick={closeMenu} className="min-w-0 shrink"><Logo src={logoUrl} /></Link>

        <nav className="hidden items-center gap-6 text-sm font-bold text-slate-700 lg:flex">
          {menuItems.map((item) => <Link key={item.label} href={item.href} className="transition hover:text-dgGreen">{item.label}</Link>)}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/connexion" className="inline-flex items-center gap-2 rounded-xl bg-dgNavy px-4 py-3 text-sm font-black text-white transition hover:opacity-95">
            <CircleUserRound className="h-4 w-4" /> <span className="hidden sm:inline">Mon espace</span>
          </Link>
          <details ref={mobileMenuRef} className="group relative lg:hidden">
            <summary className="flex cursor-pointer list-none items-center rounded-xl border border-slate-200 p-3 text-dgNavy marker:content-none" aria-label="Ouvrir le menu"><Menu className="h-5 w-5" /></summary>
            <div className="absolute right-0 top-14 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-3 shadow-soft">
              {menuItems.map((item) => <Link key={item.label} href={item.href} onClick={closeMenu} className="block rounded-xl px-4 py-3 font-bold text-dgNavy hover:bg-dgIvory">{item.label}</Link>)}
              <Link href="/connexion" onClick={closeMenu} className="mt-2 flex items-center gap-2 rounded-xl bg-dgNavy px-4 py-3 font-black text-white"><CircleUserRound className="h-4 w-4" /> Mon espace</Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
