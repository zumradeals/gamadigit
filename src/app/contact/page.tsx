import type { Metadata } from 'next';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { siteConfig, whatsappUrl } from '@/lib/site';

export const metadata: Metadata = { title: 'Contact et devis', description: 'Présentez votre projet numérique à GamaDigit.' };

export default function ContactPage() {
  return (
    <section className="bg-cloud px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <div><p className="text-sm font-black uppercase tracking-[0.17em] text-ocean">Parlons de votre projet</p><h1 className="mt-4 text-4xl font-black text-ink sm:text-6xl">Une première discussion peut déjà clarifier la bonne direction.</h1><p className="mt-6 text-lg leading-8 text-slate-600">Décrivez votre besoin, votre public et l’objectif prioritaire. Nous vous répondrons avec les prochaines étapes.</p><div className="mt-8 space-y-4 text-slate-700"><p className="flex items-center gap-3"><MapPin className="h-5 w-5 text-ocean" />{siteConfig.location}</p><p className="flex items-center gap-3"><Phone className="h-5 w-5 text-ocean" />{siteConfig.phone}</p><p className="flex items-center gap-3"><Mail className="h-5 w-5 text-ocean" />{siteConfig.email}</p></div></div>
        <div className="rounded-3xl bg-white p-7 shadow-soft sm:p-10"><h2 className="text-2xl font-black text-ink">Demande de devis</h2><p className="mt-3 leading-7 text-slate-600">Le formulaire connecté au back-office arrive dans la prochaine étape. WhatsApp est disponible immédiatement.</p><a href={whatsappUrl('Bonjour GamaDigit, je souhaite demander un devis. Mon projet concerne : ')} target="_blank" rel="noreferrer" className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-mint px-6 py-4 font-black text-white"><MessageCircle className="h-5 w-5" />Continuer sur WhatsApp</a></div>
      </div>
    </section>
  );
}
