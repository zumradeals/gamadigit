import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Lightbulb, Newspaper } from 'lucide-react';
import { getPublicBlogPosts } from '@/lib/public-content';

export const metadata: Metadata = {
  title: 'Actualités & conseils numériques',
  description: 'Opportunités numériques, astuces, conseils pratiques, logiciels, formations et transformation numérique avec DG AFRIQUE.',
};

export default async function BlogPage() {
  const posts = await getPublicBlogPosts();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <>
      <section className="relative overflow-hidden bg-dgNavy px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-dgGold/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.17em] text-dgGold">Actualités & conseils</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-6xl">Des contenus pratiques pour mieux utiliser le numérique.</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Opportunités numériques, outils, logiciels, formation, entrepreneuriat et conseils simples : nous publions ce que nous pouvons réellement suivre, expliquer et rendre utile.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><Lightbulb className="h-6 w-6 text-dgGold"/><p className="mt-4 font-black">Astuces & conseils</p><p className="mt-2 text-sm leading-6 text-slate-300">Des explications concrètes pour faire de meilleurs choix numériques.</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><Newspaper className="h-6 w-6 text-dgGold"/><p className="mt-4 font-black">Opportunités numériques</p><p className="mt-2 text-sm leading-6 text-slate-300">Des informations utiles lorsque nous pouvons les vérifier et les présenter clairement.</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><BookOpen className="h-6 w-6 text-dgGold"/><p className="mt-4 font-black">Ressources pratiques</p><p className="mt-2 text-sm leading-6 text-slate-300">Logiciels, compétences, usages et transformation numérique.</p></div>
          </div>
        </div>
      </section>

      {featured && (
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-black uppercase tracking-[0.17em] text-dgGold">À lire en premier</p>
            <Link href={`/blog/${featured.slug}`} className="mt-5 grid gap-8 rounded-[2rem] border border-slate-200 bg-dgIvory p-7 transition hover:-translate-y-1 hover:shadow-lg md:grid-cols-[.75fr_1.25fr] md:items-center sm:p-9">
              <div className="flex min-h-52 items-center justify-center rounded-[1.5rem] bg-dgNavy text-dgGold"><BookOpen className="h-14 w-14" /></div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-dgGreen">{featured.category}</p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-dgNavy sm:text-4xl">{featured.title}</h2>
                <p className="mt-4 text-lg leading-8 text-slate-600">{featured.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-black text-dgGreen">Lire l’article <ArrowRight className="h-4 w-4" /></span>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl"><p className="text-sm font-black uppercase tracking-[0.17em] text-dgGold">Toutes les publications</p><h2 className="mt-3 text-3xl font-black text-dgNavy sm:text-4xl">Lire, comprendre, décider.</h2></div>
          {rest.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{rest.map((post) => <Link key={post.id} href={`/blog/${post.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><p className="text-xs font-black uppercase tracking-[0.14em] text-dgGreen">{post.category}</p><h3 className="mt-3 text-2xl font-black leading-8 text-dgNavy">{post.title}</h3><p className="mt-4 leading-7 text-slate-600">{post.excerpt}</p><div className="mt-7 flex items-center justify-between gap-4"><p className="text-xs font-bold text-slate-400">{post.publishedAt} · {post.readTime}</p><ArrowRight className="h-4 w-4 text-dgGreen transition group-hover:translate-x-1" /></div></Link>)}</div>
          ) : !featured ? (
            <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-8"><p className="font-black text-dgNavy">Les premières publications arrivent progressivement.</p><p className="mt-2 text-slate-600">Cette rubrique restera volontairement ciblée sur les contenus que DG AFRIQUE peut suivre et produire avec sérieux.</p></div>
          ) : null}
        </div>
      </section>
    </>
  );
}
