import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getDeviceFingerprint } from '../utils/deviceFingerprint';
import {
  FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiShield,
  FiCpu, FiCheck, FiX, FiAlertTriangle, FiSmartphone,
  FiArrowRight, FiRefreshCw
} from 'react-icons/fi';

const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:8000'
  : 'https://tonycv-backend.onrender.com';

// ── Password Strength Meter ──────────────────────────────────────────────────
const PasswordStrength = ({ password }) => {
  const checks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'Uppercase letter (A–Z)', ok: /[A-Z]/.test(password) },
    { label: 'Lowercase letter (a–z)', ok: /[a-z]/.test(password) },
    { label: 'Number (0–9)', ok: /\d/.test(password) },
    { label: 'Special character (!@#$...)', ok: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password) },
  ];
  const passed = checks.filter(c => c.ok).length;
  const strength = passed === 5 ? 'Strong' : passed >= 3 ? 'Moderate' : passed >= 1 ? 'Weak' : '';
  const strengthColor = passed === 5 ? '#10b981' : passed >= 3 ? '#f59e0b' : '#ef4444';

  if (!password) return null;

  return (
    <div className="mt-3 p-4 rounded-xl space-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-gray-400">Password Strength</span>
        {strength && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${strengthColor}20`, color: strengthColor, border: `1px solid ${strengthColor}40` }}>
            {strength}
          </span>
        )}
      </div>
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= passed ? strengthColor : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>
      {checks.map((c, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          {c.ok
            ? <FiCheck size={12} className="text-emerald-400 flex-shrink-0" />
            : <FiX size={12} className="text-red-500/60 flex-shrink-0" />}
          <span style={{ color: c.ok ? '#6ee7b7' : '#6b7280' }}>{c.label}</span>
        </div>
      ))}
    </div>
  );
};

// ── Google Sign-In Button ────────────────────────────────────────────────────
const GoogleSignInButton = ({ onSuccess, onError, fingerprint, isLoading }) => {
  const handleGoogleClick = () => {
    // Google Identity Services flow
    if (!window.google) {
      onError('Google Sign-In library is not loaded. Please refresh the page.');
      return;
    }
    window.google.accounts.id.initialize({
      client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // ← Replace with your Google Client ID
      callback: async (response) => {
        if (!response.credential) {
          onError('Google sign-in was cancelled.');
          return;
        }
        try {
          // Decode JWT to get user info (just for display — backend validates)
          const base64Url = response.credential.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(window.atob(base64));
          await onSuccess({
            google_id_token: response.credential,
            name: payload.name || payload.email.split('@')[0],
            email: payload.email,
            google_id: payload.sub,
          });
        } catch (e) {
          onError('Failed to process Google sign-in. Please try again.');
        }
      },
      auto_select: false,
    });
    window.google.accounts.id.prompt();
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      disabled={isLoading}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '12px 20px',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: '#e5e7eb',
        fontWeight: 600,
        fontSize: '14px',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: isLoading ? 0.6 : 1,
      }}
      onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'; }}}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
    >
      {/* Google "G" Logo */}
      <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Continue with Google
    </button>
  );
};

// ── Main AuthPage Component ──────────────────────────────────────────────────
const AuthPage = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [deviceFingerprint, setDeviceFingerprint] = useState('');
  const [fpLoading, setFpLoading] = useState(true);

  // Generate device fingerprint on mount
  useEffect(() => {
    setFpLoading(true);
    getDeviceFingerprint()
      .then(fp => { setDeviceFingerprint(fp); setFpLoading(false); })
      .catch(() => { setDeviceFingerprint('fallback-' + Date.now()); setFpLoading(false); });
  }, []);

  const switchMode = useCallback((newMode) => {
    setMode(newMode);
    setError('');
    setPassword('');
    setConfirmPassword('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fpLoading) { setError('Device verification in progress...'); return; }
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setIsLoading(false);
          return;
        }
        const res = await axios.post(`${API_BASE_URL}/auth/register`, {
          email, name, password, device_fingerprint: deviceFingerprint
        });
        localStorage.setItem('tonycv_token', res.data.access_token);
        localStorage.setItem('tonycv_user', JSON.stringify(res.data.user));
        onAuthSuccess(res.data.user);
      } else {
        const res = await axios.post(`${API_BASE_URL}/auth/login`, {
          email, password, device_fingerprint: deviceFingerprint
        });
        localStorage.setItem('tonycv_token', res.data.access_token);
        localStorage.setItem('tonycv_user', JSON.stringify(res.data.user));
        onAuthSuccess(res.data.user);
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'An error occurred. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async ({ google_id_token, name: gName, email: gEmail, google_id }) => {
    if (fpLoading) { setError('Device verification in progress...'); return; }
    setError('');
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/google`, {
        google_id_token, name: gName, email: gEmail, google_id,
        device_fingerprint: deviceFingerprint
      });
      localStorage.setItem('tonycv_token', res.data.access_token);
      localStorage.setItem('tonycv_user', JSON.stringify(res.data.user));
      onAuthSuccess(res.data.user);
    } catch (err) {
      setError(err.response?.data?.detail || 'Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      {/* Animated Background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse at 20% 0%, rgba(99,102,241,0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 0%, rgba(168,85,247,0.14) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(14,165,233,0.10) 0%, transparent 55%), #06080f'
      }} />

      {/* Left Branding Panel */}
      <div style={{
        display: 'none',
        width: '45%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '60px',
        position: 'relative',
        zIndex: 1,
      }}
        className="auth-left-panel"
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(124,58,237,0.4)'
          }}>
            <FiCpu style={{ color: '#fff' }} size={22} />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
              Tony<span style={{ background: 'linear-gradient(135deg,#a78bfa,#818cf8,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CV</span>
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280', letterSpacing: '1px', textTransform: 'uppercase' }}>AI Engine v2.5.3 SECURE</div>
          </div>
        </div>

        <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-1px' }}>
          Your Career,<br />
          <span style={{ background: 'linear-gradient(135deg,#f472b6,#a78bfa,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Analyzed by AI.
          </span>
        </h1>

        <p style={{ color: '#9ca3af', fontSize: '16px', lineHeight: 1.7, marginBottom: '40px', maxWidth: '380px' }}>
          Upload your CV and get instant, ML-powered placement predictions. Know your chances before you apply.
        </p>

        {/* Security Features */}
        {[
          { icon: <FiShield />, text: 'Single-device security binding' },
          { icon: <FiSmartphone />, text: 'Device fingerprint authentication' },
          { icon: <FiLock />, text: 'AES-256 encrypted sessions' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'rgba(139,92,246,0.15)', color: '#a78bfa',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {item.icon}
            </div>
            <span style={{ color: '#9ca3af', fontSize: '14px' }}>{item.text}</span>
          </div>
        ))}

        {/* Decorative Glow */}
        <div style={{
          position: 'absolute', bottom: '10%', left: '-60px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Right Auth Form Panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          width: '100%',
          maxWidth: '460px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          padding: '40px 36px',
          backdropFilter: 'blur(20px)',
        }}>
          {/* Mobile Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '32px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(124,58,237,0.4)'
            }}>
              <FiCpu style={{ color: '#fff' }} size={20} />
            </div>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>
              Tony<span style={{ background: 'linear-gradient(135deg,#a78bfa,#818cf8,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CV</span>
            </span>
          </div>

          {/* Mode Toggle */}
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '28px',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            {['login', 'register'].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: '9px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  background: mode === m ? 'linear-gradient(135deg,#7c3aed,#6366f1)' : 'transparent',
                  color: mode === m ? '#fff' : '#6b7280',
                  boxShadow: mode === m ? '0 4px 12px rgba(124,58,237,0.3)' : 'none',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Device Security Badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 14px', borderRadius: '10px', marginBottom: '24px',
            background: fpLoading ? 'rgba(251,191,36,0.08)' : 'rgba(16,185,129,0.08)',
            border: `1px solid ${fpLoading ? 'rgba(251,191,36,0.2)' : 'rgba(16,185,129,0.2)'}`,
          }}>
            {fpLoading
              ? <FiRefreshCw size={13} style={{ color: '#fbbf24', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
              : <FiShield size={13} style={{ color: '#34d399', flexShrink: 0 }} />
            }
            <span style={{ fontSize: '11px', color: fpLoading ? '#fbbf24' : '#6ee7b7', fontWeight: 500 }}>
              {fpLoading
                ? 'Scanning device fingerprint...'
                : `Device verified · ID: ${deviceFingerprint.slice(0, 8)}...${deviceFingerprint.slice(-4)}`
              }
            </span>
          </div>

          {/* Google Sign-In */}
          <GoogleSignInButton
            onSuccess={handleGoogleSuccess}
            onError={setError}
            fingerprint={deviceFingerprint}
            isLoading={isLoading}
          />

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ color: '#4b5563', fontSize: '12px', fontWeight: 500 }}>or continue with email</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Error Alert */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              padding: '12px 14px', borderRadius: '10px', marginBottom: '16px',
              background: 'rgba(239,68,68,0.09)', border: '1px solid rgba(239,68,68,0.22)',
            }}>
              <FiAlertTriangle size={16} style={{ color: '#f87171', flexShrink: 0, marginTop: '1px' }} />
              <p style={{ color: '#fca5a5', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Name field (register only) */}
            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9ca3af', marginBottom: '8px', letterSpacing: '0.3px' }}>
                  FULL NAME
                </label>
                <div style={{ position: 'relative' }}>
                  <FiUser size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} />
                  <input
                    id="auth-name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="John Doe"
                    autoComplete="name"
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '12px 14px 12px 40px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      borderRadius: '10px', color: '#e5e7eb',
                      fontSize: '14px', outline: 'none',
                      transition: 'all 0.2s',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.12)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9ca3af', marginBottom: '8px', letterSpacing: '0.3px' }}>
                EMAIL ADDRESS
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} />
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '12px 14px 12px 40px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: '10px', color: '#e5e7eb',
                    fontSize: '14px', outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9ca3af', marginBottom: '8px', letterSpacing: '0.3px' }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder={mode === 'register' ? 'Min 8 chars, A-Z, 0-9, special' : 'Your password'}
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '12px 44px 12px 40px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: '10px', color: '#e5e7eb',
                    fontSize: '14px', outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 0 }}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {mode === 'register' && <PasswordStrength password={password} />}
            </div>

            {/* Confirm Password */}
            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#9ca3af', marginBottom: '8px', letterSpacing: '0.3px' }}>
                  CONFIRM PASSWORD
                </label>
                <div style={{ position: 'relative' }}>
                  <FiLock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} />
                  <input
                    id="auth-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Retype your password"
                    autoComplete="new-password"
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '12px 44px 12px 40px',
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${confirmPassword && confirmPassword !== password ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.09)'}`,
                      borderRadius: '10px', color: '#e5e7eb',
                      fontSize: '14px', outline: 'none',
                      transition: 'all 0.2s',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.12)'; }}
                    onBlur={e => {
                      e.target.style.borderColor = confirmPassword && confirmPassword !== password ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.09)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(p => !p)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 0 }}
                  >
                    {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p style={{ color: '#f87171', fontSize: '12px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiX size={12} /> Passwords do not match
                  </p>
                )}
                {confirmPassword && confirmPassword === password && password && (
                  <p style={{ color: '#34d399', fontSize: '12px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiCheck size={12} /> Passwords match
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isLoading || fpLoading}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '15px',
                cursor: isLoading || fpLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading || fpLoading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
                transition: 'all 0.2s ease',
                marginTop: '4px',
              }}
              onMouseEnter={e => { if (!isLoading && !fpLoading) { e.currentTarget.style.boxShadow = '0 8px 28px rgba(124,58,237,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.35)'; e.currentTarget.style.transform = 'none'; }}
            >
              {isLoading ? (
                <>
                  <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  {mode === 'register' ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>
                  {mode === 'register' ? 'Create Secure Account' : 'Sign In'} <FiArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '8px',
            marginTop: '20px', padding: '10px 12px', borderRadius: '9px',
            background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)',
          }}>
            <FiSmartphone size={14} style={{ color: '#818cf8', marginTop: '1px', flexShrink: 0 }} />
            <p style={{ color: '#818cf8', fontSize: '11px', margin: 0, lineHeight: 1.6 }}>
              {mode === 'register'
                ? 'Your account will be bound to this device. Logging in from another device will be blocked for security.'
                : 'This system enforces single-device login. Access from unknown devices is automatically denied.'
              }
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
        @media (min-width: 768px) {
          .auth-left-panel { display: flex !important; }
        }
        input::placeholder { color: #4b5563; }
      `}</style>
    </div>
  );
};

export default AuthPage;
