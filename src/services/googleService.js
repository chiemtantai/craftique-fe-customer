import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from "../firebaseConfig";
import axios from "axios";

// const API_BASE_URL = 'https://localhost:7218/api';
const API_BASE_URL = 'https://api-craftique.innosphere.io.vn/api';

const googleService = {
  // Đăng nhập bằng Google
  loginWithGoogle: async () => {
    try {
      // Đăng nhập Firebase
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const credential = GoogleAuthProvider.credentialFromResult (result);
      const idToken = credential?.idToken;
      
      console.log("Firebase User:", user);
      console.log("ID Token:", idToken);
      
      // Gửi thông tin đến backend
      const response = await axios.post(`${API_BASE_URL}/Account/GoogleLogin`, {
        idToken: idToken,
        email: user.email,
        name: user.displayName || user.email,
        phoneNumber: user.phoneNumber || ""
      }, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      console.log("Backend Response:", response.data);

      const { accessToken, refreshToken, userID, userName, name } = response.data;

      // Lưu thông tin user
      const userData = {
        userID,
        userName,
        name,
        email: user.email,
        photoURL: user.photoURL
      };

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem('userData', JSON.stringify(userData));

      return response.data;
    } catch (error) {
      console.error("Google Login Error:", error);
      
      // Đăng xuất Firebase nếu có lỗi
      try {
        await auth.signOut();
      } catch (signOutError) {
        console.error("Error signing out:", signOutError);
      }
      
      // Throw error with more details
      if (error.response) {
        console.error("Error Response:", error.response.data);
        throw error.response.data;
      } else if (error.request) {
        console.error("Error Request:", error.request);
        throw { message: "Không thể kết nối tới server" };
      } else {
        console.error("Error Message:", error.message);
        throw { message: error.message || "Đăng nhập Google thất bại" };
      }
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