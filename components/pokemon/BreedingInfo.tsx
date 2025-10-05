import { PokemonSpecies } from '@/lib/types/pokemon';
import { Egg } from 'lucide-react';

interface BreedingInfoProps {
  species: PokemonSpecies;
}

export default function BreedingInfo({ species }: BreedingInfoProps) {
  // Format egg groups
  const eggGroups = species.egg_groups
    .map((group) => group.name.replace('-', ' '))
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
    .join(', ');

  // Calculate hatch time (steps to cycles conversion)
  const hatchCycles = species.hatch_counter || 0;
  const stepsMin = hatchCycles * 255;
  const stepsMax = hatchCycles * 257;

  return (
    <div className="bg-bg-secondary border border-border rounded-3xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <Egg className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-bold text-text-primary">Breeding Information</h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Egg Groups */}
        <div className="bg-bg-primary border border-border rounded-xl p-4">
          <p className="text-xs text-text-secondary mb-2">Egg Groups</p>
          <p className="text-lg font-medium text-text-primary">
            {eggGroups || 'No Eggs Discovered'}
          </p>
        </div>

        {/* Gender Ratio */}
        <div className="bg-bg-primary border border-border rounded-xl p-4">
          <p className="text-xs text-text-secondary mb-2">Gender Ratio</p>
          {species.gender_rate === -1 ? (
            <p className="text-lg font-medium text-text-primary">Genderless</p>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-blue-500">♂</span>
                <span className="text-sm text-text-primary">
                  {((8 - species.gender_rate) / 8 * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-pink-500">♀</span>
                <span className="text-sm text-text-primary">
                  {(species.gender_rate / 8 * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Hatch Counter */}
        {hatchCycles > 0 && (
          <div className="bg-bg-primary border border-border rounded-xl p-4">
            <p className="text-xs text-text-secondary mb-2">Egg Cycles</p>
            <p className="text-lg font-medium text-text-primary">{hatchCycles}</p>
            <p className="text-xs text-text-secondary mt-1">
              {stepsMin.toLocaleString()} - {stepsMax.toLocaleString()} steps
            </p>
          </div>
        )}

        {/* Base Happiness */}
        <div className="bg-bg-primary border border-border rounded-xl p-4">
          <p className="text-xs text-text-secondary mb-2">Base Happiness</p>
          <p className="text-lg font-medium text-text-primary">
            {species.base_happiness || 0}
          </p>
        </div>

        {/* Capture Rate */}
        <div className="bg-bg-primary border border-border rounded-xl p-4">
          <p className="text-xs text-text-secondary mb-2">Capture Rate</p>
          <p className="text-lg font-medium text-text-primary">
            {species.capture_rate}
          </p>
          <p className="text-xs text-text-secondary mt-1">
            {((species.capture_rate / 255) * 100).toFixed(1)}% with full HP
          </p>
        </div>

        {/* Growth Rate */}
        <div className="bg-bg-primary border border-border rounded-xl p-4">
          <p className="text-xs text-text-secondary mb-2">Growth Rate</p>
          <p className="text-lg font-medium text-text-primary capitalize">
            {species.growth_rate?.name.replace('-', ' ') || 'Unknown'}
          </p>
        </div>
      </div>
    </div>
  );
}
