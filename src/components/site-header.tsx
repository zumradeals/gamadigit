import Link from 'next/link';
import { ChevronDown, Menu, MessageCircle } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { getPublicMenu } from '@/lib/navigation';
import { getPublicSiteSettings } from '@/lib/public-content';

export async function SiteHeader() {
  const [menuItems, settings] = await Promise.all([
    getPublicMenu('header'),
    getPublicSiteSettings(),
  ]);
  const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Bonjour GamaDigit, je souhaite parler de mon projet numérique.')}`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Accueil GamaDigit">
          <Logo className="h-12 w-auto" />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-700 lg:flex">
          {menuItems.map((item) => item.children.length ? (
            <div key={item.id} className="group relative">
              <Link href={item.url} target={item.target} className="flex items-center gap-1 py-7 hover:text-ocean">
                {item.label} <ChevronDown className="h-4 w-4" />
              </Link>
              <div className="invisible absolute left-1/2 top-[4.6rem] w-80 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-3 opacity-0 shadow-soft transition group-hover:visible group-hover:opacity-100">
                <div className="space-y-1">
                  {item.children.map((child) => (
                    <Link key={child.id} href={child.url} target={child.target} className="block rounded-xl px-4 py-3 font-bold text-ink hover:bg-cloud hover:text-ocean">
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Link key={item.id} href={item.url} target={item.target} className="hover:text-ocean">{item.label}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="hidden items-center gap-2 rounded-xl bg-mint px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200/50 transition hover:-translate-y-0.5 sm:inline-flex">
            <MessageCircle className="h-4 w-4" />
            Parler de mon projet
          </a>

          <details className="group relative lg:hidden">
            <summary className="flex cursor-pointer list-none items-center rounded-xl border border-slate-200 p-3 text-ink marker:content-none" aria-label="Ouvrir le menu">
              <Menu className="h-5 w-5" />
            </summary>
            <div className="absolute right-0 top-14 max-h-[75vh] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-soft">
              {menuItems.map((item) => item.children.length ? (
                <div key={item.id} className="mt-1 border-t border-slate-100 pt-2 first:border-t-0 first:pt-0">
                  <Link href={item.url} target={item.target} className="block rounded-xl px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-slate-400 hover:bg-cloud">{item.label}</Link>
                  {item.children.map((child) => (
                    <Link key={child.id} href={child.url} target={child.target} className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-cloud">{child.label}</Link>
                  ))}
                </div>
              ) : (
                <Link key={item.id} href={item.url} target={item.target} className="block rounded-xl px-4 py-3 font-bold text-ink hover:bg-cloud">{item.label}</Link>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
