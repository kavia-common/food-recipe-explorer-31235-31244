import { NavLink, useLocation } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function BottomNav() {
  /** Bottom navigation bar for primary routes */
  const { pathname } = useLocation();

  const tabs = [
    { to: '/', label: 'Home', aria: 'Go to Home' },
    { to: '/favorites', label: 'Favorites', aria: 'Go to Favorites' },
    { to: '/profile', label: 'Profile', aria: 'Go to Profile' },
  ];

  return (
    <nav className="bottom-nav" aria-label="Primary">
      {tabs.map((t) => (
        <NavLink key={t.to} to={t.to} className="nav-btn" aria-label={t.aria}>
          <span className={pathname === t.to ? 'active' : ''}>
            {t.label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
}
