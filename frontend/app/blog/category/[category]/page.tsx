import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { blogCategories, getPostsByCategory } from '@/lib/content';

export function generateStaticParams() {
  return blogCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = blogCategories.find((item) => item.slug === categorySlug);

  if (!category) return { title: 'Category not found - HackForge' };

  return {
    title: `${category.name} - HackForge Blog`,
    description: category.description,
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = blogCategories.find((item) => item.slug === categorySlug);

  if (!category) notFound();

  const posts = getPostsByCategory(category.slug);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <Link
          href="/blog"
          className="inline-flex items-center text-primary hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>

        <h1 className="text-4xl font-bold neon-text mb-3">{category.name}</h1>
        <p className="text-lg text-gray-300 mb-10">{category.description}</p>

        {posts.length === 0 ? (
          <div className="glass-effect border border-white/10 rounded-xl p-8 text-center">
            <p className="text-gray-300">No articles in this category yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="glass-effect border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group"
              >
                <h2 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-300 text-sm mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {post.date}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {post.readTime}
                  </span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-primary hover:text-accent transition-colors"
                >
                  Read More →
                </Link>
              </article>
            ))}
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Other categories</h2>
          <div className="flex flex-wrap gap-3">
            {blogCategories
              .filter((item) => item.slug !== category.slug)
              .map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/category/${item.slug}`}
                  className="glass-effect border border-white/10 rounded-lg px-4 py-2 text-gray-300 hover:border-primary/50 hover:text-primary transition-all"
                >
                  {item.name}
                </Link>
              ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
