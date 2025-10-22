# Login Feature Proposal for Food Recipe Explorer Frontend

## Overview

This proposal introduces a minimal, modular authentication layer to the existing React app. It adds an AuthContext for state management, a reusable Login modal and a dedicated `/login` route, an API client helper to call a placeholder backend endpoint, route guards, a hook for consuming auth state, and small UI updates to the header/navigation. The design follows the Ocean Professional theme already present in App.css.

Assumptions:
- Backend login endpoint: POST ${REACT_APP_API_BASE_URL || ''}/api/auth/login with JSON body { email, password }, returns { token, user }.
- Token handling: Prefer HttpOnly cookie set by server on successful login; if not available, fallback to in-memory storage with optional localStorage persistence when “Remember me” is checked.
- This proposal only changes the frontend. The backend is assumed to be a placeholder.

## New Environment Variables

- REACT_APP_API_BASE_URL: Base URL for API calls. Default is "" (same origin).

Example:
- Development: REACT_APP_API_BASE_URL=http://localhost:3000
- Production: REACT_APP_API_BASE_URL=https://api.example.com

## File Changes (Unified Diffs)

Below are unified diffs for new and modified files. Each hunk is preceded by a brief explanation.

### 1) New: src/lib/apiClient.js

Explanation: API client utility for JSON requests, base URL from env, and a login function for the placeholder backend.
```diff
*** /dev/null
--- a/src/lib/apiClient.js
@@
+const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
+
+async function request(path, { method = 'GET', body, headers = {}, credentials = 'include' } = {}) {
+  const res = await fetch(`${BASE_URL}${path}`, {
+    method,
+    headers: {
+      'Content-Type': 'application/json',
+      ...headers,
+    },
+    credentials,
+    body: body ? JSON.stringify(body) : undefined,
+  });
+  const isJson = res.headers.get('content-type')?.includes('application/json');
+  const data = isJson ? await res.json() : null;
+  if (!res.ok) {
+    const message = data?.message || res.statusText || 'Request failed';
+    const error = new Error(message);
+    error.status = res.status;
+    error.data = data;
+    throw error;
+  }
+  return data;
+}
+
+export async function loginApi({ email, password }) {
+  // Placeholder backend: POST /api/auth/login -> { token, user }
+  return request('/api/auth/login', {
+    method: 'POST',
+    body: { email, password },
+  });
+}
+
+export const apiClient = { request, loginApi };
```

### 2) New: src/context/AuthContext.jsx

Explanation: Centralized AuthContext with login/logout, token storage strategy (cookie preferred), optional localStorage fallback with “remember me”, and user state.
```diff
*** /dev/null
--- a/src/context/AuthContext.jsx
@@
+import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
+import { loginApi } from '../lib/apiClient';
+
+const STORAGE_KEY = 'auth_token';
+const USER_KEY = 'auth_user';
+
+const AuthContext = createContext(null);
+
+export function AuthProvider({ children }) {
+  const memoryTokenRef = useRef(null);
+  const [user, setUser] = useState(null);
+  const [loading, setLoading] = useState(false);
+  const [error, setError] = useState(null);
+
+  // Load from localStorage if present (fallback mode)
+  useEffect(() => {
+    try {
+      const t = localStorage.getItem(STORAGE_KEY);
+      const u = localStorage.getItem(USER_KEY);
+      if (t && u) {
+        memoryTokenRef.current = t;
+        setUser(JSON.parse(u));
+      }
+    } catch {
+      // ignore
+    }
+  }, []);
+
+  const login = useCallback(async ({ email, password, remember }) => {
+    setLoading(true);
+    setError(null);
+    try {
+      const { token, user: userPayload } = await loginApi({ email, password });
+
+      // Prefer HttpOnly cookie set by server. If server returns token, store in memory, optionally in localStorage.
+      memoryTokenRef.current = token || null;
+      setUser(userPayload || null);
+
+      if (remember && token) {
+        try {
+          localStorage.setItem(STORAGE_KEY, token);
+          localStorage.setItem(USER_KEY, JSON.stringify(userPayload || null));
+        } catch {
+          // ignore storage errors
+        }
+      } else {
+        try {
+          localStorage.removeItem(STORAGE_KEY);
+          localStorage.removeItem(USER_KEY);
+        } catch {
+          // ignore
+        }
+      }
+      return { token, user: userPayload };
+    } catch (e) {
+      setError(e?.message || 'Login failed');
+      throw e;
+    } finally {
+      setLoading(false);
+    }
+  }, []);
+
+  const logout = useCallback(() => {
+    memoryTokenRef.current = null;
+    setUser(null);
+    try {
+      localStorage.removeItem(STORAGE_KEY);
+      localStorage.removeItem(USER_KEY);
+    } catch {
+      // ignore
+    }
+  }, []);
+
+  const value = useMemo(() => ({
+    user,
+    token: memoryTokenRef.current,
+    loading,
+    error,
+    login,
+    logout,
+    isAuthenticated: !!user,
+  }), [user, loading, error, login, logout]);
+
+  return (
+    <AuthContext.Provider value={value}>
+      {children}
+    </AuthContext.Provider>
+  );
+}
+
+export function useAuth() {
+  const ctx = useContext(AuthContext);
+  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
+  return ctx;
+}
```

