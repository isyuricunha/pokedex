'use client';

import { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
}

export default function PullToRefresh({ onRefresh }: PullToRefreshProps) {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    let pullDistance = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY !== 0 || refreshing) return;

      currentY.current = e.touches[0].clientY;
      pullDistance = currentY.current - startY.current;

      if (pullDistance > 0) {
        setPulling(true);
        e.preventDefault();
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance > 80 && !refreshing) {
        setRefreshing(true);
        setPulling(false);
        
        try {
          await onRefresh();
        } finally {
          setRefreshing(false);
        }
      } else {
        setPulling(false);
      }
      
      pullDistance = 0;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onRefresh, refreshing]);

  if (!pulling && !refreshing) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center pt-4">
      <div className={`bg-bg-secondary border border-border rounded-full p-3 shadow-lg ${refreshing ? 'animate-spin' : ''}`}>
        <RefreshCw className="w-5 h-5 text-accent" />
      </div>
    </div>
  );
}
