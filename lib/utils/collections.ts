// Collections and progress tracking with localStorage

const VIEWED_POKEMON_KEY = 'pokedex-viewed';
const ACHIEVEMENTS_KEY = 'pokedex-achievements';

export interface CollectionStats {
  totalViewed: number;
  completionPercentage: number;
  generationProgress: Record<number, { viewed: number; total: number }>;
  typeProgress: Record<string, number>;
  legendaryCount: number;
  mythicalCount: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

const TOTAL_POKEMON = 1025;

const GENERATION_RANGES: Record<number, [number, number]> = {
  1: [1, 151],
  2: [152, 251],
  3: [252, 386],
  4: [387, 493],
  5: [494, 649],
  6: [650, 721],
  7: [722, 809],
  8: [810, 905],
  9: [906, 1025],
};

const ACHIEVEMENTS_LIST: Achievement[] = [
  { id: 'starter', name: 'Getting Started', description: 'View your first Pokémon', icon: '🎯' },
  { id: 'explorer', name: 'Explorer', description: 'View 50 different Pokémon', icon: '🔍' },
  { id: 'collector', name: 'Collector', description: 'View 100 different Pokémon', icon: '📚' },
  { id: 'master', name: 'Pokémon Master', description: 'View 500 different Pokémon', icon: '👑' },
  { id: 'completionist', name: 'Completionist', description: 'View all 1025 Pokémon', icon: '🏆' },
  { id: 'gen1_complete', name: 'Kanto Champion', description: 'View all Gen I Pokémon', icon: '🔴' },
  { id: 'gen2_complete', name: 'Johto Champion', description: 'View all Gen II Pokémon', icon: '🟡' },
  { id: 'legendary_hunter', name: 'Legendary Hunter', description: 'View 10 legendary Pokémon', icon: '⚡' },
  { id: 'team_builder', name: 'Team Builder', description: 'Create your first team', icon: '👥' },
  { id: 'comparison_expert', name: 'Comparison Expert', description: 'Compare 5 different Pokémon', icon: '⚖️' },
];

/**
 * Get set of viewed Pokemon IDs
 */
export function getViewedPokemon(): Set<number> {
  if (typeof window === 'undefined') return new Set();
  
  try {
    const viewed = localStorage.getItem(VIEWED_POKEMON_KEY);
    return viewed ? new Set(JSON.parse(viewed)) : new Set();
  } catch (error) {
    console.error('Error reading viewed Pokemon:', error);
    return new Set();
  }
}

/**
 * Mark a Pokemon as viewed
 */
export function markPokemonAsViewed(pokemonId: number): void {
  if (typeof window === 'undefined') return;
  
  const viewed = getViewedPokemon();
  const wasNew = !viewed.has(pokemonId);
  
  viewed.add(pokemonId);
  
  try {
    localStorage.setItem(VIEWED_POKEMON_KEY, JSON.stringify(Array.from(viewed)));
    
    if (wasNew) {
      checkAndUnlockAchievements(viewed);
      window.dispatchEvent(new CustomEvent('pokemon-viewed', { detail: { pokemonId } }));
    }
  } catch (error) {
    console.error('Error marking Pokemon as viewed:', error);
  }
}

/**
 * Get collection statistics
 */
export function getCollectionStats(): CollectionStats {
  const viewed = getViewedPokemon();
  const totalViewed = viewed.size;
  const completionPercentage = Math.round((totalViewed / TOTAL_POKEMON) * 100);

  // Generation progress
  const generationProgress: Record<number, { viewed: number; total: number }> = {};
  Object.entries(GENERATION_RANGES).forEach(([gen, [start, end]]) => {
    const genNum = parseInt(gen);
    const total = end - start + 1;
    const viewedInGen = Array.from(viewed).filter(id => id >= start && id <= end).length;
    generationProgress[genNum] = { viewed: viewedInGen, total };
  });

  // Type progress (placeholder - would need Pokemon data to calculate)
  const typeProgress: Record<string, number> = {};

  return {
    totalViewed,
    completionPercentage,
    generationProgress,
    typeProgress,
    legendaryCount: 0, // Would need species data
    mythicalCount: 0, // Would need species data
  };
}

/**
 * Get unlocked achievements
 */
export function getUnlockedAchievements(): Achievement[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const unlocked = localStorage.getItem(ACHIEVEMENTS_KEY);
    return unlocked ? JSON.parse(unlocked) : [];
  } catch (error) {
    console.error('Error reading achievements:', error);
    return [];
  }
}

/**
 * Get all achievements with unlock status
 */
export function getAllAchievements(): Achievement[] {
  const unlocked = getUnlockedAchievements();
  const unlockedIds = new Set(unlocked.map(a => a.id));
  
  return ACHIEVEMENTS_LIST.map(achievement => {
    const unlockedAchievement = unlocked.find(a => a.id === achievement.id);
    return unlockedAchievement || achievement;
  });
}

/**
 * Unlock an achievement
 */
function unlockAchievement(achievementId: string): void {
  if (typeof window === 'undefined') return;
  
  const unlocked = getUnlockedAchievements();
  const alreadyUnlocked = unlocked.some(a => a.id === achievementId);
  
  if (alreadyUnlocked) return;
  
  const achievement = ACHIEVEMENTS_LIST.find(a => a.id === achievementId);
  if (!achievement) return;
  
  const unlockedAchievement = {
    ...achievement,
    unlockedAt: Date.now(),
  };
  
  unlocked.push(unlockedAchievement);
  
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unlocked));
    window.dispatchEvent(new CustomEvent('achievement-unlocked', { detail: unlockedAchievement }));
  } catch (error) {
    console.error('Error unlocking achievement:', error);
  }
}

/**
 * Check and unlock achievements based on viewed Pokemon
 */
function checkAndUnlockAchievements(viewed: Set<number>): void {
  const count = viewed.size;

  // View count achievements
  if (count >= 1) unlockAchievement('starter');
  if (count >= 50) unlockAchievement('explorer');
  if (count >= 100) unlockAchievement('collector');
  if (count >= 500) unlockAchievement('master');
  if (count >= 1025) unlockAchievement('completionist');

  // Generation completion
  Object.entries(GENERATION_RANGES).forEach(([gen, [start, end]]) => {
    const genNum = parseInt(gen);
    const viewedInGen = Array.from(viewed).filter(id => id >= start && id <= end).length;
    const total = end - start + 1;
    
    if (viewedInGen === total) {
      if (genNum === 1) unlockAchievement('gen1_complete');
      if (genNum === 2) unlockAchievement('gen2_complete');
    }
  });
}

/**
 * Export progress as JSON
 */
export function exportProgress(): string {
  const viewed = Array.from(getViewedPokemon());
  const achievements = getUnlockedAchievements();
  const stats = getCollectionStats();
  
  return JSON.stringify({
    viewed,
    achievements,
    stats,
    exportedAt: new Date().toISOString(),
  }, null, 2);
}

/**
 * Import progress from JSON
 */
export function importProgress(json: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const data = JSON.parse(json);
    
    if (data.viewed && Array.isArray(data.viewed)) {
      localStorage.setItem(VIEWED_POKEMON_KEY, JSON.stringify(data.viewed));
    }
    
    if (data.achievements && Array.isArray(data.achievements)) {
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(data.achievements));
    }
    
    window.dispatchEvent(new Event('progress-imported'));
    return true;
  } catch (error) {
    console.error('Error importing progress:', error);
    return false;
  }
}
