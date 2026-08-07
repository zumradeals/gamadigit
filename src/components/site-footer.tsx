import Link from 'next/link';
import { Logo } from '@/components/brand/logo';
import { siteConfig } from '@/lib/site';

export async function SiteFooter() {
  const whatsappLink = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent('Bonjour DG AFRIQUE, je souhaite obtenir des informations.')}`;

  return (
    <footer className="bg-[#041726] text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="inline-block rounded-2xl bg-white p-3"><Logo /></div>
          <p className="mt-5 max-w-sm text-sm leading-7">{siteConfig.description}</p>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-amber">{siteConfig.tagline}</p>
        </div>
        <div>
          <h2 className="font-bold text-white">Nos pôles</h2>
          <div className="mt-4 space-y-3 text-sm">
            <Link href="/gamadigit" className="block hover:text-white">GamaDigit — pôle numérique</Link>
            <Link href="/#poles" className="block hover:text-white">Découvrir DG AFRIQUE</Link>
          </div>
        </div>
        <div>
          <h2 className="font-bold text-white">Explorer</h2>
          <div className="mt-4 space-y-3 text-sm">
            <Link href="/logiciels" className="block hover:text-white">Logiciels</Link>
            <Link href="/formations" className="block hover:text-white">Formations</Link>
            <Link href="/blog" className="block hover:text-white">Actualités & conseils</Link>
            <Link href="/contact" className="block hover:text-white">Contact</Link>
          </div>
        </div>
        <div>
          <h2 className="font-bold text-white">Contact</h2>
          <div className="mt-4 space-y-3 text-sm">
            <p>{siteConfig.location}</p>
            <p>{siteConfig.phone}</p>
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-block font-bold text-mint">WhatsApp direct</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} DG AFRIQUE SARL. Tous droits réservés.
      </div>
    </footer>
  );
}
