import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CircleCheck,
  Globe2,
  Handshake,
  Leaf,
  MessageCircle,
  Mountain,
  Network,
  PackageCheck,
  Pickaxe,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { getPublicSoftwareProducts, getPublicTrainingPrograms } from '@/lib/public-content';
import { gamadigitConfig, siteConfig, whatsappUrl } from '@/lib/site';

const poles = [
  { title: 'Commerce international & courtage', text: 'Import-export, négoce, mise en relation B2B, recherche de fournisseurs et d’acheteurs, transit et logistique.', icon: Globe2 },
  { title: 'Investissement & partenariats', text: 'Connexion entre porteurs de projets, investisseurs, partenaires techniques, commerciaux et internationaux.', icon: Handshake },
  { title: 'Mines, agriculture & matières premières', text: 'Opportunités liées aux ressources, produits agricoles, matières premières, achat, vente, stockage et transport.', icon: Mountain },
  { title: 'Construction, BTP & projets', text: 'Construction, fournitures, partenaires techniques, projets immobiliers et infrastructurels.', icon: Building2 },
  { title: 'Services aux entreprises & développement', text: 'Prestations, conseil, développement commercial, mise en relation et accompagnement opérationnel.', icon: Network },
  { title: 'GamaDigit — pôle numérique', text: 'Logiciels, abonnements, formations, web, applications, design, hébergement et digitalisation.', icon: PackageCheck },
];

export default async function HomePage() {
  const [softwareProducts, trainingPrograms] = await Promise.all([
    getPublicSoftwareProducts(),
    getPublicTrainingPrograms(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-dgNavy px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
        <div className="absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full bg-dgGold/10 blur-3xl" />
        <div className="absolute -bottom-56 left-1/4 h-[30rem] w-[30rem] rounded-full bg-dgGreen/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-dgGold"><Sparkles className="h-4 w-4" /> Développement Global Afrique</div>
            <h1 className="mt-7 max-w-5xl text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">Des solutions pour faire avancer <span className="text-dgGold">l’Afrique.</span></h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">Nous connectons les besoins africains aux solutions, marchés et partenaires capables de les transformer en opportunités.</p>
            <p className="mt-4 max-w-3xl leading-8 text-slate-400">Commerce international, courtage, partenariats, investissement, mines, agriculture, BTP, services et numérique.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="#poles" className="inline-flex items-center justify-center gap-2 rounded-xl bg-dgGold px-6 py-4 font-black text-dgNavy">Découvrir nos pôles <ArrowRight className="h-5 w-5" /></Link>
              <a href={whatsappUrl('Bonjour DG AFRIQUE, je souhaite vous présenter un projet, une opportunité ou un partenariat.')} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-4 font-black text-white"><MessageCircle className="h-5 w-5" /> Parler de mon projet</a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
              {['Afrique & international', 'Mise en relation B2B', 'Pôles spécialisés'].map((item) => <span key={item} className="flex items-center gap-2"><CircleCheck className="h-4 w-4 text-dgGreen" />{item}</span>)}
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-7 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-dgGold">Votre besoin peut commencer ici</p>
            <h2 className="mt-3 text-3xl font-black">Projet, marché, partenaire ou solution.</h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                ['Je cherche un fournisseur / acheteur', '/opportunites'],
                ['Je cherche un investisseur / partenaire', '/investisseurs-partenaires'],
                ['J’ai un projet à développer', '/contact'],
                ['Je cherche une solution numérique', '/gamadigit'],
              ].map(([label, href]) => <Link key={label} href={href} className="rounded-2xl bg-white p-5 font-black text-dgNavy transition hover:-translate-y-1">{label}<ArrowRight className="mt-4 h-4 w-4 text-dgGreen" /></Link>)}
            </div>
          </div>
        </div>
      </section>

      <section id="poles" className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.17em] text-dgGreen">Nos pôles</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-dgNavy sm:text-5xl">Une structure multisectorielle pensée pour connecter les opportunités.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">DG AFRIQUE regroupe ses activités en pôles lisibles afin que chaque client, entreprise, investisseur ou partenaire sache immédiatement où commencer.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {poles.map(({ title, text, icon: Icon }, index) => (
              <article key={title} className={`rounded-2xl border p-7 ${index === 5 ? 'border-dgGreen/30 bg-dgIvory' : 'border-slate-200 bg-white'}`}>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-dgNavy text-dgGold"><Icon className="h-6 w-6" /></span>
                <h3 className="mt-6 text-xl font-black text-dgNavy">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
                {index === 5 && <Link href="/gamadigit" className="mt-6 inline-flex items-center gap-2 text-sm font-black text-dgGreen">Entrer dans GamaDigit <ArrowRight className="h-4 w-4" /></Link>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dgIvory px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.17em] text-dgGreen">Opportunités & partenariats</p>
              <h2 className="mt-4 text-3xl font-black text-dgNavy sm:text-5xl">Créer les bonnes connexions autour des bons projets.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">DG AFRIQUE peut faciliter la mise en relation entre fournisseurs, acheteurs, porteurs de projets, partenaires techniques, partenaires commerciaux et investisseurs, en Afrique et à l’international.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/opportunites" className="rounded-xl bg-dgNavy px-5 py-3 font-black text-white">Voir les opportunités</Link>
                <Link href="/investisseurs-partenaires" className="rounded-xl border border-dgNavy/20 bg-white px-5 py-3 font-black text-dgNavy">Investisseurs & partenaires</Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[['Courtage international', Globe2], ['Mise en relation B2B', Handshake], ['Partenariats techniques', Wrench], ['Opportunités sectorielles', Pickaxe]].map(([label, Icon]) => {
                const C = Icon as typeof Globe2;
                return <div key={label as string} className="rounded-2xl bg-white p-6 shadow-sm"><C className="h-7 w-7 text-dgGreen" /><h3 className="mt-5 font-black text-dgNavy">{label as string}</h3></div>;
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#061F35] to-[#0B456C] p-8 text-white sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan">Pôle numérique</p>
              <h2 className="mt-4 text-4xl font-black sm:text-5xl">GamaDigit</h2>
              <p className="mt-3 text-xl font-bold text-cyan">{gamadigitConfig.tagline}</p>
              <p className="mt-5 max-w-2xl leading-8 text-slate-300">{gamadigitConfig.description}</p>
              <Link href="/gamadigit" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-mint px-5 py-3.5 font-black text-white">Entrer dans GamaDigit <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-6"><PackageCheck className="h-6 w-6 text-cyan" /><p className="mt-4 text-3xl font-black">{softwareProducts.length || '40+'}</p><p className="mt-1 text-sm text-slate-300">logiciels & abonnements</p></div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-6"><Leaf className="h-6 w-6 text-mint" /><p className="mt-4 text-3xl font-black">{trainingPrograms.length || '30+'}</p><p className="mt-1 text-sm text-slate-300">formations & packs</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-dgNavy px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 lg:flex-row lg:items-center">
          <div><p className="text-sm font-black uppercase tracking-[0.16em] text-dgGold">Une opportunité à proposer ?</p><h2 className="mt-3 text-3xl font-black">Présentez votre projet à DG AFRIQUE.</h2></div>
          <a href={whatsappUrl('Bonjour DG AFRIQUE, je souhaite vous présenter une opportunité, un projet ou un partenariat.')} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-dgGreen px-6 py-4 font-black text-white"><MessageCircle className="h-5 w-5" /> Échanger sur WhatsApp</a>
        </div>
      </section>
    </>
  );
}
