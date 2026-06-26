import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    try {
      const auth = JSON.parse(localStorage.getItem('auth') || '{}');
      if (auth.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
    } catch {}
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
        toast.error('Session expired. Please log in again.');
      }
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (!error.response) {
      toast.error('Network error. Check your connection.');
    }
    return Promise.reject(error);
  }
);

export default api;
