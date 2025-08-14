"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Zap, Bot } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function HeroSection() {
  // Temporarily disabled Clerk authentication
  const isSignedIn = false;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-full">
              <Bot className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Powered by GPT-4</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 neon-text">
            Build Apps with
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              AI Power
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into production-ready code in seconds. 
            HackForge uses advanced AI to generate full-stack applications 
            with modern frameworks and best practices.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {isSignedIn ? (
              <Link href="/generate">
                <Button size="lg" className="neon-glow text-lg px-8 py-6">
                  <Zap className="h-5 w-5 mr-2" />
                  Start Generating
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <Link href="/generate">
                <Button size="lg" className="neon-glow text-lg px-8 py-6">
                  <Zap className="h-5 w-5 mr-2" />
                  Get Started Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            )}
            
            <Link href="#features">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 glass-effect border-white/20 hover:border-primary/50">
                <Code className="h-5 w-5 mr-2" />
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            <div className="glass-effect rounded-lg p-6">
              <div className="text-3xl font-bold text-primary mb-2">10k+</div>
              <div className="text-sm text-muted-foreground">Projects Generated</div>
            </div>
            <div className="glass-effect rounded-lg p-6">
              <div className="text-3xl font-bold text-accent mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Developers</div>
            </div>
            <div className="glass-effect rounded-lg p-6">
              <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="glass-effect rounded-lg p-6">
              <div className="text-3xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">AI Available</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Code Elements */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-10 glass-effect p-3 rounded-lg font-mono text-sm opacity-60"
      >
        const app = () =&gt; {'{'}
      </motion.div>

      <motion.div
        animate={{
          y: [0, 10, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-40 right-10 glass-effect p-3 rounded-lg font-mono text-sm opacity-60"
      >
        return &lt;Amazing /&gt;
      </motion.div>

      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 3, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-40 left-20 glass-effect p-3 rounded-lg font-mono text-sm opacity-60"
      >
        npm run deploy ✨
      </motion.div>
    </section>
  );
}