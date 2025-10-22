const KEY = 'favorites';

// PUBLIC_INTERFACE
export function getFavorites() {
  /** Get favorite recipe IDs from localStorage */
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export function setFavorites(ids) {
  /** Set favorite recipe IDs to localStorage */
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // ignore storage errors in restricted environments
  }
}

// PUBLIC_INTERFACE
export function isFavorite(id) {
  /** Check if a recipe is favorited */
  return getFavorites().includes(id);
}

// PUBLIC_INTERFACE
export function toggleFavorite(id) {
  /** Toggle favorite state for recipe id */
  const curr = getFavorites();
  const next = curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id];
  setFavorites(next);
  return next;
}
