import Link from 'next/link';
import { ArrowRight, BookOpenCheck, Cloud, Search, ShieldCheck, UsersRound } from 'lucide-react';
import { FamilyIcon } from '@/components/family-icon';
import { federationContinuePath, listFederationSatellites } from '@/lib/federation/satellites';
import { getPublicBlogPosts, getPublicFamilies } from '@/lib/public-content';

const shortcuts = [
  { label: 'Services', href: '/pole-numerique' },
  { label: 'Logiciels', href: '/logiciels' },
  { label: 'Formations', href: '/formations' },
  { label: 'Opportunités', href: '/opportunites' },
];

function familyHref(slug: string) {
  if (slug === 'logiciels-abonnements') return '/logiciels';
  if (slug === 'formation-accompagnement') return '/formations';
  return `/services/${slug}`;
}

export async function PortalShell() {
  const [families, posts] = await Promise.all([
    getPublicFamilies(),
    getPublicBlogPosts(),
  ]);
  const featuredPosts = posts.slice(0, 3);
  const satellites = listFederationSatellites();

  return (
    <>
      <section className="relative w-full overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,rgba(25,194,208,.32),transparent_30%),radial-gradient(circle_at_85%_75%,rgba(245,185,66,.20),transparent_28%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(120deg,transparent_25%,white_25%,white_26%,transparent_26%,transparent_50%,white_50%,white_51%,transparent_51%)] [background-size:72px_72px]" />
        <div className="dg-container relative py-16 text-center sm:py-20 lg:py-24">
          <p className="dg-kicker text-cyan">Le portail humain de l’écosystème GAMAD</p>
          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-black leading-tight tracking-[-0.045em] sm:text-5xl lg:text-6xl">Vos projets rencontrent les bonnes <span className="text-sand">solutions en Afrique.</span></h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">Services numériques, compétences, opportunités et partenaires : commencez par votre besoin, nous vous orientons vers ce qui existe réellement.</p>

          <div className="mx-auto mt-9 max-w-4xl">
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-bold text-white/65">
              {shortcuts.map((item, index) => <Link key={item.href} href={item.href} className={`focus-ring rounded-md border-b-2 px-1 py-2 transition hover:text-white ${index === 0 ? 'border-sand text-white' : 'border-transparent'}`}>{item.label}</Link>)}
            </div>
            <div className="mt-4 flex flex-col gap-3 rounded-[1.25rem] bg-white p-3 text-left shadow-search sm:flex-row sm:items-center">
              <div className="flex min-h-12 flex-1 items-center gap-3 px-3 text-body"><Search className="h-5 w-5 shrink-0 text-ocean" aria-hidden="true" /><span className="text-sm text-muted sm:text-base">Que souhaitez-vous faire aujourd’hui ?</span></div>
              <Link href="/pole-numerique" className="dg-button-primary w-full sm:w-auto">Voir les solutions <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <p className="mt-3 text-xs text-white/55">Accès direct aux services disponibles — aucune promesse fictive.</p>
          </div>
        </div>
      </section>

      <section className="w-full bg-cloud py-16 sm:py-20">
        <div className="dg-container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="dg-kicker text-ocean">Commencer simplement</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] text-ink sm:text-4xl">Quel est votre besoin numérique ?</h2>
            <p className="mt-4 leading-7 text-muted">Choisissez une porte d’entrée claire. Chaque carte mène à un service ou un parcours déjà accessible.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {families.slice(0, 6).map((family, index) => (
              <Link key={family.id} href={familyHref(family.slug)} className={`focus-ring group rounded-[1.125rem] border p-6 transition hover:-translate-y-1 hover:shadow-floating ${index === 0 ? 'border-ink bg-ink text-white' : 'border-border bg-white text-ink'}`}>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${index === 0 ? 'bg-sand text-ink' : 'bg-cloud text-ocean'}`}><FamilyIcon name={family.icon} className="h-5 w-5" /></div>
                <div className="mt-5 flex items-start justify-between gap-3"><h3 className="text-lg font-extrabold">{family.name}</h3><ArrowRight className={`mt-1 h-4 w-4 shrink-0 transition group-hover:translate-x-1 ${index === 0 ? 'text-sand' : 'text-ocean'}`} /></div>
                <p className={`mt-3 text-sm leading-6 ${index === 0 ? 'text-white/65' : 'text-muted'}`}>{family.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-ink py-16 text-white sm:py-20">
        <div className="dg-container grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-ink"><UsersRound className="h-6 w-6" /></div>
            <p className="dg-kicker mt-6 text-mint">Programme ZUMRA</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.035em] sm:text-4xl">Une identité DG, un engagement ZUMRA distinct.</h2>
            <p className="mt-5 max-w-2xl leading-7 text-white/65">Votre compte DG Afrique reste votre point d’entrée. Rejoindre ZUMRA est une démarche séparée, soumise à ses propres conditions, consentements et contributions.</p>
            <Link href="/programme-zumra" className="dg-button-primary mt-7">Découvrir ZUMRA <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-6 sm:p-8">
            <p className="text-sm font-extrabold text-white">Ce que votre espace protège</p>
            <div className="mt-5 space-y-4">
              {['Une identité unique gérée par GAMAD Core', 'Un profil DG indépendant de l’adhésion ZUMRA', 'Des états d’adhésion et de contribution toujours explicites'].map((label) => <div key={label} className="flex gap-3 text-sm leading-6 text-white/70"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-mint" /><span>{label}</span></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-cloud py-16 sm:py-20">
        <div className="dg-container">
          <div className="max-w-3xl">
            <p className="dg-kicker text-ocean">Écosystème connecté</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] text-ink sm:text-4xl">Un compte, des accès explicites.</h2>
            <p className="mt-4 leading-7 text-muted">DG Afrique reste votre portail principal. Les plateformes fédérées disponibles s’ouvrent depuis votre espace, sans confondre votre identité avec une adhésion à un programme.</p>
          </div>
          <div className="mt-9 grid gap-4 lg:grid-cols-2">
            {satellites.map((satellite) => (
              <Link key={satellite.key} href={federationContinuePath(satellite.key)} className="focus-ring group flex items-center justify-between gap-5 rounded-[1.125rem] border border-border bg-white p-6 transition hover:-translate-y-1 hover:shadow-floating">
                <span className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ocean text-white"><Cloud className="h-6 w-6" aria-hidden="true" /></span><span><span className="block text-lg font-black text-ink">{satellite.displayName}</span><span className="mt-1 block text-sm text-muted">Plateforme fédérée accessible avec votre compte DG</span></span></span>
                <ArrowRight className="h-5 w-5 shrink-0 text-ocean transition group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ))}
            <Link href="/programme-zumra" className="focus-ring group flex items-center justify-between gap-5 rounded-[1.125rem] border border-ink bg-ink p-6 text-white transition hover:-translate-y-1 hover:shadow-floating">
              <span className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-ink"><UsersRound className="h-6 w-6" aria-hidden="true" /></span><span><span className="block text-lg font-black">ZUMRA</span><span className="mt-1 block text-sm text-white/65">Programme distinct avec sa propre adhésion</span></span></span>
              <ArrowRight className="h-5 w-5 shrink-0 text-mint transition group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-16 sm:py-20">
        <div className="dg-container">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl"><BookOpenCheck className="h-8 w-8 text-ocean" /><p className="dg-kicker mt-5 text-ocean">Articles & conseils</p><h2 className="mt-3 text-3xl font-black tracking-[-0.035em] text-ink">Comprendre avant de choisir.</h2><p className="mt-4 leading-7 text-muted">Des contenus réellement publiés pour éclairer vos choix numériques.</p></div>
            <Link href="/blog" className="inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-ink px-5 py-3 text-sm font-extrabold text-white sm:self-auto">Tous les articles <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {featuredPosts.map((post) => <Link key={post.id} href={`/blog/${post.slug}`} className="focus-ring group flex min-h-64 flex-col rounded-[1.125rem] border border-border bg-cloud p-6 transition hover:-translate-y-1 hover:shadow-floating"><span className="text-xs font-extrabold uppercase tracking-[0.12em] text-ocean">{post.category}</span><h3 className="mt-4 text-xl font-black leading-snug text-ink">{post.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{post.excerpt}</p><span className="mt-auto flex items-center justify-between pt-6 text-xs font-bold text-muted"><span>{post.publishedAt} · {post.readTime}</span><ArrowRight className="h-4 w-4 text-ocean transition group-hover:translate-x-1" /></span></Link>)}
          </div>
          <div className="mt-10 rounded-[1.25rem] border border-border bg-white p-7 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-9">
            <div>
            <p className="dg-kicker text-mint">Votre espace personnel</p><h2 className="mt-3 text-2xl font-black text-ink">Retrouvez votre profil et vos accès.</h2><p className="mt-4 leading-7 text-muted">Connectez-vous avec votre compte DG Afrique pour consulter les services qui vous sont réellement ouverts.</p>
            </div><Link href="/connexion" className="dg-button-primary mt-6 shrink-0 sm:mt-0">Se connecter ou créer un compte <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
