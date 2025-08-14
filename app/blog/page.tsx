import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Calendar, Clock, User, ArrowRight, TrendingUp, Code, Zap, Users, BookOpen, Star, Tag } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl font-bold neon-text mb-6">📝 Blog</h1>
          <p className="text-xl text-gray-300 mb-8">
            Stay updated with product news, dev tips, and AI innovation stories from the HackForge team and community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="glass-effect border border-white/10 rounded-lg px-6 py-3">
              <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
              <span className="text-sm text-gray-300">Latest Updates</span>
            </div>
            <div className="glass-effect border border-white/10 rounded-lg px-6 py-3">
              <Code className="h-6 w-6 text-primary mx-auto mb-2" />
              <span className="text-sm text-gray-300">Dev Tips</span>
            </div>
            <div className="glass-effect border border-white/10 rounded-lg px-6 py-3">
              <Zap className="h-6 w-6 text-primary mx-auto mb-2" />
              <span className="text-sm text-gray-300">AI Innovation</span>
            </div>
          </div>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <div className="glass-effect border border-white/10 rounded-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                    Featured
                  </span>
                  <span className="px-3 py-1 bg-green-400/20 text-green-400 rounded-full text-sm">
                    New
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  How HackForge Generates Clean, Maintainable Code
                </h2>
                <p className="text-gray-300 mb-6 text-lg">
                  Discover the engineering principles and AI techniques that enable HackForge to generate production-ready code that follows best practices and industry standards.
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Dec 15, 2024
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    8 min read
                  </span>
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Sarah Chen
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">AI Engineering</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">Code Quality</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">Best Practices</span>
                </div>
                <Link 
                  href="/blog/how-hackforge-generates-clean-code" 
                  className="inline-flex items-center bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg transition-colors duration-200 hover:neon-text"
                >
                  Read Full Article
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
              <div className="md:w-1/2 bg-gradient-to-br from-primary/20 to-accent/20 p-8 flex items-center justify-center">
                <div className="text-center">
                  <Code className="h-24 w-24 text-primary mx-auto mb-4" />
                  <p className="text-primary font-medium">Featured Article</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Posts Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Post 1 */}
            <article className="glass-effect border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 group">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-400/20 text-blue-400 rounded-full text-xs">
                    Trending
                  </span>
                  <span className="px-2 py-1 bg-green-400/20 text-green-400 rounded-full text-xs">
                    New
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                  Top 5 AI-Powered Development Trends in 2025
                </h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Explore the most impactful AI development trends that will shape the future of software engineering and how HackForge is positioned to help developers stay ahead.
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Dec 12, 2024
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    6 min read
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">AI Trends</span>
                  <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">2025</span>
                </div>
                <Link 
                  href="/blog/ai-development-trends-2025" 
                  className="inline-flex items-center text-primary hover:text-accent transition-colors duration-200 group-hover:neon-text"
                >
                  Read More →
                </Link>
              </div>
            </article>

            {/* Post 2 */}
            <article className="glass-effect border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 group">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 bg-purple-400/20 text-purple-400 rounded-full text-xs">
                    Behind the Scenes
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                  Behind the Scenes: Our Road to Launch
                </h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Take a deep dive into the development journey of HackForge, from initial concept to public launch, including the challenges, breakthroughs, and lessons learned.
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Dec 10, 2024
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    12 min read
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">Company</span>
                  <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">Launch</span>
                </div>
                <Link 
                  href="/blog/road-to-launch" 
                  className="inline-flex items-center text-primary hover:text-accent transition-colors duration-200 group-hover:neon-text"
                >
                  Read More →
                </Link>
              </div>
            </article>

            {/* Post 3 */}
            <article className="glass-effect border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 group">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 bg-orange-400/20 text-orange-400 rounded-full text-xs">
                    Tutorial
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                  Building a Real-Time Chat App with HackForge
                </h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Step-by-step guide to creating a modern real-time chat application using HackForge's AI-powered code generation and WebSocket integration.
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Dec 8, 2024
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    15 min read
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">Tutorial</span>
                  <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">Real-time</span>
                </div>
                <Link 
                  href="/blog/real-time-chat-app-tutorial" 
                  className="inline-flex items-center text-primary hover:text-accent transition-colors duration-200 group-hover:neon-text"
                >
                  Read More →
                </Link>
              </div>
            </article>

            {/* Post 4 */}
            <article className="glass-effect border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 group">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 bg-green-400/20 text-green-400 rounded-full text-xs">
                    Case Study
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                  How We Built a SaaS Platform in 48 Hours
                </h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Real-world case study of building a complete SaaS platform using HackForge, including the development process, challenges, and results.
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Dec 5, 2024
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    10 min read
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">Case Study</span>
                  <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">SaaS</span>
                </div>
                <Link 
                  href="/blog/saas-platform-48-hours" 
                  className="inline-flex items-center text-primary hover:text-accent transition-colors duration-200 group-hover:neon-text"
                >
                  Read More →
                </Link>
              </div>
            </article>

            {/* Post 5 */}
            <article className="glass-effect border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 group">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-400/20 text-blue-400 rounded-full text-xs">
                    Technical
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                  Optimizing AI-Generated Code for Performance
                </h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Learn advanced techniques for optimizing AI-generated code, including performance profiling, memory management, and best practices for production deployment.
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Dec 3, 2024
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    18 min read
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">Performance</span>
                  <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">Optimization</span>
                </div>
                <Link 
                  href="/blog/optimizing-ai-generated-code" 
                  className="inline-flex items-center text-primary hover:text-accent transition-colors duration-200 group-hover:neon-text"
                >
                  Read More →
                </Link>
              </div>
            </article>

            {/* Post 6 */}
            <article className="glass-effect border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 group">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-xs">
                    Community
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                  Community Spotlight: Amazing Projects Built with HackForge
                </h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Discover incredible projects built by the HackForge community, from innovative web apps to game-changing tools that demonstrate the platform's versatility.
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Dec 1, 2024
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    7 min read
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">Community</span>
                  <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">Showcase</span>
                </div>
                <Link 
                  href="/blog/community-spotlight" 
                  className="inline-flex items-center text-primary hover:text-accent transition-colors duration-200 group-hover:neon-text"
                >
                  Read More →
                </Link>
              </div>
            </article>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link 
              href="/blog/category/tutorials" 
              className="glass-effect border border-white/10 rounded-xl p-6 text-center hover:border-primary/50 transition-all duration-300 group"
            >
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Tutorials</h3>
              <p className="text-gray-400 text-sm">Step-by-step guides and how-tos</p>
            </Link>

            <Link 
              href="/blog/category/technical" 
              className="glass-effect border border-white/10 rounded-xl p-6 text-center hover:border-primary/50 transition-all duration-300 group"
            >
              <Code className="h-12 w-12 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Technical</h3>
              <p className="text-gray-400 text-sm">Deep technical insights and analysis</p>
            </Link>

            <Link 
              href="/blog/category/company" 
              className="glass-effect border border-white/10 rounded-xl p-6 text-center hover:border-primary/50 transition-all duration-300 group"
            >
              <Users className="h-12 w-12 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Company</h3>
              <p className="text-gray-400 text-sm">Updates and behind-the-scenes stories</p>
            </Link>

            <Link 
              href="/blog/category/community" 
              className="glass-effect border border-white/10 rounded-xl p-6 text-center hover:border-primary/50 transition-all duration-300 group"
            >
              <Star className="h-12 w-12 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Community</h3>
              <p className="text-gray-400 text-sm">User stories and community highlights</p>
            </Link>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="text-center">
          <div className="glass-effect border border-primary/30 rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-6">
              Get the latest articles, tutorials, and updates delivered to your inbox. No spam, just valuable content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-foreground placeholder-gray-400 focus:outline-none focus:border-primary/50 transition-colors duration-200"
              />
              <button className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg transition-colors duration-200 hover:neon-text">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              By subscribing, you agree to our privacy policy and terms of service.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 