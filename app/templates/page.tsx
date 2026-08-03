"use client";

import React from 'react';
import { PromptTemplates } from '@/components/prompt-templates';
import { Header } from '@/components/header';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function TemplatesPage() {
  const router = useRouter();

  const handleTemplateSelect = (template: any) => {
    // Client-side navigation; window.location.href forced a full page reload.
    router.push(
      `/generate?template=${encodeURIComponent(template.id)}&prompt=${encodeURIComponent(template.prompt)}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold neon-text mb-4">🔧 AI Prompt Templates</h1>
          <p className="text-lg text-gray-300 mb-4">
            Jumpstart your app development with pre-built, customizable templates.
          </p>
          <p className="text-gray-400 max-w-3xl mx-auto">
            HackForge offers a growing library of professionally designed app templates—from SaaS dashboards and ecommerce stores to portfolios and admin panels. Each template is optimized for performance, accessibility, and modern UI/UX trends. Just select a template and customize it with your prompt.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <PromptTemplates onTemplateSelectAction={handleTemplateSelect} />
        </motion.div>
      </div>
    </div>
  );
} 