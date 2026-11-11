import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BadgePercent,
  BriefcaseBusiness,
  Check,
  GraduationCap,
  Handshake,
  ImageIcon,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import {
  getPublicSiteSettings,
  getPublicTrainingCategories,
  getPublicTrainingPrograms,
} from '@/lib/public-content';
import type { TrainingProgram } from '@/types/content';

export const metadata: Metadata = {
  title: 'Formations professionnelles',
  description: 'Formations professionnelles en CAO, DAO, BIM, structure, industrie, VRD et visualisation avec orientation sur WhatsApp.',
};

function whatsappUrl(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function TrainingCard({ program, whatsapp }: { program: TrainingProgram; whatsapp: string }) {
  const image = program.media[0]?.publicUrl || program.media[0]?.url;
  const message = program.whatsappMessage
    || `Bonjour DG AFRIQUE, je souhaite recevoir les informations et les modalités d’inscription pour ${program.name}.`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      {image ? (
        <div className="aspect-[16/8] overflow-hidden bg-slate-100">
          <img src={image} alt={program.media[0]?.alt || program.name} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="flex aspect-[16/6] items-center justify-between bg-gradient-to-br from-slate-50 to-blue-50 px-6">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-ocean shadow-sm">
            {program.kind === 'career_pack' ? <BriefcaseBusiness className="h-7 w-7" /> : <GraduationCap className="h-7 w-7" />}
          </span>
          <span className="flex items-center gap-2 text-xs font-bold text-slate-400"><ImageIcon className="h-4 w-4" />Image à ajouter</span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-black uppercase tracking-[0.14em]" style={{ color: program.categoryAccent }}>
            {program.kind === 'career_pack' ? 'Pack métier premium' : program.categoryName}
          </span>
          {program.durationLabel && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{program.durationLabel}</span>
          )}
        </div>

        <h3 className="mt-4 text-2xl font-black text-ink">{program.name}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{program.excerpt}</p>

        <ul className="mt-5 space-y-2 text-sm text-slate-700">
          {program.highlights.slice(0, 3).map((highlight) => (
            <li key={highlight} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-mint" />
              {highlight}
            </li>
          ))}
        </ul>

        {program.partnerLabel && (
          <p className="mt-5 rounded-xl bg-cloud px-4 py-3 text-xs font-semibold leading-5 text-slate-500">
            {program.partnerLabel}
          </p>
        )}

        <div className="mt-auto border-t border-slate-100 pt-6">
          <p className="text-lg font-black text-ink">
            {program.showPrice && program.priceLabel ? program.priceLabel : 'Tarif sur WhatsApp'}
          </p>
          {program.formatLabel && <p className="mt-1 text-xs font-semibold text-slate-500">{program.formatLabel}</p>}
          <a
            href={whatsappUrl(whatsapp, message)}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-mint px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
          >
            <MessageCircle className="h-4 w-4" />
            Recevoir le programme et le tarif
          </a>
        </div>
      </div>
    </article>
  );
}

export default async function TrainingsPage() {
  const [categories, programs, settings] = await Promise.all([
    getPublicTrainingCategories(),
    getPublicTrainingPrograms(),
    getPublicSiteSettings(),
  ]);

  const featured = programs.filter((program) => program.featured).slice(0, 6);
  const standardCategories = categories.filter((category) => category.slug !== 'packs-metiers-premium');
  const premiumCategory = categories.find((category) => category.slug === 'packs-metiers-premium');
  const premiumPrograms = programs.filter((program) => program.categorySlug === 'packs-metiers-premium');
  const generalMessage = 'Bonjour DG AFRIQUE, je souhaite être orienté vers une formation professionnelle adaptée à mon projet.';

  return (
    <>
      <section className="relative overflow-hidden bg-ink px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
        <div className="absolute -right-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-cyan/10 blur-3xl" />
        <div className="absolute -bottom-48 left-1/3 h-[28rem] w-[28rem] rounded-full bg-mint/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan">Pôle numérique · Formations</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
              Des compétences professionnelles pour passer de l’apprentissage à la pratique.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              CAO, DAO, BIM, structure, industrie, VRD et visualisation : découvrez les programmes disponibles, puis échangez sur WhatsApp pour choisir la formation adaptée.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappUrl(settings.whatsapp, generalMessage)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-mint px-6 py-4 font-black text-white"
              >
                <MessageCircle className="h-5 w-5" /> Être conseillé sur WhatsApp
              </a>
              <a href="#catalogue" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-4 font-black text-white">
                Voir les formations <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-5 text-ink">
                <p className="text-4xl font-black text-ocean">25</p>
                <p className="mt-2 text-sm font-bold text-slate-600">formations par logiciel</p>
              </div>
              <div className="rounded-2xl bg-white p-5 text-ink">
                <p className="text-4xl font-black text-mint">6</p>
                <p className="mt-2 text-sm font-bold text-slate-600">packs métiers premium</p>
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-ink/30 p-5">
              <p className="flex items-center gap-2 font-black text-white"><Handshake className="h-5 w-5 text-cyan" /> Une collaboration utile</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Le pôle numérique de DG AFRIQUE facilite la découverte, l’orientation et l’inscription. Les programmes sont assurés avec notre partenaire formateur spécialisé.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl bg-cloud px-4 py-3 text-sm font-bold text-slate-700"><BadgePercent className="h-5 w-5 text-ocean" />Étudiants : réduction annoncée de 10 %</div>
          <div className="flex items-center gap-3 rounded-xl bg-cloud px-4 py-3 text-sm font-bold text-slate-700"><BadgePercent className="h-5 w-5 text-ocean" />Groupes : réduction annoncée de 15 %</div>
          <div className="flex items-center gap-3 rounded-xl bg-cloud px-4 py-3 text-sm font-bold text-slate-700"><BadgePercent className="h-5 w-5 text-ocean" />Paiement intégral : réduction annoncée de 5 %</div>
        </div>
        <p className="mx-auto mt-3 max-w-7xl text-center text-xs text-slate-500">Les conditions et la disponibilité des réductions sont confirmées sur WhatsApp avant l’inscription.</p>
      </section>

      {featured.length > 0 && (
        <section className="bg-cloud px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.17em] text-ocean"><Sparkles className="h-4 w-4" />Programmes en vedette</p>
              <h2 className="mt-4 text-3xl font-black text-ink sm:text-5xl">Commencez par les compétences les plus recherchées.</h2>
              <p className="mt-4 leading-7 text-slate-600">Une sélection pour les futurs étudiants, techniciens, dessinateurs, ingénieurs et professionnels en évolution.</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featured.map((program) => <TrainingCard key={program.id} program={program} whatsapp={settings.whatsapp} />)}
            </div>
          </div>
        </section>
      )}

      <main id="catalogue" className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-20">
          <nav className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <a key={category.id} href={`#${category.slug}`} className="shrink-0 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-ocean hover:text-ocean">
                {category.name}
              </a>
            ))}
          </nav>

          {standardCategories.map((category) => {
            const categoryPrograms = programs.filter((program) => program.categorySlug === category.slug);
            if (!categoryPrograms.length) return null;
            return (
              <section key={category.id} id={category.slug} className="scroll-mt-28">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div className="max-w-3xl">
                    <div className="h-1.5 w-16 rounded-full" style={{ backgroundColor: category.accent }} />
                    <h2 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-4xl">{category.name}</h2>
                    <p className="mt-3 leading-7 text-slate-600">{category.description}</p>
                  </div>
                  <span className="text-sm font-bold text-slate-400">{categoryPrograms.length} formation{categoryPrograms.length > 1 ? 's' : ''}</span>
                </div>
                <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {categoryPrograms.map((program) => <TrainingCard key={program.id} program={program} whatsapp={settings.whatsapp} />)}
                </div>
              </section>
            );
          })}

          {premiumCategory && premiumPrograms.length > 0 && (
            <section id={premiumCategory.slug} className="scroll-mt-28 rounded-[2rem] bg-ink p-7 text-white sm:p-10">
              <div className="max-w-3xl">
                <p className="text-sm font-black uppercase tracking-[0.17em] text-cyan">Parcours complets</p>
                <h2 className="mt-4 text-3xl font-black sm:text-5xl">{premiumCategory.name}</h2>
                <p className="mt-4 leading-8 text-slate-300">{premiumCategory.description}</p>
              </div>
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {premiumPrograms.map((program) => (
                  <article key={program.id} className="flex flex-col rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                    <BriefcaseBusiness className="h-7 w-7 text-cyan" />
                    <h3 className="mt-5 text-2xl font-black">{program.name}</h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-slate-300">{program.excerpt}</p>
                    <p className="mt-5 font-black text-white">{program.showPrice && program.priceLabel ? program.priceLabel : 'Tarif sur WhatsApp'}</p>
                    <a href={whatsappUrl(settings.whatsapp, program.whatsappMessage || generalMessage)} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-mint px-4 py-3 text-sm font-black text-white">
                      <MessageCircle className="h-4 w-4" /> Recevoir les détails
                    </a>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-[2rem] bg-cloud p-8 text-center sm:p-12">
            <h2 className="text-3xl font-black text-ink">Vous hésitez entre plusieurs formations ?</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">Présentez votre métier, votre niveau et votre objectif. Le pôle numérique de DG AFRIQUE vous orientera vers le programme le plus pertinent avec le partenaire formateur.</p>
            <a href={whatsappUrl(settings.whatsapp, generalMessage)} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-4 font-black text-white">
              Demander une orientation <ArrowRight className="h-5 w-5" />
            </a>
            <div className="mt-5"><Link href="/contact" className="text-sm font-black text-ocean">Ou envoyer une demande détaillée</Link></div>
          </section>
        </div>
      </main>
    </>
  );
}
