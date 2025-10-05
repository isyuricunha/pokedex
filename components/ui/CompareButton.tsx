'use client';

import { useState, useEffect } from 'react';
import { Scale, Check } from 'lucide-react';
import { addToComparison, removeFromComparison, isInComparison, isComparisonFull } from '@/lib/utils/comparison';

interface CompareButtonProps {
  pokemonId: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function CompareButton({ pokemonId, size = 'md' }: CompareButtonProps) {
  const [inComparison, setInComparison] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    updateState();
  }, [pokemonId]);

  const updateState = () => {
    setInComparison(isInComparison(pokemonId));
    setIsFull(isComparisonFull());
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inComparison) {
      removeFromComparison(pokemonId);
    } else {
      const added = addToComparison(pokemonId);
      if (!added && isComparisonFull()) {
        alert('You can only compare 2 Pokémon at a time. Remove one first.');
        return;
      }
    }

    updateState();
    // Dispatch event for other components to update
    window.dispatchEvent(new Event('comparison-updated'));
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const isDisabled = !inComparison && isFull;

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full transition-all ${
        inComparison
          ? 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30'
          : isDisabled
          ? 'bg-bg-secondary border border-border text-text-secondary opacity-50 cursor-not-allowed'
          : 'bg-bg-secondary border border-border text-text-secondary hover:border-blue-500 hover:text-blue-500'
      }`}
      aria-label={inComparison ? 'Remove from comparison' : 'Add to comparison'}
      title={isDisabled ? 'Comparison full (max 2)' : undefined}
    >
      {inComparison ? (
        <Check className={`${iconSizes[size]}`} />
      ) : (
        <Scale className={`${iconSizes[size]}`} />
      )}
    </button>
  );
}
