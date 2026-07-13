import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for managing favorites/wishlist
 * Persists to localStorage
 */
const useFavorites = (storageKey = 'qzaar:favorites') => {
  const [favorites, setFavorites] = useState(new Set());

  // Initialize from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setFavorites(new Set(JSON.parse(stored)));
      }
    } catch {
      console.error('Failed to load favorites');
    }
  }, [storageKey]);

  // Persist to localStorage
  const persist = useCallback((newFavorites) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(newFavorites)));
    } catch {
      console.error('Failed to persist favorites');
    }
  }, [storageKey]);

  // Add to favorites
  const addFavorite = useCallback((itemId) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.add(itemId);
      persist(next);
      return next;
    });
  }, [persist]);

  // Remove from favorites
  const removeFavorite = useCallback((itemId) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.delete(itemId);
      persist(next);
      return next;
    });
  }, [persist]);

  // Toggle favorite status
  const toggleFavorite = useCallback((itemId) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      persist(next);
      return next;
    });
  }, [persist]);

  // Check if item is favorited
  const isFavorite = useCallback((itemId) => {
    return favorites.has(itemId);
  }, [favorites]);

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    setFavorites(new Set());
    persist(new Set());
  }, [persist]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    count: favorites.size,
  };
};

export default useFavorites;
