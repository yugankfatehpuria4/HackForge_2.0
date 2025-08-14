import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold neon-text mb-4">🏢 About</h1>
        <p className="text-lg text-gray-300 mb-4">
          Redefining full-stack development with AI-first tools.
        </p>
        <p className="text-gray-400 mb-4">
          HackForge was created to empower anyone—from developers to founders—to turn ideas into production-grade apps effortlessly. We're a team of builders passionate about pushing the boundaries of code generation and human-computer collaboration.
        </p>
        <ul className="text-left text-gray-300 mb-4 list-disc list-inside">
          <li>Mission: Make software creation accessible, fast, and fun</li>
          <li>Vision: AI as a creative partner for every builder</li>
          <li>Values: Innovation, transparency, and community-driven growth</li>
          <li>Backed by cutting-edge AI and a global team of experts</li>
        </ul>
        <p className="text-gray-400">
          <span className="font-semibold text-primary">Want to learn more?</span> Connect with us on social or check out our blog for the latest updates.
        </p>
      </div>
    </div>
  );
} 