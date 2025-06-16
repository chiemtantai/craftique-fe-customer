import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebaseConfig";
import axios from "axios";

const API_BASE_URL = "https://localhost:7218/api";

const googleService = {
  // Đăng nhập bằng Google
  loginWithGoogle: async () => {
    try {
      // Đăng nhập Firebase
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Lấy ID token từ Firebase
      const idToken = await user.getIdToken();
      
      // Gửi thông tin đến backend
      const response = await axios.post(`${API_BASE_URL}/Account/GoogleLogin`, {
        idToken,
        email: user.email,
        name: user.displayName,
        phoneNumber: user.phoneNumber || ""
      }, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      const { accessToken, refreshToken, userID, userName, name, address } = response.data;

      // Lưu thông tin user
      const userData = {
        userID,
        userName,
        name,
        address: address || null,
        email: user.email,
        photoURL: user.photoURL
      };

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem('userData', JSON.stringify(userData));

      return response.data;
    } catch (error) {
      // Đăng xuất Firebase nếu có lỗi
      await auth.signOut();
      throw error.response?.data || { message: "Đăng nhập Google thất bại" };
    }
  },

  // Đăng xuất Google
  logoutGoogle: async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userData");
    } catch (error) {
      console.error("Lỗi khi đăng xuất Google:", error);
    }
  }
};

export default googleService;