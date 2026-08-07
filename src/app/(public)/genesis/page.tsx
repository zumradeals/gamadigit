import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CircleUserRound,
  Cloud,
  Compass,
  GraduationCap,
  Grid3X3,
  HeartPulse,
  Landmark,
  Layers3,
  Newspaper,
  Search,
  Sparkles,
  Sprout,
  Tv,
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

const applications = [
  { name: 'GAMAD Technology', description: 'Solutions, logiciels, formations et infrastructure.', href: '/pole-numerique', icon: Layers3, status: 'Disponible' },
  { name: 'Opportunités', description: 'Offres, besoins, projets, investissements et partenariats.', href: '/opportunites', icon: BriefcaseBusiness, status: 'Disponible' },
  { name: 'GamaDrive', description: 'Espace transversal de fichiers et de collaboration.', href: '#', icon: Cloud, status: 'À venir' },
  { name: 'Wasplex', description: 'Plateforme métier reliée progressivement à l’écosystème.', href: '#', icon: Grid3X3, status: 'Satellite' },
  { name: 'GAMAD TV', description: 'Information, programmes et productions éditoriales.', href: '#', icon: Tv, status: 'Projet' },
  { name: 'Mon espace', description: 'Identité, organisations, accès et services personnels.', href: '#', icon: CircleUserRound, status: 'Genesis' },
];

export default function GenesisPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-dgNavy px-4 pb-20 pt-14 text-white sm:px-6 lg:px-8 lg:pb-28 lg:pt-20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dgGold/60 to-transparent" />
        <div className="absolute -right-32 top-8 h-80 w-80 rounded-full bg-cyan/10 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-mint/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-dgGold">DG AFRIQUE · Portal Genesis</p>
              <p className="mt-2 text-sm text-slate-400">Développement Global Afrique</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-black text-white">
                <Grid3X3 className="h-4 w-4" /> Applications
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-dgNavy">
                <CircleUserRound className="h-4 w-4" /> Mon espace
              </button>
            </div>
          </div>

          <div className="mx-auto mt-20 max-w-5xl text-center lg:mt-24">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-dgGold/30 bg-dgGold/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-dgGold">
              <Sparkles className="h-4 w-4" /> Portail africain · services · connaissance · opportunités
            </div>
            <h1 className="mt-7 text-5xl font-black tracking-[-0.055em] sm:text-7xl lg:text-[5.5rem] lg:leading-[0.98]">
              L’Afrique, reliée à ses possibilités.
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
              Un portail institutionnel conçu pour relier information, opportunités, technologie, organisations et futurs services de l’écosystème GAMAD.
            </p>

            <div className="mx-auto mt-10 flex max-w-3xl items-center gap-3 rounded-2xl bg-white p-2 text-left shadow-2xl shadow-black/20">
              <Search className="ml-4 h-6 w-6 shrink-0 text-slate-400" />
              <div className="min-w-0 flex-1 py-3 text-base text-slate-500">Que recherchez-vous en Afrique ?</div>
              <button className="rounded-xl bg-dgNavy px-5 py-3 font-black text-white">Rechercher</button>
            </div>
            <p className="mt-3 text-xs text-slate-500">Recherche Genesis · articles, opportunités, solutions et services seront fédérés progressivement.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white px-4 py-7 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {universes.map(({ label, icon: Icon }) => (
              <button key={label} className="group rounded-2xl px-3 py-4 text-center transition hover:bg-slate-50">
                <Icon className="mx-auto h-5 w-5 text-dgNavy transition group-hover:text-dgGold" />
                <span className="mt-2 block text-sm font-black text-slate-700">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-dgGold">Services & satellites</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] text-dgNavy sm:text-5xl">Un portail. Plusieurs portes vers l’écosystème.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">Les services disponibles vivent aux côtés des futurs satellites. Le portail les rend découvrables sans absorber leurs données métier.</p>
            </div>
            <button className="inline-flex items-center gap-2 text-sm font-black text-dgNavy">Voir toutes les applications <ArrowRight className="h-4 w-4" /></button>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {applications.map(({ name, description, href, icon: Icon, status }) => {
              const content = (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div className="rounded-2xl bg-dgNavy p-3 text-white"><Icon className="h-6 w-6" /></div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-500">{status}</span>
                  </div>
                  <h3 className="mt-7 text-2xl font-black text-dgNavy">{name}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{description}</p>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-black text-dgNavy">Ouvrir <ArrowRight className="h-4 w-4" /></span>
                </>
              );

              return href === '#' ? (
                <div key={name} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">{content}</div>
              ) : (
                <Link key={name} href={href} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">{content}</Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-stretch">
          <div className="rounded-[2rem] bg-dgNavy p-8 text-white sm:p-10 lg:p-12">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-dgGold">À la une</p>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Comprendre l’Afrique. Relier ses acteurs. Faire émerger ses projets.</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">La future couche éditoriale du portail donnera une lecture professionnelle des grands domaines de la vie africaine sans confondre information, opinion, service public et activité commerciale.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-black text-dgNavy"><Newspaper className="h-4 w-4" /> Explorer l’actualité</button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 font-black text-white"><Tv className="h-4 w-4" /> GAMAD TV</button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 sm:p-10 lg:p-12">
            <div className="flex h-full flex-col">
              <div className="rounded-2xl bg-white p-4 shadow-sm w-fit"><Building2 className="h-7 w-7 text-dgNavy" /></div>
              <p className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-dgGold">Notre direction</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] text-dgNavy">Développement Global Afrique.</h2>
              <p className="mt-5 text-base leading-8 text-slate-600">Le portail ne remplace pas les acteurs : il crée un espace où identités, organisations, informations, opportunités et services peuvent se rencontrer progressivement dans un cadre professionnel.</p>
              <div className="mt-auto pt-8"><button className="inline-flex items-center gap-2 text-sm font-black text-dgNavy">Découvrir la vision <ArrowRight className="h-4 w-4" /></button></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-dgNavy px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-dgGold">Genesis · première matérialisation</p>
            <p className="mt-3 max-w-2xl text-lg text-slate-300">Ce prototype teste le langage visuel et l’architecture d’accueil du futur portail. Les capacités Core seront raccordées par étapes.</p>
          </div>
          <div className="flex items-center gap-3 text-sm font-black"><span className="h-2 w-2 rounded-full bg-mint" /> Branche de travail isolée</div>
        </div>
      </section>
    </>
  );
}
