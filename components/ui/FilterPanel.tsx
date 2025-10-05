'use client';

import { useState } from 'react';
import { Filter, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { TypeName } from '@/lib/types/pokemon';

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  types: TypeName[];
  generation: number | null;
  favoritesOnly: boolean;
  minSpeed?: number;
  minAttack?: number;
  minHP?: number;
  ability?: string;
  eggGroup?: string;
  evolutionStage?: 'baby' | 'basic' | 'stage1' | 'stage2' | 'legendary';
}

const ALL_TYPES: TypeName[] = [
  'normal', 'fighting', 'flying', 'poison', 'ground', 'rock',
  'bug', 'ghost', 'steel', 'fire', 'water', 'grass',
  'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'
];

const GENERATIONS = [
  { id: 1, name: 'Gen I', range: [1, 151] },
  { id: 2, name: 'Gen II', range: [152, 251] },
  { id: 3, name: 'Gen III', range: [252, 386] },
  { id: 4, name: 'Gen IV', range: [387, 493] },
  { id: 5, name: 'Gen V', range: [494, 649] },
  { id: 6, name: 'Gen VI', range: [650, 721] },
  { id: 7, name: 'Gen VII', range: [722, 809] },
  { id: 8, name: 'Gen VIII', range: [810, 905] },
  { id: 9, name: 'Gen IX', range: [906, 1025] },
];

