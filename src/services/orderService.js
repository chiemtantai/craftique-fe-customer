import axios from "axios";

// Base URL cho API - thay đổi theo môi trường của bạn
const API_BASE_URL = "https://localhost:7218/api";

// Tạo axios instance với cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
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
    }
    return Promise.reject(error);
  }
);

// Order Service functions
const orderService = {
  // Lấy tất cả đơn hàng
  getAllOrders: async () => {
    try {
      const response = await apiClient.get("/Order/orders");

      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách đơn hàng thành công",
      };
    } catch (error) {
      console.error("Lỗi lấy danh sách đơn hàng:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Lấy danh sách đơn hàng thất bại",
        error: error.response?.data || error.message,
      };
    }
  },

  // Tạo đơn hàng mới
  createOrder: async (orderData) => {
    try {
      // Format lại data theo đúng cấu trúc API
      const formattedOrderData = {
        userID: orderData.userID,
        orderDate: new Date().toISOString(),
        address: orderData.address,
        paymentMethod: orderData.paymentMethod,
        shippingMethodID: orderData.shippingMethodID || 1, // Mặc định là 1
        total: orderData.total,
        orderDetails: orderData.orderDetails.map((item) => ({
          productItemID: item.productItemID,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const response = await apiClient.post("/Order", formattedOrderData);

      return {
        success: true,
        data: response.data,
        message: "Tạo đơn hàng thành công",
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Lỗi khi tạo đơn hàng",
        error: error.response?.data || error.message,
      };
    }
  },

  getOrderById: async (orderId) => {
    try {
      const response = await apiClient.get(`/Order/${orderId}`);

      return {
        success: true,
        data: response.data,
        message: "Lấy chi tiết đơn hàng thành công",
      };
    } catch (error) {
      console.error("Lỗi lấy chi tiết đơn hàng:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Lấy chi tiết đơn hàng thất bại",
        error: error.response?.data || error.message,
      };
    }
  },

  updateOrderStatus: async (
    orderId,
    newStatus,
    isCancelledByCustomer = false
  ) => {
    try {
      const params = new URLSearchParams({
        NewStatus: newStatus,
        isCancelledByCustomer: isCancelledByCustomer.toString(),
      });

      const url = `/Order/${orderId}/status?${params.toString()}`;

      const response = await apiClient.put(url);

      return {
        success: true,
        data: response.data,
        message: "Cập nhật trạng thái đơn hàng thành công",
      };
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái đơn hàng:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          "Cập nhật trạng thái đơn hàng thất bại",
        error: error.response?.data || error.message,
      };
    }
  },
};

export default orderService;
