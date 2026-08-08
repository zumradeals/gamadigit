'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CircleUserRound,
  Compass,
  GraduationCap,
  HeartPulse,
  Landmark,
  Layers3,
  Menu,
  Newspaper,
  Search,
  Sparkles,
  Sprout,
  Tv,
  X,
} from 'lucide-react';

const universes = [
  { label: 'Économie', icon: BriefcaseBusiness, description: 'Entreprises, commerce, marchés et initiatives.' },
  { label: 'Technologie', icon: Layers3, description: 'Numérique, logiciels, innovation et compétences.' },
  { label: 'Éducation', icon: GraduationCap, description: 'Formation, apprentissage et transmission.' },
  { label: 'Santé', icon: HeartPulse, description: 'Prévention, systèmes de santé et innovation.' },
  { label: 'Agriculture', icon: Sprout, description: 'Production, transformation et chaînes de valeur.' },
  { label: 'Politique', icon: Landmark, description: 'Institutions, gouvernance et politiques publiques.' },
  { label: 'Religion', icon: BookOpen, description: 'Spiritualité, connaissance et société.' },
  { label: 'Société', icon: Compass, description: 'Culture, jeunesse, diaspora et initiatives.' },
];

const services = [
  {
    title: 'Opportunités',
    description: 'Découvrez des offres, projets, besoins, partenariats et possibilités de collaboration.',
    href: '/opportunites',
    icon: BriefcaseBusiness,
    action: 'Explorer les opportunités',
  },
  {
    title: 'Solutions numériques',
    description: 'Logiciels, abonnements, formations et accompagnement à la digitalisation.',
    href: '/pole-numerique',
    icon: Layers3,
    action: 'Découvrir les solutions',
  },
  {
    title: 'Mon espace',
    description: 'Un accès personnel simple pour retrouver progressivement vos informations et vos services.',
    href: '/connexion',
    icon: CircleUserRound,
    action: 'Accéder à mon espace',
  },
];

