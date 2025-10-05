'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { toggleFavorite, isFavorite } from '@/lib/utils/favorites';

interface FavoriteButtonProps {
  pokemonId: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function FavoriteButton({ pokemonId, size = 'md' }: FavoriteButtonProps) {
  const [favorite, setFavorite] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFavorite(isFavorite(pokemonId));
  }, [pokemonId]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleFavorite(pokemonId);
    setFavorite(newState);
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

  return (
    <button
      onClick={handleClick}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full transition-all ${
        favorite
          ? 'bg-accent/20 text-accent hover:bg-accent/30'
          : 'bg-bg-secondary border border-border text-text-secondary hover:border-accent hover:text-accent'
      }`}
      aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`${iconSizes[size]} transition-all ${favorite ? 'fill-current' : ''}`}
      />
    </button>
  );
}
