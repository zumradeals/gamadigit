import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  GraduationCap,
  Handshake,
  Layers3,
  MessageCircle,
  PackageCheck,
  Rocket,
  Sparkles,
} from 'lucide-react';
import {
  getPublicServices,
  getPublicSoftwareProducts,
  getPublicTrainingPrograms,
} from '@/lib/public-content';
import { gamadigitConfig, siteConfig } from '@/lib/site';

function whatsappUrl(message: string) {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

export default async function HomePage() {
  const [softwareProducts, trainingPrograms, services] = await Promise.all([
    getPublicSoftwareProducts(),
    getPublicTrainingPrograms(),
    getPublicServices(),
  ]);

  const digitalServices = services.filter(
    (service) => !['logiciels-abonnements', 'formation-accompagnement'].includes(service.familySlug),
  );

  return (
    <>
      <section className="relative overflow-hidden bg-ink px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
        <div className="absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full bg-amber/10 blur-3xl" />
        <div className="absolute -bottom-56 left-1/4 h-[30rem] w-[30rem] rounded-full bg-ocean/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-amber">
              <Sparkles className="h-4 w-4" /> Développement Global Afrique
            </div>
            <h1 className="mt-7 max-w-5xl text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Des solutions pour faire avancer <span className="text-amber">l’Afrique.</span>
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
              DG AFRIQUE développe des solutions, structure des services et organise des pôles spécialisés pour accompagner les particuliers, les professionnels, les entreprises et les porteurs de projets.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="#poles" className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber px-6 py-4 font-black text-ink transition hover:-translate-y-0.5">
                Découvrir nos pôles <ArrowRight className="h-5 w-5" />
              </Link>
              <a href={whatsappUrl('Bonjour DG AFRIQUE, je souhaite vous présenter mon projet.')} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-4 font-black text-white hover:bg-white/15">
                <MessageCircle className="h-5 w-5" /> Parler de mon projet
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
              {['Une structure unique', 'Des pôles spécialisés', 'Un accompagnement orienté résultats'].map((item) => (
                <span key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-mint" />{item}</span>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 backdrop-blur sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-cyan">Une architecture faite pour grandir</p>
            <h2 className="mt-3 text-3xl font-black">Une maison, plusieurs expertises.</h2>
            <p className="mt-4 leading-7 text-slate-300">DG AFRIQUE rassemble progressivement des pôles capables de traiter des besoins spécialisés tout en gardant une vision globale du projet.</p>
            <div className="mt-7 space-y-3">
              <div className="rounded-2xl bg-white p-5 text-ink">
                <div className="flex items-center gap-3"><Layers3 className="h-6 w-6 text-ocean" /><p className="font-black">GamaDigit — pôle numérique</p></div>
                <p className="mt-2 text-sm leading-6 text-slate-600">Logiciels, formations, web, applications, design, hébergement et digitalisation.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><Building2 className="h-5 w-5 text-amber" /><p className="mt-3 text-sm font-black">Solutions entreprises</p></div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><Handshake className="h-5 w-5 text-mint" /><p className="mt-3 text-sm font-black">Partenariats & projets</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="poles" className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.17em] text-ocean">Nos pôles</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-5xl">Des expertises spécialisées, réunies sous DG AFRIQUE.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Chaque pôle possède sa propre offre, ses outils et son parcours client. DG AFRIQUE assure la cohérence d’ensemble et crée les passerelles utiles entre les besoins.</p>
          </div>

          <article className="mt-12 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#071D30] to-[#0B456C] text-white shadow-xl">
            <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
              <div>
                <span className="inline-flex rounded-full bg-cyan/15 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-cyan">Pôle actif</span>
                <h3 className="mt-5 text-4xl font-black sm:text-5xl">GamaDigit</h3>
                <p className="mt-3 text-xl font-bold text-cyan">{gamadigitConfig.tagline}</p>
                <p className="mt-5 max-w-2xl leading-8 text-slate-300">{gamadigitConfig.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/gamadigit" className="inline-flex items-center gap-2 rounded-xl bg-mint px-5 py-3.5 font-black text-white">Entrer dans GamaDigit <ArrowRight className="h-4 w-4" /></Link>
                  <Link href="/logiciels" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3.5 font-black text-white">Voir les logiciels</Link>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-5"><PackageCheck className="h-6 w-6 text-cyan" /><p className="mt-5 text-3xl font-black">{softwareProducts.length || '40+'}</p><p className="mt-1 text-sm text-slate-300">logiciels & abonnements</p></div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-5"><GraduationCap className="h-6 w-6 text-mint" /><p className="mt-5 text-3xl font-black">{trainingPrograms.length || '30+'}</p><p className="mt-1 text-sm text-slate-300">formations & packs</p></div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-5"><Rocket className="h-6 w-6 text-amber" /><p className="mt-5 text-3xl font-black">{digitalServices.length || '6+'}</p><p className="mt-1 text-sm text-slate-300">services numériques</p></div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section id="solutions" className="bg-cloud px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.17em] text-ocean">Comment DG AFRIQUE intervient</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-5xl">Partir du besoin, construire la bonne réponse.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Nous privilégions une approche simple : comprendre le projet, mobiliser le bon pôle ou le bon partenaire, puis accompagner l’exécution.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-7 shadow-sm"><Layers3 className="h-9 w-9 text-ocean" /><h3 className="mt-6 text-xl font-black text-ink">Solutions spécialisées</h3><p className="mt-3 leading-7 text-slate-600">Des offres structurées dans des pôles identifiables, avec des parcours simples et des interlocuteurs clairs.</p></div>
            <div className="rounded-2xl bg-white p-7 shadow-sm"><Building2 className="h-9 w-9 text-amber" /><h3 className="mt-6 text-xl font-black text-ink">Accompagnement des entreprises</h3><p className="mt-3 leading-7 text-slate-600">Équipement, digitalisation, services, besoins d’équipes et solutions adaptées aux organisations.</p></div>
            <div className="rounded-2xl bg-white p-7 shadow-sm"><Handshake className="h-9 w-9 text-mint" /><h3 className="mt-6 text-xl font-black text-ink">Partenariats & développement</h3><p className="mt-3 leading-7 text-slate-600">DG AFRIQUE peut structurer des collaborations et connecter les compétences utiles autour d’un projet.</p></div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-ink p-8 text-white shadow-xl sm:p-12 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-amber">Un projet à faire avancer ?</p>
            <h2 className="mt-3 text-3xl font-black sm:text-5xl">Présentez-nous votre besoin.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">Même si vous ne savez pas encore quel service ou quel pôle choisir, commencez simplement par nous expliquer votre objectif.</p>
          </div>
          <a href={whatsappUrl('Bonjour DG AFRIQUE, j’ai un projet et je souhaite être orienté vers la solution adaptée.')} target="_blank" rel="noreferrer" className="mt-7 inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-mint px-6 py-4 font-black text-white lg:mt-0">
            <MessageCircle className="h-5 w-5" /> Échanger sur WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
