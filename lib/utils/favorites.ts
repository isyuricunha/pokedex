// Favorites management using localStorage

const FAVORITES_KEY = 'pokedex_favorites';

/**
 * Get all favorite Pokemon IDs from localStorage
 */
export function getFavorites(): number[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading favorites:', error);
    return [];
  }
}

/**
 * Add a Pokemon to favorites
 */
export function addFavorite(pokemonId: number): void {
  if (typeof window === 'undefined') return;
  
  try {
    const favorites = getFavorites();
    if (!favorites.includes(pokemonId)) {
      favorites.push(pokemonId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
  }
}

/**
 * Remove a Pokemon from favorites
 */
export function removeFavorite(pokemonId: number): void {
  if (typeof window === 'undefined') return;
  
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter(id => id !== pokemonId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
}

/**
 * Toggle favorite status for a Pokemon
 */
export function toggleFavorite(pokemonId: number): boolean {
  const favorites = getFavorites();
  const isFavorite = favorites.includes(pokemonId);
  
  if (isFavorite) {
    removeFavorite(pokemonId);
  } else {
    addFavorite(pokemonId);
  }
  
  return !isFavorite;
}

/**
 * Check if a Pokemon is favorited
 */
export function isFavorite(pokemonId: number): boolean {
  const favorites = getFavorites();
  return favorites.includes(pokemonId);
}
