import RecipeCard from './RecipeCard.jsx';

// PUBLIC_INTERFACE
export default function RecipeGrid({ recipes, onOpen, isFavorite }) {
  /** Grid layout of recipe cards */
  return (
    <div className="recipe-grid" role="list">
      {recipes.map((r) => (
        <div role="listitem" key={r.id}>
          <RecipeCard recipe={r} onOpen={onOpen} isFavorite={isFavorite} />
        </div>
      ))}
    </div>
  );
}
