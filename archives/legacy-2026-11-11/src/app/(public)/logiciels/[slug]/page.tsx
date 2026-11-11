import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Users,
} from 'lucide-react';
import {
  getPublicSiteSettings,
  getPublicSoftwareProductBySlug,
  getPublicSoftwareProducts,
} from '@/lib/public-content';

function whatsappUrl(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export async function generateStaticParams() {
  const products = await getPublicSoftwareProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicSoftwareProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.excerpt,
  };
}

export default async function SoftwareProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getPublicSoftwareProductBySlug(slug),
    getPublicSiteSettings(),
  ]);

  if (!product) notFound();

  const image = product.media?.[0]?.publicUrl || product.media?.[0]?.url;
  const message = product.whatsappMessage
    || `Bonjour DG AFRIQUE, je souhaite commander ou recevoir des informations sur ${product.name}.`;

  return (
    <main className="bg-cloud">
      <section className="bg-ink px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <Link href="/logiciels" className="inline-flex items-center gap-2 text-sm font-black text-cyan">
            <ArrowLeft className="h-4 w-4" /> Retour au catalogue
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-cyan">
                  {product.categoryName || 'Logiciel professionnel'}
                </span>
                {product.productCode ? (
                  <span className="text-xs font-bold text-slate-400">Réf. {product.productCode}</span>
                ) : null}
              </div>
              <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">{product.name}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{product.excerpt}</p>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">Tarif</p>
                  <p className="mt-1 text-2xl font-black">{product.priceLabel}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">Formule</p>
                  <p className="mt-1 text-lg font-black">{product.deliveryLabel}</p>
                </div>
              </div>

              <a
                href={whatsappUrl(settings.whatsapp, message)}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-mint px-6 py-4 font-black text-white transition hover:-translate-y-0.5"
              >
                <MessageCircle className="h-5 w-5" /> Commander ou demander conseil
              </a>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl">
              {image ? (
                <img src={image} alt={product.media?.[0]?.alt || product.name} className="aspect-[4/3] h-full w-full object-cover" />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-white/10 to-cyan/10">
                  <span className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white/10 text-cyan">
                    <PackageCheck className="h-14 w-14" />
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.25fr_.75fr]">
          <article className="rounded-[2rem] bg-white p-7 shadow-sm sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.15em] text-ocean">Présentation</p>
            <h2 className="mt-3 text-3xl font-black text-ink">Ce que cette offre vous apporte</h2>
            <p className="mt-6 whitespace-pre-line text-lg leading-9 text-slate-700">{product.description}</p>

            {product.features.length ? (
              <div className="mt-10">
                <h3 className="text-2xl font-black text-ink">Avantages principaux</h3>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-slate-700">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-mint" />
                      <span className="leading-7">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {product.keyPoints?.length ? (
              <div className="mt-10">
                <h3 className="text-2xl font-black text-ink">Points essentiels</h3>
                <ul className="mt-5 space-y-3">
                  {product.keyPoints.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-slate-700">
                      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-ocean" />
                      <span className="leading-7">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </article>

          <aside className="space-y-6">
            {product.targetAudience?.length ? (
              <div className="rounded-[2rem] bg-white p-7 shadow-sm">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-ocean" />
                  <h2 className="text-2xl font-black text-ink">Pour qui ?</h2>
                </div>
                <ul className="mt-5 space-y-3 text-slate-700">
                  {product.targetAudience.map((audience) => (
                    <li key={audience} className="flex items-start gap-3">
                      <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-cyan" />
                      <span className="leading-7">{audience}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="rounded-[2rem] bg-gradient-to-br from-ocean to-[#075E9E] p-7 text-white shadow-lg">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-cyan">Conseil du pôle numérique</p>
              <h2 className="mt-3 text-2xl font-black">Besoin d’une formule différente ?</h2>
              <p className="mt-4 leading-7 text-blue-100">Expliquez votre besoin, votre durée et le nombre d’utilisateurs. Nous vous orientons vers l’offre la plus adaptée.</p>
              <a
                href={whatsappUrl(settings.whatsapp, message)}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 font-black text-ocean"
              >
                <MessageCircle className="h-5 w-5" /> Échanger sur WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
