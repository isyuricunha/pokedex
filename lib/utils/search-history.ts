// Search history management with localStorage

const SEARCH_HISTORY_KEY = 'pokedex-search-history';
const MAX_HISTORY_ITEMS = 5;

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  pokemonId?: number;
}

/**
 * Get search history from localStorage
 */
export function getSearchHistory(): SearchHistoryItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error reading search history:', error);
    return [];
  }
}

/**
 * Add a search to history
 */
export function addToSearchHistory(query: string, pokemonId?: number): void {
  if (typeof window === 'undefined') return;
  if (!query.trim()) return;
  
  try {
    let history = getSearchHistory();
    
    // Remove duplicate if exists
    history = history.filter(item => item.query.toLowerCase() !== query.toLowerCase());
    
    // Add new item at the beginning
    history.unshift({
      query: query.trim(),
      timestamp: Date.now(),
      pokemonId,
    });
    
    // Keep only last MAX_HISTORY_ITEMS items
    history = history.slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving search history:', error);
  }
}

/**
 * Clear all search history
 */
export function clearSearchHistory(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing search history:', error);
  }
}

/**
 * Remove a specific item from search history
 */
export function removeFromSearchHistory(query: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    let history = getSearchHistory();
    history = history.filter(item => item.query.toLowerCase() !== query.toLowerCase());
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error removing from search history:', error);
  }
}
