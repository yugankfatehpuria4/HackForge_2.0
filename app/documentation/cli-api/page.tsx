import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ArrowLeft, Code } from 'lucide-react';

export const metadata = {
  title: 'API Reference - HackForge Documentation',
  description: 'REST endpoints exposed by the HackForge backend.',
};

const endpoints = [
  {
    method: 'POST',
    path: '/api/generate',
    description: 'Generate code from a prompt. Rate limited to 10 requests per 15 minutes.',
  },
  {
    method: 'GET',
    path: '/api/projects',
    description: 'List saved projects. Supports page, limit, search, sortBy and sortOrder.',
  },
  {
    method: 'POST',
    path: '/api/projects',
    description: 'Save a project. Requires title, prompt and generatedCode.',
  },
  {
    method: 'GET',
    path: '/api/projects/:id',
    description: 'Fetch a single project by id.',
  },
  {
    method: 'PUT',
    path: '/api/projects/:id',
    description: 'Update an existing project.',
  },
  {
    method: 'DELETE',
    path: '/api/projects/:id',
    description: 'Delete a project.',
  },
  {
    method: 'PATCH',
    path: '/api/projects/:id/favorite',
    description: 'Toggle the favourite flag on a project.',
  },
  {
    method: 'GET',
    path: '/health',
    description: 'Service health and configuration status.',
  },
];

const methodColor: Record<string, string> = {
  GET: 'text-green-400 border-green-400/30',
  POST: 'text-blue-400 border-blue-400/30',
  PUT: 'text-yellow-400 border-yellow-400/30',
  PATCH: 'text-purple-400 border-purple-400/30',
  DELETE: 'text-red-400 border-red-400/30',
};

export default function CliApiPage() {
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
          <Code className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-4xl font-bold neon-text">CLI &amp; API Usage</h1>
        </div>

        <p className="text-gray-300 text-lg mb-10">
          The backend is a plain Express server. Every route below is relative to{' '}
          <code className="text-primary">NEXT_PUBLIC_API_URL</code> (defaults to{' '}
          <code className="text-primary">http://localhost:5002</code>).
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Endpoints</h2>
          <div className="space-y-3">
            {endpoints.map((endpoint) => (
              <div
                key={`${endpoint.method} ${endpoint.path}`}
                className="glass-effect border border-white/10 rounded-lg p-4"
              >
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span
                    className={`text-xs font-mono font-semibold px-2 py-1 rounded border ${
                      methodColor[endpoint.method] || 'text-gray-400 border-gray-400/30'
                    }`}
                  >
                    {endpoint.method}
                  </span>
                  <code className="text-sm text-foreground font-mono">{endpoint.path}</code>
                </div>
                <p className="text-sm text-gray-400">{endpoint.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Generating code</h2>
          <div className="code-block">
            <pre className="text-sm text-gray-200 whitespace-pre-wrap">{`curl -X POST http://localhost:5002/api/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Build a todo app with React and local storage",
    "projectTitle": "Todo App",
    "saveToHistory": true,
    "userId": "demo-user"
  }'`}</pre>
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-3">Response</h3>
          <div className="code-block">
            <pre className="text-sm text-gray-200 whitespace-pre-wrap">{`{
  "success": true,
  "code": "// generated source ...",
  "prompt": "Build a todo app ...",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "projectId": "65f1c2...",
  "generationTime": 3120
}`}</pre>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Errors</h2>
          <p className="text-gray-300 mb-4">
            Failures return a consistent shape with a machine-readable{' '}
            <code className="text-primary">error</code> code.
          </p>
          <div className="code-block mb-4">
            <pre className="text-sm text-gray-200 whitespace-pre-wrap">{`{
  "success": false,
  "message": "Gemini API key is not configured.",
  "error": "GEMINI_NOT_CONFIGURED"
}`}</pre>
          </div>
          <ul className="text-gray-300 space-y-2 list-disc list-inside text-sm">
            <li><code className="text-primary">MISSING_PROMPT</code> — no prompt supplied (400)</li>
            <li><code className="text-primary">PROMPT_TOO_SHORT</code> — fewer than 10 characters (400)</li>
            <li><code className="text-primary">GEMINI_NOT_CONFIGURED</code> — missing API key (500)</li>
            <li><code className="text-primary">QUOTA_EXCEEDED</code> — Gemini quota exhausted (500)</li>
            <li><code className="text-primary">PROJECT_NOT_FOUND</code> — unknown project id (404)</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Rate limits</h2>
          <ul className="text-gray-300 space-y-2 list-disc list-inside">
            <li>Code generation: 10 requests per 15 minutes</li>
            <li>Project routes: 100 requests per 15 minutes</li>
          </ul>
          <p className="text-gray-400 text-sm mt-3">
            Exceeding a limit returns HTTP 429 with a JSON message.
          </p>
        </section>

        <Link href="/documentation/deployment" className="text-primary hover:text-accent">
          Next: Deployment Guide →
        </Link>
      </main>
      <Footer />
    </div>
  );
}
