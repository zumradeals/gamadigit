import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, Building2, Newspaper, Search, Sparkles } from 'lucide-react';
import type { PortalUniverse } from '@/lib/portal-universes';
import {
  getPublicBlogPosts,
  getPublicServices,
  getPublicSoftwareProducts,
  getPublicTrainingPrograms,
} from '@/lib/public-content';

export async function UniversePage({ universe }: { universe: PortalUniverse }) {
  const [posts, services, software, trainings] = await Promise.all([
    getPublicBlogPosts(),
    getPublicServices(),
    getPublicSoftwareProducts(),
    getPublicTrainingPrograms(),
  ]);

  const isEconomy = universe.slug === 'economie';
  const isTechnology = universe.slug === 'technologie';
  const isReligion = universe.slug === 'religion';

  const economyServices = services
    .filter((item) => ['solutions-entreprises', 'creation-web-applications'].includes(item.familySlug))
    .slice(0, 3);

  const technologySoftware = software.slice(0, 3);
  const technologyTrainings = trainings.slice(0, 3);

  const relevantPosts = posts.filter((post) => {
    const haystack = `${post.title} ${post.excerpt} ${post.category}`.toLowerCase();
    if (isTechnology) return /(logiciel|numérique|digital|web|hébergement|formation|cloud|ia|cyber)/.test(haystack);
    if (isEconomy) return /(entreprise|activité|marché|commerce|business|site web|professionnel)/.test(haystack);
    if (isReligion) return /(religion|spiritual|islam|musulman|chrét|foi|religieux)/.test(haystack);
    return false;
  }).slice(0, 3);

  const hasPublishedContent = relevantPosts.length > 0
    || (isEconomy && economyServices.length > 0)
    || (isTechnology && (technologySoftware.length > 0 || technologyTrainings.length > 0));

  return (
    <>
      <section className="relative overflow-hidden bg-dgNavy px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-dgGold/10 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-dgGreen/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-dgGold/30 bg-dgGold/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-dgGold">
              <Sparkles className="h-4 w-4" /> {universe.eyebrow}
            </div>
            <p className="mt-8 text-sm font-black uppercase tracking-[0.2em] text-slate-400">Univers · {universe.label}</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.045em] sm:text-6xl lg:text-7xl">{universe.title}</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">{universe.description}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              {universe.primaryHref && universe.primaryLabel ? (
                <Link href={universe.primaryHref} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 font-black text-dgNavy">
                  {universe.primaryLabel} <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
              <Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3.5 font-black text-white">Retour au portail</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">Explorer {universe.label}</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-dgNavy">Thèmes principaux</h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {universe.themes.map((theme) => (
              <div key={theme} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-center text-sm font-black text-slate-700">{theme}</div>
            ))}
          </div>
        </div>
      </section>

      {hasPublishedContent ? (
        <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-14">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">À découvrir maintenant</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-dgNavy">Contenus et services déjà publiés</h2>
            </div>

            {isTechnology && technologySoftware.length > 0 ? (
              <PublishedGrid
                eyebrow="Logiciels"
                title="Solutions numériques disponibles"
                items={technologySoftware.map((item) => ({
                  title: item.name,
                  text: item.excerpt,
                  href: `/logiciels/${item.slug}`,
                }))}
              />
            ) : null}

            {isTechnology && technologyTrainings.length > 0 ? (
              <PublishedGrid
                eyebrow="Formations"
                title="Développer les compétences"
                items={technologyTrainings.map((item) => ({
                  title: item.name,
                  text: item.excerpt,
                  href: '/formations',
                }))}
              />
            ) : null}

            {isEconomy && economyServices.length > 0 ? (
              <PublishedGrid
                eyebrow="Solutions pour les entreprises"
                title="Des capacités déjà disponibles pour structurer une activité"
                items={economyServices.map((item) => ({
                  title: item.name,
                  text: item.excerpt,
                  href: '/pole-numerique',
                }))}
              />
            ) : null}

            {relevantPosts.length > 0 ? (
              <PublishedGrid
                eyebrow="Information"
                title={`À lire dans l’univers ${universe.label}`}
                items={relevantPosts.map((post) => ({
                  title: post.title,
                  text: post.excerpt,
                  href: `/blog/${post.slug}`,
                }))}
              />
            ) : null}
          </div>
        </section>
      ) : (
        <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-8 sm:p-10">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">Publication progressive</p>
              <h2 className="mt-3 text-2xl font-black text-dgNavy">Aucun contenu spécifique n’est encore publié dans cet univers.</h2>
              <p className="mt-3 max-w-3xl leading-7 text-slate-600">DG AFRIQUE n’affiche ici que des ressources réellement publiées. Cet espace s’enrichira au fur et à mesure des publications et services disponibles.</p>
            </div>
          </div>
        </section>
      )}

      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-3">
            <Feature icon={Newspaper} title="Information" text={`Actualités, analyses et ressources liées à ${universe.label.toLowerCase()}, uniquement lorsqu’elles sont publiées.`} />
            <Feature icon={BriefcaseBusiness} title="Opportunités" text="Les offres, projets, partenariats et besoins pertinents seront reliés à cet univers." />
            <Feature icon={Building2} title="Acteurs & organisations" text="Découvrez progressivement les entreprises, institutions, associations et autres acteurs utiles liés à cet univers." />
          </div>

          <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-7 sm:p-9">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">Recherche</p>
                <h2 className="mt-2 text-2xl font-black text-dgNavy">Chercher dans tout le portail</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">La recherche globale reliera progressivement les contenus de cet univers aux autres ressources de DG AFRIQUE.</p>
              </div>
              <Link href="/#recherche" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-dgNavy px-5 py-3.5 text-sm font-black text-white">
                <Search className="h-4 w-4" /> Rechercher
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PublishedGrid({ eyebrow, title, items }: { eyebrow: string; title: string; items: Array<{ title: string; text: string; href: string }> }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">{eyebrow}</p>
      <h3 className="mt-2 text-2xl font-black text-dgNavy">{title}</h3>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <Link key={`${item.href}-${item.title}`} href={item.href} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-dgGold/40 hover:shadow-lg">
            <h4 className="text-xl font-black text-dgNavy">{item.title}</h4>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-dgNavy">Découvrir <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, text }: { icon: typeof Newspaper; title: string; text: string }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dgNavy text-dgGold"><Icon className="h-6 w-6" /></div>
      <h2 className="mt-6 text-2xl font-black text-dgNavy">{title}</h2>
      <p className="mt-3 leading-7 text-slate-600">{text}</p>
    </article>
  );
}
