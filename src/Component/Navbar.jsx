import React from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust path if needed
import './Navbar.css';

export const Navbar = () => {
  const { user, logout, updateTheme } = useAuth();
  const currentTheme = user?.theme || 'default';

  return (
    <header className="navbar">
      <div className="nav-brand">
        <span className="brand-logo">✓</span>
        <span className="brand-title">To-Do Dashboard</span>
      </div>

      <div className="nav-controls">
        {/* User Badge */}
        <div className="user-badge">
          <span className="badge-dot"></span>
          <span className="username">{user?.username || 'User'}</span>
        </div>

        {/* Database Theme Dropdown */}
        <div className="theme-picker-wrapper">
          <label htmlFor="theme-select" className="theme-label">theme</label>
          <select
            id="theme-select"
            className="theme-dropdown"
            value={currentTheme}
            onChange={(e) => updateTheme(e.target.value)}
          >
            <option value="default">Default Tada</option>
            <option value="dark">Dark Tada</option>
            <option value="indigo">Deep Indigo Tada</option>
          </select>
        </div>

        {/* Logout Action */}
        <button className="logout-btn" onClick={logout} title="Sign out of your account">
          Logout
        </button>
      </div>
    </header>
  );
};