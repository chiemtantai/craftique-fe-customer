import axios from 'axios';

const API_BASE_URL = 'https://localhost:7218/api';

const BlogAPI = axios.create({
  baseURL: `${API_BASE_URL}/Blog`,
  headers: {
    'Content-Type': 'application/json',
  },
});

BlogAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const blogService = {
  getAll: () => BlogAPI.get('/'),
  getById: (id) => BlogAPI.get(`/${id}`),
};