export function PortalShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');

  const normalized = query.trim().toLowerCase();
  const filteredUniverses = useMemo(
    () => universes.filter((item) => !normalized || `${item.label} ${item.description}`.toLowerCase().includes(normalized)),
    [normalized],
  );
  const filteredServices = useMemo(
    () => services.filter((item) => !normalized || `${item.title} ${item.description}`.toLowerCase().includes(normalized)),
    [normalized],
  );

  return (
    <>
      <header className="relative overflow-hidden bg-dgNavy text-white">
        <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-dgGold/10 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-dgGreen/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-20 items-center justify-between gap-5 border-b border-white/10">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-dgGold/35 bg-dgGold/10 text-dgGold">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-dgGold">DG AFRIQUE</p>
                <p className="text-xs text-slate-400">Développement Global Afrique</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-7 text-sm font-bold text-slate-300 lg:flex">
              <a href="#explorer" className="transition hover:text-white">Explorer</a>
              <Link href="/opportunites" className="transition hover:text-white">Opportunités</Link>
              <a href="#services" className="transition hover:text-white">Services</a>
              <a href="#actualite" className="transition hover:text-white">Actualités</a>
            </nav>

            <div className="flex items-center gap-2">
              <Link href="/connexion" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-dgNavy transition hover:bg-slate-100">
                <CircleUserRound className="h-4 w-4" /> <span className="hidden sm:inline">Mon espace</span>
              </Link>
              <button
                onClick={() => setMobileOpen((value) => !value)}
                className="inline-flex rounded-xl border border-white/15 p-3 lg:hidden"
                aria-label="Ouvrir la navigation"
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="grid gap-2 border-b border-white/10 py-4 text-sm font-bold text-slate-200 lg:hidden">
              <a href="#explorer" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 hover:bg-white/10">Explorer</a>
              <Link href="/opportunites" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 hover:bg-white/10">Opportunités</Link>
              <a href="#services" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 hover:bg-white/10">Services</a>
              <a href="#actualite" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 hover:bg-white/10">Actualités</a>
            </div>
          )}

          <section className="pb-20 pt-16 text-center sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-dgGold/30 bg-dgGold/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-dgGold">
              <Sparkles className="h-4 w-4" /> Une porte d’entrée pour l’Afrique
            </div>
            <h1 className="mx-auto mt-7 max-w-5xl text-5xl font-black tracking-[-0.055em] sm:text-7xl lg:text-[5.5rem] lg:leading-[0.98]">
              L’Afrique, reliée à ses possibilités.
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
              Trouvez des informations, des opportunités, des solutions et des services à partir d’un même point d’entrée.
            </p>

            <div className="mx-auto mt-10 max-w-3xl">
              <div className="flex items-center gap-3 rounded-2xl bg-white p-2 text-left shadow-2xl shadow-black/20">
                <Search className="ml-3 h-6 w-6 shrink-0 text-slate-400 sm:ml-4" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Que recherchez-vous en Afrique ?"
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:text-base"
                />
                <a href="#resultats" className="hidden rounded-xl bg-dgNavy px-5 py-3 text-sm font-black text-white sm:block">Rechercher</a>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs font-bold text-slate-400">
                <span>Exemples :</span>
                {['formation', 'opportunité', 'technologie', 'agriculture'].map((term) => (
                  <button key={term} onClick={() => setQuery(term)} className="text-slate-300 underline-offset-4 hover:text-white hover:underline">{term}</button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </header>

      <section id="explorer" className="border-b border-slate-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">Explorer</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] text-dgNavy">Les grands univers</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-500">Une navigation simple pour accéder progressivement aux contenus et services qui comptent.</p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {universes.map(({ label, icon: Icon }) => (
              <button key={label} onClick={() => setQuery(label)} className="group rounded-2xl border border-slate-200 bg-white px-3 py-5 text-center transition hover:-translate-y-1 hover:border-dgGold/40 hover:shadow-sm">
                <Icon className="mx-auto h-5 w-5 text-dgNavy transition group-hover:text-dgGold" />
                <span className="mt-2 block text-sm font-black text-slate-700">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {normalized && (
        <section id="resultats" className="bg-dgIvory px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">Résultats</p>
                <h2 className="mt-2 text-3xl font-black text-dgNavy">Pour « {query} »</h2>
              </div>
              <button onClick={() => setQuery('')} className="text-sm font-black text-dgNavy">Effacer</button>
            </div>

            {filteredUniverses.length === 0 && filteredServices.length === 0 ? (
              <p className="mt-8 rounded-2xl bg-white p-6 text-slate-600">Aucun résultat disponible pour le moment. Le moteur de recherche s’enrichira progressivement.</p>
            ) : (
              <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredServices.map((service) => (
                  <Link key={service.title} href={service.href} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-dgGold/40">
                    <p className="text-xs font-black uppercase tracking-wider text-dgGold">Service</p>
                    <h3 className="mt-3 text-xl font-black text-dgNavy">{service.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
                  </Link>
                ))}
                {filteredUniverses.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-6">
                    <p className="text-xs font-black uppercase tracking-wider text-dgGold">Univers</p>
                    <h3 className="mt-3 text-xl font-black text-dgNavy">{item.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section id="services" className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-dgGold">À portée de main</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-dgNavy sm:text-5xl">Commencez par ce qui est déjà utile aujourd’hui.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Le portail grandira progressivement, mais chaque entrée visible doit conduire à une capacité réelle.</p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {services.map(({ title, description, href, icon: Icon, action }) => (
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

      <section id="actualite" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-[2rem] bg-dgNavy p-8 text-white sm:p-10 lg:p-12">
            <div className="flex items-center justify-between gap-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-dgGold">Information</p>
              <Newspaper className="h-6 w-6 text-dgGold" />
            </div>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Comprendre ce qui bouge en Afrique.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Actualités, analyses, initiatives et contenus thématiques pourront être réunis ici dans une lecture claire et structurée.</p>
            <div className="mt-9 inline-flex items-center gap-2 text-sm font-black text-white">Actualités bientôt disponibles <ArrowRight className="h-4 w-4" /></div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-dgIvory p-8 sm:p-10 lg:p-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-dgNavy shadow-sm"><Building2 className="h-6 w-6" /></div>
            <p className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-dgGold">DG AFRIQUE</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] text-dgNavy">Un portail qui grandit par capacités réelles.</h2>
            <p className="mt-5 text-base leading-8 text-slate-600">Chaque nouvelle rubrique, service ou fonctionnalité sera ajoutée lorsqu’elle peut réellement servir les utilisateurs.</p>
            <div className="mt-8 flex items-center gap-2 text-sm font-black text-dgNavy"><Tv className="h-4 w-4" /> Information, services et opportunités réunis progressivement.</div>
          </div>
        </div>
      </section>
    </>
  );
}
