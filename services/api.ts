import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Helper for Laravel Validation Errors
export const parseApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
    if (axiosError.response?.status === 422 && axiosError.response.data.errors) {
      const firstErrorKey = Object.keys(axiosError.response.data.errors)[0];
      return axiosError.response.data.errors[firstErrorKey][0];
    }
    return axiosError.response?.data?.message || axiosError.message || 'Something went wrong';
  }
  return 'An unexpected error occurred';
};

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      // Optional: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
