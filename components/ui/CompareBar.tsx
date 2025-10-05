'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Scale, X } from 'lucide-react';
import { getComparisonSelection, removeFromComparison, clearComparison } from '@/lib/utils/comparison';

export default function CompareBar() {
  const [pokemonIds, setPokemonIds] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    updateSelection();

    // Listen for comparison updates
    const handleUpdate = () => updateSelection();
    window.addEventListener('comparison-updated', handleUpdate);

    return () => {
      window.removeEventListener('comparison-updated', handleUpdate);
    };
  }, []);

  const updateSelection = () => {
    setPokemonIds(getComparisonSelection());
  };

  const handleRemove = (id: number) => {
    removeFromComparison(id);
    updateSelection();
  };

  const handleClear = () => {
    clearComparison();
    updateSelection();
  };

  const handleCompare = () => {
    if (pokemonIds.length === 2) {
      router.push(`/compare?pokemon=${pokemonIds.join(',')}`);
    }
  };

  // Don't show if no Pokemon selected or not mounted
  if (!mounted || pokemonIds.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-bg-secondary border-2 border-accent rounded-2xl p-4 shadow-2xl shadow-accent/20 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-accent" />
          <h3 className="font-bold text-text-primary">Compare Pokémon</h3>
        </div>
        <button
          onClick={handleClear}
          className="text-text-secondary hover:text-accent transition-colors"
          aria-label="Clear comparison"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 mb-4">
        {pokemonIds.map((id, index) => (
          <div
            key={id}
            className="flex items-center justify-between bg-bg-primary border border-border rounded-lg px-3 py-2"
          >
            <span className="text-sm text-text-primary font-medium">
              Pokémon #{index + 1}: <span className="text-accent">#{id}</span>
            </span>
            <button
              onClick={() => handleRemove(id)}
              className="text-text-secondary hover:text-red-500 transition-colors"
              aria-label="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {pokemonIds.length === 1 && (
          <div className="text-xs text-text-secondary text-center py-2 border border-dashed border-border rounded-lg">
            Select one more Pokémon to compare
          </div>
        )}
      </div>

      <button
        onClick={handleCompare}
        disabled={pokemonIds.length !== 2}
        className={`w-full py-2 rounded-lg font-medium transition-all ${
          pokemonIds.length === 2
            ? 'bg-accent hover:bg-accent-hover text-white'
            : 'bg-bg-primary border border-border text-text-secondary cursor-not-allowed opacity-50'
        }`}
      >
        Compare {pokemonIds.length}/2
      </button>
    </div>
  );
}