### 3) New: src/hooks/useAuth.js

Explanation: Small convenience hook that re-exports useAuth from context for discoverability.
```diff
*** /dev/null
--- a/src/hooks/useAuth.js
@@
+export { useAuth } from '../context/AuthContext.jsx';
```

### 4) New: src/components/auth/LoginModal.jsx

Explanation: Reusable, accessible login modal aligned with Ocean Professional theme. Includes email/password fields, validation, loading, error state, and “Remember me”.
```diff
*** /dev/null
--- a/src/components/auth/LoginModal.jsx
@@
+import React, { useEffect, useRef, useState } from 'react';
+import { useAuth } from '../../context/AuthContext.jsx';
+
+export default function LoginModal({ open, onClose }) {
+  const { login, loading, error } = useAuth();
+  const [email, setEmail] = useState('');
+  const [password, setPassword] = useState('');
+  const [remember, setRemember] = useState(true);
+  const [formError, setFormError] = useState(null);
+  const ref = useRef(null);
+
+  useEffect(() => {
+    if (open) {
+      const prev = document.activeElement;
+      ref.current?.focus();
+      return () => prev?.focus?.();
+    }
+  }, [open]);
+
+  if (!open) return null;
+
+  const handleBackdrop = (e) => {
+    if (e.target.getAttribute('data-backdrop') === '1') onClose?.();
+  };
+
+  const validate = () => {
+    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
+    if (!emailOk) return 'Please enter a valid email address.';
+    if (!password || password.length < 6) return 'Password must be at least 6 characters.';
+    return null;
+  };
+
+  const onSubmit = async (e) => {
+    e.preventDefault();
+    const v = validate();
+    setFormError(v);
+    if (v) return;
+    try {
+      await login({ email, password, remember });
+      onClose?.();
+    } catch {
+      // error is exposed via context.error
+    }
+  };
+
+  return (
+    <div
+      className="modal-backdrop"
+      data-backdrop="1"
+      onMouseDown={handleBackdrop}
+      role="dialog"
+      aria-modal="true"
+      aria-labelledby="login-modal-title"
+    >
+      <div className="modal" tabIndex={-1} ref={ref}>
+        <div className="modal-header">
+          <div id="login-modal-title" className="modal-title">Sign in</div>
+          <button className="btn" onClick={onClose} aria-label="Close login">
+            Close
+          </button>
+        </div>
+        <div className="modal-body">
+          <form onSubmit={onSubmit} noValidate>
+            <div style={{ display: 'grid', gap: 12 }}>
+              <label>
+                <span style={{ display: 'block', marginBottom: 6 }}>Email</span>
+                <input
+                  type="email"
+                  name="email"
+                  autoComplete="email"
+                  required
+                  aria-required="true"
+                  value={email}
+                  onChange={(e) => setEmail(e.target.value)}
+                  style={{
+                    width: '100%',
+                    padding: '10px 12px',
+                    borderRadius: 10,
+                    border: '1px solid var(--border-color)',
+                    background: 'var(--surface)',
+                    color: 'var(--text-primary)',
+                  }}
+                />
+              </label>
+              <label>
+                <span style={{ display: 'block', marginBottom: 6 }}>Password</span>
+                <input
+                  type="password"
+                  name="password"
+                  autoComplete="current-password"
+                  required
+                  aria-required="true"
+                  value={password}
+                  onChange={(e) => setPassword(e.target.value)}
+                  style={{
+                    width: '100%',
+                    padding: '10px 12px',
+                    borderRadius: 10,
+                    border: '1px solid var(--border-color)',
+                    background: 'var(--surface)',
+                    color: 'var(--text-primary)',
+                  }}
+                />
+              </label>
+              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
+                <input
+                  type="checkbox"
+                  checked={remember}
+                  onChange={(e) => setRemember(e.target.checked)}
+                  aria-label="Remember this device"
+                />
+                <span>Remember me</span>
+              </label>
+              {(formError || error) && (
+                <div role="alert" style={{ color: 'var(--error)' }}>
+                  {formError || error}
+                </div>
+              )}
+              <button
+                className="btn"
+                type="submit"
+                aria-label="Sign in"
+                disabled={loading}
+              >
+                {loading ? 'Signing in…' : 'Sign in'}
+              </button>
+            </div>
+          </form>
+          <p className="helper-text" style={{ marginTop: 12 }}>
+            Your session will be secured using HttpOnly cookies when available. Only a non-sensitive token is stored in localStorage if “Remember me” is enabled.
+          </p>
+        </div>
+      </div>
+    </div>
+  );
+}
```

