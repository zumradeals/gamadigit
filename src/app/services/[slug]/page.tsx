import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, MessageCircle } from 'lucide-react';
import { FamilyIcon } from '@/components/family-icon';
import { families, familyBySlug, servicesByFamily } from '@/lib/content';
import { whatsappUrl } from '@/lib/site';

export function generateStaticParams() {
  return families.map((family) => ({ slug: family.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const family = familyBySlug(slug);
  if (!family) return {};
  return { title: family.name, description: family.description };
}

export default async function ServiceFamilyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const family = familyBySlug(slug);
  if (!family) notFound();
  const items = servicesByFamily(slug);

  return (
    <>
      <section className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: family.accent }}><FamilyIcon name={family.icon} className="h-7 w-7" /></span>
          <p className="mt-7 text-sm font-black uppercase tracking-[0.17em] text-cyan">{family.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">{family.name}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{family.description}</p>
        </div>
      </section>
      <section className="bg-cloud px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-3">
            {items.map((service) => (
              <article key={service.id} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-ocean">{service.deliveryLabel}</p>
                <h2 className="mt-3 text-2xl font-black text-ink">{service.name}</h2>
                <p className="mt-4 leading-7 text-slate-600">{service.description}</p>
                <ul className="mt-6 space-y-3 text-sm text-slate-700">{service.features.map((feature) => <li key={feature} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-mint" />{feature}</li>)}</ul>
                <div className="mt-8 border-t border-slate-100 pt-5"><p className="font-black text-ink">{service.priceLabel}</p><a href={whatsappUrl(`Bonjour GamaDigit, je souhaite en savoir plus sur : ${service.name}.`)} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-mint px-4 py-3 text-sm font-black text-white"><MessageCircle className="h-4 w-4" />Demander un devis</a></div>
              </article>
            ))}
          </div>
          <div className="mt-12 rounded-2xl bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-black text-ink">Votre besoin ne correspond pas exactement à ces offres ?</h2>
            <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">La version minimale présente les offres les plus simples. Les projets spécifiques restent disponibles sur étude.</p>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 font-black text-ocean">Présenter mon besoin <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
