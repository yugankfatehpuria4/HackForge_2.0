import React from 'react';

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold neon-text mb-4">🚀 Careers</h1>
        <p className="text-lg text-gray-300 mb-4">
          Build the future of app development with us.
        </p>
        <p className="text-gray-400 mb-4">
          We’re looking for engineers, designers, researchers, and storytellers who believe in the power of AI to transform software creation. Join HackForge and help shape tools used by the next generation of builders.
        </p>
        <ul className="text-left text-gray-300 mb-4 list-disc list-inside">
          <li>Remote-first, globally distributed team</li>
          <li>Opportunities for growth and learning</li>
          <li>Work on cutting-edge AI and developer tools</li>
          <li>Collaborative, inclusive, and mission-driven culture</li>
          <li>Competitive compensation and benefits</li>
        </ul>
        <p className="text-gray-400">
          <span className="font-semibold text-primary">Open roles coming soon:</span> Engineering, Product, Design, Community, and more.
        </p>
      </div>
    </div>
  );
} 