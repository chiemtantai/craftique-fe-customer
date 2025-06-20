import axios from 'axios';

const API_BASE_URL = 'https://localhost:7218/api';

const productItemAPI = axios.create({
  baseURL: `${API_BASE_URL}/ProductItem`,
  headers: {
    'Content-Type': 'application/json',
  },
});

productItemAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const productItemService = {
  getAll: (params = {}) => {
    // Build query string from parameters
    const queryParams = new URLSearchParams();
    
    if (params.pageNumber) {
      queryParams.append('pageNumber', params.pageNumber);
    }
    if (params.pageSize) {
      queryParams.append('pageSize', params.pageSize);
    }
    if (params.categoryId !== undefined && params.categoryId !== null) {
      queryParams.append('categoryId', params.categoryId);
    }
    if (params.searchTerm) {
      queryParams.append('searchTerm', params.searchTerm);
    }
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/?${queryString}` : '/';
    
    return productItemAPI.get(url);
  },
  getById: (id) => productItemAPI.get(`/${id}`),
};