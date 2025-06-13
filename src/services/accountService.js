import axios from "axios";

// Base URL cho API - thay đổi theo môi trường của bạn
const API_BASE_URL = "https://localhost:7218/api";

// Tạo axios instance với cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // Tăng timeout lên 15 giây cho Google login
});

// Request interceptor để thêm token nếu có
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
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
      localStorage.removeItem("authToken");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // Redirect to login page if needed
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Utility function để decode JWT token (để lấy thông tin user từ Google token nếu cần)
const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

// Account Service functions
const accountService = {
  // Đăng nhập thường
  login: async (email, password) => {
    try {
      const response = await apiClient.post("/Account/Login", {
        email: email,
        password: password,
      });

      console.log("Login response:", response.data);

      // Lưu token và thông tin user nếu login thành công
      if (response.data.accessToken) {
        // Lưu các token
        localStorage.setItem("authToken", response.data.accessToken);
        localStorage.setItem("accessToken", response.data.accessToken);

        if (response.data.refreshToken) {
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }

        // Tạo userInfo object từ response
        const userInfo = {
          userID:
            response.data.userID || response.data.id || response.data.userId,
          userName: response.data.userName || response.data.username,
          name:
            response.data.name ||
            response.data.fullName ||
            response.data.displayName,
          email: response.data.email || email,
          avatar: response.data.avatar || response.data.picture,
        };

        console.log("Saving userInfo:", userInfo);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        console.log("Đăng nhập thành công, userInfo:", userInfo);
      }

      return {
        success: true,
        data: response.data,
        message: "Đăng nhập thành công",
      };
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Đăng nhập thất bại",
        error: error.response?.data || error.message,
      };
    }
  },

  googleLogin: async (googleIdToken) => {
    try {
      console.log("Sending Google ID token to backend:", googleIdToken);

      // Decode Google ID token để lấy thông tin user
      const decodedToken = decodeJWT(googleIdToken);
      console.log("Decoded Google token:", decodedToken);

      // Tạo request payload theo đúng API spec - FIX: Chỉ gửi idToken
      const requestPayload = {
        idToken: googleIdToken,
        // Loại bỏ email, name, phoneNumber vì API chỉ cần idToken
      };

      console.log("Google login request payload:", requestPayload);

      // Gửi request đến backend API
      const response = await apiClient.post(
        "/Account/GoogleLogin",
        requestPayload
      );

      console.log("Google login response:", response.data);

      // Xử lý response - API trả về token trực tiếp
      if (response.data && response.data.accessToken) {
        const accessToken = response.data.accessToken;

        // Lưu các token
        localStorage.setItem("authToken", accessToken);
        localStorage.setItem("accessToken", accessToken);

        if (response.data.refreshToken) {
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }

        // Tạo userInfo từ response và decoded token
        const userInfo = {
          userID: response.data.userID || response.data.id || decodedToken?.sub,
          userName:
            response.data.userName || decodedToken?.email?.split("@")[0],
          name: response.data.name || decodedToken?.name,
          email: response.data.email || decodedToken?.email,
          avatar: response.data.avatar || decodedToken?.picture,
        };

        console.log("Saving Google userInfo:", userInfo);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        return {
          success: true,
          data: response.data,
          message: "Đăng nhập Google thành công",
        };
      } else {
        console.error("No access token in response:", response.data);
        return {
          success: false,
          data: null,
          message: "Không nhận được token từ server",
          error: "Missing access token",
        };
      }
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);

      let errorMessage = "Đăng nhập Google thất bại";

      if (error.response?.status === 400) {
        errorMessage =
          error.response?.data?.message || "Google token không hợp lệ";
      } else if (error.response?.status === 401) {
        errorMessage = "Google token không được chấp nhận";
      } else if (error.response?.status === 500) {
        errorMessage = "Lỗi server. Vui lòng thử lại sau";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Kết nối timeout. Vui lòng thử lại";
      } else if (!error.response) {
        errorMessage = "Không thể kết nối đến server";
      }

      return {
        success: false,
        data: null,
        message: errorMessage,
        error: error.response?.data || error.message,
      };
    }
  },

  // Đăng xuất
  logout: () => {
    try {
      // Xóa tất cả thông tin đăng nhập
      localStorage.removeItem("authToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userInfo");

      console.log("Đã đăng xuất thành công");

      return {
        success: true,
        message: "Đăng xuất thành công",
      };
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      return {
        success: false,
        message: "Có lỗi khi đăng xuất",
      };
    }
  },

  // Kiểm tra trạng thái đăng nhập
  isAuthenticated: () => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("accessToken");
      const userInfo = localStorage.getItem("userInfo");

      // Kiểm tra cả token và userInfo
      if (!token || !userInfo) {
        return false;
      }

      // Có thể thêm kiểm tra token expiry ở đây
      try {
        const decodedToken = decodeJWT(token);
        if (decodedToken && decodedToken.exp) {
          const currentTime = Math.floor(Date.now() / 1000);
          if (decodedToken.exp < currentTime) {
            // Token đã hết hạn
            console.log("Token has expired");
            accountService.logout();
            return false;
          }
        }
      } catch (tokenError) {
        console.error("Error checking token expiry:", tokenError);
      }

      return true;
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái đăng nhập:", error);
      return false;
    }
  },

  // Lấy thông tin user từ localStorage
  getCurrentUser: () => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        const parsedUser = JSON.parse(userInfo);
        console.log("Current user:", parsedUser);
        return parsedUser;
      }
      return null;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin user:", error);
      // Xóa dữ liệu lỗi
      localStorage.removeItem("userInfo");
      return null;
    }
  },

  // Lấy user ID
  getUserId: () => {
    try {
      const userInfo = accountService.getCurrentUser();
      return userInfo?.userID || null;
    } catch (error) {
      console.error("Lỗi khi lấy user ID:", error);
      return null;
    }
  },

  // Lấy username
  getUserName: () => {
    try {
      const userInfo = accountService.getCurrentUser();
      return userInfo?.userName || null;
    } catch (error) {
      console.error("Lỗi khi lấy username:", error);
      return null;
    }
  },

  // Lấy display name
  getDisplayName: () => {
    try {
      const userInfo = accountService.getCurrentUser();
      return userInfo?.name || userInfo?.userName || null;
    } catch (error) {
      console.error("Lỗi khi lấy display name:", error);
      return null;
    }
  },

  // Lấy token
  getToken: () => {
    try {
      return (
        localStorage.getItem("authToken") || localStorage.getItem("accessToken")
      );
    } catch (error) {
      console.error("Lỗi khi lấy token:", error);
      return null;
    }
  },

  // Lấy access token
  getAccessToken: () => {
    try {
      return localStorage.getItem("accessToken");
    } catch (error) {
      console.error("Lỗi khi lấy access token:", error);
      return null;
    }
  },

  // Lấy refresh token
  getRefreshToken: () => {
    try {
      return localStorage.getItem("refreshToken");
    } catch (error) {
      console.error("Lỗi khi lấy refresh token:", error);
      return null;
    }
  },

  // Cập nhật thông tin user trong localStorage
  updateUserInfo: (userInfo) => {
    try {
      const currentUser = accountService.getCurrentUser();
      const updatedUser = { ...currentUser, ...userInfo };
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin user:", error);
      return false;
    }
  },

  // Refresh token (nếu API hỗ trợ)
  refreshToken: async () => {
    try {
      const refreshToken = accountService.getRefreshToken();
      if (!refreshToken) {
        throw new Error("Không có refresh token");
      }

      const response = await apiClient.post("/Account/RefreshToken", {
        refreshToken: refreshToken,
      });

      if (response.data.accessToken) {
        localStorage.setItem("authToken", response.data.accessToken);
        localStorage.setItem("accessToken", response.data.accessToken);

        if (response.data.refreshToken) {
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }
      }

      return {
        success: true,
        data: response.data,
        message: "Refresh token thành công",
      };
    } catch (error) {
      console.error("Lỗi refresh token:", error);
      // Nếu refresh token thất bại, đăng xuất user
      accountService.logout();
      return {
        success: false,
        data: null,
        message: "Refresh token thất bại",
        error: error.response?.data || error.message,
      };
    }
  },

  // Đăng ký (nếu có API)
  register: async (userData) => {
    try {
      const response = await apiClient.post("/Account/Register", userData);

      return {
        success: true,
        data: response.data,
        message: "Đăng ký thành công",
      };
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Đăng ký thất bại",
        error: error.response?.data || error.message,
      };
    }
  },

  // Quên mật khẩu
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post("/Account/forget-password", {
        email: email,
      });

      return {
        success: true,
        data: response.data,
        message: "Email khôi phục mật khẩu đã được gửi",
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Gửi email khôi phục thất bại",
        error: error.response?.data || error.message,
      };
    }
  },

  // Đặt lại mật khẩu
  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiClient.post("/Account/reset-password", {
        token: token,
        password: newPassword,
      });

      return {
        success: true,
        data: response.data,
        message: "Đặt lại mật khẩu thành công",
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Đặt lại mật khẩu thất bại",
        error: error.response?.data || error.message,
      };
    }
  },
};

export default accountService;
