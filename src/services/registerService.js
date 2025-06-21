import axios from "axios";

const API_BASE_URL = "https://localhost:7218/api";

const registerService = {
  // Đăng ký tài khoản mới
  register: async (name, email, password, confirmPassword) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Account/Register`, {
        name,
        email,
        password,
        confirmPassword,
      }, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Đăng ký thất bại" };
    }
  },

  // Kiểm tra email đã tồn tại
  checkEmailExists: async (email) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Account/check-email/${email}`, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      return response.data;
    } catch (error) {
      console.log(error);
      return { exists: false };
    }
  },

  // Validate dữ liệu đăng ký phía client
  validateRegisterData: (name, email, password, confirmPassword) => {
    const errors = {};

    // Validate name
    if (!name || name.trim().length < 2) {
      errors.name = "Tên phải có ít nhất 2 ký tự";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = "Email là bắt buộc";
    } else if (!emailRegex.test(email)) {
      errors.email = "Email không hợp lệ";
    }

    // Validate password
    if (!password) {
      errors.password = "Mật khẩu là bắt buộc";
    } else if (password.length < 3) {
      errors.password = "Mật khẩu phải có ít nhất 3 ký tự";
    }

    // Validate confirm password
    if (!confirmPassword) {
      errors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

export default registerService;