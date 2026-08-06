import Link from 'next/link';
import { ChevronDown, Menu, MessageCircle } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { getPublicFamilies, getPublicSiteSettings } from '@/lib/public-content';

export async function SiteHeader() {
  const [families, settings] = await Promise.all([
    getPublicFamilies(),
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
          <Link href="/" className="hover:text-ocean">Accueil</Link>
          <div className="group relative">
            <button className="flex items-center gap-1 py-7 hover:text-ocean">Services <ChevronDown className="h-4 w-4" /></button>
            <div className="invisible absolute left-1/2 top-[4.6rem] w-[34rem] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-3 opacity-0 shadow-soft transition group-hover:visible group-hover:opacity-100">
              <div className="grid grid-cols-2 gap-1">
                {families.map((family) => (
                  <Link key={family.id} href={`/services/${family.slug}`} className="rounded-xl p-3 hover:bg-cloud">
                    <span className="block font-bold text-ink">{family.shortName}</span>
                    <span className="mt-1 block text-xs font-normal leading-5 text-slate-500">{family.description}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/blog" className="hover:text-ocean">Blog</Link>
          <Link href="/contact" className="hover:text-ocean">Contact</Link>
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
            <div className="absolute right-0 top-14 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-3 shadow-soft">
              <Link href="/" className="block rounded-xl px-4 py-3 font-bold text-ink hover:bg-cloud">Accueil</Link>
              <div className="mt-1 border-t border-slate-100 pt-2">
                <p className="px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">Services</p>
                {families.map((family) => (
                  <Link key={family.id} href={`/services/${family.slug}`} className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-cloud">{family.shortName}</Link>
                ))}
              </div>
              <div className="mt-1 border-t border-slate-100 pt-2">
                <Link href="/blog" className="block rounded-xl px-4 py-3 font-bold text-ink hover:bg-cloud">Blog</Link>
                <Link href="/contact" className="block rounded-xl px-4 py-3 font-bold text-ink hover:bg-cloud">Contact</Link>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
