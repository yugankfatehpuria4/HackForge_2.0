"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Wand2, Loader2, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { API_URL, apiUrl } from '@/lib/api';
import { authFetch } from '@/lib/auth-client';

interface PromptFormProps {
  onGenerate: (code: string, prompt: string, projectTitle: string, projectId?: string) => void;
  isGenerating: boolean;
  setIsGenerating: (loading: boolean) => void;
  initialPrompt?: string;
}

const techStacks = [
  { value: 'nextjs', label: 'Next.js + TypeScript' },
  { value: 'react', label: 'React + Node.js' },
  { value: 'vue', label: 'Vue.js + Express' },
  { value: 'python', label: 'Python + FastAPI' },
  { value: 'fullstack', label: 'Full-Stack (Auto)' },
];

const promptSuggestions = [
  "Build a modern e-commerce store with cart functionality",
  "Create a social media dashboard with real-time notifications",
  "Develop a project management tool with team collaboration",
  "Build a fitness tracking app with workout plans",
  "Create a weather app with location-based forecasts",
];

export function PromptForm({ onGenerate, isGenerating, setIsGenerating, initialPrompt = '' }: PromptFormProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [projectTitle, setProjectTitle] = useState('');
  const [techStack, setTechStack] = useState('fullstack');

  // Update prompt when initialPrompt changes
  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a project description');
      return;
    }

    if (prompt.trim().length < 10) {
      toast.error('Please provide a more detailed description (at least 10 characters)');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Check if backend is reachable.
      // fetch only rejects on a transport failure — backend down, DNS, or a
      // CORS rejection. The raw "Failed to fetch" that surfaced here told the
      // user nothing about which of those it was.
      try {
        const healthCheck = await fetch(apiUrl('/health'));
        if (!healthCheck.ok) {
          throw new Error('Backend server is not running. Please start the backend server.');
        }
      } catch (reachError) {
        if (reachError instanceof TypeError) {
          throw new Error('UNREACHABLE_BACKEND');
        }
        throw reachError;
      }

      // authFetch attaches the bearer token, which is what lets the backend
      // auto-save the result to a signed-in user's history. A plain fetch here
      // meant generations were never saved, even when signed in. userId is no
      // longer sent — the server takes identity from the token.
      const response = await authFetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({
          prompt: `${prompt}\n\nTech Stack: ${techStack}`,
          projectTitle: projectTitle || `Generated from: ${prompt.substring(0, 50)}...`,
          saveToHistory: true,
        }),
      });

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', errorData);
        
        // The backend always sends an actionable `message`; prefer it over a
        // status-code-shaped string the user can do nothing with.
        throw new Error(
          errorData.message ||
            (response.status === 400
              ? 'Invalid request. Please check your input.'
              : `Request failed (HTTP ${response.status}).`)
        );
      }

      const data = await response.json();
      console.log('✅ Code generation successful');
      
      if (!data.success && !data.code) {
        throw new Error(data.message || 'No code was generated');
      }
      
      const finalProjectTitle = projectTitle || `Generated from: ${prompt.substring(0, 50)}...`;
      onGenerate(data.code, prompt, finalProjectTitle, data.projectId);
      toast.success('Code generated and saved successfully!');
      
    } catch (error) {
      console.error('❌ Code generation error:', error);
      
      let errorMessage = 'Failed to generate code. Please try again.';
      
      if (error instanceof Error) {
        if (error.message === 'UNREACHABLE_BACKEND') {
          errorMessage =
            `Cannot reach the backend at ${API_URL}. Check it is running, that ` +
            `NEXT_PUBLIC_API_URL points at it, and that FRONTEND_URL on the backend ` +
            `matches the address in your browser's URL bar (CORS).`;
        } else if (error.message.includes('Backend server is not running')) {
          errorMessage = 'Backend server is not running. Please start it with: npm run backend:dev';
        } else if (error.message.includes('API key')) {
          errorMessage = 'Grok API key is not configured. Please add XAI_API_KEY to backend/.env';
        } else if (error.message.includes('quota')) {
          errorMessage = 'Grok rate limit reached. Please check your usage at https://console.x.ai';
        } else if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
          errorMessage = `Cannot connect to the backend at ${API_URL}. Make sure it is running.`;
        } else {
          errorMessage = error.message;
        }
      } else {
        errorMessage = 'An unexpected error occurred. Please try again.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="glass-effect border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          Project Generator
        </CardTitle>
        <CardDescription>
          Describe your app idea and let AI create the code structure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Title (Optional)</label>
            <Input
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Enter a custom title for your project..."
              className="glass-effect border-white/20 focus:border-primary/50"
              disabled={isGenerating}
            />
            <p className="text-xs text-gray-400">
              Leave empty to auto-generate from your description
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Project Description</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your app idea in detail..."
              className="min-h-[120px] glass-effect border-white/20 focus:border-primary/50 resize-none"
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tech Stack</label>
            <Select value={techStack} onValueChange={setTechStack} disabled={isGenerating}>
              <SelectTrigger className="glass-effect border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {techStacks.map((stack) => (
                  <SelectItem key={stack.value} value={stack.value}>
                    {stack.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="w-full neon-glow"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate & Save Code
              </>
            )}
          </Button>
        </form>

        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium">Quick Ideas</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {promptSuggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-colors"
                  onClick={() => setPrompt(suggestion)}
                >
                  {suggestion}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}