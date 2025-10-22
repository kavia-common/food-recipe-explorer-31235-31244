import React from 'react';

// PUBLIC_INTERFACE
export default function RecipeCard({ recipe, onOpen, isFavorite }) {
  /** Card for recipe preview */
  return (
    <button
      className="recipe-card"
      onClick={() => onOpen?.(recipe)}
      aria-label={`Open ${recipe.title}`}
    >
      <div
        className="recipe-thumb"
        style={{ backgroundImage: `url(${recipe.image || ''})` }}
        aria-hidden="true"
      />
      <div className="recipe-content">
        <div className="recipe-title">
          {recipe.title} {isFavorite?.(recipe.id) ? '★' : ''}
        </div>
        <div className="recipe-tags">
          {recipe.tags?.slice(0, 3).map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </div>
    </button>
  );
}
