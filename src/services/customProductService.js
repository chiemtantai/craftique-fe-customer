import axios from "axios";

// const API_BASE_URL = 'https://localhost:7218/api';
const API_BASE_URL = 'https://api-craftique.innosphere.io.vn/api';

const customProductAPI = axios.create({
  baseURL: `${API_BASE_URL}/CustomProduct`,
  headers: {
    "Content-Type": "application/json",
  },
});

customProductAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const customProductService = {
  getAll: () => customProductAPI.get("/"),
  getById: (id) => customProductAPI.get(`/${id}`),
  create: (customData) => customProductAPI.post("/", customData),
  // Thêm các hàm khác nếu cần (update, delete, ...)
};

export default customProductService;
