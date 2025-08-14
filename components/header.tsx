"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Code, Menu, X, Zap, Users, Shield, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// import { SignInButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 glass-effect border-b border-white/10"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Code className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-300" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:bg-accent/20 transition-colors duration-300"></div>
            </div>
            <span className="text-xl font-bold neon-text">HackForge</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-foreground/80 hover:text-foreground transition-colors duration-200 hover:neon-text"
            >
              Home
            </Link>
            
            {/* Documentation Dropdown */}
            <div className="relative group">
              <button 
                className="flex items-center space-x-1 text-foreground/80 hover:text-foreground transition-colors duration-200 hover:neon-text"
                onMouseEnter={() => setIsDocsOpen(true)}
                onMouseLeave={() => setIsDocsOpen(false)}
              >
                <span>Documentation</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              <AnimatePresence>
                {isDocsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-64 glass-effect border border-white/10 rounded-lg shadow-xl"
                    onMouseEnter={() => setIsDocsOpen(true)}
                    onMouseLeave={() => setIsDocsOpen(false)}
                  >
                    <div className="p-4 space-y-3">
                      <Link href="/documentation" className="block text-foreground/80 hover:text-foreground transition-colors duration-200">
                        📚 Getting Started
                      </Link>
                      <Link href="/tutorials" className="block text-foreground/80 hover:text-foreground transition-colors duration-200">
                        🎯 Tutorials
                      </Link>
                      <Link href="/templates" className="block text-foreground/80 hover:text-foreground transition-colors duration-200">
                        🎨 Templates
                      </Link>
                      <Link href="/api-reference" className="block text-foreground/80 hover:text-foreground transition-colors duration-200">
                        🔌 API Reference
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              href="/blog" 
              className="text-foreground/80 hover:text-foreground transition-colors duration-200 hover:neon-text"
            >
              Blog
            </Link>
            
            <Link 
              href="/community" 
              className="text-foreground/80 hover:text-foreground transition-colors duration-200 hover:neon-text"
            >
              Community
            </Link>

            <Link 
              href="/about" 
              className="text-foreground/80 hover:text-foreground transition-colors duration-200 hover:neon-text"
            >
              About
            </Link>

            {/* <SignedIn> */}
              <Link 
                href="/dashboard" 
                className="text-foreground/80 hover:text-foreground transition-colors duration-200 hover:neon-text"
              >
                Dashboard
              </Link>
              <Link 
                href="/generate" 
                className="text-foreground/80 hover:text-foreground transition-colors duration-200 hover:neon-text"
              >
                Generate
              </Link>
            {/* </SignedIn> */}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {/* <SignedOut> */}
            {/* Sign In button removed */}
            {/* </SignedOut> */}
            {/* <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                    userButtonPopoverCard: "glass-effect border border-white/10",
                    userButtonPopoverActionButton: "hover:bg-white/10",
                  }
                }}
              />
            </SignedIn> */}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-white/10 py-4"
            >
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/" 
                  className="text-foreground/80 hover:text-foreground transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                
                <div className="border-l-2 border-primary/30 pl-4 space-y-2">
                  <div className="text-sm font-semibold text-primary mb-2">Documentation</div>
                  <Link 
                    href="/documentation" 
                    className="block text-foreground/80 hover:text-foreground transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    📚 Getting Started
                  </Link>
                  <Link 
                    href="/tutorials" 
                    className="block text-foreground/80 hover:text-foreground transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🎯 Tutorials
                  </Link>
                  <Link 
                    href="/templates" 
                    className="block text-foreground/80 hover:text-foreground transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🎨 Templates
                  </Link>
                  <Link 
                    href="/api-reference" 
                    className="block text-foreground/80 hover:text-foreground transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🔌 API Reference
                  </Link>
                </div>

                <Link 
                  href="/blog" 
                  className="text-foreground/80 hover:text-foreground transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
                
                <Link 
                  href="/community" 
                  className="text-foreground/80 hover:text-foreground transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Community
                </Link>

                <Link 
                  href="/about" 
                  className="text-foreground/80 hover:text-foreground transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>

                {/* <SignedIn> */}
                  <Link 
                    href="/dashboard" 
                    className="text-foreground/80 hover:text-foreground transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/generate" 
                    className="text-foreground/80 hover:text-foreground transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Generate
                  </Link>
                {/* </SignedIn> */}
                
                <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                  {/* <SignedOut> */}
                  {/* Sign In button removed */}
                  {/* </SignedOut> */}
                  {/* <SignedIn>
                    <div className="flex justify-center">
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "h-8 w-8",
                            userButtonPopoverCard: "glass-effect border border-white/10",
                            userButtonPopoverActionButton: "hover:bg-white/10",
                          }
                        }}
                      />
                    </div>
                  </SignedIn> */}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}