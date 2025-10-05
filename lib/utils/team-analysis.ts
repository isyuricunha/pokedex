// Team analysis utilities

import { TypeName } from '@/lib/types/pokemon';
import { getTypeEffectiveness } from './type-effectiveness';

export interface TypeCoverage {
  offensive: Map<TypeName, number>; // How many Pokemon can hit each type super-effectively
  defensive: Map<TypeName, number>; // How many Pokemon resist each type
}

export interface WeaknessAnalysis {
  commonWeaknesses: TypeName[];
  commonResistances: TypeName[];
  immunities: TypeName[];
}

export interface TeamStats {
  totalHP: number;
  totalAttack: number;
  totalDefense: number;
  totalSpAttack: number;
  totalSpDefense: number;
  totalSpeed: number;
  averageTotal: number;
}

export type PokemonRole = 'physical-sweeper' | 'special-sweeper' | 'physical-tank' | 'special-tank' | 'balanced' | 'fast-support';

export interface RoleDistribution {
  [key: string]: number;
}

/**
 * Analyze type coverage for a team
 */
export function analyzeTypeCoverage(
  teamTypes: { pokemonId: number; types: TypeName[] }[]
): TypeCoverage {
  const offensive = new Map<TypeName, number>();
  const defensive = new Map<TypeName, number>();

  const allTypes: TypeName[] = [
    'normal', 'fighting', 'flying', 'poison', 'ground', 'rock',
    'bug', 'ghost', 'steel', 'fire', 'water', 'grass',
    'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'
  ];

  // Initialize maps
  allTypes.forEach(type => {
    offensive.set(type, 0);
    defensive.set(type, 0);
  });

  // Analyze each Pokemon's types
  teamTypes.forEach(({ types }) => {
    types.forEach(attackerType => {
      // Offensive coverage - which types can this Pokemon hit super-effectively
      allTypes.forEach(defenderType => {
        const effectiveness = getTypeEffectiveness(attackerType, [defenderType as TypeName]);
        if (effectiveness > 1) {
          offensive.set(defenderType, (offensive.get(defenderType) || 0) + 1);
        }
      });
    });

    // Defensive coverage - which types does this Pokemon resist
    allTypes.forEach(attackerType => {
      const effectiveness = types.reduce((max, defenderType) => {
        return Math.max(max, getTypeEffectiveness(attackerType, [defenderType as TypeName]));
      }, 0);
      
      if (effectiveness < 1) {
        defensive.set(attackerType, (defensive.get(attackerType) || 0) + 1);
      }
    });
  });

  return { offensive, defensive };
}

/**
 * Analyze common weaknesses and resistances
 */
export function analyzeWeaknesses(
  teamTypes: { pokemonId: number; types: TypeName[] }[]
): WeaknessAnalysis {
  const allTypes: TypeName[] = [
    'normal', 'fighting', 'flying', 'poison', 'ground', 'rock',
    'bug', 'ghost', 'steel', 'fire', 'water', 'grass',
    'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'
  ];

  const weaknessCount = new Map<TypeName, number>();
  const resistanceCount = new Map<TypeName, number>();
  const immunityCount = new Map<TypeName, number>();

  teamTypes.forEach(({ types }) => {
    allTypes.forEach(attackerType => {
      let totalEffectiveness = 1;
      types.forEach(defenderType => {
        totalEffectiveness *= getTypeEffectiveness(attackerType, [defenderType as TypeName]);
      });

      if (totalEffectiveness > 1) {
        weaknessCount.set(attackerType, (weaknessCount.get(attackerType) || 0) + 1);
      } else if (totalEffectiveness === 0) {
        immunityCount.set(attackerType, (immunityCount.get(attackerType) || 0) + 1);
      } else if (totalEffectiveness < 1) {
        resistanceCount.set(attackerType, (resistanceCount.get(attackerType) || 0) + 1);
      }
    });
  });

  // Find common weaknesses (3+ Pokemon weak to this type)
  const commonWeaknesses = allTypes.filter(type => (weaknessCount.get(type) || 0) >= 3);
  
  // Find common resistances (3+ Pokemon resist this type)
  const commonResistances = allTypes.filter(type => (resistanceCount.get(type) || 0) >= 3);
  
  // Find immunities
  const immunities = allTypes.filter(type => (immunityCount.get(type) || 0) > 0);

  return { commonWeaknesses, commonResistances, immunities };
}

