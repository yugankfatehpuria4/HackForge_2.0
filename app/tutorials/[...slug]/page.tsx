import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ArrowLeft, BookOpen, Clock, Signal } from 'lucide-react';
import {
  tutorials,
  learningPaths,
  getTutorialBySlug,
  getPathBySlug,
} from '@/lib/content';

export function generateStaticParams() {
  return [...tutorials, ...learningPaths].map((entry) => ({
    slug: entry.slug.split('/'),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const key = slug.join('/');
  const entry = getTutorialBySlug(key) || getPathBySlug(key);

  if (!entry) return { title: 'Tutorial not found - HackForge' };

  return { title: `${entry.title} - HackForge Tutorials`, description: entry.description };
}

export default async function TutorialPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const key = slug.join('/');
  const tutorial = getTutorialBySlug(key);
  const path = getPathBySlug(key);

  if (!tutorial && !path) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <Link
          href="/tutorials"
          className="inline-flex items-center text-primary hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tutorials
        </Link>

        {tutorial && (
          <>
            <h1 className="text-4xl font-bold neon-text mb-4">{tutorial.title}</h1>
            <p className="text-lg text-gray-300 mb-6">{tutorial.description}</p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-10 pb-6 border-b border-white/10">
              <span className="flex items-center">
                <Signal className="h-4 w-4 mr-2" />
                {tutorial.level}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {tutorial.duration}
              </span>
            </div>

            <ol className="space-y-6">
              {tutorial.steps.map((step, index) => (
                <li
                  key={step.heading}
                  className="glass-effect border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold">
                      {index + 1}
                    </span>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground mb-2">
                        {step.heading}
                      </h2>
                      <p className="text-gray-300">{step.detail}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 glass-effect border border-primary/30 rounded-xl p-6 text-center">
              <p className="text-gray-300 mb-4">Ready to try it yourself?</p>
              <Link
                href="/generate"
                className="inline-flex items-center bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Open the Generator →
              </Link>
            </div>
          </>
        )}

        {path && (
          <>
            <div className="flex items-center mb-4">
              <BookOpen className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-4xl font-bold neon-text">{path.title}</h1>
            </div>
            <p className="text-lg text-gray-300 mb-10">{path.description}</p>

            <h2 className="text-2xl font-semibold mb-6">What this path covers</h2>
            <ul className="space-y-4">
              {path.modules.map((module, index) => (
                <li
                  key={module}
                  className="glass-effect border border-white/10 rounded-lg p-5 flex items-start gap-4"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-gray-300 pt-1">{module}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-4">Start here</h2>
              <Link
                href="/tutorials/beginner/idea-to-app"
                className="text-primary hover:text-accent"
              >
                From Idea to App in 10 Minutes →
              </Link>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
