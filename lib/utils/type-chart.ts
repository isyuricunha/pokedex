// Type effectiveness data
export const TYPE_CHART: Record<string, { strengths: string[]; weaknesses: string[]; immunities: string[] }> = {
  normal: {
    strengths: [],
    weaknesses: ['fighting'],
    immunities: ['ghost'],
  },
  fighting: {
    strengths: ['normal', 'ice', 'rock', 'dark', 'steel'],
    weaknesses: ['flying', 'psychic', 'fairy'],
    immunities: [],
  },
  flying: {
    strengths: ['fighting', 'bug', 'grass'],
    weaknesses: ['electric', 'ice', 'rock'],
    immunities: ['ground'],
  },
  poison: {
    strengths: ['grass', 'fairy'],
    weaknesses: ['ground', 'psychic'],
    immunities: [],
  },
  ground: {
    strengths: ['fire', 'electric', 'poison', 'rock', 'steel'],
    weaknesses: ['water', 'grass', 'ice'],
    immunities: ['electric'],
  },
  rock: {
    strengths: ['fire', 'ice', 'flying', 'bug'],
    weaknesses: ['water', 'grass', 'fighting', 'ground', 'steel'],
    immunities: [],
  },
  bug: {
    strengths: ['grass', 'psychic', 'dark'],
    weaknesses: ['fire', 'flying', 'rock'],
    immunities: [],
  },
  ghost: {
    strengths: ['ghost', 'psychic'],
    weaknesses: ['ghost', 'dark'],
    immunities: ['normal', 'fighting'],
  },
  steel: {
    strengths: ['ice', 'rock', 'fairy'],
    weaknesses: ['fire', 'fighting', 'ground'],
    immunities: ['poison'],
  },
  fire: {
    strengths: ['grass', 'ice', 'bug', 'steel'],
    weaknesses: ['water', 'ground', 'rock'],
    immunities: [],
  },
  water: {
    strengths: ['fire', 'ground', 'rock'],
    weaknesses: ['electric', 'grass'],
    immunities: [],
  },
  grass: {
    strengths: ['water', 'ground', 'rock'],
    weaknesses: ['fire', 'ice', 'poison', 'flying', 'bug'],
    immunities: [],
  },
  electric: {
    strengths: ['water', 'flying'],
    weaknesses: ['ground'],
    immunities: [],
  },
  psychic: {
    strengths: ['fighting', 'poison'],
    weaknesses: ['bug', 'ghost', 'dark'],
    immunities: [],
  },
  ice: {
    strengths: ['grass', 'ground', 'flying', 'dragon'],
    weaknesses: ['fire', 'fighting', 'rock', 'steel'],
    immunities: [],
  },
  dragon: {
    strengths: ['dragon'],
    weaknesses: ['ice', 'dragon', 'fairy'],
    immunities: [],
  },
  dark: {
    strengths: ['ghost', 'psychic'],
    weaknesses: ['fighting', 'bug', 'fairy'],
    immunities: ['psychic'],
  },
  fairy: {
    strengths: ['fighting', 'dragon', 'dark'],
    weaknesses: ['poison', 'steel'],
    immunities: ['dragon'],
  },
};

export const ALL_TYPES = Object.keys(TYPE_CHART);

/**
 * Get type effectiveness multiplier
 */
export function getTypeEffectiveness(attackType: string, defenseType: string): number {
  const chart = TYPE_CHART[attackType];
  if (!chart) return 1;

  if (chart.immunities.includes(defenseType)) return 0;
  if (chart.strengths.includes(defenseType)) return 2;
  if (TYPE_CHART[defenseType]?.weaknesses.includes(attackType)) return 2;
  if (TYPE_CHART[defenseType]?.strengths.includes(attackType)) return 0.5;

  return 1;
}

/**
 * Get effectiveness label
 */
export function getEffectivenessLabel(multiplier: number): string {
  if (multiplier === 0) return 'No Effect';
  if (multiplier === 0.5) return 'Not Very Effective';
  if (multiplier === 2) return 'Super Effective';
  return 'Normal';
}
