import { useEffect, useState } from 'react';
import { searchRecipes } from '../services/mockRecipes';

// PUBLIC_INTERFACE
export default function useRecipes() {
  /** Manage search query, loading state, and results using mock service */
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    searchRecipes(query).then((r) => {
      if (!alive) return;
      setResults(r);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [query]);

  return { query, setQuery, results, loading };
}
