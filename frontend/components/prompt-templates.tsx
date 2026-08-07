"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  CheckCircle, 
  Clock, 
  Star,
  Zap,
  Palette,
  Smartphone,
  Globe,
  Database,
  Shield,
  TrendingUp,
  Users,
  ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: 'web' | 'mobile' | 'api' | 'ai' | 'game' | 'tool';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  tags: string[];
  icon: React.ReactNode;
}

const promptTemplates: PromptTemplate[] = [
  {
    id: 'todo-app',
    title: 'Build To-Do App',
    description: 'A modern, responsive to-do application with task management',
    prompt: 'Create a modern to-do application with React/Next.js that includes: task creation, editing, deletion, completion tracking, categories, due dates, and a clean responsive UI. Include state management, local storage, and smooth animations.',
    category: 'web',
    difficulty: 'beginner',
    estimatedTime: '2-3 hours',
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    icon: <CheckCircle className="h-5 w-5" />
  },
  {
    id: 'portfolio-site',
    title: 'Create Portfolio Site',
    description: 'A professional portfolio website to showcase your work',
    prompt: 'Design a stunning portfolio website with: hero section, about me, skills showcase, project gallery, contact form, and smooth scrolling. Use modern design principles, animations, and ensure it\'s fully responsive and SEO optimized.',
    category: 'web',
    difficulty: 'intermediate',
    estimatedTime: '4-6 hours',
    tags: ['HTML', 'CSS', 'JavaScript', 'Animations'],
    icon: <Palette className="h-5 w-5" />
  },
  {
    id: 'mobile-app',
    title: 'Mobile App Template',
    description: 'A cross-platform mobile application structure',
    prompt: 'Create a React Native mobile app template with: navigation setup, authentication screens, home dashboard, settings, and profile management. Include proper folder structure, state management, and navigation patterns.',
    category: 'mobile',
    difficulty: 'intermediate',
    estimatedTime: '6-8 hours',
    tags: ['React Native', 'Navigation', 'State Management'],
    icon: <Smartphone className="h-5 w-5" />
  },
  {
    id: 'api-service',
    title: 'REST API Service',
    description: 'A complete backend API with authentication and CRUD operations',
    prompt: 'Build a RESTful API service with: user authentication, JWT tokens, CRUD operations, data validation, error handling, rate limiting, and comprehensive documentation. Include testing setup and deployment configuration.',
    category: 'api',
    difficulty: 'intermediate',
    estimatedTime: '5-7 hours',
    tags: ['Node.js', 'Express', 'MongoDB', 'JWT'],
    icon: <Database className="h-5 w-5" />
  },
  {
    id: 'ai-chatbot',
    title: 'AI Chatbot Interface',
    description: 'An intelligent chatbot with modern UI and AI integration',
    prompt: 'Create an AI chatbot interface with: real-time messaging, user authentication, conversation history, AI response handling, typing indicators, and a modern chat UI. Include error handling and response streaming.',
    category: 'ai',
    difficulty: 'advanced',
    estimatedTime: '8-10 hours',
    tags: ['AI Integration', 'WebSocket', 'React', 'Node.js'],
    icon: <Sparkles className="h-5 w-5" />
  },
  {
    id: 'game-engine',
    title: 'Simple Game Engine',
    description: 'A basic 2D game engine with sprite management',
    prompt: 'Develop a 2D game engine with: sprite rendering, collision detection, input handling, game loop, scene management, and basic physics. Include examples of creating simple games like a platformer or shooter.',
    category: 'game',
    difficulty: 'advanced',
    estimatedTime: '10-12 hours',
    tags: ['Canvas', 'Game Development', 'Physics', 'JavaScript'],
    icon: <Zap className="h-5 w-5" />
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Platform',
    description: 'A full-featured online shopping experience',
    prompt: 'Build an e-commerce platform with: product catalog, shopping cart, user authentication, payment integration, order management, admin dashboard, and responsive design. Include search, filtering, and recommendation features.',
    category: 'web',
    difficulty: 'advanced',
    estimatedTime: '12-15 hours',
    tags: ['Full Stack', 'E-commerce', 'Payment', 'Admin'],
    icon: <ShoppingCart className="h-5 w-5" />
  },
  {
    id: 'dashboard',
    title: 'Analytics Dashboard',
    description: 'A comprehensive data visualization dashboard',
    prompt: 'Create an analytics dashboard with: data visualization charts, real-time updates, filtering options, export functionality, responsive design, and dark/light theme toggle. Include various chart types and data tables.',
    category: 'tool',
    difficulty: 'intermediate',
    estimatedTime: '6-8 hours',
    tags: ['Charts', 'Data Visualization', 'Dashboard', 'React'],
    icon: <TrendingUp className="h-5 w-5" />
  },
  {
    id: 'social-platform',
    title: 'Social Media Platform',
    description: 'A social networking platform with core features',
    prompt: 'Develop a social platform with: user profiles, posts, comments, likes, following system, news feed, notifications, and real-time updates. Include image upload, search, and privacy settings.',
    category: 'web',
    difficulty: 'advanced',
    estimatedTime: '15-20 hours',
    tags: ['Social Media', 'Real-time', 'File Upload', 'Full Stack'],
    icon: <Users className="h-5 w-5" />
  }
];

