import React, { useState, useEffect } from 'react';
import orderService from '../../services/orderService';
import accountService from '../../services/accountService'; // Import accountService
import './OrderPage.css';

const OrderPage = () => {
  // State quản lý form
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'COD',
    note: ''
  });

  // State quản lý UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(1); // Mặc định ID = 1 (Giao hàng nhanh)

  // FIX: Sử dụng accountService để lấy thông tin user
  const userInfo = accountService.getCurrentUser() || {};
  const userId = accountService.getUserId();

  // Debug: Log để kiểm tra
  console.log('UserInfo:', userInfo);
  console.log('UserId:', userId);
  console.log('Is authenticated:', accountService.isAuthenticated());

  // Tính toán giá trị
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = shippingMethods.find(method => method.id === selectedShipping)?.price || 
                     shippingMethods.find(method => method.shippingMethodID === selectedShipping)?.shippingPrice || 
                     20000; // Fallback to default price
  const total = subtotal + shippingFee;

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load giỏ hàng từ localStorage
      const savedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      setCartItems(savedCart);

      // Load phương thức vận chuyển
      const shippingResponse = await orderService.getShippingMethods();
      if (shippingResponse.success) {
        setShippingMethods(shippingResponse.data);
      } else {
        // Fallback data nếu API không hoạt động
        setShippingMethods([
          { shippingMethodID: 1, name: 'Giao hàng nhanh', shippingPrice: 20000, isDeleted: 0 },
          { shippingMethodID: 2, name: 'Giao hàng hỏa tốc', shippingPrice: 50000, isDeleted: 0 }
        ]);
      }

      // Pre-fill thông tin user nếu có
      if (userInfo.name) setFormData(prev => ({ ...prev, fullName: userInfo.name }));
      if (userInfo.email) setFormData(prev => ({ ...prev, email: userInfo.email }));
      if (userInfo.phone) setFormData(prev => ({ ...prev, phone: userInfo.phone }));
    } catch (error) {
      console.error('Error loading initial data:', error);
      // Fallback data nếu có lỗi
      setShippingMethods([
        { shippingMethodID: 1, name: 'Giao hàng nhanh', shippingPrice: 20000, isDeleted: 0 },
        { shippingMethodID: 2, name: 'Giao hàng hỏa tốc', shippingPrice: 50000, isDeleted: 0 }
      ]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error khi user bắt đầu nhập
    if (error) setError('');
  };

  const handleShippingChange = (e) => {
    setSelectedShipping(parseInt(e.target.value));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Vui lòng nhập họ tên');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Vui lòng nhập email');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Vui lòng nhập địa chỉ giao hàng');
      return false;
    }
    if (cartItems.length === 0) {
      setError('Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi đặt hàng');
      return false;
    }
    // FIX: Kiểm tra authentication tốt hơn
    if (!userId || !accountService.isAuthenticated()) {
      setError('Vui lòng đăng nhập để tiếp tục');
      return false;
    }
    return true;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const orderData = {
        userID: userId,
        address: formData.address,
        paymentMethod: formData.paymentMethod,
        shippingMethodID: selectedShipping,
        total: total,
        orderDetails: cartItems.map(item => ({
          productItemID: item.id || item.productItemID,
          quantity: item.quantity,
          price: item.price
        }))
      };

      console.log('Order data:', orderData); // Debug

      const response = await orderService.createOrder(orderData);

      if (response.success) {
        // Clear giỏ hàng ngay lập tức
        localStorage.removeItem('cartItems');
        setCartItems([]);
        
        // Reset form
        setFormData({
          fullName: userInfo.name || '',
          phone: userInfo.phone || '',
          email: userInfo.email || '',
          address: '',
          paymentMethod: 'COD',
          note: ''
        });

        // Hiển thị thông báo thành công và chuyển hướng ngay lập tức
        setSuccess('Đặt hàng thành công!');
        
        // Chuyển hướng ngay lập tức thay vì chờ timeout
        window.location.href = '/purchase-orders'; 
      } else {
        setError(response.message || 'Có lỗi xảy ra khi đặt hàng');
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
      console.error('Order submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-page">
      <h1 className="page-title">Thanh Toán</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Giỏ hàng trống</h2>
          <p>Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán</p>
        </div>
      ) : (
        <div className="order-container">
          <form className="order-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {/* Thông tin giao hàng */}
            <div className="form-section">
              <h2 className="section-title">Thông tin giao hàng</h2>
              
              <div className="form-group">
                <label className="form-label">Họ và tên *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Số điện thoại *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Nhập địa chỉ email"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Địa chỉ giao hàng *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Nhập địa chỉ chi tiết (số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ghi chú đơn hàng</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)"
                  rows="3"
                />
              </div>
            </div>

            {/* Phương thức vận chuyển */}
            <div className="form-section">
              <h2 className="section-title">Phương thức vận chuyển</h2>
              
              <div className="shipping-methods">
                {shippingMethods
                  .filter(method => method.isDeleted === 0)
                  .map((method) => (
                  <div key={method.shippingMethodID || method.id} className={`shipping-option ${selectedShipping === (method.shippingMethodID || method.id) ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      id={`shipping-${method.shippingMethodID || method.id}`}
                      name="shippingMethod"
                      value={method.shippingMethodID || method.id}
                      checked={selectedShipping === (method.shippingMethodID || method.id)}
                      onChange={handleShippingChange}
                      className="shipping-radio"
                    />
                    <label htmlFor={`shipping-${method.shippingMethodID || method.id}`} className="shipping-label">
                      <div className="shipping-name">{method.name}</div>
                      <div className="shipping-price">{formatCurrency(method.shippingPrice || method.price)}</div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="form-section">
              <h2 className="section-title">Phương thức thanh toán</h2>
              
              <div className="payment-methods">
                <div className={`payment-option ${formData.paymentMethod === 'COD' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={handleInputChange}
                    className="payment-radio"
                  />
                  <label htmlFor="cod" className="payment-label">
                    Thanh toán khi nhận hàng (COD)
                  </label>
                </div>

                <div className={`payment-option ${formData.paymentMethod === 'Banking' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    id="banking"
                    name="paymentMethod"
                    value="Banking"
                    checked={formData.paymentMethod === 'Banking'}
                    onChange={handleInputChange}
                    className="payment-radio"
                  />
                  <label htmlFor="banking" className="payment-label">
                    Chuyển khoản ngân hàng
                  </label>
                </div>

                <div className={`payment-option ${formData.paymentMethod === 'EWallet' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    id="ewallet"
                    name="paymentMethod"
                    value="EWallet"
                    checked={formData.paymentMethod === 'EWallet'}
                    onChange={handleInputChange}
                    className="payment-radio"
                  />
                  <label htmlFor="ewallet" className="payment-label">
                    Ví điện tử (Momo, ZaloPay)
                  </label>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading && <span className="loading-spinner"></span>}
              {loading ? 'Đang xử lý...' : 'Đặt hàng'}
            </button>
          </form>

          {/* Tóm tắt đơn hàng */}
          <div className="order-summary">
            <h2 className="summary-title">Tóm tắt đơn hàng</h2>
            
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="item-info">
                    <div className="item-name">{item.name || item.productName}</div>
                    <div className="item-details">
                      Số lượng: {item.quantity} × {formatCurrency(item.price)}
                    </div>
                  </div>
                  <div className="item-total">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-row">
              <span className="summary-label">Tạm tính:</span>
              <span className="summary-value">{formatCurrency(subtotal)}</span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Phí vận chuyển:</span>
              <span className="summary-value">{formatCurrency(shippingFee)}</span>
            </div>

            <div className="summary-row total-row">
              <span className="summary-label">Tổng cộng:</span>
              <span className="summary-value">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;