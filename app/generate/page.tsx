"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import { PromptForm } from '@/components/prompt-form';
import { CodeOutput } from '@/components/code-output';
import { motion } from 'framer-motion';

function GenerateContent() {
  // Temporarily disabled Clerk authentication
  const user = { id: 'temp-user', firstName: 'Demo User' };
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectId, setProjectId] = useState<string | undefined>();
  
  // Get URL parameters for template selection
  const searchParams = useSearchParams();
  const templatePrompt = searchParams.get('prompt');
  const templateId = searchParams.get('template');

  // Pre-fill form if template is selected
  useEffect(() => {
    if (templatePrompt) {
      setCurrentPrompt(templatePrompt);
    }
  }, [templatePrompt]);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 neon-text">
            AI Code Generator
          </h1>
          <p className="text-muted-foreground text-lg">
            Transform your ideas into production-ready code with AI
          </p>
          {templateId && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg"
            >
              <p className="text-sm text-primary">
                🎯 Using template: <span className="font-semibold">{templateId}</span>
              </p>
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <PromptForm
              onGenerate={(code, prompt, title, id) => {
                setGeneratedCode(code);
                setCurrentPrompt(prompt);
                setProjectTitle(title);
                setProjectId(id);
              }}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
              initialPrompt={templatePrompt || ''}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CodeOutput
              code={generatedCode}
              isGenerating={isGenerating}
              prompt={currentPrompt}
              projectTitle={projectTitle}
              projectId={projectId}
              user={user}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function Generate() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <GenerateContent />
    </Suspense>
  );
}