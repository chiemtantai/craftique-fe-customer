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
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // Redirect to login page if needed
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Account Service functions
const accountService = {
  // Đăng nhập
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/Account/Login', {
        email: email,
        password: password
      });
      
      // Lưu token và thông tin user nếu login thành công
      if (response.data.accessToken) {
        // Lưu các token
        localStorage.setItem('authToken', response.data.accessToken);
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        
        // Tạo userInfo object từ response
        const userInfo = {
          userId: response.data.userID,
          userName: response.data.userName,
          name: response.data.name,
          email: email // Từ input vì API không trả về email
        };
        
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        console.log('Đăng nhập thành công, userInfo:', userInfo);
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Đăng nhập thành công'
      };
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Đăng nhập thất bại',
        error: error.response?.data || error.message
      };
    }
  },

  // Đăng nhập bằng Google
  googleLogin: async (googleToken) => {
    try {
      const response = await apiClient.post('/Account/GoogleLogin', {
        token: googleToken
      });
      
      if (response.data.accessToken) {
        // Lưu các token
        localStorage.setItem('authToken', response.data.accessToken);
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        
        // Tạo userInfo object từ response
        const userInfo = {
          userId: response.data.userID,
          userName: response.data.userName,
          name: response.data.name
        };
        
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        console.log('Đăng nhập Google thành công, userInfo:', userInfo);
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Đăng nhập Google thành công'
      };
    } catch (error) {
      console.error('Lỗi đăng nhập Google:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Đăng nhập Google thất bại',
        error: error.response?.data || error.message
      };
    }
  },

  // Đăng xuất
  logout: () => {
    try {
      // Xóa tất cả thông tin đăng nhập
      localStorage.removeItem('authToken');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userInfo');
      
      console.log('Đã đăng xuất thành công');
      
      return {
        success: true,
        message: 'Đăng xuất thành công'
      };
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      return {
        success: false,
        message: 'Có lỗi khi đăng xuất'
      };
    }
  },

  // Kiểm tra trạng thái đăng nhập
  isAuthenticated: () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      const userInfo = localStorage.getItem('userInfo');
      
      // Kiểm tra cả token và userInfo
      return !!(token && userInfo);
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', error);
      return false;
    }
  },

  // Lấy thông tin user từ localStorage
  getCurrentUser: () => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const parsedUser = JSON.parse(userInfo);
        console.log('Current user:', parsedUser);
        return parsedUser;
      }
      return null;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin user:', error);
      // Xóa dữ liệu lỗi
      localStorage.removeItem('userInfo');
      return null;
    }
  },

  // Lấy user ID
  getUserId: () => {
    try {
      const userInfo = accountService.getCurrentUser();
      return userInfo?.userId || null;
    } catch (error) {
      console.error('Lỗi khi lấy user ID:', error);
      return null;
    }
  },

  // Lấy username
  getUserName: () => {
    try {
      const userInfo = accountService.getCurrentUser();
      return userInfo?.userName || null;
    } catch (error) {
      console.error('Lỗi khi lấy username:', error);
      return null;
    }
  },

  // Lấy display name
  getDisplayName: () => {
    try {
      const userInfo = accountService.getCurrentUser();
      return userInfo?.name || userInfo?.userName || null;
    } catch (error) {
      console.error('Lỗi khi lấy display name:', error);
      return null;
    }
  },

  // Lấy token
  getToken: () => {
    try {
      return localStorage.getItem('authToken') || localStorage.getItem('accessToken');
    } catch (error) {
      console.error('Lỗi khi lấy token:', error);
      return null;
    }
  },

  // Lấy access token
  getAccessToken: () => {
    try {
      return localStorage.getItem('accessToken');
    } catch (error) {
      console.error('Lỗi khi lấy access token:', error);
      return null;
    }
  },

  // Lấy refresh token
  getRefreshToken: () => {
    try {
      return localStorage.getItem('refreshToken');
    } catch (error) {
      console.error('Lỗi khi lấy refresh token:', error);
      return null;
    }
  },

  // Cập nhật thông tin user trong localStorage
  updateUserInfo: (userInfo) => {
    try {
      const currentUser = accountService.getCurrentUser();
      const updatedUser = { ...currentUser, ...userInfo };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin user:', error);
      return false;
    }
  },

  // Refresh token (nếu API hỗ trợ)
  refreshToken: async () => {
    try {
      const refreshToken = accountService.getRefreshToken();
      if (!refreshToken) {
        throw new Error('Không có refresh token');
      }

      const response = await apiClient.post('/Account/RefreshToken', {
        refreshToken: refreshToken
      });

      if (response.data.accessToken) {
        localStorage.setItem('authToken', response.data.accessToken);
        localStorage.setItem('accessToken', response.data.accessToken);
        
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
      }

      return {
        success: true,
        data: response.data,
        message: 'Refresh token thành công'
      };
    } catch (error) {
      console.error('Lỗi refresh token:', error);
      // Nếu refresh token thất bại, đăng xuất user
      accountService.logout();
      return {
        success: false,
        data: null,
        message: 'Refresh token thất bại',
        error: error.response?.data || error.message
      };
    }
  },

  // Đăng ký (nếu có API)
  register: async (userData) => {
    try {
      const response = await apiClient.post('/Account/Register', userData);
      
      return {
        success: true,
        data: response.data,
        message: 'Đăng ký thành công'
      };
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Đăng ký thất bại',
        error: error.response?.data || error.message
      };
    }
  },

  // Quên mật khẩu
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post('/Account/forget-password', {
        email: email
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Email khôi phục mật khẩu đã được gửi'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Gửi email khôi phục thất bại',
        error: error.response?.data || error.message
      };
    }
  },

  // Đặt lại mật khẩu
  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiClient.post('/Account/reset-password', {
        token: token,
        password: newPassword
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Đặt lại mật khẩu thành công'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Đặt lại mật khẩu thất bại',
        error: error.response?.data || error.message
      };
    }
  }
};

export default accountService;