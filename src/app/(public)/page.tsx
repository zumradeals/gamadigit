import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  ChevronRight,
  Code2,
  GraduationCap,
  MessageCircle,
  PackageCheck,
  Palette,
  Server,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { FamilyIcon } from '@/components/family-icon';
import { getHomepageContent } from '@/lib/homepage';
import {
  getPublicBlogPosts,
  getPublicFamilies,
  getPublicServices,
  getPublicSiteSettings,
  getPublicSoftwareProducts,
  getPublicTrainingPrograms,
} from '@/lib/public-content';

function HighlightedTitle({ title, highlight }: { title: string; highlight: string }) {
  if (!highlight || !title.includes(highlight)) return <>{title}</>;
  const [before, ...afterParts] = title.split(highlight);
  return (
    <>
      {before}
      <span className="text-cyan">{highlight}</span>
      {afterParts.join(highlight)}
    </>
  );
}

export default async function HomePage() {
  const [homepage, families, services, softwareProducts, trainingPrograms, posts, settings] = await Promise.all([
    getHomepageContent(),
    getPublicFamilies(),
    getPublicServices(),
    getPublicSoftwareProducts(),
    getPublicTrainingPrograms(),
    getPublicBlogPosts(),
    getPublicSiteSettings(),
  ]);

  const heroWhatsapp = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(homepage.hero.primaryMessage)}`;
  const softwareWhatsapp = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(homepage.softwareIntro.whatsappMessage)}`;
  const finalWhatsapp = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(homepage.finalCta.whatsappMessage)}`;

  const softwareFeatured = (() => {
    const marked = softwareProducts.filter((product) => product.featured);
    return (marked.length ? marked : softwareProducts).slice(0, 6);
  })();
  const autodeskSuite = softwareProducts.find((product) =>
    product.name.toLowerCase().includes('autodesk all apps'),
  ) || softwareFeatured[0];
  const softwareSecondary = softwareFeatured.filter((product) => product.id !== autodeskSuite?.id).slice(0, 4);

  const trainingFeatured = (() => {
    const marked = trainingPrograms.filter((program) => program.featured);
    const base = marked.length ? marked : trainingPrograms;
    const firstPack = trainingPrograms.find((program) => program.kind === 'career_pack');
    const selection = base.slice(0, 4);
    if (firstPack && !selection.some((program) => program.id === firstPack.id)) {
      selection[selection.length === 4 ? 3 : selection.length] = firstPack;
    }
    return selection.filter(Boolean);
  })();

  const digitalServices = services.filter(
    (service) => service.familySlug !== 'logiciels-abonnements' && service.familySlug !== 'formation-accompagnement',
  );
  const serviceHighlights = digitalServices.filter((service) => service.featured).slice(0, 3);
  const latestPosts = posts.slice(0, 3);

  return (
    <>
      {homepage.visible.hero && (
        <section className="relative overflow-hidden bg-ink px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
          <div className="absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-cyan/10 blur-3xl" />
          <div className="absolute -bottom-56 left-1/3 h-[30rem] w-[30rem] rounded-full bg-ocean/20 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.08fr_.92fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.13em] text-cyan">
                <Sparkles className="h-4 w-4" /> {homepage.hero.badge}
              </div>
              <h1 className="mt-7 max-w-4xl text-4xl font-black leading-[1.04] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                <HighlightedTitle title={homepage.hero.title} highlight={homepage.hero.highlight} />
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                {homepage.hero.description}
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href={heroWhatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-mint px-6 py-4 font-extrabold text-white shadow-xl shadow-emerald-950/20 transition hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-5 w-5" />
                  {homepage.hero.primaryLabel}
                </a>
                <Link
                  href="#univers"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-4 font-bold text-white transition hover:bg-white/15"
                >
                  {homepage.hero.secondaryLabel} <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
              {homepage.visible.promises && (
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
                  {homepage.promises.items.map((item) => (
                    <span key={item} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-mint" />
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-cyan/20 via-ocean/10 to-transparent blur-2xl" />
              <div className="relative rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur sm:p-7">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan">Par où commencer ?</p>
                    <h2 className="mt-2 text-2xl font-black">Choisissez votre besoin principal.</h2>
                  </div>
                  <span className="rounded-full bg-white/10 p-3 text-mint"><BadgeCheck className="h-6 w-6" /></span>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <Link href="/logiciels" className="group rounded-2xl bg-white p-5 text-ink transition hover:-translate-y-1">
                    <PackageCheck className="h-7 w-7 text-ocean" />
                    <h3 className="mt-4 font-black">Acheter un logiciel</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Autodesk, Microsoft, création, IA et sécurité.</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-ocean">Voir le catalogue <ChevronRight className="h-4 w-4" /></span>
                  </Link>
                  <Link href="/formations" className="group rounded-2xl bg-white p-5 text-ink transition hover:-translate-y-1">
                    <GraduationCap className="h-7 w-7 text-mint" />
                    <h3 className="mt-4 font-black">Suivre une formation</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Logiciels professionnels et parcours métiers.</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-ocean">Voir les programmes <ChevronRight className="h-4 w-4" /></span>
                  </Link>
                  <Link href="/services/creation-web-applications" className="group rounded-2xl bg-white p-5 text-ink transition hover:-translate-y-1">
                    <Code2 className="h-7 w-7 text-cyan" />
                    <h3 className="mt-4 font-black">Lancer un projet digital</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Site, application, design, cloud ou communication.</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-ocean">Découvrir les services <ChevronRight className="h-4 w-4" /></span>
                  </Link>
                  <Link href="/services/solutions-entreprises" className="group rounded-2xl bg-white p-5 text-ink transition hover:-translate-y-1">
                    <Building2 className="h-7 w-7 text-amber" />
                    <h3 className="mt-4 font-black">Équiper une entreprise</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Volume, équipes, infrastructure et accompagnement.</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-ocean">Parler de votre besoin <ChevronRight className="h-4 w-4" /></span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto mt-14 grid max-w-7xl gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <p className="text-2xl font-black text-cyan">{softwareProducts.length || '40+'}</p>
              <p className="mt-1 text-sm text-slate-300">logiciels et abonnements</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <p className="text-2xl font-black text-mint">{trainingPrograms.length || '30+'}</p>
              <p className="mt-1 text-sm text-slate-300">formations et packs métiers</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <p className="text-2xl font-black text-amber">{families.length || 6}</p>
              <p className="mt-1 text-sm text-slate-300">familles de solutions numériques</p>
            </div>
          </div>
        </section>
      )}

      <section id="univers" className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.17em] text-ocean">Tout GamaDigit en un regard</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-5xl">Une plateforme pour acheter, apprendre et construire.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Vous pouvez commencer par un logiciel, une formation ou un projet. Notre équipe vous accompagne ensuite vers la solution complémentaire utile.</p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/logiciels" className="group rounded-2xl border border-slate-200 bg-cloud p-6 transition hover:-translate-y-1 hover:shadow-soft">
              <PackageCheck className="h-9 w-9 text-ocean" />
              <h3 className="mt-6 text-xl font-black text-ink">Logiciels & abonnements</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">Licences, abonnements, activation et accompagnement en français.</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-ocean">Explorer <ArrowRight className="h-4 w-4" /></span>
            </Link>
            <Link href="/formations" className="group rounded-2xl border border-slate-200 bg-cloud p-6 transition hover:-translate-y-1 hover:shadow-soft">
              <GraduationCap className="h-9 w-9 text-mint" />
              <h3 className="mt-6 text-xl font-black text-ink">Formations professionnelles</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">Formations par logiciel et packs métiers pour développer une expertise pratique.</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-ocean">Explorer <ArrowRight className="h-4 w-4" /></span>
            </Link>
            <Link href="/services/creation-web-applications" className="group rounded-2xl border border-slate-200 bg-cloud p-6 transition hover:-translate-y-1 hover:shadow-soft">
              <Code2 className="h-9 w-9 text-cyan" />
              <h3 className="mt-6 text-xl font-black text-ink">Services numériques</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">Web, applications, design, communication, hébergement et maintenance.</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-ocean">Explorer <ArrowRight className="h-4 w-4" /></span>
            </Link>
            <Link href="/services/solutions-entreprises" className="group rounded-2xl border border-slate-200 bg-cloud p-6 transition hover:-translate-y-1 hover:shadow-soft">
              <Building2 className="h-9 w-9 text-amber" />
              <h3 className="mt-6 text-xl font-black text-ink">Solutions entreprises</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">Équipement des équipes, volume, digitalisation et solutions sur mesure.</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-ocean">Explorer <ArrowRight className="h-4 w-4" /></span>
            </Link>
          </div>
        </div>
      </section>

      {softwareProducts.length > 0 && autodeskSuite && (
        <section id="logiciels" className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <p className="text-sm font-black uppercase tracking-[0.17em] text-cyan">{homepage.softwareIntro.eyebrow}</p>
                <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">{homepage.softwareIntro.title}</h2>
                <p className="mt-5 text-lg leading-8 text-slate-300">{homepage.softwareIntro.description}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/logiciels" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-3 font-black text-white hover:bg-white/10">
                  {homepage.softwareIntro.linkLabel} <ArrowRight className="h-4 w-4" />
                </Link>
                <a href={softwareWhatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-mint px-5 py-3 font-black text-white">
                  <MessageCircle className="h-4 w-4" />{homepage.softwareIntro.whatsappLabel}
                </a>
              </div>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
              <article className="relative overflow-hidden rounded-[2rem] border border-cyan/30 bg-gradient-to-br from-ocean/35 to-white/5 p-7 sm:p-9">
                <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan/15 blur-3xl" />
                <div className="relative">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <span className="rounded-full bg-cyan px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-ink">Offre phare</span>
                    <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black">{autodeskSuite.priceLabel}</span>
                  </div>
                  <h3 className="mt-7 text-3xl font-black sm:text-4xl">{autodeskSuite.name}</h3>
                  <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-200">{autodeskSuite.excerpt}</p>
                  <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                    {autodeskSuite.features.slice(0, 4).map((feature) => (
                      <li key={feature} className="flex items-start gap-2 rounded-xl bg-white/5 p-3 text-sm text-slate-200">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-mint" />{feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(autodeskSuite.whatsappMessage || `Bonjour GamaDigit, je souhaite commander ${autodeskSuite.name}.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-mint px-5 py-4 font-black text-white"
                    >
                      <MessageCircle className="h-5 w-5" /> Commander la suite
                    </a>
                    <Link href="/logiciels" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-4 font-black text-white">
                      Comparer les formules <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {softwareSecondary.map((product) => (
                  <article key={product.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.12em] text-cyan">Vente séparée</p>
                        <h3 className="mt-2 text-xl font-black">{product.name}</h3>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-slate-200">{product.priceLabel}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{product.excerpt}</p>
                    <a
                      href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(product.whatsappMessage || `Bonjour GamaDigit, je souhaite commander ${product.name}.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-black text-mint"
                    >
                      Demander ou commander <ArrowRight className="h-4 w-4" />
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {trainingFeatured.length > 0 && (
        <section id="formations" className="bg-gradient-to-b from-emerald-50 to-white px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <p className="text-sm font-black uppercase tracking-[0.17em] text-mint">Formations professionnelles</p>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-5xl">Apprenez les outils qui font avancer votre métier.</h2>
                <p className="mt-5 text-lg leading-8 text-slate-600">Formations par logiciel, parcours spécialisés et packs métiers. Les programmes sont présentés par GamaDigit et assurés avec notre partenaire formateur.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/formations" className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 font-black text-white">
                  Voir toutes les formations <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Bonjour GamaDigit, je souhaite être conseillé pour choisir une formation professionnelle.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 py-3 font-black text-ink"
                >
                  <MessageCircle className="h-4 w-4 text-mint" /> Demander conseil
                </a>
              </div>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {trainingFeatured.map((program) => (
                <article key={program.id} className="flex h-full flex-col rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-xl bg-emerald-50 p-3 text-mint"><GraduationCap className="h-6 w-6" /></span>
                    <span className="rounded-full bg-cloud px-3 py-1 text-xs font-black text-slate-600">{program.priceLabel || 'Tarif sur WhatsApp'}</span>
                  </div>
                  <p className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-ocean">{program.kind === 'career_pack' ? 'Pack métier premium' : program.categoryName}</p>
                  <h3 className="mt-2 text-xl font-black text-ink">{program.name}</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{program.excerpt}</p>
                  <ul className="mt-5 space-y-2 text-sm text-slate-700">
                    {program.highlights.slice(0, 3).map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-mint" />{highlight}</li>
                    ))}
                  </ul>
                  <a
                    href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(program.whatsappMessage || `Bonjour GamaDigit, je souhaite recevoir les informations sur la formation ${program.name}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-mint px-4 py-3 text-sm font-black text-white"
                  >
                    <MessageCircle className="h-4 w-4" /> S’informer ou s’inscrire
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {homepage.visible.familiesIntro && (
        <section id="services" className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.17em] text-ocean">{homepage.familiesIntro.eyebrow}</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-5xl">{homepage.familiesIntro.title}</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">{homepage.familiesIntro.description}</p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {families.map((family) => {
                const href = family.slug === 'logiciels-abonnements'
                  ? '/logiciels'
                  : family.slug === 'formation-accompagnement'
                    ? '/formations'
                    : `/services/${family.slug}`;
                return (
                  <Link key={family.id} href={href} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl text-white" style={{ backgroundColor: family.accent }}>
                      <FamilyIcon name={family.icon} className="h-6 w-6" />
                    </span>
                    <p className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-slate-400">{family.eyebrow}</p>
                    <h3 className="mt-2 text-xl font-black text-ink">{family.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{family.description}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-ocean">Découvrir <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="bg-cloud px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div className="rounded-[2rem] bg-ink p-8 text-white sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.17em] text-cyan">Solutions pour entreprises</p>
            <h2 className="mt-4 text-3xl font-black sm:text-4xl">Équipez vos collaborateurs et digitalisez vos opérations.</h2>
            <p className="mt-5 leading-8 text-slate-300">Licences en volume, formation des équipes, sites et applications, cloud, support et solutions adaptées à votre organisation.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/services/solutions-entreprises" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-black text-ink">
                Découvrir l’offre entreprise <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Bonjour GamaDigit, je souhaite recevoir une proposition pour équiper ou digitaliser mon entreprise.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-mint px-5 py-3 font-black text-white"
              >
                <MessageCircle className="h-4 w-4" /> Demander une cotation
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <PackageCheck className="h-8 w-8 text-ocean" />
              <h3 className="mt-5 text-xl font-black text-ink">Licences et abonnements</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">Offres individuelles, équipes et volumes avec configuration adaptée.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <GraduationCap className="h-8 w-8 text-mint" />
              <h3 className="mt-5 text-xl font-black text-ink">Formation des équipes</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">Programmes ciblés selon les métiers, outils et objectifs opérationnels.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <Server className="h-8 w-8 text-cyan" />
              <h3 className="mt-5 text-xl font-black text-ink">Infrastructure numérique</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">Domaines, hébergement, e-mails, sauvegardes et maintenance.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <Palette className="h-8 w-8 text-amber" />
              <h3 className="mt-5 text-xl font-black text-ink">Présence et communication</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">Identité, supports, site web et outils pour mieux présenter l’entreprise.</p>
            </div>
          </div>
        </div>
      </section>

      {homepage.visible.process && (
        <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 p-7 sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.17em] text-ocean">{homepage.process.eyebrow}</p>
                <h2 className="mt-4 text-3xl font-black text-ink sm:text-4xl">{homepage.process.title}</h2>
                <p className="mt-5 leading-8 text-slate-600">Un seul interlocuteur pour vous orienter vers la bonne combinaison : achat, installation, formation ou réalisation sur mesure.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {homepage.process.steps.map((step) => (
                  <div key={`${step.number}-${step.title}`} className="rounded-2xl bg-cloud p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-sm font-black text-white">{step.number}</span>
                    <h3 className="mt-5 font-black text-ink">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-100 pt-7 text-sm font-bold text-slate-600">
              <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-mint" />Accompagnement en français</span>
              <span className="flex items-center gap-2"><BadgeCheck className="h-5 w-5 text-ocean" />Conseil avant engagement</span>
              <span className="flex items-center gap-2"><MessageCircle className="h-5 w-5 text-cyan" />WhatsApp au centre du parcours</span>
            </div>
          </div>
        </section>
      )}

      {homepage.visible.offersIntro && serviceHighlights.length > 0 && (
        <section className="bg-cloud px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.17em] text-ocean">{homepage.offersIntro.eyebrow}</p>
                <h2 className="mt-3 text-3xl font-black text-ink sm:text-4xl">{homepage.offersIntro.title}</h2>
              </div>
              <Link href="/contact" className="inline-flex items-center gap-2 font-black text-ocean">{homepage.offersIntro.linkLabel} <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {serviceHighlights.map((service) => (
                <article key={service.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-mint">{service.deliveryLabel}</p>
                  <h3 className="mt-3 text-2xl font-black text-ink">{service.name}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{service.excerpt}</p>
                  <ul className="mt-6 space-y-3 text-sm text-slate-700">
                    {service.features.slice(0, 3).map((feature) => (
                      <li key={feature} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-mint" />{feature}</li>
                    ))}
                  </ul>
                  <div className="mt-7 flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
                    <span className="font-black text-ink">{service.priceLabel}</span>
                    <Link href={`/services/${service.familySlug}`} className="rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white">Voir l’offre</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {homepage.visible.blogIntro && latestPosts.length > 0 && (
        <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-[0.17em] text-ocean">{homepage.blogIntro.eyebrow}</p>
              <h2 className="mt-3 text-3xl font-black text-ink sm:text-4xl">{homepage.blogIntro.title}</h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">{homepage.blogIntro.description}</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {latestPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:shadow-soft">
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-ocean">{post.category}</span>
                  <h3 className="mt-3 text-xl font-black leading-7 text-ink group-hover:text-ocean">{post.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
                  <p className="mt-6 text-xs font-bold text-slate-400">{post.publishedAt} · {post.readTime}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {homepage.visible.finalCta && (
        <section className="bg-white px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-gradient-to-r from-ink to-[#0b4f75] px-6 py-14 text-center text-white shadow-soft sm:px-12">
            <h2 className="text-3xl font-black sm:text-4xl">{homepage.finalCta.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">{homepage.finalCta.description}</p>
            <a href={finalWhatsapp} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-mint px-6 py-4 font-black text-white">
              <MessageCircle className="h-5 w-5" />{homepage.finalCta.buttonLabel}
            </a>
          </div>
        </section>
      )}
    </>
  );
}
