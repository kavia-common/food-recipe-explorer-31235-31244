import useFavorites from '../hooks/useFavorites';

// PUBLIC_INTERFACE
export default function Profile({ onToggleTheme }) {
  /** Simple profile placeholder with saved count and theme toggle duplication */
  const { favorites } = useFavorites();

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
        <div
          aria-hidden="true"
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background:
              'linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 30%, transparent))',
            boxShadow: 'var(--shadow-md)',
          }}
        />
        <div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>Guest</div>
          <div className="helper-text">Welcome back! Explore tasty ideas.</div>
        </div>
      </div>

      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 12,
          padding: 16,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Your Stats</div>
        <div>Saved recipes: {favorites.length}</div>
      </div>

      {onToggleTheme && (
        <div style={{ marginTop: 16 }}>
          <button className="btn" aria-label="Toggle theme" onClick={onToggleTheme}>
            Toggle Theme
          </button>
        </div>
      )}
    </div>
  );
}
