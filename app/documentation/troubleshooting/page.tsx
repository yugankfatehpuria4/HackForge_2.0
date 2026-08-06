import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ArrowLeft, Wrench } from 'lucide-react';

export const metadata = {
  title: 'Troubleshooting - HackForge Documentation',
  description: 'Common HackForge issues and how to resolve them.',
};

const issues = [
  {
    title: '"Backend server is not running"',
    cause:
      'The frontend could not reach the /health endpoint on the configured API URL.',
    fix: `npm run backend:dev
curl http://localhost:5002/health`,
  },
  {
    title: 'Requests go to "undefined/api/generate"',
    cause:
      'NEXT_PUBLIC_API_URL was not set at build time. The app now falls back to http://localhost:5002, but production builds still need the real value.',
    fix: `# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5002`,
  },
  {
    title: 'GROK_NOT_CONFIGURED',
    cause:
      'XAI_API_KEY is missing, or still set to the placeholder value from the example file.',
    fix: `# backend/.env
XAI_API_KEY=your_real_key

# confirm it was picked up
curl http://localhost:5002/health`,
  },
  {
    title: 'Generated projects do not appear on the dashboard',
    cause:
      'Saving requires MongoDB. Without MONGODB_URI the backend still generates code but silently skips persistence.',
    fix: `# backend/.env
MONGODB_URI=mongodb://localhost:27017/hackforge`,
  },
  {
    title: 'CORS errors in the browser console',
    cause:
      'FRONTEND_URL on the backend does not match the origin the browser is actually using.',
    fix: `# backend/.env
FRONTEND_URL=http://localhost:3000`,
  },
  {
    title: 'Generated code is cut off mid-function',
    cause:
      'The Grok response hit the output token ceiling. The backend logs a warning when finish_reason is length.',
    fix: 'Ask for a smaller scope, or split the request into several prompts.',
  },
  {
    title: 'HTTP 429 Too Many Requests',
    cause:
      'Rate limiting: 10 generations per 15 minutes, 100 project requests per 15 minutes.',
    fix: 'Wait for the window to reset, or adjust the limits in backend/routes/.',
  },
  {
    title: 'Type errors after pulling changes',
    cause:
      'Stale dependencies — @types/react must stay on v18 to match React 18.',
    fix: `rm -rf node_modules package-lock.json
npm install
npm run typecheck`,
  },
];

export default function TroubleshootingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          href="/documentation"
          className="inline-flex items-center text-primary hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Documentation
        </Link>

        <div className="flex items-center mb-6">
          <Wrench className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-4xl font-bold neon-text">Troubleshooting</h1>
        </div>

        <p className="text-gray-300 text-lg mb-10">
          Start with <code className="text-primary">/health</code> on the backend —
          it reports whether Grok, MongoDB and Redis are actually connected.
        </p>

        <div className="space-y-6">
          {issues.map((issue) => (
            <div
              key={issue.title}
              className="glass-effect border border-white/10 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-3">{issue.title}</h2>
              <p className="text-gray-300 mb-4">
                <span className="text-gray-400 font-medium">Cause: </span>
                {issue.cause}
              </p>
              <div className="code-block">
                <pre className="text-sm text-gray-200 whitespace-pre-wrap">{issue.fix}</pre>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link href="/community" className="text-primary hover:text-accent">
            Still stuck? Ask the community →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
