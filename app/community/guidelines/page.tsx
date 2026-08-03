import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata = {
  title: 'Community Guidelines - HackForge',
  description: 'How we expect members of the HackForge community to treat each other.',
};

const guidelines = [
  {
    title: 'Be respectful',
    detail:
      'Disagree with ideas, not people. Assume the person you are replying to is acting in good faith and is at a different point on the same learning curve you were once on.',
  },
  {
    title: 'Ask answerable questions',
    detail:
      'Include what you tried, what you expected, and what actually happened. Paste the error text rather than describing it, and mention your Node version and whether the backend is running.',
  },
  {
    title: 'Share code, not screenshots of code',
    detail:
      'Text can be searched, copied and corrected. Use fenced code blocks and trim the example down to the part that reproduces the problem.',
  },
  {
    title: 'Never post secrets',
    detail:
      'API keys, database URIs and tokens do not belong in issues, discussions or screenshots. If you paste one by accident, rotate it immediately — deleting the message is not enough.',
  },
  {
    title: 'Credit your sources',
    detail:
      'If you share generated code that you adapted from someone else, say so. The same applies to tutorials, templates and snippets.',
  },
  {
    title: 'Keep self-promotion relevant',
    detail:
      'Showing a project you built is welcome. Repeatedly posting the same link is not. If in doubt, share what you learned alongside the link.',
  },
];

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <Link
          href="/community"
          className="inline-flex items-center text-primary hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Community
        </Link>

        <div className="flex items-center mb-6">
          <Shield className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-4xl font-bold neon-text">Community Guidelines</h1>
        </div>

        <p className="text-lg text-gray-300 mb-10">
          These guidelines exist so that asking a beginner question stays as
          comfortable as answering an advanced one.
        </p>

        <div className="space-y-6">
          {guidelines.map((item) => (
            <div
              key={item.title}
              className="glass-effect border border-white/10 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold text-foreground mb-3">{item.title}</h2>
              <p className="text-gray-300">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 glass-effect border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-3">Reporting a problem</h2>
          <p className="text-gray-300">
            If you see behaviour that breaks these guidelines, report it to the
            moderators rather than replying in the thread. Reports are handled
            privately.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
