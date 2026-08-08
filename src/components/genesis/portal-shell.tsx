import Link from 'next/link';
import {
  ArrowRight,
  BriefcaseBusiness,
  CircleUserRound,
  Handshake,
  Layers3,
  Newspaper,
  Sparkles,
} from 'lucide-react';

const activities = [
  {
    title: 'Pôle numérique',
    description: 'Solutions numériques, logiciels, formations et accompagnement pour les particuliers, professionnels et organisations.',
    href: '/pole-numerique',
    icon: Layers3,
    action: 'Découvrir le pôle numérique',
  },
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
  {
    title: 'Services',
    description: 'Accédez aux services déjà disponibles aujourd’hui et, progressivement, aux nouvelles applications reliées à DG AFRIQUE.',
    href: '/#services',
    icon: Sparkles,
    action: 'Voir les services',
  },
];

export function PortalShell() {
  return (
    <>
      <section className="relative overflow-hidden bg-dgNavy px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
        <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-dgGold/10 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-dgGreen/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-5xl">
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
              <Link href="/pole-numerique" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 font-black text-dgNavy">
                Découvrir le pôle numérique <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/opportunites" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3.5 font-black text-white">
                Voir les opportunités
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="activites" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-dgGold">DG AFRIQUE aujourd’hui</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-dgNavy sm:text-5xl">Construire à partir de capacités réelles.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Nous avançons progressivement, avec des activités concrètes et des collaborations qui peuvent produire de la valeur dès maintenant.</p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {activities.map(({ title, description, href, icon: Icon, action }) => (
              <Link key={title} href={href} className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dgNavy text-dgGold"><Icon className="h-6 w-6" /></div>
                <h3 className="mt-6 text-2xl font-black text-dgNavy">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{description}</p>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-black text-dgNavy">{action} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-[2rem] bg-dgNavy p-8 text-white sm:p-10 lg:p-12">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-dgGold">Services & applications</p>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Un point d’entrée qui peut grandir avec nos solutions.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Les services disponibles aujourd’hui restent accessibles, et de nouvelles applications pourront rejoindre progressivement DG AFRIQUE lorsqu’elles seront réellement prêtes.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/logiciels" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 font-black text-dgNavy">Logiciels <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/formations" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3.5 font-black text-white">Formations</Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 sm:p-10 lg:p-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dgIvory text-dgNavy"><CircleUserRound className="h-6 w-6" /></div>
            <p className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-dgGold">Mon espace</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] text-dgNavy">Votre accès personnel à DG AFRIQUE.</h2>
            <p className="mt-5 text-base leading-8 text-slate-600">Créez votre compte ou connectez-vous. Votre espace pourra accueillir progressivement les services auxquels vous aurez accès.</p>
            <Link href="/connexion" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-dgNavy px-5 py-3.5 text-sm font-black text-white">Créer un compte ou se connecter <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section id="actualite" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] border border-slate-200 bg-dgIvory p-8 sm:p-10 lg:p-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-dgNavy shadow-sm"><Newspaper className="h-6 w-6" /></div>
            <p className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-dgGold">Actualités & conseils</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-0.04em] text-dgNavy sm:text-5xl">Partager ce que nous pouvons réellement suivre et expliquer.</h2>
            <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-600">Opportunités numériques, astuces, conseils, outils et contenus pratiques : une rubrique éditoriale volontairement ciblée, alimentée au rythme de nos capacités.</p>
            <Link href="/blog" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-dgNavy px-5 py-3.5 text-sm font-black text-white">Lire les publications <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
