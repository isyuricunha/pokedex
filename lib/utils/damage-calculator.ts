// Advanced damage calculator with STAB and effectiveness

import { TypeName } from '@/lib/types/pokemon';
import { getTypeEffectiveness } from './type-effectiveness';

interface DamageCalculationParams {
  attackerLevel: number;
  attackPower: number;
  attackStat: number;
  defenseStat: number;
  attackerTypes: TypeName[];
  moveType: TypeName;
  defenderTypes: TypeName[];
  isCritical?: boolean;
  weatherBoost?: number;
  otherModifiers?: number;
}

/**
 * Calculate damage using the Pokémon damage formula
 * Damage = ((((2 * Level / 5 + 2) * Power * A/D) / 50) + 2) * Modifier
 */
export function calculateDamage(params: DamageCalculationParams): {
  min: number;
  max: number;
  effectiveness: number;
  hasStab: boolean;
} {
  const {
    attackerLevel,
    attackPower,
    attackStat,
    defenseStat,
    attackerTypes,
    moveType,
    defenderTypes,
    isCritical = false,
    weatherBoost = 1,
    otherModifiers = 1,
  } = params;

  // Base damage calculation
  const levelMultiplier = (2 * attackerLevel) / 5 + 2;
  const baseDamage = (levelMultiplier * attackPower * (attackStat / defenseStat)) / 50 + 2;

  // Type effectiveness
  const effectiveness = getTypeEffectiveness(moveType, defenderTypes);

  // STAB (Same Type Attack Bonus) - 1.5x if move type matches attacker type
  const hasStab = attackerTypes.includes(moveType);
  const stabMultiplier = hasStab ? 1.5 : 1;

  // Critical hit - 1.5x in modern games (2x in older games)
  const criticalMultiplier = isCritical ? 1.5 : 1;

  // Random factor (0.85 to 1.0)
  const randomMin = 0.85;
  const randomMax = 1.0;

  // Final modifiers
  const modifier = stabMultiplier * effectiveness * criticalMultiplier * weatherBoost * otherModifiers;

  // Calculate damage range
  const damageMin = Math.floor(baseDamage * modifier * randomMin);
  const damageMax = Math.floor(baseDamage * modifier * randomMax);

  return {
    min: Math.max(1, damageMin), // Minimum 1 damage
    max: Math.max(1, damageMax),
    effectiveness,
    hasStab,
  };
}

/**
 * Calculate damage percentage
 */
export function calculateDamagePercentage(damage: number, targetHP: number): number {
  return (damage / targetHP) * 100;
}

/**
 * Determine KO probability
 */
export function getKOProbability(minDamage: number, maxDamage: number, targetHP: number): string {
  if (minDamage >= targetHP) {
    return 'Guaranteed KO';
  }
  if (maxDamage >= targetHP) {
    return 'Possible KO';
  }
  if (maxDamage >= targetHP * 0.5) {
    return '2HKO (2-Hit KO)';
  }
  if (maxDamage >= targetHP * 0.33) {
    return '3HKO (3-Hit KO)';
  }
  return 'No KO';
}

/**
 * Get weather effects
 */
export const WEATHER_EFFECTS = {
  harsh_sunlight: {
    name: 'Harsh Sunlight',
    fire: 1.5,
    water: 0.5,
  },
  rain: {
    name: 'Rain',
    water: 1.5,
    fire: 0.5,
  },
  sandstorm: {
    name: 'Sandstorm',
    rock: 1.5, // Sp. Def boost for Rock types
  },
  hail: {
    name: 'Hail',
    ice: 1.5, // Def boost for Ice types in some games
  },
};

/**
 * Get common move powers by category
 */
export const COMMON_MOVES = {
  physical: [
    { name: 'Tackle', power: 40 },
    { name: 'Quick Attack', power: 40 },
    { name: 'Earthquake', power: 100 },
    { name: 'Close Combat', power: 120 },
    { name: 'Outrage', power: 120 },
    { name: 'Extreme Speed', power: 80 },
  ],
  special: [
    { name: 'Thunderbolt', power: 90 },
    { name: 'Flamethrower', power: 90 },
    { name: 'Ice Beam', power: 90 },
    { name: 'Psychic', power: 90 },
    { name: 'Hyper Beam', power: 150 },
    { name: 'Shadow Ball', power: 80 },
  ],
};