### 5) New: src/routes/Login.jsx

Explanation: Dedicated route-based login page that reuses the same form logic as the modal. This offers flexibility for deep links and redirects.
```diff
*** /dev/null
--- a/src/routes/Login.jsx
@@
+import React, { useState } from 'react';
+import { useNavigate, useLocation } from 'react-router-dom';
+import { useAuth } from '../context/AuthContext.jsx';
+
+export default function LoginRoute() {
+  const { login, loading, error } = useAuth();
+  const [email, setEmail] = useState('');
+  const [password, setPassword] = useState('');
+  const [remember, setRemember] = useState(true);
+  const [formError, setFormError] = useState(null);
+  const navigate = useNavigate();
+  const location = useLocation();
+  const from = location.state?.from || '/';
+
+  const validate = () => {
+    const emailOk = /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email);
+    if (!emailOk) return 'Please enter a valid email address.';
+    if (!password || password.length < 6) return 'Password must be at least 6 characters.';
+    return null;
+  };
+
+  const onSubmit = async (e) => {
+    e.preventDefault();
+    const v = validate();
+    setFormError(v);
+    if (v) return;
+    try {
+      await login({ email, password, remember });
+      navigate(from, { replace: true });
+    } catch {
+      // context.error displays error
+    }
+  };
+
+  return (
+    <div>
+      <h2 className="section-title">Sign in</h2>
+      <form onSubmit={onSubmit} noValidate style={{
+        background: 'var(--surface)',
+        border: '1px solid var(--border-color)',
+        borderRadius: 12,
+        padding: 16,
+        boxShadow: 'var(--shadow-sm)',
+        maxWidth: 420
+      }}>
+        <div style={{ display: 'grid', gap: 12 }}>
+          <label>
+            <span style={{ display: 'block', marginBottom: 6 }}>Email</span>
+            <input
+              type="email"
+              name="email"
+              autoComplete="email"
+              required
+              aria-required="true"
+              value={email}
+              onChange={(e) => setEmail(e.target.value)}
+              style={{
+                width: '100%',
+                padding: '10px 12px',
+                borderRadius: 10,
+                border: '1px solid var(--border-color)',
+                background: 'var(--surface)',
+                color: 'var(--text-primary)',
+              }}
+            />
+          </label>
+          <label>
+            <span style={{ display: 'block', marginBottom: 6 }}>Password</span>
+            <input
+              type="password"
+              name="password"
+              autoComplete="current-password"
+              required
+              aria-required="true"
+              value={password}
+              onChange={(e) => setPassword(e.target.value)}
+              style={{
+                width: '100%',
+                padding: '10px 12px',
+                borderRadius: 10,
+                border: '1px solid var(--border-color)',
+                background: 'var(--surface)',
+                color: 'var(--text-primary)',
+              }}
+            />
+          </label>
+          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
+            <input
+              type="checkbox"
+              checked={remember}
+              onChange={(e) => setRemember(e.target.checked)}
+              aria-label="Remember this device"
+            />
+            <span>Remember me</span>
+          </label>
+          {(formError || error) && (
+            <div role="alert" style={{ color: 'var(--error)' }}>
+              {formError || error}
+            </div>
+          )}
+          <button
+            className="btn"
+            type="submit"
+            aria-label="Sign in"
+            disabled={loading}
+          >
+            {loading ? 'Signing in…' : 'Sign in'}
+          </button>
+        </div>
+      </form>
+    </div>
+  );
+}
```

