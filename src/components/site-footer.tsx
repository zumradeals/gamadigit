import Link from 'next/link';
import { Logo } from '@/components/brand/logo';
import { getPublicFamilies, getPublicSiteSettings } from '@/lib/public-content';

export async function SiteFooter() {
  const [families, settings] = await Promise.all([
    getPublicFamilies(),
    getPublicSiteSettings(),
  ]);
  const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Bonjour GamaDigit, je souhaite obtenir des informations.')}`;

  return (
    <footer className="bg-[#041726] text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo className="h-14 w-auto rounded-lg bg-white p-2" />
          <p className="mt-5 max-w-sm text-sm leading-7">{settings.description}</p>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-cyan">{settings.ecosystem}</p>
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
            <p>{settings.location}</p>
            <p>{settings.phone}</p>
            <p>{settings.email}</p>
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-block font-bold text-mint">WhatsApp direct</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {settings.name}. Tous droits réservés.
      </div>
    </footer>
  );
}
