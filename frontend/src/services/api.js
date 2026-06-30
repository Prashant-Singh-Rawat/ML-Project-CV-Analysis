import axios from 'axios';
import axiosRetry from 'axios-retry';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create a centralized Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second global timeout
});

// Configure automatic retries for transient failures
axiosRetry(api, {
  retries: 3, // Retry up to 3 times
  retryDelay: (retryCount) => {
    return retryCount * 1000; // Exponential-like backoff: 1s, 2s, 3s
  },
  retryCondition: (error) => {
    // Retry on network errors or 5xx status codes
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status >= 500;
  }
});

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      toast.error('The request timed out. Please try again.');
    } else if (!error.response) {
      toast.error('Network Error: The server appears to be offline.');
    } else {
      const status = error.response.status;
      const detail = error.response.data?.detail || error.message;
      
      if (status >= 500) {
        toast.error(`Server Error (${status}): ${detail}`);
      } else if (status === 429) {
        toast.error('Rate Limit Exceeded. Please slow down.');
      }
    }
    
    // Return a Promise rejection to allow local components to handle specific cases
    return Promise.reject(error);
  }
);

export default api;
