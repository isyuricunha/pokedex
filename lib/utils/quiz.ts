// Quiz utilities and localStorage management

export interface QuizScore {
  mode: 'silhouette' | 'stats' | 'type';
  score: number;
  totalQuestions: number;
  date: number;
}

export interface QuizStreak {
  current: number;
  best: number;
}

const QUIZ_SCORES_KEY = 'pokedex_quiz_scores';
const QUIZ_STREAK_KEY = 'pokedex_quiz_streak';

/**
 * Get all quiz scores from localStorage
 */
export function getQuizScores(): QuizScore[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(QUIZ_SCORES_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Save quiz score
 */
export function saveQuizScore(score: QuizScore): void {
  const scores = getQuizScores();
  scores.push(score);
  // Keep only last 50 scores
  const recentScores = scores.slice(-50);
  localStorage.setItem(QUIZ_SCORES_KEY, JSON.stringify(recentScores));
}

/**
 * Get high scores by mode
 */
export function getHighScores(mode: QuizScore['mode'], limit: number = 10): QuizScore[] {
  const scores = getQuizScores();
  return scores
    .filter(s => s.mode === mode)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get quiz streak
 */
export function getQuizStreak(): QuizStreak {
  if (typeof window === 'undefined') return { current: 0, best: 0 };
  const data = localStorage.getItem(QUIZ_STREAK_KEY);
  return data ? JSON.parse(data) : { current: 0, best: 0 };
}

/**
 * Update quiz streak
 */
export function updateQuizStreak(correct: boolean): QuizStreak {
  const streak = getQuizStreak();
  
  if (correct) {
    streak.current += 1;
    if (streak.current > streak.best) {
      streak.best = streak.current;
    }
  } else {
    streak.current = 0;
  }

  localStorage.setItem(QUIZ_STREAK_KEY, JSON.stringify(streak));
  return streak;
}

/**
 * Generate random Pokemon ID
 */
export function getRandomPokemonId(max: number = 1025): number {
  return Math.floor(Math.random() * max) + 1;
}

/**
 * Generate wrong answers for multiple choice
 */
export function generateWrongAnswers(correctId: number, count: number = 3, max: number = 1025): number[] {
  const wrong: Set<number> = new Set();
  
  while (wrong.size < count) {
    const id = getRandomPokemonId(max);
    if (id !== correctId) {
      wrong.add(id);
    }
  }
  
  return Array.from(wrong);
}

/**
 * Shuffle array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
