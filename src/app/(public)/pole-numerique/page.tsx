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

const journey = [
  {
    icon: PackageCheck,
    title: 'S’équiper',
    text: 'Choisir les logiciels, licences et abonnements adaptés à votre activité.',
    href: '/logiciels',
    label: 'Explorer les logiciels',
  },
  {
    icon: GraduationCap,
    title: 'Se former',
    text: 'Développer des compétences pratiques sur les outils et métiers numériques.',
    href: '/formations',
    label: 'Voir les formations',
  },
  {
    icon: Code2,
    title: 'Construire',
    text: 'Créer un site, une application ou un outil numérique adapté à votre projet.',
    href: '/services/creation-web-applications',
    label: 'Découvrir le web & applications',
  },
  {
    icon: Server,
    title: 'Déployer',
    text: 'Hébergement, domaines, e-mails et infrastructure pour travailler durablement.',
    href: '/services/hebergement-infrastructure',
    label: 'Voir l’infrastructure',
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

  const whatsapp = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent('Bonjour DG AFRIQUE, je souhaite être conseillé sur les solutions de votre pôle numérique.')}`;
  const projectWhatsapp = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent('Bonjour DG AFRIQUE, j’ai un projet numérique et je souhaite être orienté vers la bonne solution.')}`;

  return (
    <>
      <section className="relative overflow-hidden bg-ink px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute -right-36 -top-40 h-[30rem] w-[30rem] rounded-full bg-cyan/10 blur-3xl" />
        <div className="absolute -bottom-56 left-1/4 h-[28rem] w-[28rem] rounded-full bg-mint/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <Link href="/" className="text-sm font-black text-amber">DG AFRIQUE / Pôle numérique</Link>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.17em] text-cyan">Voici le pôle numérique de DG AFRIQUE</p>
              <h1 className="mt-4 text-5xl font-black tracking-[-0.04em] sm:text-7xl">Le numérique au service de vos projets.</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Un même espace pour s’équiper, apprendre, créer et déployer : logiciels professionnels, formations, web, applications, infrastructure et accompagnement numérique.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/logiciels" className="inline-flex items-center justify-center gap-2 rounded-xl bg-mint px-6 py-4 font-black text-white">Voir les logiciels <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/formations" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-4 font-black text-white">Voir les formations <ArrowRight className="h-4 w-4" /></Link>
                <a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-4 font-black text-white"><MessageCircle className="h-5 w-5" />Demander conseil</a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-mint" />Particuliers & professionnels</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-mint" />Entreprises & organisations</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-mint" />Conseil via WhatsApp</span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-5"><PackageCheck className="h-6 w-6 text-cyan" /><p className="mt-5 text-3xl font-black">{softwareProducts.length || '40+'}</p><p className="mt-1 text-sm text-slate-300">logiciels & abonnements</p></div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-5"><GraduationCap className="h-6 w-6 text-mint" /><p className="mt-5 text-3xl font-black">{trainingPrograms.length || '30+'}</p><p className="mt-1 text-sm text-slate-300">formations & packs</p></div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-5"><Code2 className="h-6 w-6 text-amber" /><p className="mt-5 text-3xl font-black">{digitalServices.length || '6+'}</p><p className="mt-1 text-sm text-slate-300">services numériques</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.17em] text-ocean">Votre parcours numérique</p>
            <h2 className="mt-4 text-3xl font-black text-ink sm:text-5xl">Acheter, apprendre, construire et déployer au même endroit.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Le pôle numérique relie les outils, les compétences et les services nécessaires pour faire avancer un projet sans multiplier les interlocuteurs.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {journey.map(({ icon: Icon, title, text, href, label }) => (
              <Link key={title} href={href} className="rounded-2xl border border-slate-200 bg-cloud p-6 transition hover:-translate-y-1 hover:shadow-soft">
                <Icon className="h-9 w-9 text-ocean" />
                <h3 className="mt-6 text-xl font-black text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-ocean">{label} <ArrowRight className="h-4 w-4" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cloud px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.17em] text-ocean">Logiciels & abonnements</p>
              <h2 className="mt-4 text-3xl font-black text-ink sm:text-5xl">Des outils professionnels pour travailler et progresser.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">Une sélection issue du catalogue du pôle numérique. Les détails, formules et disponibilités peuvent être confirmés directement sur WhatsApp.</p>
            </div>
            <Link href="/logiciels" className="inline-flex items-center gap-2 font-black text-ocean">Voir tout le catalogue <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredSoftware.map((product) => (
              <Link key={product.id} href={`/logiciels/${product.slug}`} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <div><p className="text-xs font-black uppercase tracking-[0.12em] text-ocean">{product.categoryName || 'Logiciel professionnel'}</p><h3 className="mt-2 text-xl font-black text-ink">{product.name}</h3></div>
                  <PackageCheck className="h-6 w-6 shrink-0 text-mint" />
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">{product.excerpt}</p>
                <p className="mt-5 font-black text-ink">{product.priceLabel || 'Tarif sur demande'}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-sm font-black uppercase tracking-[0.17em] text-mint">Formations</p>
              <h2 className="mt-4 text-3xl font-black text-ink sm:text-5xl">Acheter un outil, puis apprendre à bien l’utiliser.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">Le pôle numérique crée un lien naturel entre les logiciels et la montée en compétences. Les tarifs et modalités de formation restent configurables et peuvent être confirmés avant inscription.</p>
              <Link href="/formations" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3.5 font-black text-white">Toutes les formations <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {featuredTraining.map((training) => (
                <Link key={training.id} href="/formations" className="rounded-2xl border border-slate-200 bg-cloud p-6 transition hover:-translate-y-1 hover:shadow-soft">
                  <GraduationCap className="h-7 w-7 text-mint" />
                  <p className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-ocean">{training.categoryName}</p>
                  <h3 className="mt-2 text-xl font-black text-ink">{training.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{training.excerpt}</p>
                  {training.showPrice && training.priceLabel ? <p className="mt-5 font-black text-ink">{training.priceLabel}</p> : <p className="mt-5 font-black text-ocean">Tarif sur demande</p>}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-dgIvory px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.17em] text-dgGreen">Solutions & services</p>
            <h2 className="mt-4 text-3xl font-black text-dgNavy sm:text-5xl">Quand le besoin dépasse le logiciel.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Création web, applications, infrastructure et accompagnement : DG AFRIQUE peut prendre en charge un besoin numérique plus complet.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredServices.map((service) => (
              <Link key={service.id} href={`/services/${service.familySlug}`} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-soft">
                <Code2 className="h-7 w-7 text-dgGreen" />
                <h3 className="mt-5 text-xl font-black text-dgNavy">{service.name}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{service.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-ink p-8 text-white sm:p-10">
            <Users className="h-9 w-9 text-cyan" />
            <p className="mt-8 text-sm font-black uppercase tracking-[0.15em] text-cyan">Particuliers & professionnels</p>
            <h2 className="mt-3 text-3xl font-black">Je veux le bon outil ou la bonne formation.</h2>
            <p className="mt-4 leading-8 text-slate-300">Expliquez votre métier, votre objectif ou le logiciel recherché. Le pôle numérique vous oriente vers une formule adaptée.</p>
            <a href={whatsapp} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-mint px-5 py-3.5 font-black text-white"><MessageCircle className="h-5 w-5" />Être conseillé</a>
          </div>
          <div className="rounded-[2rem] bg-dgNavy p-8 text-white sm:p-10">
            <Building2 className="h-9 w-9 text-dgGold" />
            <p className="mt-8 text-sm font-black uppercase tracking-[0.15em] text-dgGold">Entreprises & organisations</p>
            <h2 className="mt-3 text-3xl font-black">J’ai un besoin numérique à structurer.</h2>
            <p className="mt-4 leading-8 text-slate-300">Licences, formation d’équipe, site, application, hébergement ou digitalisation : présentez le besoin et nous construisons le parcours avec vous.</p>
            <a href={projectWhatsapp} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-dgGold px-5 py-3.5 font-black text-dgNavy"><MessageCircle className="h-5 w-5" />Présenter mon besoin</a>
          </div>
        </div>
      </section>

      {latestPosts.length > 0 && (
        <section className="bg-cloud px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div><p className="text-sm font-black uppercase tracking-[0.17em] text-ocean">Conseils & actualités</p><h2 className="mt-4 text-3xl font-black text-ink sm:text-5xl">Apprendre avant de décider.</h2></div>
              <Link href="/blog" className="inline-flex items-center gap-2 font-black text-ocean">Voir toutes les actualités <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-soft">
                  <Sparkles className="h-6 w-6 text-amber" />
                  <p className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-ocean">{post.category}</p>
                  <h3 className="mt-2 text-xl font-black text-ink">{post.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-gradient-to-r from-[#061F35] to-[#0B456C] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 lg:flex-row lg:items-center">
          <div><p className="text-sm font-black uppercase tracking-[0.16em] text-cyan">Un besoin numérique ?</p><h2 className="mt-3 text-3xl font-black">Commencez par nous expliquer ce que vous voulez accomplir.</h2><p className="mt-3 max-w-3xl text-slate-300">Pas besoin de connaître la solution technique à l’avance. Décrivez simplement votre objectif.</p></div>
          <a href={projectWhatsapp} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-mint px-6 py-4 font-black text-white"><MessageCircle className="h-5 w-5" />Parler à DG AFRIQUE</a>
        </div>
      </section>
    </>
  );
}
