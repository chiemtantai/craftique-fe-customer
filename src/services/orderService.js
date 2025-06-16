import axios from "axios";

const API_BASE_URL = "https://localhost:7218/api";

const orderAPI = axios.create({
  baseURL: `${API_BASE_URL}/Order`,
  headers: {
    "Content-Type": "application/json",
  },
});

orderAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const orderService = {
  getAll: () => orderAPI.get(`/orders`),

  getById: (id) => orderAPI.get(`/${id}`),

  create: (orderData) => orderAPI.post(`/`, orderData),

  updateStatus: (orderId, statusData) => {
    const params = new URLSearchParams();

    if (statusData.NewStatus) {
      params.append("NewStatus", statusData.NewStatus);
    }
    if (statusData.RefundReason) {
      params.append("RefundReason", statusData.RefundReason);
    }

    return orderAPI.put(`/${orderId}/status?${params.toString()}`);
  },

  updateOrderStatus: (orderId, newStatus, refundReason = null) => {
    const statusData = {
      NewStatus: newStatus,
      RefundReason: refundReason
    };
    
    return orderService.updateStatus(orderId, statusData);
  },

  cancelOrder: (orderId) => {
    return orderService.updateOrderStatus(orderId, 'Cancelled');
  },

  refundRequestOrder: (orderId, refundReason = null) => {
    return orderService.updateOrderStatus(orderId, 'Refunded', null, refundReason);
  },

  completeOrder: (orderId) => {
    return orderService.updateOrderStatus(orderId, 'Completed');
  },

  canUpdateStatus: (currentStatus, newStatus) => {
    const allowedTransitions = {
      'Pending': ['Cancelled'],
      'Delivered': ['Completed'],
      'Completed': ['RefundRequest']
    };
    
    return allowedTransitions[currentStatus]?.includes(newStatus) || false;
  },

  getAvailableStatuses: (currentStatus) => {
    const allowedTransitions = {
      'Pending': ['Cancelled'],
      'Delivered': ['Completed'],
      'Completed': ['RefundRequest']
    };
    
    return allowedTransitions[currentStatus] || [];
  }
};
export default orderService;