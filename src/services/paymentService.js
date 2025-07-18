import axios from 'axios';

// const API_BASE_URL = 'https://localhost:7218/api';
const API_BASE_URL = 'https://api-craftique.innosphere.io.vn/api';

class PaymentService {
  // Tạo request thanh toán ngân hàng
  async requestTopup(amount) {
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.post(
        `${API_BASE_URL}/Payment/request-topup`,
        { amount },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'accept': '*/*'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Lỗi thanh toán:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();