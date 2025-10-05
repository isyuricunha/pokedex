'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SwipeNavigationProps {
  currentId: number;
  maxId?: number;
}

export default function SwipeNavigation({ currentId, maxId = 1025 }: SwipeNavigationProps) {
  const router = useRouter();
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX.current = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const diff = touchStartX.current - touchEndX.current;

      if (Math.abs(diff) < swipeThreshold) return;

      if (diff > 0) {
        // Swiped left - next Pokemon
        const nextId = currentId < maxId ? currentId + 1 : 1;
        router.push(`/pokemon/${nextId}`);
      } else {
        // Swiped right - previous Pokemon
        const prevId = currentId > 1 ? currentId - 1 : maxId;
        router.push(`/pokemon/${prevId}`);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentId, maxId, router]);

  return null;
}