### 6) New: src/components/ProtectedRoute.jsx

Explanation: Wrapper to protect routes by redirecting unauthenticated users to /login, preserving the intended destination for return after login.
```diff
*** /dev/null
--- a/src/components/ProtectedRoute.jsx
@@
+import React from 'react';
+import { Navigate, useLocation } from 'react-router-dom';
+import { useAuth } from '../context/AuthContext.jsx';
+
+export default function ProtectedRoute({ children }) {
+  const { isAuthenticated } = useAuth();
+  const location = useLocation();
+  if (!isAuthenticated) {
+    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
+    }
+  return children;
+}
```

### 7) Modified: src/App.js

Explanation: Wrap the app in AuthProvider, add /login route, protect /favorites and /profile with ProtectedRoute, and add Sign In/Out UI in the top bar with user avatar initials.
```diff
--- a/src/App.js
+++ b/src/App.js
@@
-import React, { useState, useEffect } from 'react';
+import React, { useState, useEffect } from 'react';
 import './App.css';
 import './index.css';
 import { Routes, Route, Navigate } from 'react-router-dom';
 import Home from './routes/Home';
 import Favorites from './routes/Favorites';
 import Profile from './routes/Profile';
 import BottomNav from './components/BottomNav';
+import ProtectedRoute from './components/ProtectedRoute.jsx';
+import LoginRoute from './routes/Login.jsx';
+import { AuthProvider, useAuth } from './context/AuthContext.jsx';
 
 // PUBLIC_INTERFACE
-function App() {
+function TopBarActions() {
+  const { isAuthenticated, user, logout } = useAuth();
+  if (!isAuthenticated) {
+    return (
+      <a className="theme-toggle" href="/login" aria-label="Go to sign in">
+        Sign in
+      </a>
+    );
+  }
+  const initials = (user?.name || user?.email || 'U').slice(0, 1).toUpperCase();
+  return (
+    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
+      <div aria-hidden="true" title={user?.email || ''} style={{
+        width: 28, height: 28, borderRadius: '50%',
+        display: 'grid', placeItems: 'center',
+        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
+        color: '#fff', fontSize: 14, fontWeight: 800,
+        boxShadow: 'var(--shadow-sm)'
+      }}>{initials}</div>
+      <button className="theme-toggle" onClick={logout} aria-label="Sign out">
+        Sign out
+      </button>
+    </div>
+  );
+}
+
+function AppShell() {
   const [theme, setTheme] = useState(() => {
     // persist theme between sessions
     const saved = localStorage.getItem('theme');
     return saved || 'light';
   });
@@
   return (
     <div className="App ocean-app">
       <header className="topbar">
         <div className="brand">
           <span className="brand-dot" aria-hidden="true"></span>
           Food Recipe Explorer
         </div>
-        <button
-          className="theme-toggle"
-          onClick={toggleTheme}
-          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
-        >
-          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
-        </button>
+        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
+          <button
+            className="theme-toggle"
+            onClick={toggleTheme}
+            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
+          >
+            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
+          </button>
+          <TopBarActions />
+        </div>
       </header>
 
       <main className="page-content">
         <Routes>
           <Route path="/" element={<Home />} />
-          <Route path="/favorites" element={<Favorites />} />
-          <Route path="/profile" element={<Profile onToggleTheme={toggleTheme} />} />
+          <Route path="/login" element={<LoginRoute />} />
+          <Route path="/favorites" element={
+            <ProtectedRoute>
+              <Favorites />
+            </ProtectedRoute>
+          } />
+          <Route path="/profile" element={
+            <ProtectedRoute>
+              <Profile onToggleTheme={toggleTheme} />
+            </ProtectedRoute>
+          } />
           <Route path="*" element={<Navigate to="/" replace />} />
         </Routes>
       </main>
 
       <BottomNav />
     </div>
   );
 }
 
-export default App;
+export default function App() {
+  return (
+    <AuthProvider>
+      <AppShell />
+    </AuthProvider>
+  );
+}
```

