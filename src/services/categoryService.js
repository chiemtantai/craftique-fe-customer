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

// Category Service functions
const categoryService = {
  // Lấy tất cả categories
  getAllCategories: async () => {
    try {
      const response = await apiClient.get('/category');
      
      return {
        success: true,
        data: response.data,
        message: 'Lấy danh sách categories thành công'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Lỗi khi lấy danh sách categories',
        error: error.response?.data || error.message
      };
    }
  },

  // Lấy products theo categoryId với pagination
  getProductsByCategory: async (categoryId, pageNumber = 1, pageSize = 10) => {
    try {
      const response = await apiClient.get('/ProductItem', {
        params: {
          CategoryId: categoryId,
          PageNumber: pageNumber,
          PageSize: pageSize
        }
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Lấy sản phẩm theo category thành công'
      };
    } catch (error) {
      return {
        success: false,
        data: { items: [] },
        message: error.response?.data?.message || 'Lỗi khi lấy sản phẩm theo category',
        error: error.response?.data || error.message
      };
    }
  },

  // Lấy category theo ID
  getCategoryById: async (categoryId) => {
    try {
      const response = await apiClient.get(`/category/${categoryId}`);
      
      return {
        success: true,
        data: response.data,
        message: 'Lấy thông tin category thành công'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Lỗi khi lấy thông tin category',
        error: error.response?.data || error.message
      };
    }
  }
};

export default categoryService;