import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ArrowLeft, Rocket } from 'lucide-react';

export const metadata = {
  title: 'Getting Started - HackForge Documentation',
  description: 'Install, configure and run HackForge locally.',
};

export default function GettingStartedPage() {
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
          <Rocket className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-4xl font-bold neon-text">Getting Started</h1>
        </div>

        <p className="text-gray-300 text-lg mb-10">
          HackForge runs as two processes: a Next.js frontend and an Express
          backend that talks to a Groq (or xAI) chat-completions API.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Prerequisites</h2>
          <ul className="text-gray-300 space-y-2 list-disc list-inside">
            <li>Node.js 18 or newer</li>
            <li>A Groq API key from console.groq.com (an xAI key also works)</li>
            <li>MongoDB — optional, only needed to save projects</li>
            <li>Redis — optional, used for response caching</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Installation</h2>
          <div className="code-block">
            <pre className="text-sm text-gray-200 whitespace-pre-wrap">{`git clone https://github.com/yugankfatehpuria4/HackForge_2.0.git
cd HackForge_2.0

# frontend dependencies
npm install

# backend dependencies
cd backend && npm install && cd ..`}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Environment setup</h2>
          <p className="text-gray-300 mb-3">
            Create <code className="text-primary">.env.local</code> in the project root:
          </p>
          <div className="code-block mb-6">
            <pre className="text-sm text-gray-200 whitespace-pre-wrap">{`NEXT_PUBLIC_API_URL=http://localhost:5002`}</pre>
          </div>

          <p className="text-gray-300 mb-3">
            Create <code className="text-primary">backend/.env</code>:
          </p>
          <div className="code-block">
            <pre className="text-sm text-gray-200 whitespace-pre-wrap">{`PORT=5002
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:3000

# signs auth tokens — generate with:
#   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
JWT_SECRET=your_jwt_secret

# optional
# AI_MODEL=llama-3.3-70b-versatile
MONGODB_URI=mongodb://localhost:27017/hackforge
REDIS_HOST=localhost
REDIS_PORT=6379`}</pre>
          </div>
          <p className="text-gray-400 text-sm mt-3">
            Without <code>MONGODB_URI</code> the app still generates code — it just
            cannot create accounts or save projects to the dashboard.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Running both servers</h2>
          <div className="code-block">
            <pre className="text-sm text-gray-200 whitespace-pre-wrap">{`# terminal 1 — backend on :5002
npm run backend:dev

# terminal 2 — frontend on :3000
npm run dev`}</pre>
          </div>
          <p className="text-gray-300 mt-4">
            Open <code className="text-primary">http://localhost:3000</code>, then head to{' '}
            <Link href="/generate" className="text-primary hover:text-accent">
              Generate
            </Link>{' '}
            to create your first project.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Verifying the setup</h2>
          <p className="text-gray-300 mb-3">
            The backend exposes a health endpoint that reports which services are
            wired up:
          </p>
          <div className="code-block">
            <pre className="text-sm text-gray-200 whitespace-pre-wrap">{`curl http://localhost:5002/health`}</pre>
          </div>
          <p className="text-gray-400 text-sm mt-3">
            <code>services.ai</code> must be <code>true</code> before code
            generation will work.
          </p>
        </section>

        <div className="flex flex-wrap gap-4">
          <Link href="/documentation/cli-api" className="text-primary hover:text-accent">
            Next: CLI &amp; API Usage →
          </Link>
          <Link href="/documentation/troubleshooting" className="text-primary hover:text-accent">
            Troubleshooting →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