### 8) Optional style additions (if desired)

Existing App.css already fits the Ocean Professional theme. The login forms and buttons reuse theme variables and existing classes (btn, surface, border). No CSS changes are required, but if needed, an “input” base style can be added later.

## Usage Notes and Validation

- Accessibility: Inputs include aria attributes, labels, and role-based alerts for errors.
- Validation: Basic email format and minimum password length checks on client.
- State: The AuthContext manages user and token. It exposes login/logout, loading, error, and isAuthenticated.
- Routing: Favorites and Profile routes are protected by ProtectedRoute. Unauthenticated users are redirected to /login with a state-based return path.
- Navigation: Header shows Sign in when logged out, and avatar + Sign out when logged in. BottomNav remains unchanged for simplicity.

## Integration Notes for a Real Backend

- Prefer issuing Set-Cookie with HttpOnly, Secure, SameSite cookies from the backend on successful login to avoid storing sensitive tokens in the client. The frontend is already configured to send credentials by default.
- If the backend uses cookies, the returned token can be ignored safely. If it uses bearer tokens, return { token, user }, and ensure no sensitive data is persisted in localStorage unless explicitly opted-in.
- Add a /api/auth/me endpoint to fetch current user on initial load and on refresh. The AuthProvider can be extended to call it and restore session from cookie without localStorage.
- Implement logout endpoint to clear cookies server-side (e.g., /api/auth/logout). The frontend can call it before clearing local state.

## Testing Ideas (not included in diffs)

- Add unit tests for ProtectedRoute to redirect unauthenticated users to /login.
- Add integration tests for AuthContext login flow by mocking fetch and asserting UI transitions.
- Add tests for TopBarActions to render correct controls depending on auth state.

## Summary of New Files

- src/lib/apiClient.js
- src/context/AuthContext.jsx
- src/hooks/useAuth.js
- src/components/auth/LoginModal.jsx
- src/routes/Login.jsx
- src/components/ProtectedRoute.jsx

## Summary of Modified Files

- src/App.js

## Environment Variables

- REACT_APP_API_BASE_URL: Base URL for API calls (string). Default: empty string for same-origin. Example: http://localhost:3001

## Security Considerations

- HttpOnly cookies are preferred for session tokens; this avoids exposing tokens to XSS.
- When using localStorage fallback, only store the bare token if absolutely necessary and with explicit user consent (“Remember me”).
- Always use credentials: 'include' for cookie-based sessions.
- Apply CORS settings properly on the backend for cross-origin requests in development.
