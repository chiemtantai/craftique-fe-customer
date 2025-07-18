import axios from 'axios';

// const API_BASE_URL = 'https://localhost:7218/api';
const API_BASE_URL = 'https://api-craftique.innosphere.io.vn/api';

const workshopAPI = axios.create({
  baseURL: `${API_BASE_URL}/Workshop`,
  headers: {
    'Content-Type': 'application/json',
  },
});

workshopAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const workshopService = {
  create: (workshopData) => workshopAPI.post(`/register`, workshopData),
};