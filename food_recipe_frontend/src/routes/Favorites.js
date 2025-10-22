import { useMemo, useState } from 'react';
import useFavorites from '../hooks/useFavorites';
import { allRecipes } from '../services/mockRecipes';
import RecipeGrid from '../components/RecipeGrid.jsx';
import RecipeModal from '../components/RecipeModal.jsx';

// PUBLIC_INTERFACE
export default function Favorites() {
  /** Favorites screen: shows saved recipes and allows unfavorite */
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [active, setActive] = useState(null);

  const favRecipes = useMemo(
    () => allRecipes().filter(r => favorites.includes(r.id)),
    [favorites]
  );

  return (
    <div>
      <h2 className="section-title">Favorites</h2>
      <RecipeGrid
        recipes={favRecipes}
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
      {favRecipes.length === 0 && (
        <p className="helper-text">No favorites yet. Tap the heart on a recipe to save it.</p>
      )}
    </div>
  );
}
