import axios from 'axios';

const API_BASE_URL = 'https://localhost:7218/api';

const categoryAPI = axios.create({
  baseURL: `${API_BASE_URL}/Category`,
  headers: {
    'Content-Type': 'application/json',
  },
});

categoryAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const categoryService = {
  getAll: () => categoryAPI.get('/'),
};