import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  MessageCircle,
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
} from '@/lib/public-content';

function HighlightedTitle({ title, highlight }: { title: string; highlight: string }) {
  if (!highlight || !title.includes(highlight)) return <>{title}</>;
  const [before, ...afterParts] = title.split(highlight);
  return <>{before}<span className="text-cyan">{highlight}</span>{afterParts.join(highlight)}</>;
}

export default async function HomePage() {
  const [homepage, families, services, posts, settings] = await Promise.all([
    getHomepageContent(),
    getPublicFamilies(),
    getPublicServices(),
    getPublicBlogPosts(),
    getPublicSiteSettings(),
  ]);

  const explicitlyFeatured = services.filter((service) => service.featured);
  const featured = (explicitlyFeatured.length ? explicitlyFeatured : services).slice(0, 3);
  const latestPosts = posts.slice(0, 3);
  const heroWhatsapp = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(homepage.hero.primaryMessage)}`;
  const finalWhatsapp = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(homepage.finalCta.whatsappMessage)}`;

  return (
    <>
      {homepage.visible.hero && (
        <section className="relative overflow-hidden bg-ink px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
          <div className="absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-cyan/10 blur-3xl" />
          <div className="absolute -bottom-56 left-1/3 h-[30rem] w-[30rem] rounded-full bg-ocean/20 blur-3xl" />
          <div className={`relative mx-auto grid max-w-7xl items-center gap-14 ${homepage.visible.process ? 'lg:grid-cols-[1.05fr_.95fr]' : ''}`}>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.13em] text-cyan">
                <Sparkles className="h-4 w-4" /> {homepage.hero.badge}
              </div>
              <h1 className="mt-7 max-w-3xl text-4xl font-black leading-[1.06] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                <HighlightedTitle title={homepage.hero.title} highlight={homepage.hero.highlight} />
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">{homepage.hero.description}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href={heroWhatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-mint px-6 py-4 font-extrabold text-white shadow-xl shadow-emerald-950/20 transition hover:-translate-y-0.5">
                  <MessageCircle className="h-5 w-5" />
                  {homepage.hero.primaryLabel}
                </a>
                <Link href="#services" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-4 font-bold text-white transition hover:bg-white/15">
                  {homepage.hero.secondaryLabel} <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
              {homepage.visible.promises && (
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
                  {homepage.promises.items.map((item) => (
                    <span key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-mint" />{item}</span>
                  ))}
                </div>
              )}
            </div>

            {homepage.visible.process && (
              <div className="relative">
                <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-cyan/20 via-ocean/10 to-transparent blur-2xl" />
                <div className="relative rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur sm:p-7">
                  <div className="rounded-2xl bg-white p-6 text-slate-900 shadow-2xl">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-ocean">{homepage.process.eyebrow}</p>
                        <h2 className="mt-2 text-2xl font-black text-ink">{homepage.process.title}</h2>
                      </div>
                      <span className="rounded-full bg-emerald-50 p-3 text-mint"><BadgeCheck className="h-6 w-6" /></span>
                    </div>
                    <div className="mt-7 space-y-4">
                      {homepage.process.steps.map((step) => (
                        <div key={`${step.number}-${step.title}`} className="grid grid-cols-[3rem_1fr] gap-4 rounded-xl bg-cloud p-4">
                          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-sm font-black text-white">{step.number}</span>
                          <div><p className="font-black text-ink">{step.title}</p><p className="mt-1 text-sm leading-6 text-slate-600">{step.text}</p></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 px-5 py-4 text-sm text-slate-200">
                    <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-cyan" />Approche professionnelle</span>
                    <span className="font-bold text-mint">Réponse rapide</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {homepage.visible.familiesIntro && (
        <section id="services" className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.17em] text-ocean">{homepage.familiesIntro.eyebrow}</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-5xl">{homepage.familiesIntro.title}</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">{homepage.familiesIntro.description}</p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {families.map((family) => (
                <Link key={family.id} href={`/services/${family.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl text-white" style={{ backgroundColor: family.accent }}><FamilyIcon name={family.icon} className="h-6 w-6" /></span>
                  <p className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-slate-400">{family.eyebrow}</p>
                  <h3 className="mt-2 text-xl font-black text-ink">{family.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{family.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-ocean">Découvrir <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {homepage.visible.offersIntro && featured.length > 0 && (
        <section className="bg-cloud px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div><p className="text-sm font-black uppercase tracking-[0.17em] text-ocean">{homepage.offersIntro.eyebrow}</p><h2 className="mt-3 text-3xl font-black text-ink sm:text-4xl">{homepage.offersIntro.title}</h2></div>
              <Link href="/contact" className="inline-flex items-center gap-2 font-black text-ocean">{homepage.offersIntro.linkLabel} <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {featured.map((service) => (
                <article key={service.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-mint">{service.deliveryLabel}</p>
                  <h3 className="mt-3 text-2xl font-black text-ink">{service.name}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{service.excerpt}</p>
                  <ul className="mt-6 space-y-3 text-sm text-slate-700">
                    {service.features.map((feature) => <li key={feature} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-mint" />{feature}</li>)}
                  </ul>
                  <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5"><span className="font-black text-ink">{service.priceLabel}</span><Link href={`/services/${service.familySlug}`} className="rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white">Voir l’offre</Link></div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {homepage.visible.blogIntro && latestPosts.length > 0 && (
        <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="text-center"><p className="text-sm font-black uppercase tracking-[0.17em] text-ocean">{homepage.blogIntro.eyebrow}</p><h2 className="mt-3 text-3xl font-black text-ink sm:text-4xl">{homepage.blogIntro.title}</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">{homepage.blogIntro.description}</p></div>
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
            <a href={finalWhatsapp} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-mint px-6 py-4 font-black text-white"><MessageCircle className="h-5 w-5" />{homepage.finalCta.buttonLabel}</a>
          </div>
        </section>
      )}
    </>
  );
}
