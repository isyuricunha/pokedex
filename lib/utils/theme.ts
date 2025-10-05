// Theme management using localStorage

const THEME_KEY = 'pokedex_theme';

export type Theme = 'dark' | 'light';

/**
 * Get current theme from localStorage
 */
export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return (stored as Theme) || 'dark';
  } catch (error) {
    console.error('Error reading theme:', error);
    return 'dark';
  }
}

/**
 * Set theme in localStorage and apply to document
 */
export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  } catch (error) {
    console.error('Error setting theme:', error);
  }
}

/**
 * Toggle between dark and light theme
 */
export function toggleTheme(): Theme {
  const current = getTheme();
  const newTheme = current === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  return newTheme;
}

/**
 * Apply theme to document root
 */
export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  document.documentElement.setAttribute('data-theme', theme);
}
