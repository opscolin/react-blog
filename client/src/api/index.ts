import axios from 'axios';
import { useAuthStore } from '../store/auth';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

let isLoggingIn = false;

api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;
  if (token && !isLoggingIn) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => {
    isLoggingIn = false;
    return response;
  },
  error => {
    isLoggingIn = false;
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      useAuthStore.getState().logout();
      if (currentPath.startsWith('/admin')) {
        window.location.href = '/admin';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
