"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Theme = 'light' | 'dark' | 'system';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Default to system preference
      setTheme('system');
      applyTheme('system');
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
      root.classList.toggle('light', systemTheme === 'light');
    } else {
      root.classList.toggle('dark', newTheme === 'dark');
      root.classList.toggle('light', newTheme === 'light');
    }
    
    // Save preference
    localStorage.setItem('theme', newTheme);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Listen for system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="w-10 h-10 p-0 glass-effect border-white/20">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light theme';
      case 'dark':
        return 'Dark theme';
      case 'system':
        return 'System theme';
      default:
        return 'Theme';
    }
  };

  return (
    <div className="relative group">
      <Button
        variant="outline"
        size="sm"
        className="w-10 h-10 p-0 glass-effect border-white/20 hover:bg-white/10"
        title={getThemeLabel()}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {getThemeIcon()}
          </motion.div>
        </AnimatePresence>
      </Button>
      
      {/* Theme dropdown */}
      <div className="absolute right-0 top-12 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="glass-effect border border-white/20 rounded-lg p-2 space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className={`w-full justify-start ${theme === 'light' ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'}`}
            onClick={() => handleThemeChange('light')}
          >
            <Sun className="h-4 w-4 mr-2" />
            Light
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`w-full justify-start ${theme === 'dark' ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'}`}
            onClick={() => handleThemeChange('dark')}
          >
            <Moon className="h-4 w-4 mr-2" />
            Dark
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`w-full justify-start ${theme === 'system' ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'}`}
            onClick={() => handleThemeChange('system')}
          >
            <Monitor className="h-4 w-4 mr-2" />
            System
          </Button>
        </div>
      </div>
    </div>
  );
} 