/**
 * Calculate team stats distribution
 */
export function calculateTeamStats(
  pokemonStats: {
    pokemonId: number;
    hp: number;
    attack: number;
    defense: number;
    spAttack: number;
    spDefense: number;
    speed: number;
  }[]
): TeamStats {
  const stats = pokemonStats.reduce(
    (acc, pokemon) => ({
      totalHP: acc.totalHP + pokemon.hp,
      totalAttack: acc.totalAttack + pokemon.attack,
      totalDefense: acc.totalDefense + pokemon.defense,
      totalSpAttack: acc.totalSpAttack + pokemon.spAttack,
      totalSpDefense: acc.totalSpDefense + pokemon.spDefense,
      totalSpeed: acc.totalSpeed + pokemon.speed,
    }),
    {
      totalHP: 0,
      totalAttack: 0,
      totalDefense: 0,
      totalSpAttack: 0,
      totalSpDefense: 0,
      totalSpeed: 0,
    }
  );

  const count = pokemonStats.length || 1;
  const averageTotal = Math.round(
    (stats.totalHP + stats.totalAttack + stats.totalDefense + 
     stats.totalSpAttack + stats.totalSpDefense + stats.totalSpeed) / count
  );

  return { ...stats, averageTotal };
}

/**
 * Identify Pokemon role based on stats
 */
export function identifyRole(stats: {
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
}): PokemonRole {
  const { hp, attack, defense, spAttack, spDefense, speed } = stats;
  const total = hp + attack + defense + spAttack + spDefense + speed;
  
  // Normalized stats
  const hpRatio = hp / total;
  const atkRatio = attack / total;
  const defRatio = defense / total;
  const spAtkRatio = spAttack / total;
  const spDefRatio = spDefense / total;
  const spdRatio = speed / total;

  // Physical Sweeper: High attack and speed
  if (atkRatio > 0.18 && spdRatio > 0.18) return 'physical-sweeper';
  
  // Special Sweeper: High special attack and speed
  if (spAtkRatio > 0.18 && spdRatio > 0.18) return 'special-sweeper';
  
  // Physical Tank: High HP and defense
  if (hpRatio > 0.18 && defRatio > 0.18) return 'physical-tank';
  
  // Special Tank: High HP and special defense
  if (hpRatio > 0.18 && spDefRatio > 0.18) return 'special-tank';
  
  // Fast Support: High speed but not sweeper
  if (spdRatio > 0.20) return 'fast-support';
  
  // Balanced: No clear role
  return 'balanced';
}

/**
 * Calculate team synergy score (0-100)
 */
export function calculateSynergyScore(
  teamTypes: { pokemonId: number; types: TypeName[] }[],
  roles: RoleDistribution
): number {
  let score = 0;

  // Type coverage score (0-40 points)
  const coverage = analyzeTypeCoverage(teamTypes);
  const offensiveCoverage = Array.from(coverage.offensive.values()).filter(v => v > 0).length;
  const defensiveCoverage = Array.from(coverage.defensive.values()).filter(v => v > 0).length;
  score += (offensiveCoverage / 18) * 20; // Max 20 points
  score += (defensiveCoverage / 18) * 20; // Max 20 points

  // Weakness distribution score (0-30 points)
  const weaknesses = analyzeWeaknesses(teamTypes);
  const weaknessPenalty = weaknesses.commonWeaknesses.length * 5;
  const resistanceBonus = weaknesses.commonResistances.length * 3;
  const immunityBonus = weaknesses.immunities.length * 2;
  score += Math.max(0, 30 - weaknessPenalty + resistanceBonus + immunityBonus);

  // Role diversity score (0-30 points)
  const roleCount = Object.keys(roles).length;
  score += (roleCount / 6) * 30; // Max 30 points for having all 6 role types

  return Math.min(100, Math.round(score));
}
