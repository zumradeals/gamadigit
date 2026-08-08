'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CircleUserRound,
  Cloud,
  Compass,
  GraduationCap,
  Grid3X3,
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
  { label: 'Économie', icon: BriefcaseBusiness },
  { label: 'Technologie', icon: Layers3 },
  { label: 'Éducation', icon: GraduationCap },
  { label: 'Santé', icon: HeartPulse },
  { label: 'Agriculture', icon: Sprout },
  { label: 'Politique', icon: Landmark },
  { label: 'Religion', icon: BookOpen },
  { label: 'Société', icon: Compass },
];

const services = [
  { name: 'Pôle numérique', description: 'Solutions, logiciels, formations et infrastructure.', href: '/pole-numerique', icon: Layers3, status: 'Disponible' },
  { name: 'Opportunités', description: 'Offres, besoins, projets, investissements et partenariats.', href: '/opportunites', icon: BriefcaseBusiness, status: 'Disponible' },
  { name: 'GamaDrive', description: 'Espace de fichiers et de collaboration.', href: '#', icon: Cloud, status: 'À venir' },
  { name: 'GAMAD TV', description: 'Information, programmes et productions éditoriales.', href: '#', icon: Tv, status: 'À venir' },
  { name: 'Mon espace', description: 'Votre compte, vos accès et vos services.', href: '/connexion', icon: CircleUserRound, status: 'Disponible' },
];

