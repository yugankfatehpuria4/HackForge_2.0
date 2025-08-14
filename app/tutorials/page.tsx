import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Play, Clock, TrendingUp, Rocket, Code, Zap, Users, BookOpen, Star, ArrowRight } from 'lucide-react';

export default function TutorialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl font-bold neon-text mb-6">🎯 Tutorials</h1>
          <p className="text-xl text-gray-300 mb-8">
            Step-by-step learning paths to master HackForge. Follow along with interactive examples to build your first app in minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="glass-effect border border-white/10 rounded-lg px-6 py-3">
              <Play className="h-6 w-6 text-primary mx-auto mb-2" />
              <span className="text-sm text-gray-300">Interactive Learning</span>
            </div>
            <div className="glass-effect border border-white/10 rounded-lg px-6 py-3">
              <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
              <span className="text-sm text-gray-300">Step-by-Step</span>
            </div>
            <div className="glass-effect border border-white/10 rounded-lg px-6 py-3">
              <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
              <span className="text-sm text-gray-300">Progressive Skills</span>
            </div>
          </div>
        </div>

        {/* Tutorial Categories */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Beginner Tutorials */}
          <div className="lg:col-span-2">
            <div className="glass-effect border border-white/10 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <Rocket className="h-10 w-10 text-green-400 mr-4" />
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Beginner</h2>
                  <p className="text-gray-400">Perfect for developers new to AI-powered development</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="border-l-4 border-green-400 pl-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    From Idea to App in 10 Minutes
                  </h3>
                  <p className="text-gray-300 mb-3">
                    Learn the fundamentals of HackForge by building a simple todo application from scratch. This tutorial covers the basics of prompt engineering, project structure, and deployment.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      10 minutes
                    </span>
                    <span className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Beginner
                    </span>
                    <span className="px-2 py-1 bg-green-400/20 text-green-400 rounded-full text-xs">
                      Free
                    </span>
                  </div>
                  <Link 
                    href="/tutorials/beginner/idea-to-app" 
                    className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors duration-200 group"
                  >
                    Start Learning
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>

                <div className="border-l-4 border-green-400 pl-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Your First AI-Generated Component
                  </h3>
                  <p className="text-gray-300 mb-3">
                    Understand how to create reusable UI components using natural language descriptions. Learn best practices for component generation and customization.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      15 minutes
                    </span>
                    <span className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Beginner
                    </span>
                    <span className="px-2 py-1 bg-green-400/20 text-green-400 rounded-full text-xs">
                      Free
                    </span>
                  </div>
                  <Link 
                    href="/tutorials/beginner/first-component" 
                    className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors duration-200 group"
                  >
                    Start Learning
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="glass-effect border border-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-300">Tutorials Available</div>
            </div>
            
            <div className="glass-effect border border-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">10k+</div>
              <div className="text-gray-300">Developers Trained</div>
            </div>
            
            <div className="glass-effect border border-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">4.9★</div>
              <div className="text-gray-300">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Intermediate Tutorials */}
        <div className="mb-16">
          <div className="glass-effect border border-white/10 rounded-xl p-8">
            <div className="flex items-center mb-6">
              <Code className="h-10 w-10 text-blue-400 mr-4" />
              <div>
                <h2 className="text-2xl font-bold text-foreground">Intermediate</h2>
                <p className="text-gray-400">Build complex applications and master advanced features</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-blue-400 pl-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Custom Templates for Faster Development
                </h3>
                <p className="text-gray-300 mb-3">
                  Create your own code templates to speed up development workflows. Learn template syntax, variables, and how to share templates with your team.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    25 minutes
                  </span>
                  <span className="flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Intermediate
                  </span>
                  <span className="px-2 py-1 bg-blue-400/20 text-blue-400 rounded-full text-xs">
                    Pro
                  </span>
                </div>
                <Link 
                  href="/tutorials/intermediate/custom-templates" 
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 group"
                >
                  Start Learning
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>

              <div className="border-l-4 border-blue-400 pl-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Building Full-Stack Applications
                </h3>
                <p className="text-gray-300 mb-3">
                  Learn to generate complete applications with frontend, backend, and database integration. Master the art of full-stack development with AI assistance.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    45 minutes
                  </span>
                  <span className="flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Intermediate
                  </span>
                  <span className="px-2 py-1 bg-blue-400/20 text-blue-400 rounded-full text-xs">
                    Pro
                  </span>
                </div>
                <Link 
                  href="/tutorials/intermediate/full-stack-apps" 
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 group"
                >
                  Start Learning
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Tutorials */}
        <div className="mb-16">
          <div className="glass-effect border border-white/10 rounded-xl p-8">
            <div className="flex items-center mb-6">
              <Zap className="h-10 w-10 text-purple-400 mr-4" />
              <div>
                <h2 className="text-2xl font-bold text-foreground">Advanced</h2>
                <p className="text-gray-400">Master enterprise features and CI/CD integration</p>
              </div>
            </div>
            
            <div className="border-l-4 border-purple-400 pl-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Integrating HackForge into Your CI/CD Pipeline
              </h3>
              <p className="text-gray-300 mb-3">
                Automate your development workflow by integrating HackForge into CI/CD pipelines. Learn to generate code automatically on pull requests, deploy previews, and maintain code quality.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  60 minutes
                </span>
                <span className="flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  Advanced
                </span>
                <span className="px-2 py-1 bg-purple-400/20 text-purple-400 rounded-full text-xs">
                  Enterprise
                </span>
              </div>
              <Link 
                href="/tutorials/advanced/ci-cd-integration" 
                className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-200 group"
              >
                Start Learning
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>

        {/* Learning Paths */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Learning Paths</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-effect border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
              <div className="text-center mb-4">
                <BookOpen className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-foreground">Frontend Developer</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Master React, Next.js, and modern UI development with AI assistance.
              </p>
              <div className="text-xs text-gray-400 mb-4">
                <div className="flex justify-between mb-1">
                  <span>Progress</span>
                  <span>0/8</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              <Link 
                href="/tutorials/paths/frontend" 
                className="block text-center text-primary hover:text-accent transition-colors duration-200"
              >
                View Path →
              </Link>
            </div>

            <div className="glass-effect border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
              <div className="text-center mb-4">
                <Code className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-foreground">Backend Developer</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Build robust APIs and server-side applications with Node.js and databases.
              </p>
              <div className="text-xs text-gray-400 mb-4">
                <div className="flex justify-between mb-1">
                  <span>Progress</span>
                  <span>0/6</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              <Link 
                href="/tutorials/paths/backend" 
                className="block text-center text-primary hover:text-accent transition-colors duration-200"
              >
                View Path →
              </Link>
            </div>

            <div className="glass-effect border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
              <div className="text-center mb-4">
                <Users className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-foreground">Full-Stack Developer</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Complete end-to-end development from database to user interface.
              </p>
              <div className="text-xs text-gray-400 mb-4">
                <div className="flex justify-between mb-1">
                  <span>Progress</span>
                  <span>0/12</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              <Link 
                href="/tutorials/paths/fullstack" 
                className="block text-center text-primary hover:text-accent transition-colors duration-200"
              >
                View Path →
              </Link>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="glass-effect border border-primary/30 rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Start Learning?</h3>
            <p className="text-gray-300 mb-6">
              Join thousands of developers who are already building amazing applications with HackForge.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/tutorials/beginner/idea-to-app" 
                className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg transition-colors duration-200 hover:neon-text"
              >
                Start with Beginner Tutorial
              </Link>
              <Link 
                href="/documentation" 
                className="border border-white/20 hover:border-primary/50 text-foreground px-6 py-3 rounded-lg transition-all duration-200 hover:neon-text"
              >
                Browse Documentation
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 