// User preferences management with localStorage

const PREFERENCES_KEY = 'pokedex-preferences';

export type ViewMode = 'grid' | 'list';
export type SpriteType = 'official' | 'pixel' | '3d';
export type CardSize = 'small' | 'medium' | 'large';

export interface UserPreferences {
  viewMode: ViewMode;
  spriteType: SpriteType;
  cardSize: CardSize;
  showPokedexNumbers: boolean;
  animationsEnabled: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  viewMode: 'grid',
  spriteType: 'official',
  cardSize: 'medium',
  showPokedexNumbers: true,
  animationsEnabled: true,
};

/**
 * Get user preferences
 */
export function getPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  
  try {
    const prefs = localStorage.getItem(PREFERENCES_KEY);
    return prefs ? { ...DEFAULT_PREFERENCES, ...JSON.parse(prefs) } : DEFAULT_PREFERENCES;
  } catch (error) {
    console.error('Error reading preferences:', error);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Save user preferences
 */
export function savePreferences(preferences: Partial<UserPreferences>): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  
  const current = getPreferences();
  const updated = { ...current, ...preferences };
  
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('preferences-updated'));
    return updated;
  } catch (error) {
    console.error('Error saving preferences:', error);
    return current;
  }
}

/**
 * Reset preferences to default
 */
export function resetPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  
  try {
    localStorage.removeItem(PREFERENCES_KEY);
    window.dispatchEvent(new Event('preferences-updated'));
    return DEFAULT_PREFERENCES;
  } catch (error) {
    console.error('Error resetting preferences:', error);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Get sprite URL based on preference
 */
export function getPokemonSpriteByPreference(pokemonId: number, spriteType: SpriteType): string {
  const baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
  
  switch (spriteType) {
    case 'official':
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
    case 'pixel':
      return `${baseUrl}/${pokemonId}.png`;
    case '3d':
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonId}.png`;
    default:
      return `${baseUrl}/other/official-artwork/${pokemonId}.png`;
  }
}
