'use client';

import { useEffect, useState } from 'react';
import { Trophy, X } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export default function AchievementToast() {
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleAchievement = (event: Event) => {
      const customEvent = event as CustomEvent<Achievement>;
      setAchievement(customEvent.detail);
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setAchievement(null);
      }, 5000);
    };

    window.addEventListener('achievement-unlocked', handleAchievement);

    return () => {
      window.removeEventListener('achievement-unlocked', handleAchievement);
    };
  }, []);

  if (!mounted || !achievement) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-gradient-to-br from-accent/30 to-accent/10 border-2 border-accent backdrop-blur-sm rounded-2xl p-4 shadow-2xl max-w-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-2xl">
            {achievement.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-accent" />
              <p className="text-xs font-bold text-accent uppercase tracking-wide">Achievement Unlocked!</p>
            </div>
            <h4 className="font-bold text-text-primary mb-1">{achievement.name}</h4>
            <p className="text-sm text-text-secondary">{achievement.description}</p>
          </div>

          <button
            onClick={() => setAchievement(null)}
            className="flex-shrink-0 p-1 hover:bg-bg-secondary/50 rounded-full transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
      </div>
    </div>
  );
}