interface PromptTemplatesProps {
  onTemplateSelectAction: (template: PromptTemplate) => void;
  className?: string;
}

export function PromptTemplates({ onTemplateSelectAction, className = '' }: PromptTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All', icon: <Globe className="h-4 w-4" /> },
    { id: 'web', name: 'Web Apps', icon: <Globe className="h-4 w-4" /> },
    { id: 'mobile', name: 'Mobile', icon: <Smartphone className="h-4 w-4" /> },
    { id: 'api', name: 'APIs', icon: <Database className="h-4 w-4" /> },
    { id: 'ai', name: 'AI/ML', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'game', name: 'Games', icon: <Zap className="h-4 w-4" /> },
    { id: 'tool', name: 'Tools', icon: <Shield className="h-4 w-4" /> }
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels', color: 'bg-gray-500' },
    { id: 'beginner', name: 'Beginner', color: 'bg-green-500' },
    { id: 'intermediate', name: 'Intermediate', color: 'bg-yellow-500' },
    { id: 'advanced', name: 'Advanced', color: 'bg-red-500' }
  ];

  const filteredTemplates = promptTemplates.filter(template => {
    const categoryMatch = selectedCategory === 'all' || template.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  return (
    <Card className={`glass-effect border-white/10 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Prompt Templates
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose from our curated collection of project templates to get started quickly
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="space-y-4">
          {/* Category Filter */}
          <div>
            <h4 className="text-sm font-medium mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="glass-effect"
                >
                  {category.icon}
                  <span className="ml-2">{category.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <h4 className="text-sm font-medium mb-2">Difficulty Level</h4>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((difficulty) => (
                <Button
                  key={difficulty.id}
                  variant={selectedDifficulty === difficulty.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                  className="glass-effect"
                >
                  <div className={`w-2 h-2 rounded-full ${difficulty.color} mr-2`} />
                  {difficulty.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="glass-effect border-white/10 hover:border-primary/30 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {template.icon}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          template.difficulty === 'beginner' ? 'border-green-500/30 text-green-400' :
                          template.difficulty === 'intermediate' ? 'border-yellow-500/30 text-yellow-400' :
                          'border-red-500/30 text-red-400'
                        }`}
                      >
                        {template.difficulty}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">
                      {template.title}
                    </h3>
                    
                    <p className="text-xs text-muted-foreground mb-3 overflow-hidden" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {template.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {template.estimatedTime}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3" />
                        {template.tags.length} features
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-white/5">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-white/5">
                          +{template.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    <Button
                      onClick={() => onTemplateSelectAction(template)}
                      className="w-full glass-effect border-primary/30 hover:bg-primary/10 hover:border-primary/50"
                      size="sm"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No templates match your current filters</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              className="mt-2 glass-effect"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 