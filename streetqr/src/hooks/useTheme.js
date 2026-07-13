import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing theme (light/dark mode)
 * Persists to localStorage and syncs with document class
 */
const useTheme = (storageKey = 'qzaar-theme') => {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(storageKey) || 'light';
    } catch {
      return 'light';
    }
  });

  // Sync theme with document and localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      console.error('Failed to persist theme');
    }
  }, [theme, storageKey]);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Set specific theme
  const setThemeValue = useCallback((newTheme) => {
    if (['light', 'dark'].includes(newTheme)) {
      setTheme(newTheme);
    }
  }, []);

  return {
    theme,
    toggleTheme,
    setTheme: setThemeValue,
    isDark: theme === 'dark',
  };
};

export default useTheme;
