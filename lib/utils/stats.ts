// Stats analysis utilities

import { Pokemon } from '@/lib/types/pokemon';

export interface BST {
  pokemonId: number;
  name: string;
  total: number;
}

export interface TypeDistribution {
  type: string;
  count: number;
  percentage: number;
}

/**
 * Calculate Base Stat Total (BST)
 */
export function calculateBST(pokemon: Pokemon): number {
  return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
}

/**
 * Get stat value by name
 */
export function getStatValue(pokemon: Pokemon, statName: string): number {
  const stat = pokemon.stats.find(s => s.stat.name === statName);
  return stat?.base_stat || 0;
}

/**
 * Sort Pokemon by BST (descending)
 */
export function sortByBST(pokemonList: Pokemon[]): BST[] {
  return pokemonList
    .map(p => ({
      pokemonId: p.id,
      name: p.name,
      total: calculateBST(p),
    }))
    .sort((a, b) => b.total - a.total);
}

/**
 * Get top N Pokemon by BST
 */
export function getTopByBST(pokemonList: Pokemon[], limit: number = 10): BST[] {
  return sortByBST(pokemonList).slice(0, limit);
}

/**
 * Get bottom N Pokemon by BST
 */
export function getBottomByBST(pokemonList: Pokemon[], limit: number = 10): BST[] {
  return sortByBST(pokemonList).slice(-limit).reverse();
}

/**
 * Calculate type distribution
 */
export function calculateTypeDistribution(pokemonList: Pokemon[]): TypeDistribution[] {
  const typeCounts = new Map<string, number>();
  
  pokemonList.forEach(pokemon => {
    pokemon.types.forEach(t => {
      const type = t.type.name;
      typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
    });
  });

  const total = Array.from(typeCounts.values()).reduce((sum, count) => sum + count, 0);

  return Array.from(typeCounts.entries())
    .map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get most common type combinations
 */
export function getMostCommonTypeCombos(pokemonList: Pokemon[], limit: number = 10): { combo: string; count: number }[] {
  const comboCounts = new Map<string, number>();

  pokemonList.forEach(pokemon => {
    const types = pokemon.types
      .sort((a, b) => a.slot - b.slot)
      .map(t => t.type.name)
      .join('/');
    
    comboCounts.set(types, (comboCounts.get(types) || 0) + 1);
  });

  return Array.from(comboCounts.entries())
    .map(([combo, count]) => ({ combo, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Filter Pokemon by BST range
 */
export function filterByBSTRange(pokemonList: Pokemon[], min: number, max: number): Pokemon[] {
  return pokemonList.filter(p => {
    const bst = calculateBST(p);
    return bst >= min && bst <= max;
  });
}

/**
 * Filter Pokemon by height range (in decimeters)
 */
export function filterByHeightRange(pokemonList: Pokemon[], min: number, max: number): Pokemon[] {
  return pokemonList.filter(p => p.height >= min && p.height <= max);
}

/**
 * Filter Pokemon by weight range (in hectograms)
 */
export function filterByWeightRange(pokemonList: Pokemon[], min: number, max: number): Pokemon[] {
  return pokemonList.filter(p => p.weight >= min && p.weight <= max);
}

/**
 * Filter Pokemon by multiple types (AND logic)
 */
export function filterByMultipleTypes(pokemonList: Pokemon[], types: string[]): Pokemon[] {
  if (types.length === 0) return pokemonList;
  
  return pokemonList.filter(pokemon => {
    const pokemonTypes = pokemon.types.map(t => t.type.name as string);
    return types.every(type => pokemonTypes.includes(type));
  });
}

/**
 * Filter Pokemon by ability
 */
export function filterByAbility(pokemonList: Pokemon[], abilityName: string): Pokemon[] {
  return pokemonList.filter(pokemon =>
    pokemon.abilities.some(a => a.ability.name === abilityName)
  );
}
