import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { FamilyIcon } from '@/components/family-icon';
import { blogPosts, families, services } from '@/lib/content';
import { siteConfig, whatsappUrl } from '@/lib/site';

export default function HomePage() {
  const featured = services.filter((service) => service.featured).slice(0, 3);
  const latestPosts = blogPosts.filter((post) => post.status === 'published').slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-ink px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
        <div className="absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-cyan/10 blur-3xl" />
        <div className="absolute -bottom-56 left-1/3 h-[30rem] w-[30rem] rounded-full bg-ocean/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.13em] text-cyan">
              <Sparkles className="h-4 w-4" /> {siteConfig.ecosystem}
            </div>
            <h1 className="mt-7 max-w-3xl text-4xl font-black leading-[1.06] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Le numérique qui fait avancer <span className="text-cyan">vos projets.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Sites web, applications, design, hébergement, logiciels et formations : une équipe unique pour transformer vos besoins en solutions concrètes.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href={whatsappUrl('Bonjour GamaDigit, je souhaite discuter de mon projet numérique.')} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-mint px-6 py-4 font-extrabold text-white shadow-xl shadow-emerald-950/20 transition hover:-translate-y-0.5">
                <MessageCircle className="h-5 w-5" />
                Démarrer mon projet
              </a>
              <Link href="#services" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-4 font-bold text-white transition hover:bg-white/15">
                Explorer nos solutions <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
              {['Conseil avant engagement', 'Devis clair', 'Accompagnement en français'].map((item) => (
                <span key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-mint" />{item}</span>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-cyan/20 via-ocean/10 to-transparent blur-2xl" />
            <div className="relative rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur sm:p-7">
              <div className="rounded-2xl bg-white p-6 text-slate-900 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-ocean">Votre projet, bien orienté</p>
                    <h2 className="mt-2 text-2xl font-black text-ink">Une solution cohérente, pas une accumulation d’outils.</h2>
                  </div>
                  <span className="rounded-full bg-emerald-50 p-3 text-mint"><BadgeCheck className="h-6 w-6" /></span>
                </div>
                <div className="mt-7 space-y-4">
                  {[
                    ['01', 'Comprendre', 'Votre besoin, votre public et votre priorité.'],
                    ['02', 'Concevoir', 'Une offre adaptée, expliquée et chiffrée.'],
                    ['03', 'Déployer', 'Mise en ligne, formation et suivi.'],
                  ].map(([number, title, text]) => (
                    <div key={number} className="grid grid-cols-[3rem_1fr] gap-4 rounded-xl bg-cloud p-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-sm font-black text-white">{number}</span>
                      <div><p className="font-black text-ink">{title}</p><p className="mt-1 text-sm leading-6 text-slate-600">{text}</p></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 px-5 py-4 text-sm text-slate-200">
                <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-cyan" />Approche professionnelle</span>
                <span className="font-bold text-mint">Réponse rapide</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.17em] text-ocean">Six familles, une seule direction</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-5xl">Tout ce qu’il faut pour construire une présence numérique utile.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">La version minimale démarre avec des offres simples dans chaque famille, puis évolue selon les besoins réels des clients.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {families.map((family) => (
              <Link key={family.id} href={`/services/${family.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl text-white" style={{ backgroundColor: family.accent }}><FamilyIcon name={family.icon} className="h-6 w-6" /></span>
                <p className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-slate-400">{family.eyebrow}</p>
                <h3 className="mt-2 text-xl font-black text-ink">{family.name}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{family.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-ocean">Découvrir <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cloud px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><p className="text-sm font-black uppercase tracking-[0.17em] text-ocean">Commencer simplement</p><h2 className="mt-3 text-3xl font-black text-ink sm:text-4xl">Nos premières offres essentielles</h2></div>
            <Link href="/contact" className="inline-flex items-center gap-2 font-black text-ocean">Demander une orientation <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {featured.map((service) => (
              <article key={service.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-mint">{service.deliveryLabel}</p>
                <h3 className="mt-3 text-2xl font-black text-ink">{service.name}</h3>
                <p className="mt-3 leading-7 text-slate-600">{service.excerpt}</p>
                <ul className="mt-6 space-y-3 text-sm text-slate-700">
                  {service.features.map((feature) => <li key={feature} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-mint" />{feature}</li>)}
                </ul>
                <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5"><span className="font-black text-ink">{service.priceLabel}</span><Link href={`/services/${service.familySlug}`} className="rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white">Voir l’offre</Link></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center"><p className="text-sm font-black uppercase tracking-[0.17em] text-ocean">Conseils et ressources</p><h2 className="mt-3 text-3xl font-black text-ink sm:text-4xl">Le blog GamaDigit</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">Des explications simples pour mieux choisir, lancer et faire évoluer vos outils numériques.</p></div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {latestPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:shadow-soft">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-ocean">{post.category}</span>
                <h3 className="mt-3 text-xl font-black leading-7 text-ink group-hover:text-ocean">{post.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
                <p className="mt-6 text-xs font-bold text-slate-400">{post.publishedAt} · {post.readTime}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-gradient-to-r from-ink to-[#0b4f75] px-6 py-14 text-center text-white shadow-soft sm:px-12">
          <h2 className="text-3xl font-black sm:text-4xl">Un projet à lancer ou à structurer ?</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">Expliquez-nous votre objectif. Nous vous orientons vers la première solution utile, sans vous imposer une offre trop complexe.</p>
          <a href={whatsappUrl('Bonjour GamaDigit, voici le projet que je souhaite lancer : ')} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-mint px-6 py-4 font-black text-white"><MessageCircle className="h-5 w-5" />Présenter mon projet</a>
        </div>
      </section>
    </>
  );
}
