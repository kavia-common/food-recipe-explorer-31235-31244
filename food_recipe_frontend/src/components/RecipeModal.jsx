import { useEffect, useRef } from 'react';

// PUBLIC_INTERFACE
export default function RecipeModal({ recipe, onClose, onToggleFavorite, isFavorite }) {
  /** Accessible modal: Esc/backdrop close, focus trapping minimal */
  const ref = useRef(null);

  useEffect(() => {
    const prev = document.activeElement;
    ref.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [onClose]);

  const handleBackdrop = (e) => {
    if (e.target.getAttribute('data-backdrop') === '1') onClose?.();
  };

  return (
    <div
      className="modal-backdrop"
      data-backdrop="1"
      onMouseDown={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-modal-title"
    >
      <div
        className="modal"
        tabIndex={-1}
        ref={ref}
      >
        <div className="modal-header">
          <div id="recipe-modal-title" className="modal-title">{recipe.title}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              onClick={onToggleFavorite}
            >
              {isFavorite ? '★ Favorited' : '☆ Favorite'}
            </button>
            <button className="btn" aria-label="Close details" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
        <div className="modal-body">
          {recipe.image && (
            <img
              src={recipe.image}
              alt=""
              style={{
                width: '100%',
                height: 220,
                objectFit: 'cover',
                borderRadius: 12,
                border: '1px solid var(--border-color)',
              }}
            />
          )}
          <div className="section-title">Ingredients</div>
          <ul>
            {recipe.ingredients?.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>

          <div className="section-title">Steps</div>
          <ol>
            {recipe.steps?.map((s, idx) => (
              <li key={idx} style={{ marginBottom: 6 }}>{s}</li>
            ))}
          </ol>

          {recipe.tags?.length ? (
            <>
              <div className="section-title">Tags</div>
              <div className="recipe-tags">
                {recipe.tags.map((t) => (
                  <span className="tag" key={t}>{t}</span>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
