import { TypeName } from '@/lib/types/pokemon';
import { getWeaknesses, getResistances, getImmunities } from '@/lib/utils/type-effectiveness';
import TypeBadge from './TypeBadge';

interface TypeMatchupProps {
  types: TypeName[];
}

export default function TypeMatchup({ types }: TypeMatchupProps) {
  const weaknesses = getWeaknesses(types);
  const resistances = getResistances(types);
  const immunities = getImmunities(types);

  return (
    <div className="bg-bg-secondary border border-border rounded-3xl p-8">
      <h2 className="text-2xl font-bold text-text-primary mb-6">Type Matchup</h2>

      {/* Weaknesses */}
      {weaknesses.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-text-secondary mb-3">
            Weak to ({weaknesses.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {weaknesses.map(({ type, multiplier }) => (
              <div key={type} className="relative">
                <TypeBadge type={type} size="sm" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {multiplier === 4 ? '4' : '2'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resistances */}
      {resistances.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-text-secondary mb-3">
            Resistant to ({resistances.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {resistances.map(({ type, multiplier }) => (
              <div key={type} className="relative">
                <TypeBadge type={type} size="sm" />
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-4 flex items-center justify-center">
                  {multiplier === 0.25 ? '¼' : '½'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Immunities */}
      {immunities.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-text-secondary mb-3">
            Immune to ({immunities.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {immunities.map((type) => (
              <div key={type} className="relative">
                <TypeBadge type={type} size="sm" />
                <span className="absolute -top-1 -right-1 bg-gray-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  0
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {weaknesses.length === 0 && resistances.length === 0 && immunities.length === 0 && (
        <p className="text-text-secondary text-center py-4">
          No special type matchups
        </p>
      )}
    </div>
  );
}
