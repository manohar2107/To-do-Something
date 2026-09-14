// client/src/components/AuthForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthForm.css';

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export const AuthForm = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [clientError, setClientError] = useState('');

  // Fallback safely whether your context exports `error` or `authError`
  const authContext = useAuth() || {};
  const serverError = authContext.authError || authContext.error || '';
  const login = authContext.login;
  const register = authContext.register;

  // Active error priority: client-side validation first, then server error
  const activeError = clientError || serverError;

  const handleTabSwitch = (registerMode) => {
    setIsRegister(registerMode);
    setClientError('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleAction = async (e) => {
    if (e) e.preventDefault();
    console.log('[AuthForm] Submit triggered:', { username, isRegister });

    const trimmedUser = username.trim();

    // 1. Client-side field validations
    if (!trimmedUser) {
      setClientError('Petname is required.');
      return;
    }
    if (trimmedUser.length < 3) {
      setClientError('Petname must be at least 3 characters long.');
      return;
    }
    if (!password) {
      setClientError('Pussword is required.');
      return;
    }
    if (isRegister) {
      if (password.length < 7) {
        setClientError('Pussword must be at least 7 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setClientError('Pusswords do not match.');
        return;
      }
    }

    // 2. Clear client error if checks pass
    setClientError('');

    // 3. Dispatch API calls
    try {
      if (isRegister) {
        console.log('[AuthForm] Dispatching register API call...');
        if (register) await register(trimmedUser, password);
      } else {
        console.log('[AuthForm] Dispatching login API call...');
        if (login) await login(trimmedUser, password);
      }
    } catch (err) {
      console.error('[AuthForm] Request exception:', err);
      setClientError(err.message || 'Network request failed.');
    }
  };

  return (
    <div className="vibrant-auth-wrapper">
      <div className="ambient-orb orb-purple"></div>
      <div className="ambient-orb orb-blue"></div>

      <div className="glass-auth-card">
        {/* Header Branding */}
        <div className="auth-brand">
          <div className="brand-badge">✓</div>
          <h2>Tomdo Jist</h2>
          <p className="auth-subtitle">{isRegister ?  'Who are you, traitor?' : 'Howdy! friend'}</p>
        </div>

        {/* Tab Controls */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`tab-btn ${!isRegister ? 'active' : ''}`}
            onClick={() => handleTabSwitch(false)}
          >
            Get In
          </button>
          <button
            type="button"
            className={`tab-btn ${isRegister ? 'active' : ''}`}
            onClick={() => handleTabSwitch(true)}
          >
            Reveal Yourself
          </button>
        </div>

        {/* Prominent Error Banner */}
        {activeError && (
          <div 
            className="vibrant-error-banner"
            style={{ 
              display: 'flex', 
              background: 'rgba(239, 68, 68, 0.2)', 
              borderColor: '#ef4444', 
              color: '#fca5a5' 
            }}
          >
            <span className="error-icon" style={{ marginRight: '8px' }}>⚠️</span>
            <span className="error-text">{String(activeError)}</span>
          </div>
        )}

        {/* Form Container with noValidate */}
        <form onSubmit={handleAction} noValidate className="auth-form-fields">
          <div className="form-group">
            <label htmlFor="petname">Petname</label>
            <input
              id="petname"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setClientError('');
              }}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="pussword">Pussword</label>
              {isRegister && <span className="field-hint">Min. 7 characters</span>}
            </div>
            <div className="password-input-wrapper">
              <input
                id="pussword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setClientError('');
                }}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div className="form-group">
              <label htmlFor="confirmPussword">Pussword Again!!!</label>
              <div className="password-input-wrapper">
                <input
                  id="confirmPussword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setClientError('');
                  }}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
          )}

          {/* Explicit onClick execution */}
          <button
            type="button"
            onClick={handleAction}
            className="vibrant-submit-btn"
          >
            {isRegister ? 'Reveal Yourself' : 'Get In'}
          </button>
        </form>
      </div>
    </div>
  );
};