/**
 * useApi Hook
 * Custom hook for API calls with loading, error, and data states
 * 
 * Usage:
 * const { data, loading, error } = useApi(() => apiService.getData());
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for API calls
 * @param {function} apiFunction - Async function to call
 * @param {array} dependencies - Dependencies array for useEffect
 * @param {boolean} immediate - Whether to call immediately
 * @returns {object} { data, loading, error, refetch }
 */
export const useApi = (
  apiFunction,
  dependencies = [],
  immediate = true
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction();
      setData(response);
    } catch (err) {
      setError(err.message || 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    if (immediate) {
      fetch();
    }
  }, [fetch, immediate, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch: fetch,
  };
};

export default useApi;
