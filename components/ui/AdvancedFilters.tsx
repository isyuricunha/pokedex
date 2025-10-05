'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';

export interface FilterOptions {
  types: string[];
  bstRange: [number, number];
  heightRange: [number, number];
  weightRange: [number, number];
  ability?: string;
}

interface AdvancedFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

const ALL_TYPES = [
  'normal', 'fighting', 'flying', 'poison', 'ground', 'rock',
  'bug', 'ghost', 'steel', 'fire', 'water', 'grass',
  'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'
];

export default function AdvancedFilters({ onFilterChange }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [bstMin, setBstMin] = useState(0);
  const [bstMax, setBstMax] = useState(780);
  const [heightMin, setHeightMin] = useState(0);
  const [heightMax, setHeightMax] = useState(200);
  const [weightMin, setWeightMin] = useState(0);
  const [weightMax, setWeightMax] = useState(9999);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleApplyFilters = () => {
    onFilterChange({
      types: selectedTypes,
      bstRange: [bstMin, bstMax],
      heightRange: [heightMin, heightMax],
      weightRange: [weightMin, weightMax],
    });
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedTypes([]);
    setBstMin(0);
    setBstMax(780);
    setHeightMin(0);
    setHeightMax(200);
    setWeightMin(0);
    setWeightMax(9999);
    onFilterChange({
      types: [],
      bstRange: [0, 780],
      heightRange: [0, 200],
      weightRange: [0, 9999],
    });
  };

  const activeFiltersCount = selectedTypes.length + 
    (bstMin > 0 || bstMax < 780 ? 1 : 0) +
    (heightMin > 0 || heightMax < 200 ? 1 : 0) +
    (weightMin > 0 || weightMax < 9999 ? 1 : 0);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center gap-2 bg-bg-secondary border border-border hover:border-accent text-text-primary px-4 py-2 rounded-full text-sm font-medium transition-all"
      >
        <Filter className="w-4 h-4" />
        Advanced Filters
        {activeFiltersCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50" onClick={() => setIsOpen(false)}>
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-bg-primary border border-border rounded-2xl max-w-2xl w-full my-8" onClick={(e) => e.stopPropagation()}>
              <div className="bg-bg-primary border-b border-border p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-primary">Advanced Filters</h2>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-bg-secondary rounded-full">
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">
                    Types (AND logic - Pokémon with ALL selected types)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {ALL_TYPES.map(type => (
                      <button
                        key={type}
                        onClick={() => handleTypeToggle(type)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium capitalize transition-all ${
                          selectedTypes.includes(type)
                            ? 'bg-accent text-white'
                            : 'bg-bg-secondary border border-border text-text-primary hover:border-accent'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* BST Range */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">
                    Base Stat Total (BST): {bstMin} - {bstMax}
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="range"
                      min="0"
                      max="780"
                      value={bstMin}
                      onChange={(e) => setBstMin(Number(e.target.value))}
                      className="flex-1 accent-accent"
                    />
                    <input
                      type="range"
                      min="0"
                      max="780"
                      value={bstMax}
                      onChange={(e) => setBstMax(Number(e.target.value))}
                      className="flex-1 accent-accent"
                    />
                  </div>
                </div>

                {/* Height Range */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">
                    Height (dm): {heightMin} - {heightMax}
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={heightMin}
                      onChange={(e) => setHeightMin(Number(e.target.value))}
                      className="flex-1 accent-accent"
                    />
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={heightMax}
                      onChange={(e) => setHeightMax(Number(e.target.value))}
                      className="flex-1 accent-accent"
                    />
                  </div>
                </div>

                {/* Weight Range */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">
                    Weight (hg): {weightMin} - {weightMax}
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="range"
                      min="0"
                      max="9999"
                      step="10"
                      value={weightMin}
                      onChange={(e) => setWeightMin(Number(e.target.value))}
                      className="flex-1 accent-accent"
                    />
                    <input
                      type="range"
                      min="0"
                      max="9999"
                      step="10"
                      value={weightMax}
                      onChange={(e) => setWeightMax(Number(e.target.value))}
                      className="flex-1 accent-accent"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleApplyFilters}
                    className="flex-1 bg-accent hover:bg-accent/90 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={handleResetFilters}
                    className="flex-1 bg-bg-secondary border border-border text-text-primary px-4 py-3 rounded-lg font-medium hover:border-accent transition-colors"
                  >
                    Reset All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
