import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  GraduationCap,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
} from 'lucide-react';
import {
  getPublicSiteSettings,
  getPublicSoftwareCategories,
  getPublicSoftwareProducts,
} from '@/lib/public-content';
import type { ServiceItem } from '@/types/content';

export const metadata: Metadata = {
  title: 'Logiciels et abonnements',
  description: 'Découvrez les logiciels professionnels, abonnements numériques et solutions de productivité du pôle numérique de DG AFRIQUE.',
};

function whatsappUrl(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function ProductCard({ product, whatsapp }: { product: ServiceItem; whatsapp: string }) {
  const image = product.media?.[0]?.publicUrl || product.media?.[0]?.url;
  const message = product.whatsappMessage
    || `Bonjour DG AFRIQUE, je souhaite connaître le tarif et la disponibilité de ${product.name}.`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <Link href={`/logiciels/${product.slug}`} className="block">
        {image ? (
          <div className="aspect-[16/9] overflow-hidden bg-slate-100">
            <img src={image} alt={product.media?.[0]?.alt || product.name} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex aspect-[16/7] items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-ocean shadow-sm">
              <PackageCheck className="h-8 w-8" />
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-ocean">
            {product.productCode || product.categoryName || 'Logiciel'}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            {product.deliveryLabel}
          </span>
        </div>
        <Link href={`/logiciels/${product.slug}`} className="mt-4 block">
          <h3 className="text-2xl font-black text-ink transition hover:text-ocean">{product.name}</h3>
        </Link>
        <p className="mt-3 text-sm leading-7 text-slate-600">{product.excerpt}</p>
        <ul className="mt-5 space-y-2 text-sm text-slate-700">
          {product.features.slice(0, 3).map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-mint" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-auto border-t border-slate-100 pt-6">
          <p className="text-lg font-black text-ink">{product.priceLabel}</p>
          <div className="mt-4 grid gap-3">
            <Link href={`/logiciels/${product.slug}`} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-ink">
              Voir la fiche complète <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={whatsappUrl(whatsapp, message)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-mint px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
            >
              <MessageCircle className="h-4 w-4" /> Commander ou demander le tarif
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default async function SoftwarePage() {
  const [categories, products, settings] = await Promise.all([
    getPublicSoftwareCategories(),
    getPublicSoftwareProducts(),
    getPublicSiteSettings(),
  ]);

  const flagship = products.filter((product) => product.categorySlug === 'offre-phare');
  const standardCategories = categories.filter((category) => category.slug !== 'offre-phare');

  return (
    <>
      <section className="relative overflow-hidden bg-ink px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute -right-40 -top-48 h-[32rem] w-[32rem] rounded-full bg-cyan/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan">Pôle numérique · DG AFRIQUE</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">Logiciels et abonnements pour apprendre, créer et travailler.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Consultez chaque fiche, comparez les formules puis échangez avec un conseiller sur WhatsApp pour confirmer la commande et le mode d’activation.</p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-200">
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2"><ShieldCheck className="h-4 w-4 text-cyan" />Support en français</span>
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2"><GraduationCap className="h-4 w-4 text-mint" />Formations associées disponibles</span>
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2"><MessageCircle className="h-4 w-4 text-mint" />Commande sur WhatsApp</span>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <a key={category.id} href={`#${category.slug}`} className="shrink-0 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-ocean hover:text-ocean">
                {category.name}
              </a>
            ))}
          </div>
        </nav>
      )}

      <main className="bg-cloud px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl space-y-20">
          {flagship.length > 0 && (
            <section id="offre-phare" className="scroll-mt-28">
              <div className="rounded-[2rem] bg-gradient-to-br from-ink to-[#0B4268] p-7 text-white shadow-xl sm:p-10">
                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan">Offre phare</p>
                    <h2 className="mt-3 text-3xl font-black sm:text-5xl">Une suite complète pour vos projets.</h2>
                    <p className="mt-5 leading-8 text-slate-300">Architecture, ingénierie, construction, design et création 3D réunis dans une offre principale.</p>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <Link href={`/logiciels/${flagship[0].slug}`} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-black text-ink">Voir la fiche <ArrowRight className="h-4 w-4" /></Link>
                      <a href={whatsappUrl(settings.whatsapp, flagship[0].whatsappMessage || `Bonjour DG AFRIQUE, je souhaite des informations sur ${flagship[0].name}.`)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-mint px-5 py-3 font-black text-white"><MessageCircle className="h-5 w-5" /> Demander sur WhatsApp</a>
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                    {flagship.map((product) => (
                      <Link key={product.id} href={`/logiciels/${product.slug}`} className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur transition hover:bg-white/15">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <span className="text-xs font-black uppercase tracking-[0.15em] text-cyan">{product.productCode}</span>
                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">{product.deliveryLabel}</span>
                        </div>
                        <h3 className="mt-4 text-3xl font-black">{product.name}</h3>
                        <p className="mt-3 leading-7 text-slate-300">{product.excerpt}</p>
                        <p className="mt-5 text-xl font-black text-white">{product.priceLabel}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {standardCategories.map((category) => {
            const categoryProducts = products.filter((product) => product.categorySlug === category.slug);
            if (!categoryProducts.length) return null;
            return (
              <section key={category.id} id={category.slug} className="scroll-mt-28">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div className="max-w-3xl">
                    <div className="h-1.5 w-16 rounded-full" style={{ backgroundColor: category.accent }} />
                    <h2 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-4xl">{category.name}</h2>
                    <p className="mt-3 leading-7 text-slate-600">{category.description}</p>
                  </div>
                  <span className="text-sm font-bold text-slate-400">{categoryProducts.length} offre{categoryProducts.length > 1 ? 's' : ''}</span>
                </div>
                <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {categoryProducts.map((product) => <ProductCard key={product.id} product={product} whatsapp={settings.whatsapp} />)}
                </div>
              </section>
            );
          })}

          <section className="rounded-[2rem] bg-white p-8 text-center shadow-sm sm:p-12">
            <h2 className="text-3xl font-black text-ink">Vous cherchez un autre logiciel ?</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">Envoyez simplement le nom du produit, la durée et le nombre d’appareils ou d’utilisateurs. Notre équipe vérifie la disponibilité.</p>
            <a href={whatsappUrl(settings.whatsapp, 'Bonjour DG AFRIQUE, je cherche un logiciel qui ne figure pas encore dans le catalogue.')} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-4 font-black text-white">Demander un autre produit <ArrowRight className="h-5 w-5" /></a>
            <div className="mt-6"><Link href="/contact" className="text-sm font-black text-ocean">Ou envoyer une demande détaillée</Link></div>
          </section>

          <p className="text-center text-xs leading-6 text-slate-500">Prix et disponibilités à confirmer au moment de la commande. Les modalités d’activation, l’éligibilité et les fonctionnalités varient selon l’offre choisie.</p>
        </div>
      </main>
    </>
  );
}