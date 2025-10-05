// Pokémon of the Day - deterministic based on date

const TOTAL_POKEMON = 1025;

/**
 * Get Pokémon of the Day based on current date
 * Uses date as seed for deterministic selection
 */
export function getPokemonOfTheDay(): number {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  
  // Create a deterministic seed from date
  const seed = year * 10000 + month * 100 + day;
  
  // Simple hash function to get a number between 1 and TOTAL_POKEMON
  const hash = (seed * 9301 + 49297) % 233280;
  const pokemonId = (hash % TOTAL_POKEMON) + 1;
  
  return pokemonId;
}

/**
 * Format date for display
 */
export function getTodayFormatted(): string {
  const today = new Date();
  return today.toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
