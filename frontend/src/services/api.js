/**
 * api.js — Centralized Axios instance for TonyCV API requests
 *
 * Key design decisions:
 *
 * 1. NO retry on POST /analyze — retrying a CV upload is dangerous:
 *    - Re-submits the file to a sleeping/starting server (wasteful)
 *    - Could trigger multiple AI analysis charges if a paid API is added
 *    - The health-gate in resumeAnalysis.js handles cold-start properly
 *
 * 2. Retry IS allowed on safe GET requests (idempotent, no side effects).
 *    e.g. /companies, /health, /metrics
 *
 * 3. Timeout is 180s to accommodate the actual /analyze processing time.
 *    The health-gate handles the cold-start wait BEFORE /analyze is called,
 *    so this timeout only covers: PDF parse + ML inference + response.
 *
 * 4. Auth tokens are attached via request interceptor (if stored in localStorage).
 */

import axios from 'axios';
import axiosRetry from 'axios-retry';

// ── Base URL resolution ────────────────────────────────────────────────────
// Priority: VITE_API_URL env var → localhost fallback for dev → production URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8000'
    : 'https://ml-project-cv-analysis.onrender.com');

// ── Axios instance ─────────────────────────────────────────────────────────
// 180s timeout covers the full /analyze processing time.
// The health-gate in resumeAnalysis.js manages the cold-start wait separately.
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000, // 180 seconds
});

// ── Retry configuration ───────────────────────────────────────────────────
// ONLY retry safe, idempotent GET requests.
// POST /analyze is explicitly excluded to prevent duplicate CV submissions.
axiosRetry(api, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // Never retry POST, PUT, PATCH, DELETE — only GET, HEAD, OPTIONS
    const method = error.config?.method?.toUpperCase();
    const isSafeMethod = ['GET', 'HEAD', 'OPTIONS'].includes(method);
    if (!isSafeMethod) return false;

    // Retry only on network errors or server errors (5xx) for safe methods
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      Boolean(error.response && error.response.status >= 500)
    );
  },
});

// ── Request interceptor — attach auth token if available ──────────────────
// The app stores the JWT under 'tonycv_token' (set by AuthPage and RegisterPopup).
// A fallback also reads from the user object's .token field for compatibility.
api.interceptors.request.use((config) => {
  try {
    const token =
      localStorage.getItem('tonycv_token') ||
      JSON.parse(localStorage.getItem('tonycv_user') || 'null')?.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch {
    // localStorage unavailable (SSR, private browsing, etc.) — proceed without token
  }
  return config;
});

// ── Response interceptor — clean up toasts on success ────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log non-cancellation errors to console for debugging
    if (error.name !== 'AbortError' && error.name !== 'CanceledError') {
      const status = error.response?.status;
      const url = error.config?.url;
      const method = error.config?.method?.toUpperCase();
      console.warn(
        `[TonyCV API] ${method} ${url} → ${status ?? error.code ?? error.message}`
      );
    }
    return Promise.reject(error);
  }
);

export default api;
