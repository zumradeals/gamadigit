import Link from 'next/link';
import { Logo } from '@/components/brand/logo';
import { siteConfig } from '@/lib/site';

export async function SiteFooter({ logoUrl }: { logoUrl?: string }) {
  const whatsappLink = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent('Bonjour DG AFRIQUE, je souhaite obtenir des informations.')}`;

  return (
    <footer className="bg-ink text-white/70">
      <div className="dg-container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div><Logo src={logoUrl} /><p className="mt-5 max-w-sm text-sm leading-7">Le portail humain de l’écosystème GAMAD, pensé pour les réalités africaines.</p><p className="mt-4 text-xs font-extrabold uppercase tracking-[0.16em] text-cyan">Des solutions pour faire avancer l’Afrique.</p></div>
        <div><h2 className="font-extrabold text-white">DG Afrique</h2><div className="mt-4 space-y-3 text-sm"><Link href="/a-propos" className="block hover:text-white">Qui sommes-nous ?</Link><Link href="/pole-numerique" className="block hover:text-white">Pôle numérique</Link><Link href="/opportunites" className="block hover:text-white">Opportunités</Link><Link href="/blog" className="block hover:text-white">Articles & conseils</Link></div></div>
        <div><h2 className="font-extrabold text-white">Écosystème</h2><div className="mt-4 space-y-3 text-sm"><Link href="/programme-zumra" className="block hover:text-white">ZUMRA</Link><Link href="/pole-numerique" className="block hover:text-white">Services disponibles</Link><Link href="/logiciels" className="block hover:text-white">Logiciels</Link><Link href="/formations" className="block hover:text-white">Formations</Link></div></div>
        <div><h2 className="font-extrabold text-white">Contact</h2><div className="mt-4 space-y-3 text-sm"><p>{siteConfig.location}</p><p>{siteConfig.phone}</p><a href={whatsappLink} target="_blank" rel="noreferrer" className="focus-ring inline-flex min-h-11 items-center font-extrabold text-mint">WhatsApp direct</a></div></div>
      </div>
      <div className="border-t border-white/10 px-4 py-6 text-center text-xs text-white/45">© {new Date().getFullYear()} DG AFRIQUE — Un satellite de l’écosystème GAMAD.</div>
    </footer>
  );
}
