import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { blogPosts, getPostBySlug } from '@/lib/content';

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return { title: 'Article not found - HackForge' };

  return { title: `${post.title} - HackForge Blog`, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const related = blogPosts
    .filter((item) => item.category === post.category && item.slug !== post.slug)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center text-primary hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>

        <article>
          <Link
            href={`/blog/category/${post.category}`}
            className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4 hover:bg-primary/30 transition-colors"
          >
            {post.categoryLabel}
          </Link>

          <h1 className="text-4xl font-bold text-foreground mb-4">{post.title}</h1>

          <p className="text-xl text-gray-300 mb-6">{post.excerpt}</p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-6 pb-6 border-b border-white/10">
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {post.date}
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {post.readTime}
            </span>
            <span className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {post.author}
            </span>
          </div>

          <div className="space-y-6 mb-10">
            {post.body.map((paragraph, index) => (
              <p key={index} className="text-gray-300 leading-relaxed text-lg">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 pb-8 border-b border-white/10">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </article>

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-foreground mb-6">Related articles</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="glass-effect border border-white/10 rounded-xl p-5 hover:border-primary/50 transition-all duration-300"
                >
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.readTime}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
