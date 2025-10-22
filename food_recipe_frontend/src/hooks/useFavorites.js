import { useEffect, useState, useCallback } from 'react';
import { getFavorites, toggleFavorite as svcToggle, setFavorites as svcSet } from '../services/favoritesService';

// PUBLIC_INTERFACE
export default function useFavorites() {
  /** Manage favorites state synced with localStorage */
  const [favorites, setFavorites] = useState(() => getFavorites());

  // sync from storage events (multi-tab safety)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'favorites') {
        try {
          setFavorites(JSON.parse(e.newValue) || []);
        } catch {
          setFavorites([]);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleFavorite = useCallback((id) => {
    const next = svcToggle(id);
    setFavorites(next);
  }, []);

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);

  const setAll = useCallback((ids) => {
    svcSet(ids);
    setFavorites(ids);
  }, []);

  return { favorites, toggleFavorite, isFavorite, setFavorites: setAll };
}
