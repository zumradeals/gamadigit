import Link from 'next/link';
import {
  ArrowRight,
  Code2,
  GraduationCap,
  MessageCircle,
  PackageCheck,
  Server,
} from 'lucide-react';
import {
  getPublicServices,
  getPublicSoftwareProducts,
  getPublicTrainingPrograms,
} from '@/lib/public-content';
import { gamadigitConfig, siteConfig } from '@/lib/site';

export default async function GamaDigitPage() {
  const [softwareProducts, trainingPrograms, services] = await Promise.all([
    getPublicSoftwareProducts(),
    getPublicTrainingPrograms(),
    getPublicServices(),
  ]);
  const digitalServices = services.filter(
    (service) => !['logiciels-abonnements', 'formation-accompagnement'].includes(service.familySlug),
  );
  const whatsapp = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent('Bonjour GamaDigit, je souhaite être conseillé sur vos solutions numériques.')}`;

  return (
    <>
      <section className="relative overflow-hidden bg-ink px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute -right-36 -top-40 h-[30rem] w-[30rem] rounded-full bg-cyan/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <Link href="/" className="text-sm font-black text-amber">DG AFRIQUE / Pôle numérique</Link>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <h1 className="text-5xl font-black tracking-[-0.04em] sm:text-7xl">GamaDigit</h1>
              <p className="mt-4 text-2xl font-black text-cyan">{gamadigitConfig.tagline}</p>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{gamadigitConfig.description}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/logiciels" className="inline-flex items-center justify-center gap-2 rounded-xl bg-mint px-6 py-4 font-black text-white">Voir les logiciels <ArrowRight className="h-4 w-4" /></Link>
                <a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-4 font-black text-white"><MessageCircle className="h-5 w-5" />Demander conseil</a>
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
            <p className="text-sm font-black uppercase tracking-[0.17em] text-ocean">Tout GamaDigit</p>
            <h2 className="mt-4 text-3xl font-black text-ink sm:text-5xl">Acheter, apprendre et construire au même endroit.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Le pôle numérique de DG AFRIQUE conserve toute l’offre déjà construite : logiciels, formations, services et solutions pour les entreprises.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/logiciels" className="rounded-2xl border border-slate-200 bg-cloud p-6 transition hover:-translate-y-1 hover:shadow-soft"><PackageCheck className="h-9 w-9 text-ocean" /><h3 className="mt-6 text-xl font-black text-ink">Logiciels & abonnements</h3><p className="mt-3 text-sm leading-7 text-slate-600">Catalogue professionnel, activation, conseil et commande via WhatsApp.</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-ocean">Explorer <ArrowRight className="h-4 w-4" /></span></Link>
            <Link href="/formations" className="rounded-2xl border border-slate-200 bg-cloud p-6 transition hover:-translate-y-1 hover:shadow-soft"><GraduationCap className="h-9 w-9 text-mint" /><h3 className="mt-6 text-xl font-black text-ink">Formations professionnelles</h3><p className="mt-3 text-sm leading-7 text-slate-600">Formations par logiciel et parcours métiers premium.</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-ocean">Explorer <ArrowRight className="h-4 w-4" /></span></Link>
            <Link href="/services/creation-web-applications" className="rounded-2xl border border-slate-200 bg-cloud p-6 transition hover:-translate-y-1 hover:shadow-soft"><Code2 className="h-9 w-9 text-cyan" /><h3 className="mt-6 text-xl font-black text-ink">Web & applications</h3><p className="mt-3 text-sm leading-7 text-slate-600">Sites, applications et outils numériques adaptés aux projets.</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-ocean">Explorer <ArrowRight className="h-4 w-4" /></span></Link>
            <Link href="/services/hebergement-infrastructure" className="rounded-2xl border border-slate-200 bg-cloud p-6 transition hover:-translate-y-1 hover:shadow-soft"><Server className="h-9 w-9 text-amber" /><h3 className="mt-6 text-xl font-black text-ink">Infrastructure & entreprises</h3><p className="mt-3 text-sm leading-7 text-slate-600">Hébergement, domaines, e-mails, équipements et accompagnement.</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-ocean">Explorer <ArrowRight className="h-4 w-4" /></span></Link>
          </div>
        </div>
      </section>
    </>
  );
}
