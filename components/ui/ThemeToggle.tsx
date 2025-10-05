'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { getTheme, toggleTheme, applyTheme, Theme } from '@/lib/utils/theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentTheme = getTheme();
    setTheme(currentTheme);
    applyTheme(currentTheme);
  }, []);

  const handleToggle = () => {
    const newTheme = toggleTheme();
    setTheme(newTheme);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-bg-secondary border border-border" />
    );
  }

  return (
    <button
      onClick={handleToggle}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary border border-border text-text-primary hover:border-accent hover:text-accent transition-all"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
