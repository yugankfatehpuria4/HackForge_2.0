import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ArrowLeft, Globe } from 'lucide-react';

export const metadata = {
  title: 'Deployment Guide - HackForge Documentation',
  description: 'Deploy the HackForge frontend and backend to production.',
};

export default function DeploymentPage() {
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
          <Globe className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-4xl font-bold neon-text">Deployment Guide</h1>
        </div>

        <p className="text-gray-300 text-lg mb-10">
          The frontend and backend deploy as two separate services. The frontend
          needs to know the backend&apos;s public URL at build time.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Environment variables</h2>
          <h3 className="text-lg font-semibold mb-2">Frontend</h3>
          <div className="code-block mb-6">
            <pre className="text-sm text-gray-200 whitespace-pre-wrap">{`NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`}</pre>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            This is inlined during <code>next build</code>, so changing it requires
            a rebuild, not just a restart.
          </p>

          <h3 className="text-lg font-semibold mb-2">Backend</h3>
          <div className="code-block">
            <pre className="text-sm text-gray-200 whitespace-pre-wrap">{`NODE_ENV=production
PORT=10000
GEMINI_API_KEY=...
MONGODB_URI=...
FRONTEND_URL=https://your-frontend.onrender.com`}</pre>
          </div>
          <p className="text-gray-400 text-sm mt-3">
            <code>FRONTEND_URL</code> drives the CORS allow-list. If it does not
            match the deployed frontend origin exactly, browser requests are blocked.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Render</h2>
          <p className="text-gray-300 mb-4">
            <code className="text-primary">render.yaml</code> declares both services.
          </p>
          <div className="code-block">
            <pre className="text-sm text-gray-200 whitespace-pre-wrap">{`# frontend
build:  npm install && npm run build
start:  npm start

# backend
build:  cd backend && npm install
start:  cd backend && npm start`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Vercel</h2>
          <p className="text-gray-300 mb-4">
            Vercel hosts the frontend only — the Express backend needs a
            long-running host such as Render or Railway. Set{' '}
            <code className="text-primary">NEXT_PUBLIC_API_URL</code> in the project
            settings before the first build.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Docker</h2>
          <div className="code-block">
            <pre className="text-sm text-gray-200 whitespace-pre-wrap">{`# frontend
docker build -t hackforge-web .
docker run -p 3000:3000 hackforge-web

# backend
docker build -t hackforge-api ./backend
docker run -p 10000:10000 --env-file backend/.env hackforge-api`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Health checks</h2>
          <ul className="text-gray-300 space-y-2 list-disc list-inside">
            <li>Frontend: <code className="text-primary">/</code></li>
            <li>Backend: <code className="text-primary">/health</code></li>
          </ul>
          <p className="text-gray-400 text-sm mt-3">
            The backend health payload reports whether Gemini, MongoDB and Redis
            are actually connected — check it first when something looks broken in
            production.
          </p>
        </section>

        <Link href="/documentation/troubleshooting" className="text-primary hover:text-accent">
          Next: Troubleshooting →
        </Link>
      </main>
      <Footer />
    </div>
  );
}
