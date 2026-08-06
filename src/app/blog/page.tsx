import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Conseils pratiques sur les sites web, logiciels, formations, hébergement et transformation numérique.',
};

export default function BlogPage() {
  const posts = blogPosts.filter((post) => post.status === 'published');
  return (
    <>
      <section className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><p className="text-sm font-black uppercase tracking-[0.17em] text-cyan">Conseils et ressources</p><h1 className="mt-4 text-4xl font-black sm:text-6xl">Le blog GamaDigit</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Des contenus utiles pour comprendre les outils numériques et prendre de meilleures décisions.</p></div></section>
      <section className="bg-cloud px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <Link key={post.id} href={`/blog/${post.slug}`} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"><p className="text-xs font-black uppercase tracking-[0.14em] text-ocean">{post.category}</p><h2 className="mt-3 text-2xl font-black leading-8 text-ink">{post.title}</h2><p className="mt-4 leading-7 text-slate-600">{post.excerpt}</p><p className="mt-7 text-xs font-bold text-slate-400">{post.publishedAt} · {post.readTime}</p></Link>)}</div></section>
    </>
  );
}
