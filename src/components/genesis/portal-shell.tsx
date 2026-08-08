import Link from 'next/link';
import {
  ArrowRight,
  BriefcaseBusiness,
  CircleUserRound,
  Handshake,
  Layers3,
  Newspaper,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const secondaryActivities = [
  {
    title: 'Opportunités',
    description: 'Des offres, projets, besoins et possibilités de collaboration publiés après validation.',
    href: '/opportunites',
    icon: BriefcaseBusiness,
    action: 'Voir les opportunités',
  },
  {
    title: 'Partenariats',
    description: 'Une porte ouverte aux entreprises, experts, institutions et réseaux qui souhaitent construire des collaborations utiles.',
    href: '/investisseurs-partenaires',
    icon: Handshake,
    action: 'Devenir partenaire',
  },
];

export function PortalShell() {
  return (
    <>
      <section className="relative overflow-hidden bg-dgNavy px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
        <div className="absolute -right-24 top-16 h-96 w-96 rounded-full bg-dgGold/10 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-dgGreen/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-dgGold/30 bg-dgGold/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-dgGold">
              <Sparkles className="h-4 w-4" /> Développement Global Afrique
            </div>
            <h1 className="mt-7 max-w-5xl text-5xl font-black tracking-[-0.055em] sm:text-7xl lg:text-[5.2rem] lg:leading-[0.99]">
              Des solutions pour faire avancer l’Afrique.
            </h1>
            <p className="mt-7 max-w-4xl text-lg leading-9 text-slate-300 sm:text-xl">
              Nous développons des solutions numériques, nous accompagnons des projets, nous mettons en relation des acteurs et nous construisons progressivement un réseau de partenaires pour le développement en Afrique.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/pole-numerique" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 font-black text-dgNavy transition hover:-translate-y-0.5">
                Découvrir le pôle numérique <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/opportunites" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3.5 font-black text-white transition hover:bg-white/5">
                Voir les opportunités
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 shadow-2xl shadow-black/10 backdrop-blur sm:p-9">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">Notre priorité actuelle</p>
            <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-dgNavy">
              <Layers3 className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-3xl font-black tracking-[-0.03em]">Le pôle numérique</h2>
            <p className="mt-4 leading-7 text-slate-300">
              Logiciels, formations, création web et applications, infrastructure et accompagnement numérique : nous concentrons nos efforts sur des services que nous pouvons réellement proposer et développer.
            </p>
            <Link href="/pole-numerique" className="mt-7 inline-flex items-center gap-2 text-sm font-black text-white">
              Explorer cette activité <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="activites" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-dgGold">DG AFRIQUE aujourd’hui</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-dgNavy sm:text-5xl">Une base simple, utile et prête à évoluer.</h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 lg:justify-self-end">
              Nous avançons à partir de capacités réelles. Chaque activité visible doit pouvoir conduire à une action concrète : découvrir une solution, trouver une opportunité, proposer une collaboration ou accéder à un service.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
            <Link href="/pole-numerique" className="group relative overflow-hidden rounded-[2rem] bg-dgNavy p-8 text-white shadow-lg sm:p-10">
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-dgGold/10 blur-3xl" />
              <div className="relative">
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-white text-dgNavy"><Layers3 className="h-6 w-6" /></div>
                <p className="mt-8 text-xs font-black uppercase tracking-[0.18em] text-dgGold">Activité phare</p>
                <h3 className="mt-3 text-3xl font-black tracking-[-0.03em] sm:text-4xl">Pôle numérique</h3>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">Solutions numériques, logiciels, formations et accompagnement pour les particuliers, professionnels et organisations.</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-black">Découvrir le pôle numérique <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </div>
            </Link>

            <div className="grid gap-5">
              {secondaryActivities.map(({ title, description, href, icon: Icon, action }) => (
                <Link key={title} href={href} className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-dgGold/30 hover:shadow-lg">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-dgIvory text-dgNavy"><Icon className="h-5 w-5" /></div>
                  <h3 className="mt-5 text-2xl font-black text-dgNavy">{title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-dgNavy">{action} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-dgGold">Services & applications</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-dgNavy sm:text-5xl">Un accès unique, sans compliquer l’expérience.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Les services disponibles restent accessibles aujourd’hui. Les nouvelles applications rejoindront cet espace uniquement lorsqu’elles seront réellement prêtes à être utilisées.</p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 sm:p-10">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">Disponible aujourd’hui</p>
                  <h3 className="mt-3 text-3xl font-black tracking-[-0.03em] text-dgNavy">Solutions numériques</h3>
                </div>
                <ShieldCheck className="h-8 w-8 shrink-0 text-dgGreen" />
              </div>
              <p className="mt-5 max-w-2xl leading-8 text-slate-600">Explorez les logiciels, les formations et les services numériques déjà présentés par DG AFRIQUE.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/logiciels" className="inline-flex items-center gap-2 rounded-xl bg-dgNavy px-5 py-3.5 text-sm font-black text-white">Logiciels <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/formations" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-black text-dgNavy">Formations</Link>
              </div>
            </div>

            <div className="rounded-[2rem] bg-dgNavy p-8 text-white sm:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-dgNavy"><CircleUserRound className="h-6 w-6" /></div>
              <p className="mt-8 text-xs font-black uppercase tracking-[0.18em] text-dgGold">Mon espace</p>
              <h3 className="mt-3 text-3xl font-black tracking-[-0.03em]">Votre accès personnel.</h3>
              <p className="mt-5 leading-8 text-slate-300">Créez votre compte ou connectez-vous. Votre espace est prêt à accueillir progressivement les services auxquels vous aurez accès.</p>
              <Link href="/connexion" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-black text-dgNavy">Créer un compte ou se connecter <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section id="actualite" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid overflow-hidden rounded-[2rem] border border-slate-200 lg:grid-cols-[.8fr_1.2fr]">
            <div className="bg-dgIvory p-8 sm:p-10 lg:p-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-dgNavy shadow-sm"><Newspaper className="h-6 w-6" /></div>
              <p className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-dgGold">Actualités & conseils</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-dgNavy">Une rubrique éditoriale ciblée.</h2>
            </div>
            <div className="p-8 sm:p-10 lg:p-12">
              <p className="max-w-3xl text-lg leading-8 text-slate-600">Opportunités numériques, astuces, conseils, outils et contenus pratiques : nous publions sur des sujets que nous pouvons réellement suivre, comprendre et expliquer.</p>
              <p className="mt-5 max-w-3xl leading-7 text-slate-500">Cette rubrique grandira au rythme des publications, sans chercher à devenir un média généraliste.</p>
              <Link href="/blog" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-dgNavy px-5 py-3.5 text-sm font-black text-white">Lire les publications <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
