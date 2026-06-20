import React, { useState } from 'react';
import { FiCheck } from 'react-icons/fi';

const RegisterPopup = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState('register'); // 'register' | 'login'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [updatesEnabled, setUpdatesEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:8000'
      : 'https://tonycv-backend.onrender.com';

    try {
      if (mode === 'register') {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            name,
            password,
            device_fingerprint: 'web-fingerprint-' + email,
            phone: phone || null,
            updates_enabled: updatesEnabled
          })
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          if (response.status === 409) {
            setMode('login');
            throw new Error("Account already exists. Please sign in instead.");
          }
          throw new Error(data.detail || 'Registration failed');
        }

        localStorage.setItem('tonycv_token', data.access_token);
        localStorage.setItem('tonycv_user', JSON.stringify(data.user));
        setSuccessMsg('Account registered successfully!');
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(data.user);
          onClose();
        }, 1500);
      } else {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            device_fingerprint: 'web-fingerprint-' + email
          })
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.detail || 'Login failed');
        }

        localStorage.setItem('tonycv_token', data.access_token);
        localStorage.setItem('tonycv_user', JSON.stringify(data.user));
        setSuccessMsg('Logged in successfully!');
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(data.user);
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md p-8 bg-white border border-slate-200 shadow-2xl rounded-2xl">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 transition flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-lg font-bold shadow-sm"
          >
            ✕
          </button>

        <h3 className="text-2xl font-black text-slate-900 tracking-tight text-center mb-1">
          {mode === 'register' ? 'Join TonyCV' : 'Welcome Back'}
        </h3>
        <p className="text-xs text-slate-500 text-center mb-6">
          {mode === 'register' ? 'Create an account to track your skill metrics' : 'Sign in to access your dashboard'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1.5 animate-pulse">
            <FiCheck size={14} /> {successMsg}
          </div>
        )}

        {/* Google sign-in confirm button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={async () => {
              setLoading(true);
              setError('');
              try {
                if (!window.google) {
                  throw new Error("Google API script not loaded. Please refresh the page.");
                }
                window.google.accounts.id.initialize({
                  client_id: '685412957904-u8g9up175t4j5b8q260840p0e2d19277.apps.googleusercontent.com', // fallback/default Google client ID
                  callback: async (response) => {
                    if (!response.credential) {
                      setError('Google verification cancelled.');
                      setLoading(false);
                      return;
                    }
                    // Parse credentials JWT
                    const base64Url = response.credential.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const payload = JSON.parse(window.atob(base64));
                    
                    // Pre-fill email and name from verified Google Account
                    setEmail(payload.email || '');
                    setName(payload.name || '');
                    
                    // Automatic Google Login/Register call
                    const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                      ? 'http://localhost:8000'
                      : 'https://tonycv-backend.onrender.com';
                      
                    const authRes = await fetch(`${API_BASE_URL}/auth/google`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        google_id_token: response.credential,
                        name: payload.name || payload.email.split('@')[0],
                        email: payload.email,
                        google_id: payload.sub,
                        device_fingerprint: 'web-fingerprint-' + payload.email
                      })
                    });
                    
                    const data = await authRes.json();
                    if (!authRes.ok) {
                      throw new Error(data.detail || 'Google authentication failed');
                    }
                    
                    localStorage.setItem('tonycv_token', data.access_token);
                    localStorage.setItem('tonycv_user', JSON.stringify(data.user));
                    setSuccessMsg('Verified with Google successfully!');
                    setTimeout(() => {
                      if (onAuthSuccess) onAuthSuccess(data.user);
                      onClose();
                    }, 1200);
                  }
                });
                window.google.accounts.id.prompt();
              } catch (err) {
                setError(err.message || 'Google verification failed.');
                setLoading(false);
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Verify & Confirm with Google
          </button>
          
          <div className="flex items-center gap-2 my-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[10px] text-slate-400 font-bold uppercase">Or use password credentials</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe" 
                className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" 
              className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
              <input 
                type="tel" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 88666 71624" 
                className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
              />
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
              {mode === 'login' && (
                <button type="button" onClick={() => alert("Forgot password functionality coming soon! Please contact support.")} className="text-[10px] font-bold text-blue-600 hover:underline">
                  Forgot Password?
                </button>
              )}
            </div>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>

          {mode === 'register' && (
            <div className="flex items-start gap-2 pt-1 select-none">
              <input 
                type="checkbox" 
                id="popup-updates" 
                checked={updatesEnabled}
                onChange={e => setUpdatesEnabled(e.target.checked)}
                className="mt-0.5 cursor-pointer accent-blue-600"
              />
              <label htmlFor="popup-updates" className="text-[11px] text-slate-500 cursor-pointer">
                Send updates & features announcements to my phone or email.
              </label>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : mode === 'register' ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          {mode === 'register' ? (
            <p>
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-blue-600 font-bold hover:underline">
                Sign In Instead
              </button>
            </p>
          ) : (
            <p>
              New to TonyCV?{' '}
              <button onClick={() => setMode('register')} className="text-blue-600 font-bold hover:underline">
                Create Account
              </button>
            </p>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default RegisterPopup;
