import { useState } from 'react';
import SearchBar from '../components/SearchBar.jsx';
import RecipeGrid from '../components/RecipeGrid.jsx';
import RecipeModal from '../components/RecipeModal.jsx';
import useRecipes from '../hooks/useRecipes';
import useFavorites from '../hooks/useFavorites';

// PUBLIC_INTERFACE
export default function Home() {
  /** Home screen: search and browse recipes */
  const { query, setQuery, results, loading } = useRecipes();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [active, setActive] = useState(null);

  return (
    <div>
      <SearchBar value={query} onChange={setQuery} loading={loading} />

      <RecipeGrid
        recipes={results}
        onOpen={(r) => setActive(r)}
        isFavorite={isFavorite}
      />

      {active && (
        <RecipeModal
          recipe={active}
          onClose={() => setActive(null)}
          onToggleFavorite={() => toggleFavorite(active.id)}
          isFavorite={isFavorite(active.id)}
        />
      )}

      {!loading && results.length === 0 && (
        <p className="helper-text">No recipes found. Try a different search.</p>
      )}

      <p className="helper-text">Saved recipes: {favorites.length}</p>
    </div>
  );
}
