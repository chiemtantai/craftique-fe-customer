import axios from 'axios';

// Base URL cho API - thay đổi theo môi trường của bạn
const API_BASE_URL = 'https://localhost:7218/api';

// Tạo axios instance với cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor để thêm token nếu có
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi chung
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
    }
    return Promise.reject(error);
  }
);

// Product Service functions
const productService = {
  // Lấy tất cả ProductItem
  getAllProductItems: async () => {
    try {
      const response = await apiClient.get('/ProductItem');
      
      return {
        success: true,
        data: response.data,
        message: 'Lấy danh sách sản phẩm thành công'
      };
    } catch (error) {
      return {
        success: false,
        data: { items: [] },
        message: error.response?.data?.message || 'Lỗi khi lấy danh sách sản phẩm',
        error: error.response?.data || error.message
      };
    }
  },

  // Lấy sản phẩm theo danh mục (nếu cần)
  getByCategory: async (categoryId) => {
    try {
      const response = await apiClient.get(`/ProductItem/${categoryId}`);
      
      return {
        success: true,
        data: response.data,
        message: 'Lấy sản phẩm theo danh mục thành công'
      };
    } catch (error) {
      return {
        success: false,
        data: { items: [] },
        message: error.response?.data?.message || 'Lỗi khi lấy sản phẩm theo danh mục',
        error: error.response?.data || error.message
      };
    }
  },

  getProductItemById: async (productItemId) => {
    try {
      const response = await apiClient.get(`/ProductItem/${productItemId}`);
      
      return {
        success: true,
        data: response.data,
        message: 'Lấy sản phẩm'
      };
    } catch (error) {
      return {
        success: false,
        data: { items: [] },
        message: error.response?.data?.message || 'Lỗi khi lấy sản phẩm',
        error: error.response?.data || error.message
      };
    }
  }
};

export default productService;