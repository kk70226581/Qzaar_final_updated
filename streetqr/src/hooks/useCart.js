import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for managing shopping cart state
 * Handles item addition, removal, quantity updates
 */
const useCart = (storageKey = 'qzaar:cart') => {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever items change
  const persistItems = useCallback((newItems) => {
    setItems(newItems);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newItems));
    } catch {
      console.error('Failed to persist cart to localStorage');
    }
  }, [storageKey]);

  // Add or update item in cart
  const addItem = useCallback((item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      let updated;

      if (existing) {
        updated = prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: Math.max(0, i.quantity + quantity) }
            : i
        );
      } else {
        updated = [...prev, { ...item, quantity: Math.max(1, quantity) }];
      }

      // Remove items with 0 quantity
      updated = updated.filter((i) => i.quantity > 0);
      persistItems(updated);
      return updated;
    });
  }, [persistItems]);

  // Remove item from cart
  const removeItem = useCallback((itemId) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== itemId);
      persistItems(updated);
      return updated;
    });
  }, [persistItems]);

  // Update item quantity
  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
    } else {
      setItems((prev) => {
        const updated = prev.map((i) =>
          i.id === itemId ? { ...i, quantity } : i
        );
        persistItems(updated);
        return updated;
      });
    }
  }, [removeItem, persistItems]);

  // Clear entire cart
  const clearCart = useCallback(() => {
    persistItems([]);
  }, [persistItems]);

  // Get item from cart
  const getItem = useCallback((itemId) => {
    return items.find((i) => i.id === itemId);
  }, [items]);

  // Calculate total price
  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
  }, [items]);

  // Calculate item count
  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }, [items]);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItem,
    total,
    itemCount,
    isEmpty: items.length === 0,
  };
};

export default useCart;
