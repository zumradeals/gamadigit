import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogContentRenderer } from '@/components/content/blog-content-renderer';
import { getPublicBlogPostBySlug, getPublicBlogPosts } from '@/lib/public-content';

export async function generateStaticParams() {
  const posts = await getPublicBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublicBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <article>
      <header className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-black uppercase tracking-[0.17em] text-cyan">{post.category}</p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">{post.title}</h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">{post.excerpt}</p>
          <p className="mt-6 text-sm font-bold text-slate-400">{post.publishedAt} · {post.readTime}</p>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <BlogContentRenderer content={post.content} />
      </div>
    </article>
  );
}
