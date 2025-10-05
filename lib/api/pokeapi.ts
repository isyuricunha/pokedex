// PokeAPI Integration Functions

import {
  Pokemon,
  PokemonSpecies,
  EvolutionChain,
  PokemonListResponse,
} from '@/lib/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

// Cache configuration for Next.js
const CACHE_CONFIG = {
  next: { revalidate: 86400 }, // 1 day
};

/**
 * Fetch a list of Pokemon with pagination
 * @param limit - Number of Pokemon to fetch
 * @param offset - Offset for pagination
 */
export async function getPokemonList(
  limit: number = 20,
  offset: number = 0
): Promise<PokemonListResponse> {
  const response = await fetch(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
    CACHE_CONFIG
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon list: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a Pokemon by ID or name
 * @param idOrName - Pokemon ID or name
 */
export async function getPokemon(idOrName: string | number): Promise<Pokemon> {
  const response = await fetch(
    `${BASE_URL}/pokemon/${idOrName}`,
    CACHE_CONFIG
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch Pokemon species data (for evolution chain and flavor text)
 * @param idOrName - Pokemon species ID or name
 */
export async function getPokemonSpecies(
  idOrName: string | number
): Promise<PokemonSpecies> {
  const response = await fetch(
    `${BASE_URL}/pokemon-species/${idOrName}`,
    CACHE_CONFIG
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon species: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch evolution chain data
 * @param id - Evolution chain ID
 */
export async function getEvolutionChain(id: number): Promise<EvolutionChain> {
  const res = await fetch(`${BASE_URL}/evolution-chain/${id}`, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch evolution chain');
  }

  return res.json();
}

/**
 * Get all Pokemon (limited to first 1025)
 */
export async function getAllPokemon(): Promise<Pokemon[]> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=1025`, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch all Pokemon');
  }

  const data: PokemonListResponse = await res.json();
  
  // Fetch detailed data for all Pokemon in parallel
  const pokemonPromises = data.results.map(p => {
    const id = parseInt(p.url.split('/').slice(-2, -1)[0]);
    return getPokemon(id.toString());
  });

  return Promise.all(pokemonPromises);
}

/**
 * Fetch multiple Pokemon by their IDs
 * @param ids - Array of Pokemon IDs
 */
export async function getMultiplePokemon(
  ids: number[]
): Promise<Pokemon[]> {
  const promises = ids.map((id) => getPokemon(id));
  return Promise.all(promises);
}

/**
 * Search Pokemon by name (client-side helper)
 * @param query - Search query
 * @param allPokemon - Array of all Pokemon names
 */
export function searchPokemon(
  query: string,
  allPokemon: { name: string; url: string }[]
): { name: string; url: string }[] {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) {
    return [];
  }

  return allPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(normalizedQuery)
  );
}

/**
 * Extract Pokemon ID from PokeAPI URL
 * @param url - PokeAPI URL (works with /pokemon/ and /pokemon-species/ URLs)
 */
export function extractPokemonId(url: string): number {
  // Match both /pokemon/{id}/ and /pokemon-species/{id}/
  const matches = url.match(/\/pokemon(?:-species)?\/(\d+)\//)
  return matches ? parseInt(matches[1], 10) : 0;
}

/**
 * Get Pokemon official artwork URL
 * @param id - Pokemon ID
 */
export function getPokemonArtwork(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/**
 * Get Pokemon sprite URL
 * @param id - Pokemon ID
 * @param shiny - Whether to get shiny sprite
 */
export function getPokemonSprite(id: number, shiny: boolean = false): string {
  const variant = shiny ? 'shiny' : 'default';
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${variant}/${id}.png`;
}

/**
 * Format Pokemon name (capitalize first letter)
 * @param name - Pokemon name
 */
export function formatPokemonName(name: string): string {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format Pokemon ID with leading zeros
 * @param id - Pokemon ID
 */
export function formatPokemonId(id: number): string {
  return `#${id.toString().padStart(3, '0')}`;
}
