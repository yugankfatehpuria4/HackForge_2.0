import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold neon-text mb-4">⚖️ Terms & Conditions</h1>
        <p className="text-lg text-gray-300 mb-4">
          Using HackForge responsibly.
        </p>
        <p className="text-gray-400 mb-4">
          Our terms outline the proper use of HackForge’s platform, generated code, and services. By using our tools, you agree to follow ethical development practices and respect copyright, data usage, and fair use policies.
        </p>
        <ul className="text-left text-gray-300 mb-4 list-disc list-inside">
          <li>Use generated code responsibly and ethically</li>
          <li>Respect copyright and intellectual property rights</li>
          <li>No use of HackForge for malicious or illegal purposes</li>
          <li>Comply with all applicable laws and regulations</li>
          <li>Report misuse or security issues to our team</li>
        </ul>
        <p className="text-gray-400">
          <span className="font-semibold text-primary">Full terms coming soon:</span> Please check back for detailed legal information and updates.
        </p>
      </div>
    </div>
  );
} 