export function PortalShell() {
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');

  const normalized = query.trim().toLowerCase();
  const filteredServices = useMemo(
    () => services.filter((item) => !normalized || `${item.name} ${item.description}`.toLowerCase().includes(normalized)),
    [normalized],
  );
  const filteredUniverses = useMemo(
    () => universes.filter((item) => !normalized || item.label.toLowerCase().includes(normalized)),
    [normalized],
  );

  return (
    <>
      <div className="relative overflow-hidden bg-dgNavy text-white">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dgGold/70 to-transparent" />
        <div className="absolute -right-32 top-24 h-96 w-96 rounded-full bg-cyan/10 blur-3xl" />
        <div className="absolute -left-28 bottom-0 h-80 w-80 rounded-full bg-mint/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-20 items-center justify-between gap-5 border-b border-white/10">
            <Link href="/" className="group flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-dgGold/35 bg-dgGold/10 text-dgGold">
                <Compass className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-black uppercase tracking-[0.22em] text-dgGold">DG AFRIQUE</p>
                <p className="truncate text-xs text-slate-400">Le portail</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-7 text-sm font-bold text-slate-300 lg:flex">
              <a href="#explorer" className="transition hover:text-white">Explorer</a>
              <a href="#services" className="transition hover:text-white">Services</a>
              <a href="#actualite" className="transition hover:text-white">Actualités</a>
              <Link href="/opportunites" className="transition hover:text-white">Opportunités</Link>
            </nav>

            <div className="flex items-center gap-2">
              <button onClick={() => setLauncherOpen(true)} className="hidden items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-black text-white transition hover:bg-white/10 sm:inline-flex">
                <Grid3X3 className="h-4 w-4" /> Applications
              </button>
              <Link href="/connexion" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-dgNavy transition hover:bg-slate-100">
                <CircleUserRound className="h-4 w-4" /> <span className="hidden sm:inline">Mon espace</span>
              </Link>
              <button onClick={() => setMobileOpen((value) => !value)} className="inline-flex rounded-xl border border-white/15 p-3 lg:hidden" aria-label="Ouvrir la navigation">
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="grid gap-2 border-b border-white/10 py-4 text-sm font-bold text-slate-200 lg:hidden">
              <a href="#explorer" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 hover:bg-white/10">Explorer</a>
              <a href="#services" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 hover:bg-white/10">Services</a>
              <a href="#actualite" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 hover:bg-white/10">Actualités</a>
              <Link href="/opportunites" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 hover:bg-white/10">Opportunités</Link>
              <Link href="/connexion" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 hover:bg-white/10">Mon espace</Link>
            </div>
          )}

          <section className="pb-20 pt-16 text-center sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-dgGold/30 bg-dgGold/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-dgGold sm:text-xs">
              <Sparkles className="h-4 w-4" /> Développement global de l’Afrique
            </div>
            <h1 className="mx-auto mt-7 max-w-5xl text-5xl font-black tracking-[-0.055em] sm:text-7xl lg:text-[5.5rem] lg:leading-[0.98]">L’Afrique, reliée à ses possibilités.</h1>
            <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">Information, opportunités, technologies, organisations et services réunis dans une même porte d’entrée professionnelle.</p>

            <div className="mx-auto mt-10 max-w-3xl">
              <div className="flex items-center gap-3 rounded-2xl bg-white p-2 text-left shadow-2xl shadow-black/20">
                <Search className="ml-3 h-6 w-6 shrink-0 text-slate-400 sm:ml-4" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Que recherchez-vous en Afrique ?" className="min-w-0 flex-1 bg-transparent py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:text-base" />
                <a href="#recherche" className="hidden rounded-xl bg-dgNavy px-5 py-3 text-sm font-black text-white sm:block">Rechercher</a>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs font-bold text-slate-400">
                <span>Essayez :</span>
                {['formation', 'opportunité', 'technologie', 'agriculture'].map((term) => (
                  <button key={term} onClick={() => setQuery(term)} className="text-slate-300 underline-offset-4 hover:text-white hover:underline">{term}</button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <section id="explorer" className="border-b border-slate-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">Explorer</p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-dgNavy">Les grands univers du portail</h2>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {filteredUniverses.map(({ label, icon: Icon }) => (
              <button key={label} className="group rounded-2xl border border-transparent px-3 py-4 text-center transition hover:border-slate-200 hover:bg-slate-50">
                <Icon className="mx-auto h-5 w-5 text-dgNavy transition group-hover:text-dgGold" />
                <span className="mt-2 block text-sm font-black text-slate-700">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {normalized && (
        <section id="recherche" className="bg-white px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">Recherche</p>
                <h2 className="mt-2 text-2xl font-black text-dgNavy">Résultats pour « {query} »</h2>
              </div>
              <button onClick={() => setQuery('')} className="text-sm font-black text-dgNavy">Effacer</button>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {filteredServices.map((item) => <ServiceResult key={item.name} item={item} />)}
              {filteredUniverses.map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-black uppercase tracking-wider text-dgGold">Univers</p>
                  <h3 className="mt-3 text-lg font-black text-dgNavy">{item.label}</h3>
                </div>
              ))}
              {filteredServices.length === 0 && filteredUniverses.length === 0 && <p className="text-slate-600">Aucun résultat pour le moment.</p>}
            </div>
          </div>
        </section>
      )}

      <section id="services" className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-dgGold">Services</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-dgNavy sm:text-5xl">Une porte d’entrée vers des services utiles.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">Le portail rassemble progressivement les services disponibles dans une expérience simple et cohérente.</p>
            </div>
            <button onClick={() => setLauncherOpen(true)} className="inline-flex items-center gap-2 text-sm font-black text-dgNavy">Voir les applications <ArrowRight className="h-4 w-4" /></button>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((item) => <ServiceCard key={item.name} item={item} />)}
          </div>
        </div>
      </section>

      <section id="actualite" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-[2rem] bg-dgNavy p-8 text-white sm:p-10 lg:p-12">
            <div className="flex items-center justify-between gap-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-dgGold">Information & connaissance</p>
              <Newspaper className="h-6 w-6 text-dgGold" />
            </div>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Une lecture africaine, professionnelle et ouverte sur le monde.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Actualités, analyses, initiatives et productions éditoriales seront progressivement réunies ici.</p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 sm:p-10 lg:p-12">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-dgGold">Notre direction</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] text-dgNavy">Développement Global Afrique.</h2>
            <p className="mt-5 text-base leading-8 text-slate-600">Un espace professionnel où connaissances, opportunités et services peuvent se rencontrer simplement.</p>
          </div>
        </div>
      </section>

      {launcherOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-dgNavy/75 p-4 pt-20 backdrop-blur-sm sm:pt-28" onClick={() => setLauncherOpen(false)}>
          <div className="w-full max-w-3xl rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-dgGold">DG AFRIQUE</p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-dgNavy">Applications & services</h2>
              </div>
              <button onClick={() => setLauncherOpen(false)} className="rounded-xl bg-slate-100 p-3 text-slate-700" aria-label="Fermer"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {services.map((item) => <LauncherItem key={item.name} item={item} close={() => setLauncherOpen(false)} />)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ServiceResult({ item }: { item: (typeof services)[number] }) {
  const body = <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-dgGold/40"><p className="text-xs font-black uppercase tracking-wider text-dgGold">Service</p><h3 className="mt-3 text-lg font-black text-dgNavy">{item.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p></div>;
  return item.href === '#' ? body : <Link href={item.href}>{body}</Link>;
}

function ServiceCard({ item }: { item: (typeof services)[number] }) {
  const Icon = item.icon;
  const body = <><div className="flex items-start justify-between gap-4"><div className="rounded-2xl bg-dgNavy p-3 text-white"><Icon className="h-6 w-6" /></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-500">{item.status}</span></div><h3 className="mt-7 text-2xl font-black text-dgNavy">{item.name}</h3><p className="mt-3 leading-7 text-slate-600">{item.description}</p><span className="mt-7 inline-flex items-center gap-2 text-sm font-black text-dgNavy">{item.href === '#' ? 'Bientôt' : 'Ouvrir'} <ArrowRight className="h-4 w-4" /></span></>;
  const classes = 'rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg';
  return item.href === '#' ? <div className={classes}>{body}</div> : <Link href={item.href} className={classes}>{body}</Link>;
}

function LauncherItem({ item, close }: { item: (typeof services)[number]; close: () => void }) {
  const Icon = item.icon;
  const body = <div className="group flex items-center gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-dgGold/40 hover:bg-slate-50"><div className="rounded-xl bg-dgNavy p-3 text-white"><Icon className="h-5 w-5" /></div><div className="min-w-0 flex-1"><p className="truncate font-black text-dgNavy">{item.name}</p><p className="mt-1 text-xs text-slate-500">{item.status}</p></div></div>;
  return item.href === '#' ? body : <Link href={item.href} onClick={close}>{body}</Link>;
}
