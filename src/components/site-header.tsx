import Link from 'next/link';
import { Menu, MessageCircle } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { siteConfig } from '@/lib/site';

const menuItems = [
  { label: 'Accueil', href: '/' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Nos pôles', href: '/#poles' },
  { label: 'Opportunités', href: '/opportunites' },
  { label: 'Investisseurs & partenaires', href: '/investisseurs-partenaires' },
  { label: 'Actualités', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export async function SiteHeader() {
  const whatsappLink = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent('Bonjour DG AFRIQUE, je souhaite vous présenter un projet, une opportunité ou un besoin de partenariat.')}`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Accueil DG AFRIQUE"><Logo /></Link>
        <nav className="hidden items-center gap-5 text-sm font-semibold text-slate-700 2xl:flex">
          {menuItems.map((item) => <Link key={item.label} href={item.href} className="transition hover:text-dgGreen">{item.label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="hidden items-center gap-2 rounded-xl bg-dgGreen px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 sm:inline-flex">
            <MessageCircle className="h-4 w-4" /> Parler de mon projet
          </a>
          <details className="group relative 2xl:hidden">
            <summary className="flex cursor-pointer list-none items-center rounded-xl border border-slate-200 p-3 text-dgNavy marker:content-none" aria-label="Ouvrir le menu"><Menu className="h-5 w-5" /></summary>
            <div className="absolute right-0 top-14 max-h-[75vh] w-[min(24rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-soft">
              {menuItems.map((item) => <Link key={item.label} href={item.href} className="block rounded-xl px-4 py-3 font-bold text-dgNavy hover:bg-dgIvory">{item.label}</Link>)}
              <Link href="/gamadigit" className="mt-2 block rounded-xl bg-dgNavy px-4 py-3 font-black text-white">Entrer dans GamaDigit</Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
