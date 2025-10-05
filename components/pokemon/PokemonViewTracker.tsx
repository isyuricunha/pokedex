'use client';

import { useEffect } from 'react';
import { markPokemonAsViewed } from '@/lib/utils/collections';

interface PokemonViewTrackerProps {
  pokemonId: number;
}

export default function PokemonViewTracker({ pokemonId }: PokemonViewTrackerProps) {
  useEffect(() => {
    // Mark Pokemon as viewed when component mounts
    markPokemonAsViewed(pokemonId);
  }, [pokemonId]);

  return null;
}
