import axios from 'axios';
import axiosRetry from 'axios-retry';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  ((typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? 'http://localhost:8000'
    : 'https://tonycv-backend.onrender.com');

// Track if we've already shown the "waking up" toast to avoid spam
let wakingUpToastId = null;

// Create a centralized Axios instance
// Timeout is 30s for local dev. Set to 90s for production (Render cold start).
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for local dev
});

// Auto-retry with exponential backoff: 3 retries, 1s → 2s → 4s delay
axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // Retry on network errors OR server errors (5xx) OR timeouts
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.response?.status >= 500 ||
      error.code === 'ECONNABORTED'
    );
  },
  onRetry: (retryCount) => {
    if (retryCount === 1 && !wakingUpToastId) {
      // Show friendly "waking up" message on first retry
      wakingUpToastId = toast.info(
        '⏳ Server is waking up... This may take up to 60 seconds on first load.',
        { autoClose: 60000, toastId: 'waking-up' }
      );
    }
  },
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    // Dismiss the "waking up" toast on successful response
    if (wakingUpToastId) {
      toast.dismiss('waking-up');
      wakingUpToastId = null;
    }
    return response;
  },
  (error) => {
    // Dismiss the "waking up" toast
    if (wakingUpToastId) {
      toast.dismiss('waking-up');
      wakingUpToastId = null;
    }

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      toast.error(
        '⏰ Request timed out. The server may be starting up — please try again in 30 seconds.',
        { autoClose: 8000 }
      );
    } else if (!error.response) {
      toast.error(
        '📡 Cannot connect to the server. Check your internet connection.',
        { autoClose: 6000 }
      );
    } else {
      const status = error.response.status;
      const detail = error.response.data?.detail || error.message;

      if (status === 408) {
        toast.error(`⏰ ${detail}`, { autoClose: 6000 });
      } else if (status === 429) {
        toast.warning('🚦 Too many requests. Please wait a moment before trying again.');
      } else if (status >= 500) {
        toast.error(`🔧 Server Error: ${detail}`);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
