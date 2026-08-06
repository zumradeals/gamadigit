import Link from 'next/link';
import { families } from '@/lib/content';
import { siteConfig, whatsappUrl } from '@/lib/site';
import { Logo } from '@/components/brand/logo';

export function SiteFooter() {
  return (
    <footer className="bg-[#041726] text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo className="h-14 w-auto rounded-lg bg-white p-2" />
          <p className="mt-5 max-w-sm text-sm leading-7">{siteConfig.description}</p>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-cyan">{siteConfig.ecosystem}</p>
        </div>
        <div>
          <h2 className="font-bold text-white">Nos familles</h2>
          <div className="mt-4 space-y-3 text-sm">
            {families.slice(0, 4).map((family) => (
              <Link key={family.id} href={`/services/${family.slug}`} className="block hover:text-white">{family.shortName}</Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-bold text-white">Explorer</h2>
          <div className="mt-4 space-y-3 text-sm">
            <Link href="/blog" className="block hover:text-white">Blog</Link>
            <Link href="/contact" className="block hover:text-white">Demander un devis</Link>
            <Link href="/admin" className="block hover:text-white">Administration</Link>
          </div>
        </div>
        <div>
          <h2 className="font-bold text-white">Contact</h2>
          <div className="mt-4 space-y-3 text-sm">
            <p>{siteConfig.location}</p>
            <p>{siteConfig.phone}</p>
            <p>{siteConfig.email}</p>
            <a href={whatsappUrl('Bonjour GamaDigit, je souhaite obtenir des informations.')} target="_blank" rel="noreferrer" className="inline-block font-bold text-mint">WhatsApp direct</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} GamaDigit. Tous droits réservés.
      </div>
    </footer>
  );
}
