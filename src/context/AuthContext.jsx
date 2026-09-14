import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = 'api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const clearAuthError = () => setAuthError(null);

  // Check and restore active session on mount
  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.error('Session verification failed:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [token]);

// Keep DOM attribute in sync with user's theme
useEffect(() => {
  const activeTheme = user?.theme || 'default';
  document.documentElement.setAttribute('data-theme', activeTheme);
}, [user?.theme]);

// 2. Call the backend to persist theme selection
const updateTheme = async (newTheme) => {
  if (!token) return;

  // Optimistic UI update: instant responsiveness
  setUser((prev) => (prev ? { ...prev, theme: newTheme } : prev));
  document.documentElement.setAttribute('data-theme', newTheme);

  try {
    const res = await fetch('/api/auth/theme', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ theme: newTheme }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('Theme sync failed:', err.error);
    }
  } catch (err) {
    console.error('Error saving theme:', err);
  }
};

    // Login, register, and logout functions
  const login = async (username, password) => {
    setAuthError(null); // Clear previous errors
    try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!res.ok) {
      setAuthError(data.error || 'Login failed.');
      return false;
    }

    setToken(data.token);
    setUser({ _id: data._id, username: data.username, theme: data.theme });
    localStorage.setItem('token', data.token);
    return true;
    }catch (err) {
      setAuthError(err.message);
      return false;
    }   
  };

  const register = async (username, password) => {
    setAuthError(null); // Clear previous errors
    try {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!res.ok) {
      // Prioritize specific backend messages, then fallback
      const failReason = data.error || data.message || 'Registration failed';
      setAuthError(failReason);
      return false;
    }

    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser({ _id: data._id, username: data.username, theme: data.theme });
    return true;
    }catch (err) {
      setAuthError(err.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    document.documentElement.setAttribute('data-theme', 'default');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, authError, clearAuthError, login, register, logout, updateTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);