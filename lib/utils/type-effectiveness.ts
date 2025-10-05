// Type effectiveness calculator for Pokémon battles

import { TypeName } from '@/lib/types/pokemon';

// Type effectiveness chart (attacking type -> defending type -> multiplier)
const TYPE_CHART: Record<TypeName, Partial<Record<TypeName, number>>> = {
  normal: {
    rock: 0.5,
    ghost: 0,
    steel: 0.5,
  },
  fighting: {
    normal: 2,
    flying: 0.5,
    poison: 0.5,
    rock: 2,
    bug: 0.5,
    ghost: 0,
    steel: 2,
    psychic: 0.5,
    ice: 2,
    dark: 2,
    fairy: 0.5,
  },
  flying: {
    fighting: 2,
    rock: 0.5,
    bug: 2,
    steel: 0.5,
    grass: 2,
    electric: 0.5,
  },
  poison: {
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    steel: 0,
    grass: 2,
    fairy: 2,
  },
  ground: {
    flying: 0,
    poison: 2,
    rock: 2,
    bug: 0.5,
    steel: 2,
    fire: 2,
    grass: 0.5,
    electric: 2,
  },
  rock: {
    fighting: 0.5,
    flying: 2,
    ground: 0.5,
    bug: 2,
    steel: 0.5,
    fire: 2,
    ice: 2,
  },
  bug: {
    fighting: 0.5,
    flying: 0.5,
    poison: 0.5,
    ghost: 0.5,
    steel: 0.5,
    fire: 0.5,
    grass: 2,
    psychic: 2,
    dark: 2,
    fairy: 0.5,
  },
  ghost: {
    normal: 0,
    ghost: 2,
    psychic: 2,
    dark: 0.5,
  },
  steel: {
    rock: 2,
    steel: 0.5,
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    ice: 2,
    fairy: 2,
  },
  fire: {
    rock: 0.5,
    bug: 2,
    steel: 2,
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 2,
    dragon: 0.5,
  },
  water: {
    ground: 2,
    rock: 2,
    fire: 2,
    water: 0.5,
    grass: 0.5,
    dragon: 0.5,
  },
  grass: {
    flying: 0.5,
    poison: 0.5,
    ground: 2,
    rock: 2,
    bug: 0.5,
    steel: 0.5,
    fire: 0.5,
    water: 2,
    grass: 0.5,
    dragon: 0.5,
  },
  electric: {
    flying: 2,
    ground: 0,
    water: 2,
    grass: 0.5,
    electric: 0.5,
    dragon: 0.5,
  },
  psychic: {
    fighting: 2,
    poison: 2,
    steel: 0.5,
    psychic: 0.5,
    dark: 0,
  },
  ice: {
    flying: 2,
    ground: 2,
    steel: 0.5,
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 0.5,
    dragon: 2,
  },
  dragon: {
    steel: 0.5,
    dragon: 2,
    fairy: 0,
  },
  dark: {
    fighting: 0.5,
    ghost: 2,
    psychic: 2,
    dark: 0.5,
    fairy: 0.5,
  },
  fairy: {
    fighting: 2,
    poison: 0.5,
    steel: 0.5,
    fire: 0.5,
    dragon: 2,
    dark: 2,
  },
  stellar: {}, // Stellar has no special effectiveness
  unknown: {}, // Unknown has no special effectiveness
};

/**
 * Calculate type effectiveness multiplier
 * @param attackingType - The type of the attacking move
 * @param defendingTypes - Array of defending Pokémon's types (1 or 2)
 */
export function getTypeEffectiveness(
  attackingType: TypeName,
  defendingTypes: TypeName[]
): number {
  let multiplier = 1;

  for (const defendingType of defendingTypes) {
    const effectiveness = TYPE_CHART[attackingType]?.[defendingType];
    if (effectiveness !== undefined) {
      multiplier *= effectiveness;
    }
  }

  return multiplier;
}

/**
 * Get effectiveness category
 */
export function getEffectivenessCategory(multiplier: number): {
  label: string;
  color: string;
} {
  if (multiplier === 0) {
    return { label: 'No Effect', color: 'text-gray-500' };
  }
  if (multiplier < 0.5) {
    return { label: 'Not Very Effective', color: 'text-red-500' };
  }
  if (multiplier === 0.5) {
    return { label: 'Not Very Effective', color: 'text-orange-500' };
  }
  if (multiplier === 1) {
    return { label: 'Normal', color: 'text-text-primary' };
  }
  if (multiplier === 2) {
    return { label: 'Super Effective', color: 'text-green-500' };
  }
  return { label: 'Super Effective!', color: 'text-green-400' };
}

/**
 * Get all weaknesses for a Pokémon's type combination
 */
export function getWeaknesses(types: TypeName[]): Array<{
  type: TypeName;
  multiplier: number;
}> {
  const weaknesses: Array<{ type: TypeName; multiplier: number }> = [];
  
  const allTypes: TypeName[] = [
    'normal', 'fighting', 'flying', 'poison', 'ground', 'rock',
    'bug', 'ghost', 'steel', 'fire', 'water', 'grass',
    'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'
  ];

  for (const attackingType of allTypes) {
    const effectiveness = getTypeEffectiveness(attackingType, types);
    if (effectiveness > 1) {
      weaknesses.push({ type: attackingType, multiplier: effectiveness });
    }
  }

  return weaknesses.sort((a, b) => b.multiplier - a.multiplier);
}

/**
 * Get all resistances for a Pokémon's type combination
 */
export function getResistances(types: TypeName[]): Array<{
  type: TypeName;
  multiplier: number;
}> {
  const resistances: Array<{ type: TypeName; multiplier: number }> = [];
  
  const allTypes: TypeName[] = [
    'normal', 'fighting', 'flying', 'poison', 'ground', 'rock',
    'bug', 'ghost', 'steel', 'fire', 'water', 'grass',
    'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'
  ];

  for (const attackingType of allTypes) {
    const effectiveness = getTypeEffectiveness(attackingType, types);
    if (effectiveness < 1 && effectiveness > 0) {
      resistances.push({ type: attackingType, multiplier: effectiveness });
    }
  }

  return resistances.sort((a, b) => a.multiplier - b.multiplier);
}

/**
 * Get all immunities for a Pokémon's type combination
 */
export function getImmunities(types: TypeName[]): TypeName[] {
  const immunities: TypeName[] = [];
  
  const allTypes: TypeName[] = [
    'normal', 'fighting', 'flying', 'poison', 'ground', 'rock',
    'bug', 'ghost', 'steel', 'fire', 'water', 'grass',
    'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'
  ];

  for (const attackingType of allTypes) {
    const effectiveness = getTypeEffectiveness(attackingType, types);
    if (effectiveness === 0) {
      immunities.push(attackingType);
    }
  }

  return immunities;
}