export default function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<TypeName[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [minSpeed, setMinSpeed] = useState<number>(0);
  const [minAttack, setMinAttack] = useState<number>(0);
  const [minHP, setMinHP] = useState<number>(0);
  const [selectedAbility, setSelectedAbility] = useState<string>('');
  const [selectedEggGroup, setSelectedEggGroup] = useState<string>('');
  const [selectedEvolutionStage, setSelectedEvolutionStage] = useState<'' | 'baby' | 'basic' | 'stage1' | 'stage2' | 'legendary'>('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const emitFilters = () => {
    onFilterChange({
      types: selectedTypes,
      generation: selectedGeneration,
      favoritesOnly,
      minSpeed: minSpeed > 0 ? minSpeed : undefined,
      minAttack: minAttack > 0 ? minAttack : undefined,
      minHP: minHP > 0 ? minHP : undefined,
      ability: selectedAbility || undefined,
      eggGroup: selectedEggGroup || undefined,
      evolutionStage: selectedEvolutionStage || undefined,
    });
  };

  const handleTypeToggle = (type: TypeName) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    setSelectedTypes(newTypes);
    setTimeout(emitFilters, 0);
  };

  const handleGenerationChange = (genId: number | null) => {
    setSelectedGeneration(genId);
    setTimeout(emitFilters, 0);
  };

  const handleFavoritesToggle = () => {
    setFavoritesOnly(!favoritesOnly);
    setTimeout(emitFilters, 0);
  };

  const handleClearAll = () => {
    setSelectedTypes([]);
    setSelectedGeneration(null);
    setFavoritesOnly(false);
    setMinSpeed(0);
    setMinAttack(0);
    setMinHP(0);
    setSelectedAbility('');
    setSelectedEggGroup('');
    setSelectedEvolutionStage('');
    onFilterChange({ types: [], generation: null, favoritesOnly: false });
  };

  const activeFiltersCount = selectedTypes.length + (selectedGeneration ? 1 : 0) + (favoritesOnly ? 1 : 0) + (minSpeed > 0 ? 1 : 0) + (minAttack > 0 ? 1 : 0) + (minHP > 0 ? 1 : 0) + (selectedAbility ? 1 : 0) + (selectedEggGroup ? 1 : 0) + (selectedEvolutionStage ? 1 : 0);

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-bg-secondary border border-border rounded-full px-4 py-2 text-text-primary hover:border-accent transition-all"
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <span className="bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute top-full mt-2 right-0 z-50 bg-bg-secondary border border-border rounded-2xl p-6 w-80 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-text-primary">Filters</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Favorites Toggle */}
            <div className="mb-6">
              <button
                onClick={handleFavoritesToggle}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  favoritesOnly
                    ? 'bg-accent text-white'
                    : 'bg-bg-primary border border-border text-text-primary hover:border-accent'
                }`}
              >
                <span className="text-lg">❤️</span>
                Show Favorites Only
              </button>
            </div>

            {/* Generation Filter */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-text-primary">Generation</h3>
                <p className="text-xs text-text-secondary">Click gen # for details</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleGenerationChange(null)}
                  className={`py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedGeneration === null
                      ? 'bg-accent text-white'
                      : 'bg-bg-primary border border-border text-text-primary hover:border-accent'
                  }`}
                >
                  All
                </button>
                {GENERATIONS.map((gen) => (
                  <div key={gen.id} className="relative group">
                    <button
                      onClick={() => handleGenerationChange(gen.id)}
                      className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedGeneration === gen.id
                          ? 'bg-accent text-white'
                          : 'bg-bg-primary border border-border text-text-primary hover:border-accent'
                      }`}
                    >
                      {gen.name}
                    </button>
                    <Link
                      href={`/generation/${gen.id}`}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                      title={`View ${gen.name} details`}
                    >
                      <ExternalLink className="w-3 h-3 text-white" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-text-primary mb-3">Type</h4>
              <div className="grid grid-cols-3 gap-2">
                {ALL_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeToggle(type)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                      selectedTypes.includes(type)
                        ? 'bg-accent text-white'
                        : 'bg-bg-primary border border-border text-text-primary hover:border-accent'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full bg-bg-primary border border-border text-text-primary hover:border-accent rounded-lg py-2 text-sm font-medium transition-all mb-4"
            >
              {showAdvanced ? '▼' : '▶'} Advanced Stat Filters
            </button>

            {/* Advanced Stat Filters */}
            {showAdvanced && (
              <div className="mb-4 space-y-4 bg-bg-primary border border-border rounded-lg p-4">
                {/* Stat Sliders */}
                <div className="space-y-3 pb-3 border-b border-border">
                <div>
                  <label className="text-xs text-text-secondary mb-1 block">
                    Min Speed: {minSpeed > 0 ? minSpeed : 'Any'}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="10"
                    value={minSpeed}
                    onChange={(e) => { setMinSpeed(Number(e.target.value)); setTimeout(emitFilters, 0); }}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-secondary mb-1 block">
                    Min Attack: {minAttack > 0 ? minAttack : 'Any'}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="10"
                    value={minAttack}
                    onChange={(e) => { setMinAttack(Number(e.target.value)); setTimeout(emitFilters, 0); }}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-secondary mb-1 block">
                    Min HP: {minHP > 0 ? minHP : 'Any'}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="10"
                    value={minHP}
                    onChange={(e) => { setMinHP(Number(e.target.value)); setTimeout(emitFilters, 0); }}
                    className="w-full"
                  />
                </div>
                </div>

                {/* Evolution Stage Filter */}
                <div>
                  <label className="text-xs text-text-secondary mb-2 block">
                    Evolution Stage
                  </label>
                  <select
                    value={selectedEvolutionStage}
                    onChange={(e) => { setSelectedEvolutionStage(e.target.value as any); setTimeout(emitFilters, 0); }}
                    className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
                  >
                    <option value="">All Stages</option>
                    <option value="baby">Baby</option>
                    <option value="basic">Basic</option>
                    <option value="stage1">Stage 1</option>
                    <option value="stage2">Stage 2</option>
                    <option value="legendary">Legendary/Mythical</option>
                  </select>
                </div>

                {/* Egg Group Filter */}
                <div>
                  <label className="text-xs text-text-secondary mb-2 block">
                    Egg Group
                  </label>
                  <select
                    value={selectedEggGroup}
                    onChange={(e) => { setSelectedEggGroup(e.target.value); setTimeout(emitFilters, 0); }}
                    className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
                  >
                    <option value="">All Egg Groups</option>
                    <option value="monster">Monster</option>
                    <option value="water1">Water 1</option>
                    <option value="bug">Bug</option>
                    <option value="flying">Flying</option>
                    <option value="ground">Ground</option>
                    <option value="fairy">Fairy</option>
                    <option value="plant">Plant</option>
                    <option value="human-like">Human-Like</option>
                    <option value="water3">Water 3</option>
                    <option value="mineral">Mineral</option>
                    <option value="amorphous">Amorphous</option>
                    <option value="water2">Water 2</option>
                    <option value="ditto">Ditto</option>
                    <option value="dragon">Dragon</option>
                    <option value="no-eggs">No Eggs Discovered</option>
                  </select>
                </div>

                {/* Ability Search */}
                <div>
                  <label className="text-xs text-text-secondary mb-2 block">
                    Ability (search)
                  </label>
                  <input
                    type="text"
                    value={selectedAbility}
                    onChange={(e) => { setSelectedAbility(e.target.value); setTimeout(emitFilters, 200); }}
                    placeholder="e.g., Levitate, Intimidate..."
                    className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            )}

            {/* Clear Button */}
            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearAll}
                className="w-full bg-bg-primary border border-border text-text-primary hover:border-accent hover:text-accent rounded-lg py-2 text-sm font-medium transition-all"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export { GENERATIONS };
