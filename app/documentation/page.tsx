import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BookOpen, Code, Rocket, Wrench, Search, FileText, Zap, Users, Shield, Globe } from 'lucide-react';

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl font-bold neon-text mb-6">📚 Documentation</h1>
          <p className="text-xl text-gray-300 mb-8">
            Welcome to the official <strong>HackForge Documentation</strong>. Here you&apos;ll find detailed guides, API references, and best practices to help you turn ideas into production-ready apps with AI-powered code generation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="glass-effect border border-white/10 rounded-lg px-6 py-3">
              <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
              <span className="text-sm text-gray-300">Comprehensive Guides</span>
            </div>
            <div className="glass-effect border border-white/10 rounded-lg px-6 py-3">
              <Code className="h-6 w-6 text-primary mx-auto mb-2" />
              <span className="text-sm text-gray-300">Code Examples</span>
            </div>
            <div className="glass-effect border border-white/10 rounded-lg px-6 py-3">
              <Rocket className="h-6 w-6 text-primary mx-auto mb-2" />
              <span className="text-sm text-gray-300">Quick Start</span>
            </div>
          </div>
        </div>

        {/* Main Sections Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Getting Started */}
          <div className="glass-effect border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <Rocket className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-xl font-semibold text-foreground">Getting Started</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Essential information to get you up and running with HackForge quickly.
            </p>
            <ul className="text-sm text-gray-400 space-y-2 mb-6">
              <li>• Installation & Setup</li>
              <li>• First Project Creation</li>
              <li>• Basic Configuration</li>
              <li>• Environment Setup</li>
            </ul>
            <Link 
              href="/documentation/getting-started" 
              className="inline-flex items-center text-primary hover:text-accent transition-colors duration-200 group-hover:neon-text"
            >
              Learn More →
            </Link>
          </div>

          {/* CLI & API Usage */}
          <div className="glass-effect border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <Code className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-xl font-semibold text-foreground">CLI & API Usage</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Master the command-line interface and programmatic API access.
            </p>
            <ul className="text-sm text-gray-400 space-y-2 mb-6">
              <li>• Command Reference</li>
              <li>• API Authentication</li>
              <li>• Rate Limits</li>
              <li>• Error Handling</li>
            </ul>
            <Link 
              href="/documentation/cli-api" 
              className="inline-flex items-center text-primary hover:text-accent transition-colors duration-200 group-hover:neon-text"
            >
              Learn More →
            </Link>
          </div>

          {/* Code Templates */}
          <div className="glass-effect border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <FileText className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-xl font-semibold text-foreground">Code Templates</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Pre-built templates and patterns for common development scenarios.
            </p>
            <ul className="text-sm text-gray-400 space-y-2 mb-6">
              <li>• Template Library</li>
              <li>• Custom Templates</li>
              <li>• Template Variables</li>
              <li>• Best Practices</li>
            </ul>
            <Link 
              href="/templates" 
              className="inline-flex items-center text-primary hover:text-accent transition-colors duration-200 group-hover:neon-text"
            >
              Browse Templates →
            </Link>
          </div>

          {/* Deployment Guide */}
          <div className="glass-effect border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <Globe className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-xl font-semibold text-foreground">Deployment Guide</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Deploy your HackForge-generated applications to production environments.
            </p>
            <ul className="text-sm text-gray-400 space-y-2 mb-6">
              <li>• Platform Deployment</li>
              <li>• Environment Variables</li>
              <li>• CI/CD Integration</li>
              <li>• Monitoring & Logs</li>
            </ul>
            <Link 
              href="/documentation/deployment" 
              className="inline-flex items-center text-primary hover:text-accent transition-colors duration-200 group-hover:neon-text"
            >
              Learn More →
            </Link>
          </div>

          {/* Troubleshooting */}
          <div className="glass-effect border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <Wrench className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-xl font-semibold text-foreground">Troubleshooting</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Common issues and their solutions to keep you productive.
            </p>
            <ul className="text-sm text-gray-400 space-y-2 mb-6">
              <li>• Common Errors</li>
              <li>• Debug Techniques</li>
              <li>• Performance Issues</li>
              <li>• Support Resources</li>
            </ul>
            <Link 
              href="/documentation/troubleshooting" 
              className="inline-flex items-center text-primary hover:text-accent transition-colors duration-200 group-hover:neon-text"
            >
              Learn More →
            </Link>
          </div>

          {/* Search & Navigation */}
          <div className="glass-effect border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <Search className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-xl font-semibold text-foreground">Search & Navigation</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Find what you need quickly with our intelligent search and navigation.
            </p>
            <ul className="text-sm text-gray-400 space-y-2 mb-6">
              <li>• Full-Text Search</li>
              <li>• Category Filtering</li>
              <li>• Related Articles</li>
              <li>• Search History</li>
            </ul>
            <div className="text-primary text-sm">
              Search functionality coming soon
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Quick Navigation</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/tutorials" 
              className="glass-effect border border-white/10 rounded-lg px-6 py-3 hover:border-primary/50 transition-all duration-300 hover:neon-text"
            >
              🎯 Tutorials
            </Link>
            <Link 
              href="/templates" 
              className="glass-effect border border-white/10 rounded-lg px-6 py-3 hover:border-primary/50 transition-all duration-300 hover:neon-text"
            >
              🎨 Templates
            </Link>
            <Link 
              href="/documentation/cli-api" 
              className="glass-effect border border-white/10 rounded-lg px-6 py-3 hover:border-primary/50 transition-all duration-300 hover:neon-text"
            >
              🔌 API Reference
            </Link>
            <Link 
              href="/community" 
              className="glass-effect border border-white/10 rounded-lg px-6 py-3 hover:border-primary/50 transition-all duration-300 hover:neon-text"
            >
              👥 Community
            </Link>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-16 text-center">
          <div className="glass-effect border border-primary/30 rounded-xl p-8 max-w-2xl mx-auto">
            <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Interactive Documentation Coming Soon</h3>
            <p className="text-gray-300 mb-4">
              We&apos;re working on interactive documentation with code sandboxes, video walkthroughs, and AI-powered search to make learning even more effective.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-400">
              <span className="px-3 py-1 bg-primary/10 rounded-full">Code Sandboxes</span>
              <span className="px-3 py-1 bg-primary/10 rounded-full">Video Tutorials</span>
              <span className="px-3 py-1 bg-primary/10 rounded-full">AI Search</span>
              <span className="px-3 py-1 bg-primary/10 rounded-full">Interactive Examples</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 