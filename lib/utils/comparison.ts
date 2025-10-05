// Comparison management using localStorage

const COMPARISON_KEY = 'pokedex_comparison';

/**
 * Get selected Pokemon IDs for comparison
 */
export function getComparisonSelection(): number[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(COMPARISON_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading comparison selection:', error);
    return [];
  }
}

/**
 * Set Pokemon IDs for comparison (max 2)
 */
export function setComparisonSelection(pokemonIds: number[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Limit to 2 Pokemon
    const limited = pokemonIds.slice(0, 2);
    localStorage.setItem(COMPARISON_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Error setting comparison selection:', error);
  }
}

/**
 * Add Pokemon to comparison (max 2)
 */
export function addToComparison(pokemonId: number): boolean {
  const current = getComparisonSelection();
  
  // Don't add if already in comparison
  if (current.includes(pokemonId)) {
    return false;
  }
  
  // Don't add if already at max (2)
  if (current.length >= 2) {
    return false;
  }
  
  current.push(pokemonId);
  setComparisonSelection(current);
  return true;
}

/**
 * Remove Pokemon from comparison
 */
export function removeFromComparison(pokemonId: number): void {
  const current = getComparisonSelection();
  const filtered = current.filter(id => id !== pokemonId);
  setComparisonSelection(filtered);
}

/**
 * Clear all comparison selections
 */
export function clearComparison(): void {
  setComparisonSelection([]);
}

/**
 * Check if Pokemon is in comparison
 */
export function isInComparison(pokemonId: number): boolean {
  const current = getComparisonSelection();
  return current.includes(pokemonId);
}

/**
 * Check if comparison is full (2 Pokemon)
 */
export function isComparisonFull(): boolean {
  const current = getComparisonSelection();
  return current.length >= 2;
}

/**
 * Get number of Pokemon in comparison
 */
export function getComparisonCount(): number {
  const current = getComparisonSelection();
  return current.length;
}
