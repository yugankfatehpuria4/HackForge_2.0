import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="text-center p-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-300 mb-6">The page you're looking for doesn't exist.</p>
        <Link
          href="/"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors inline-block"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
