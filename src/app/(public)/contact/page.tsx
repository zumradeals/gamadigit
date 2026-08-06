import type { Metadata } from 'next';
import { Mail, MapPin, Phone } from 'lucide-react';
import { LeadForm } from '@/components/contact/lead-form';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact et devis',
  description: 'Présentez votre projet numérique à GamaDigit.',
};

export default function ContactPage() {
  return (
    <section className="bg-cloud px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.17em] text-ocean">Parlons de votre projet</p>
          <h1 className="mt-4 text-4xl font-black text-ink sm:text-6xl">Une première discussion peut déjà clarifier la bonne direction.</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">Décrivez votre besoin, votre public et l’objectif prioritaire. Nous vous répondrons avec les prochaines étapes.</p>
          <div className="mt-8 space-y-4 text-slate-700">
            <p className="flex items-center gap-3"><MapPin className="h-5 w-5 text-ocean" />{siteConfig.location}</p>
            <p className="flex items-center gap-3"><Phone className="h-5 w-5 text-ocean" />{siteConfig.phone}</p>
            <p className="flex items-center gap-3"><Mail className="h-5 w-5 text-ocean" />{siteConfig.email}</p>
          </div>
        </div>
        <LeadForm />
      </div>
    </section>
  );
}
