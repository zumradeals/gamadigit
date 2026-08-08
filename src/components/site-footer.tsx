import Link from 'next/link';
import { Logo } from '@/components/brand/logo';
import { siteConfig } from '@/lib/site';

export async function SiteFooter({ logoUrl }: { logoUrl?: string }) {
  const whatsappLink = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent('Bonjour DG AFRIQUE, je souhaite obtenir des informations.')}`;

  return (
    <footer className="bg-dgNavy text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="inline-block rounded-2xl bg-white p-3"><Logo src={logoUrl} /></div>
          <p className="mt-5 max-w-sm text-sm leading-7">Une porte d’entrée vers l’information, les opportunités, les solutions et les services utiles en Afrique.</p>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-dgGold">L’Afrique, reliée à ses possibilités.</p>
        </div>

        <div>
          <h2 className="font-bold text-white">Explorer</h2>
          <div className="mt-4 space-y-3 text-sm">
            <Link href="/#explorer" className="block hover:text-white">Grands univers</Link>
            <Link href="/opportunites" className="block hover:text-white">Opportunités</Link>
            <Link href="/#actualite" className="block hover:text-white">Actualités</Link>
            <Link href="/a-propos" className="block hover:text-white">À propos</Link>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-white">Services</h2>
          <div className="mt-4 space-y-3 text-sm">
            <Link href="/connexion" className="block font-bold text-dgGold hover:text-white">Mon espace</Link>
            <Link href="/pole-numerique" className="block hover:text-white">Solutions numériques</Link>
            <Link href="/logiciels" className="block hover:text-white">Logiciels</Link>
            <Link href="/formations" className="block hover:text-white">Formations</Link>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-white">Contact</h2>
          <div className="mt-4 space-y-3 text-sm">
            <p>{siteConfig.location}</p>
            <p>{siteConfig.phone}</p>
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-block font-bold text-dgGold">WhatsApp direct</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-6 text-center text-xs text-slate-500">© {new Date().getFullYear()} DG AFRIQUE. Tous droits réservés.</div>
    </footer>
  );
}
