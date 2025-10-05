'use client';

import { useState } from 'react';
import { Pokemon, TypeName } from '@/lib/types/pokemon';
import { calculateDamage, getKOProbability } from '@/lib/utils/damage-calculator';
import { Zap } from 'lucide-react';

interface DamageCalculatorProps {
  attacker: Pokemon;
}

const MOVE_TYPES: TypeName[] = [
  'normal', 'fighting', 'flying', 'poison', 'ground', 'rock',
  'bug', 'ghost', 'steel', 'fire', 'water', 'grass',
  'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'
];

export default function DamageCalculator({ attacker }: DamageCalculatorProps) {
  const [moveType, setMoveType] = useState<TypeName>('normal');
  const [movePower, setMovePower] = useState(90);
  const [isPhysical, setIsPhysical] = useState(true);
  const [defenderHP, setDefenderHP] = useState(100);
  const [defenderDefense, setDefenderDefense] = useState(80);
  const [defenderTypes, setDefenderTypes] = useState<TypeName[]>(['normal']);
  const [isCritical, setIsCritical] = useState(false);

  const attackStat = isPhysical 
    ? attacker.stats.find(s => s.stat.name === 'attack')?.base_stat || 50
    : attacker.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 50;

  const result = calculateDamage({
    attackerLevel: 50, // VGC standard level
    attackPower: movePower,
    attackStat,
    defenseStat: defenderDefense,
    attackerTypes: attacker.types.map(t => t.type.name),
    moveType,
    defenderTypes,
    isCritical,
  });

  const koProb = getKOProbability(result.min, result.max, defenderHP);
  const damagePercent = ((result.max / defenderHP) * 100).toFixed(1);

  return (
    <div className="bg-bg-secondary border border-border rounded-3xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-bold text-text-primary">Damage Calculator</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Move Type
            </label>
            <select
              value={moveType}
              onChange={(e) => setMoveType(e.target.value as TypeName)}
              className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
            >
              {MOVE_TYPES.map(type => (
                <option key={type} value={type} className="capitalize">
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Move Power: {movePower}
            </label>
            <input
              type="range"
              min="40"
              max="150"
              step="10"
              value={movePower}
              onChange={(e) => setMovePower(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Attack Category
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsPhysical(true)}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  isPhysical
                    ? 'bg-accent text-white'
                    : 'bg-bg-primary border border-border text-text-primary hover:border-accent'
                }`}
              >
                Physical
              </button>
              <button
                onClick={() => setIsPhysical(false)}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  !isPhysical
                    ? 'bg-accent text-white'
                    : 'bg-bg-primary border border-border text-text-primary hover:border-accent'
                }`}
              >
                Special
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Defender HP: {defenderHP}
            </label>
            <input
              type="range"
              min="50"
              max="250"
              step="10"
              value={defenderHP}
              onChange={(e) => setDefenderHP(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Defender Defense: {defenderDefense}
            </label>
            <input
              type="range"
              min="30"
              max="150"
              step="5"
              value={defenderDefense}
              onChange={(e) => setDefenderDefense(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="critical"
              checked={isCritical}
              onChange={(e) => setIsCritical(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="critical" className="text-sm text-text-primary">
              Critical Hit (1.5× multiplier)
            </label>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="bg-bg-primary border-2 border-accent rounded-xl p-6">
            <h3 className="text-sm font-medium text-text-secondary mb-3">Damage Range</h3>
            <p className="text-4xl font-bold text-accent mb-2">
              {result.min} - {result.max}
            </p>
            <p className="text-sm text-text-secondary">
              {damagePercent}% of target HP
            </p>
          </div>

          <div className="bg-bg-primary border border-border rounded-xl p-4">
            <p className="text-xs text-text-secondary mb-1">KO Probability</p>
            <p className={`text-lg font-bold ${
              koProb.includes('Guaranteed') ? 'text-green-500' :
              koProb.includes('Possible') ? 'text-yellow-500' :
              koProb.includes('2HKO') ? 'text-orange-500' :
              'text-text-primary'
            }`}>
              {koProb}
            </p>
          </div>

          <div className="bg-bg-primary border border-border rounded-xl p-4">
            <p className="text-xs text-text-secondary mb-1">Type Effectiveness</p>
            <p className={`text-lg font-bold ${
              result.effectiveness === 0 ? 'text-gray-500' :
              result.effectiveness < 1 ? 'text-red-500' :
              result.effectiveness > 1 ? 'text-green-500' :
              'text-text-primary'
            }`}>
              {result.effectiveness === 0 ? 'No Effect' :
               result.effectiveness === 0.25 ? '¼× (Not Very Effective)' :
               result.effectiveness === 0.5 ? '½× (Not Very Effective)' :
               result.effectiveness === 1 ? '1× (Normal)' :
               result.effectiveness === 2 ? '2× (Super Effective)' :
               '4× (Super Effective!)'}
            </p>
          </div>

          {result.hasStab && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <p className="text-sm font-medium text-blue-400">
                ⚡ STAB Bonus Active (1.5×)
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Move type matches attacker type
              </p>
            </div>
          )}

          <div className="text-xs text-text-secondary mt-4 space-y-1">
            <p>• Calculations based on Level 50 (VGC standard)</p>
            <p>• Random factor: 85-100%</p>
            <p>• Assumes no stat boosts or items</p>
          </div>
        </div>
      </div>
    </div>
  );
}
