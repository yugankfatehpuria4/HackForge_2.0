import React from 'react';

export default function APIPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold neon-text mb-4">🧠 API</h1>
        <p className="text-lg text-gray-300 mb-4">
          Access the power of HackForge through a flexible, developer-friendly API.
        </p>
        <p className="text-gray-400 mb-4">
          Integrate our app generation engine into your own tools or workflows. Our RESTful API lets you generate code, manage deployments, and customize project outputs—all programmatically. Built for speed, scale, and innovation.
        </p>
        <ul className="text-left text-gray-300 mb-4 list-disc list-inside">
          <li>Generate full-stack codebases with a single API call</li>
          <li>Automate project creation, saving, and deployment</li>
          <li>Secure API key authentication and usage analytics</li>
          <li>AI-powered prompt parsing and code generation</li>
          <li>Comprehensive error handling and status reporting</li>
        </ul>
        <p className="text-gray-400">
          <span className="font-semibold text-primary">Coming soon:</span> Interactive API playground and SDKs for Node.js, Python, and more.
        </p>
      </div>
    </div>
  );
} 