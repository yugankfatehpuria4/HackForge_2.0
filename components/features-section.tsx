"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Zap, Database, Globe, Shield, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast Generation',
    description: 'Generate full-stack applications in seconds with our advanced AI models.',
    color: 'text-primary',
  },
  {
    icon: Code,
    title: 'Production Ready Code',
    description: 'Clean, documented, and following best practices - ready for deployment.',
    color: 'text-accent',
  },
  {
    icon: Database,
    title: 'Full-Stack Support',
    description: 'Frontend, backend, database schemas, and API endpoints all generated.',
    color: 'text-green-400',
  },
  {
    icon: Globe,
    title: 'Modern Frameworks',
    description: 'React, Next.js, Node.js, Python, and more with latest versions.',
    color: 'text-blue-400',
  },
  {
    icon: Shield,
    title: 'Secure by Default',
    description: 'Built-in security best practices and authentication patterns.',
    color: 'text-yellow-400',
  },
  {
    icon: Rocket,
    title: 'One-Click Deploy',
    description: 'Deploy to Vercel, Netlify, or your preferred platform instantly.',
    color: 'text-purple-400',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
            Why Choose HackForge?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built for developers who want to move fast without compromising on quality
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Card className="glass-effect border-white/10 hover:border-primary/30 transition-all duration-300 h-full">
                <CardHeader>
                  <div className={`inline-flex p-3 rounded-lg bg-background/50 w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Code Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <h3 className="text-3xl font-bold text-center mb-8 neon-text">
            From Idea to Code in Seconds
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="glass-effect rounded-xl p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                Input Prompt
              </h4>
              <div className="code-block">
                <p className="text-primary font-mono">
                  "Build a todo app with user authentication, 
                  real-time updates, and dark mode support"
                </p>
              </div>
            </div>

            <div className="glass-effect rounded-xl p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
                Generated Code
              </h4>
              <div className="code-block">
                <pre className="text-sm">
{`// components/TodoApp.tsx
import { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'

export default function TodoApp() {
  const { user } = useAuth()
  const [todos, setTodos] = useState([])
  
  // Real-time todo sync
  useEffect(() => {
    const sync = subscribeToTodos(user.id)
    return () => sync.unsubscribe()
  }, [user.id])
  
  return (
    <div className="dark:bg-gray-900">
      {/* Generated UI components */}
    </div>
  )
}`}
                </pre>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}