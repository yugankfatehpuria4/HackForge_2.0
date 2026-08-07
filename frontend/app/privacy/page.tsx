import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold neon-text mb-4">🔒 Privacy Policy</h1>
        <p className="text-lg text-gray-300 mb-4">
          Your data, your rules.
        </p>
        <p className="text-gray-400 mb-4">
          We take privacy seriously. HackForge ensures that all prompts, generated content, and user data are handled securely and never shared without your consent. Review our full privacy policy to understand how your data is protected.
        </p>
        <ul className="text-left text-gray-300 mb-4 list-disc list-inside">
          <li>End-to-end encryption for sensitive data</li>
          <li>No sharing of user data with third parties</li>
          <li>Transparent data retention and deletion policies</li>
          <li>GDPR and CCPA compliant</li>
          <li>AI-generated content is private by default</li>
        </ul>
        <p className="text-gray-400">
          <span className="font-semibold text-primary">Questions?</span> Contact our support team for more information about privacy and security.
        </p>
      </div>
    </div>
  );
} 