import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Code2,
  GraduationCap,
  MessageCircle,
  PackageCheck,
  Server,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  getPublicBlogPosts,
  getPublicServices,
  getPublicSoftwareProducts,
  getPublicTrainingPrograms,
} from '@/lib/public-content';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Pôle numérique',
  description: 'Logiciels, formations, création web et applications, infrastructure et accompagnement numérique proposés par DG AFRIQUE.',
};

const journey = [
  {
    icon: PackageCheck,
    title: 'S’équiper',
    text: 'Choisir des logiciels et outils adaptés à votre activité.',
    href: '/logiciels',
    label: 'Explorer les logiciels',
  },
  {
    icon: GraduationCap,
    title: 'Se former',
    text: 'Développer des compétences pratiques sur les outils numériques.',
    href: '/formations',
    label: 'Voir les formations',
  },
  {
    icon: Code2,
    title: 'Construire',
    text: 'Créer un site, une application ou un outil adapté à votre projet.',
    href: '/services/creation-web-applications',
    label: 'Web & applications',
  },
  {
    icon: Server,
    title: 'Déployer',
    text: 'Mettre en place l’hébergement et l’infrastructure nécessaires.',
    href: '/services/hebergement-infrastructure',
    label: 'Infrastructure',
  },
];

export default async function DigitalPolePage() {
  const [softwareProducts, trainingPrograms, services, posts] = await Promise.all([
    getPublicSoftwareProducts(),
    getPublicTrainingPrograms(),
    getPublicServices(),
    getPublicBlogPosts(),
  ]);

  const digitalServices = services.filter(
    (service) => !['logiciels-abonnements', 'formation-accompagnement'].includes(service.familySlug),
  );
  const featuredSoftware = softwareProducts.slice(0, 6);
  const featuredTraining = [...trainingPrograms]
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder)
    .slice(0, 4);
  const featuredServices = digitalServices.slice(0, 4);
  const latestPosts = posts.slice(0, 3);

  const adviceWhatsapp = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent('Bonjour DG AFRIQUE, je souhaite être conseillé sur les solutions de votre pôle numérique.')}`;
  const projectWhatsapp = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent('Bonjour DG AFRIQUE, j’ai un projet numérique et je souhaite être orienté vers la bonne solution.')}`;

  return (
    <>
      <section className="relative overflow-hidden bg-dgNavy px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
        <div className="absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-dgGold/10 blur-3xl" />
        <div className="absolute -bottom-44 left-1/4 h-[26rem] w-[26rem] rounded-full bg-dgGreen/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <Link href="/" className="text-sm font-black text-dgGold">DG AFRIQUE / Pôle numérique</Link>
            <p className="mt-8 text-xs font-black uppercase tracking-[0.18em] text-dgGold">Activité phare</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-[-0.05em] sm:text-7xl">Le numérique au service de vos projets.</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">Logiciels professionnels, formations, création web et applications, infrastructure et accompagnement : un parcours simple pour passer du besoin à une solution concrète.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/logiciels" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-4 font-black text-dgNavy">Voir les logiciels <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/formations" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-4 font-black text-white">Voir les formations</Link>
              <a href={adviceWhatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-4 font-black text-white"><MessageCircle className="h-5 w-5" /> Demander conseil</a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-dgGold" /> Particuliers & professionnels</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-dgGold" /> Entreprises & organisations</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-dgGold" /> Orientation via WhatsApp</span>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 backdrop-blur sm:p-9">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">Ce qui est déjà disponible</p>
            <div className="mt-7 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <Stat icon={PackageCheck} value={softwareProducts.length} fallback="40+" label="logiciels & abonnements" />
              <Stat icon={GraduationCap} value={trainingPrograms.length} fallback="30+" label="formations & packs" />
              <Stat icon={Code2} value={digitalServices.length} fallback="6+" label="services numériques" />
            </div>
            <p className="mt-7 text-sm leading-7 text-slate-400">Les contenus affichés proviennent du catalogue public actuellement disponible sur DG AFRIQUE.</p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-dgGold">Comment nous pouvons aider</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-dgNavy sm:text-5xl">Quatre chemins simples selon votre besoin.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Vous n’avez pas besoin de connaître la solution technique à l’avance. Commencez par votre objectif.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {journey.map(({ icon: Icon, title, text, href, label }) => (
              <Link key={title} href={href} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-dgGold/30 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dgIvory text-dgNavy"><Icon className="h-6 w-6" /></div>
                <h3 className="mt-6 text-xl font-black text-dgNavy">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-dgNavy">{label} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featuredSoftware.length > 0 && (
        <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Logiciels & abonnements" title="Des outils professionnels déjà présentés sur DG AFRIQUE." description="Une sélection du catalogue public. Les détails et disponibilités peuvent être confirmés directement avec nous." href="/logiciels" action="Voir tout le catalogue" />
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {featuredSoftware.map((product) => (
                <Link key={product.id} href={`/logiciels/${product.slug}`} className="group rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="text-xs font-black uppercase tracking-[0.12em] text-dgGold">{product.categoryName || 'Logiciel professionnel'}</p><h3 className="mt-2 text-xl font-black text-dgNavy">{product.name}</h3></div>
                    <PackageCheck className="h-6 w-6 shrink-0 text-dgGreen" />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{product.excerpt}</p>
                  <p className="mt-5 font-black text-dgNavy">{product.priceLabel || 'Tarif sur demande'}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {featuredTraining.length > 0 && (
        <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-dgGold">Formations</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-dgNavy sm:text-5xl">L’outil devient utile quand on sait s’en servir.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">Nous relions naturellement les logiciels à la montée en compétences, avec des formations pratiques présentées dans le catalogue.</p>
              <Link href="/formations" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-dgNavy px-5 py-3.5 font-black text-white">Toutes les formations <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {featuredTraining.map((training) => (
                <Link key={training.id} href="/formations" className="rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:shadow-lg">
                  <GraduationCap className="h-7 w-7 text-dgGreen" />
                  <p className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-dgGold">{training.categoryName}</p>
                  <h3 className="mt-2 text-xl font-black text-dgNavy">{training.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{training.excerpt}</p>
                  <p className="mt-5 font-black text-dgNavy">{training.showPrice && training.priceLabel ? training.priceLabel : 'Tarif sur demande'}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {featuredServices.length > 0 && (
        <section className="bg-dgIvory px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Solutions & services" title="Quand votre besoin dépasse le simple logiciel." description="Création web, applications, infrastructure et accompagnement : nous pouvons structurer avec vous un besoin numérique plus complet." />
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {featuredServices.map((service) => (
                <Link key={service.id} href={`/services/${service.familySlug}`} className="rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
                  <Code2 className="h-7 w-7 text-dgGreen" />
                  <h3 className="mt-5 text-xl font-black text-dgNavy">{service.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{service.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <AudienceCard icon={Users} eyebrow="Particuliers & professionnels" title="Je cherche le bon outil ou la bonne formation." text="Expliquez votre métier, votre objectif ou ce que vous souhaitez apprendre. Nous vous orientons vers les options disponibles." href={adviceWhatsapp} action="Être conseillé" />
          <AudienceCard icon={Building2} eyebrow="Entreprises & organisations" title="J’ai un besoin numérique à structurer." text="Site, application, formation d’équipe, hébergement ou digitalisation : présentez votre besoin et nous étudions le parcours avec vous." href={projectWhatsapp} action="Présenter mon besoin" dark />
        </div>
      </section>

      {latestPosts.length > 0 && (
        <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Actualités & conseils" title="Des contenus utiles avant de décider." description="Astuces, outils et conseils pratiques issus de notre rubrique éditoriale ciblée." href="/blog" action="Voir toutes les publications" />
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
                  <Sparkles className="h-6 w-6 text-dgGold" />
                  <p className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-dgGold">{post.category}</p>
                  <h3 className="mt-2 text-xl font-black text-dgNavy">{post.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-dgNavy px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-dgGold">Un besoin numérique ?</p>
            <h2 className="mt-3 text-3xl font-black">Commencez simplement par nous expliquer votre objectif.</h2>
            <p className="mt-3 max-w-3xl text-slate-300">Pas besoin de choisir une technologie avant de nous contacter.</p>
          </div>
          <a href={projectWhatsapp} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 font-black text-dgNavy"><MessageCircle className="h-5 w-5" /> Parler à DG AFRIQUE</a>
        </div>
      </section>
    </>
  );
}

function Stat({ icon: Icon, value, fallback, label }: { icon: typeof PackageCheck; value: number; fallback: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
      <Icon className="h-6 w-6 text-dgGold" />
      <p className="mt-5 text-3xl font-black">{value || fallback}</p>
      <p className="mt-1 text-sm text-slate-300">{label}</p>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description, href, action }: { eyebrow: string; title: string; description: string; href?: string; action?: string }) {
  return (
    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
      <div className="max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-dgGold">{eyebrow}</p>
        <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-dgNavy sm:text-5xl">{title}</h2>
        <p className="mt-5 text-lg leading-8 text-slate-600">{description}</p>
      </div>
      {href && action ? <Link href={href} className="inline-flex shrink-0 items-center gap-2 font-black text-dgNavy">{action} <ArrowRight className="h-4 w-4" /></Link> : null}
    </div>
  );
}

function AudienceCard({ icon: Icon, eyebrow, title, text, href, action, dark = false }: { icon: typeof Users; eyebrow: string; title: string; text: string; href: string; action: string; dark?: boolean }) {
  return (
    <div className={`rounded-[2rem] p-8 sm:p-10 ${dark ? 'bg-dgNavy text-white' : 'border border-slate-200 bg-white text-dgNavy'}`}>
      <Icon className={`h-9 w-9 ${dark ? 'text-dgGold' : 'text-dgGreen'}`} />
      <p className={`mt-8 text-sm font-black uppercase tracking-[0.15em] ${dark ? 'text-dgGold' : 'text-dgGold'}`}>{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black">{title}</h2>
      <p className={`mt-4 leading-8 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{text}</p>
      <a href={href} target="_blank" rel="noreferrer" className={`mt-7 inline-flex items-center gap-2 rounded-xl px-5 py-3.5 font-black ${dark ? 'bg-white text-dgNavy' : 'bg-dgNavy text-white'}`}><MessageCircle className="h-5 w-5" /> {action}</a>
    </div>
  );
}
