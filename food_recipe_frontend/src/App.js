import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './routes/Home';
import Favorites from './routes/Favorites';
import Profile from './routes/Profile';
import BottomNav from './components/BottomNav';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState(() => {
    // persist theme between sessions
    const saved = localStorage.getItem('theme');
    return saved || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App ocean-app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" aria-hidden="true"></span>
          Food Recipe Explorer
        </div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>

      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile onToggleTheme={toggleTheme} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <BottomNav />
    </div>
  );
}

export default App;
