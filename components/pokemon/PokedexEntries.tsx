'use client';

import { useState } from 'react';
import { PokemonSpecies } from '@/lib/types/pokemon';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

interface PokedexEntriesProps {
  species: PokemonSpecies;
}

export default function PokedexEntries({ species }: PokedexEntriesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get English flavor text entries
  const entries = species.flavor_text_entries
    .filter((entry) => entry.language.name === 'en')
    .map((entry) => ({
      text: entry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' '),
      version: entry.version.name,
    }));

  if (entries.length === 0) {
    return null;
  }

  const currentEntry = entries[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : entries.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < entries.length - 1 ? prev + 1 : 0));
  };

  // Format version name
  const formatVersionName = (version: string) => {
    return version
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="bg-bg-secondary border border-border rounded-3xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-bold text-text-primary">Pokédex Entries</h2>
      </div>

      <div className="bg-bg-primary border border-border rounded-xl p-6">
        {/* Entry Text */}
        <p className="text-text-primary text-lg leading-relaxed mb-4 min-h-[4rem]">
          &quot;{currentEntry.text}&quot;
        </p>

        {/* Version Badge */}
        <div className="flex items-center justify-between">
          <div className="bg-accent/10 border border-accent/30 rounded-full px-4 py-1">
            <p className="text-accent font-medium text-sm">
              Pokémon {formatVersionName(currentEntry.version)}
            </p>
          </div>

          {/* Navigation */}
          {entries.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                className="w-8 h-8 flex items-center justify-center bg-bg-secondary border border-border rounded-full hover:border-accent transition-colors"
                aria-label="Previous entry"
              >
                <ChevronLeft className="w-4 h-4 text-text-primary" />
              </button>
              
              <span className="text-xs text-text-secondary font-mono">
                {currentIndex + 1} / {entries.length}
              </span>

              <button
                onClick={handleNext}
                className="w-8 h-8 flex items-center justify-center bg-bg-secondary border border-border rounded-full hover:border-accent transition-colors"
                aria-label="Next entry"
              >
                <ChevronRight className="w-4 h-4 text-text-primary" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Version Grid (optional - shows all versions) */}
      {entries.length > 3 && (
        <div className="mt-4">
          <p className="text-xs text-text-secondary mb-2">Available in:</p>
          <div className="flex flex-wrap gap-2">
            {entries.map((entry, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`text-xs px-3 py-1 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-accent text-white'
                    : 'bg-bg-primary border border-border text-text-secondary hover:border-accent'
                }`}
              >
                {formatVersionName(entry.version)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
