import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';
import './PurchaseOrderPage.css';

function PurchaseOrderPage() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'COD',
    shippingMethodID: 1,
    voucherID: 0
  });
  const navigate = useNavigate();

  const shippingMethods = [
    { id: 1, name: 'Giao hàng nhanh', price: 20000, description: '3-5 ngày làm việc' },
    { id: 2, name: 'Giao hàng hỏa tốc', price: 50000, description: '1-2 ngày làm việc' }
  ];

  const paymentMethods = [
    { value: 'COD', label: 'Thanh toán khi nhận hàng (COD)' },
    { value: 'Bank', label: 'Chuyển khoản ngân hàng' },
    { value: 'Momo', label: 'Ví điện tử MoMo' },
    { value: 'ZaloPay', label: 'Ví điện tử ZaloPay' }
  ];

  useEffect(() => {
    // Kiểm tra nếu thanh toán đã được xử lý
    const paymentProcessed = localStorage.getItem('paymentProcessed');
    if (paymentProcessed === 'true') {
      localStorage.removeItem('paymentProcessed');
      navigate('/order', { 
        state: { 
          success: true, 
          message: 'Thanh toán đã được xử lý thành công!' 
        },
        replace: true
      });
      return;
    }

    checkAuth();
    loadCartItems();
  }, []);

  // Check authentication
  const checkAuth = () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('userData');
      
      if (!token || !userData) {
        navigate('/login', { 
          state: { 
            from: '/purchase-order',
            message: 'Vui lòng đăng nhập để tiếp tục thanh toán' 
          }
        });
        return;
      }
      
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      setFormData(prev => ({
        ...prev,
        fullName: parsedUser.fullName || parsedUser.name || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        address: parsedUser.address || ''
      }));
    } catch (error) {
      console.error('Lỗi khi kiểm tra đăng nhập:', error);
      navigate('/login', { 
        state: { 
          from: '/purchase-order',
          message: 'Vui lòng đăng nhập để tiếp tục thanh toán' 
        }
      });
    }
  };

  // Load cart items
  const loadCartItems = () => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        const items = JSON.parse(savedCart);
        setCartItems(items);
        
        if (items.length === 0) {
          navigate('/cart');
          return;
        }
      } else {
        navigate('/cart');
        return;
      }
    } catch (error) {
      console.error('Lỗi khi tải giỏ hàng:', error);
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'shippingMethodID' ? parseInt(value) : value
    }));
  };

  // Calculate prices
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getShippingPrice = () => {
    const method = shippingMethods.find(m => m.id === formData.shippingMethodID);
    return method ? method.price : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + getShippingPrice();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Validate form
  const validateForm = () => {
    if (!formData.fullName.trim()) {
      alert('Vui lòng nhập họ tên');
      return false;
    }
    
    if (!formData.email.trim()) {
      alert('Vui lòng nhập email');
      return false;
    }
    
    if (!formData.address.trim()) {
      alert('Vui lòng nhập địa chỉ giao hàng');
      return false;
    }

    return true;
  };

  // Create order data
  const createOrderData = () => {
    const timestamp = Date.now();
    return {
      userID: user.id || user.userID,
      orderDate: new Date().toISOString(),
      address: formData.address,
      paymentMethod: formData.paymentMethod,
      shippingMethodID: formData.shippingMethodID,
      total: calculateTotal(),
      voucherID: formData.voucherID || 0,
      orderDetails: cartItems.map(item => ({
        productItemID: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      customerInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone
      },
      // Thêm unique identifier để tránh duplicate
      clientOrderId: `${user.id || user.userID}_${timestamp}_${Math.random().toString(36).substr(2, 9)}`
    };
  };

  // Handle bank payment
  const handleBankPayment = async () => {
    try {
      const totalAmount = calculateTotal();
      const orderData = createOrderData();
      
      // Kiểm tra nếu đã có pending order data (tránh duplicate)
      const existingPendingData = localStorage.getItem('pendingOrderData');
      if (existingPendingData) {
        const existingData = JSON.parse(existingPendingData);
        // Nếu cùng user và cùng total thì có thể là duplicate
        if (existingData.userID === orderData.userID && existingData.total === orderData.total) {
          const timeDiff = Date.now() - new Date(existingData.orderDate).getTime();
          if (timeDiff < 300000) { // 5 phút
            alert('Đã có yêu cầu thanh toán đang xử lý. Vui lòng chờ hoặc reload trang.');
            return;
          }
        }
      }
      
      // Save order data to localStorage for later use after payment success
      localStorage.setItem('pendingOrderData', JSON.stringify(orderData));
      
      const paymentResponse = await paymentService.requestTopup(totalAmount);
      
      if (paymentResponse.payUrl) {
        // Redirect to payment page in the same window
        window.location.href = paymentResponse.payUrl;
      }
    } catch (error) {
      console.error('Lỗi thanh toán ngân hàng:', error);
      
      if (error.response?.status === 401) {
        navigate('/login', { 
          state: { 
            from: '/purchase-order',
            message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' 
          }
        });
      } else {
        alert('Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại sau.');
      }
    }
  };

  // Handle order creation (for COD and other non-bank payments)
  const createOrder = async () => {
    try {
      const orderData = createOrderData();
      console.log('Sending order data:', orderData);
      
      const response = await orderService.create(orderData);
      
      if (response.data) {
        localStorage.removeItem('cartItems');
        window.dispatchEvent(new Event('cartUpdated'));
        
        alert('Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại cửa hàng.');
        navigate('/order');
      }
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error);
      
      if (error.response?.status === 401) {
        navigate('/login', { 
          state: { 
            from: '/purchase-order',
            message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' 
          }
        });
      } else if (error.response?.status === 409) {
        alert('Đơn hàng đã tồn tại. Vui lòng kiểm tra lại.');
        navigate('/order');
      } else {
        alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.');
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (submitting) return; // Ngăn chặn multiple submissions

    setSubmitting(true);
    
    try {
      if (formData.paymentMethod === 'Bank') {
        await handleBankPayment();
      } else {
        await createOrder();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="purchase-order-page">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="purchase-order-page">
      <div className="purchase-header">
        <h1>Thanh toán đơn hàng</h1>
        <button 
          className="back-btn" 
          onClick={() => navigate('/cart')}
        >
          ← Quay lại giỏ hàng
        </button>
      </div>

      <div className="purchase-content">
        <div className="order-form">
          <form onSubmit={handleSubmit}>
            {/* User Information */}
            <div className="form-section">
              <h3>Thông tin người nhận</h3>
              
              <div className="form-group">
                <label htmlFor="fullName">Họ và tên *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên đầy đủ"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div className="form-section">
              <h3>Địa chỉ giao hàng</h3>
              <div className="form-group">
                <label htmlFor="address">Địa chỉ chi tiết *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ giao hàng chi tiết..."
                  required
                  rows="3"
                />
              </div>
            </div>

            {/* Shipping Method */}
            <div className="form-section">
              <h3>Phương thức vận chuyển</h3>
              <div className="shipping-options">
                {shippingMethods.map(method => (
                  <label key={method.id} className="shipping-option">
                    <input
                      type="radio"
                      name="shippingMethodID"
                      value={method.id}
                      checked={formData.shippingMethodID === method.id}
                      onChange={handleInputChange}
                    />
                    <div className="shipping-info">
                      <div className="shipping-name">{method.name}</div>
                      <div className="shipping-description">{method.description}</div>
                      <div className="shipping-price">{formatPrice(method.price)}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="form-section">
              <h3>Phương thức thanh toán</h3>
              <div className="form-group">
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                >
                  {paymentMethods.map(method => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-order-btn"
              disabled={submitting}
            >
              {submitting ? 'Đang xử lý...' : 
               formData.paymentMethod === 'Bank' ? 'Thanh toán ngân hàng' : 'Đặt hàng'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <div className="summary-card">
            <h3>Tóm tắt đơn hàng</h3>
            
            {/* Order Items */}
            <div className="order-items">
              {cartItems.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    <img 
                      src={item.image || '/placeholder-image.jpg'} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-quantity">Số lượng: {item.quantity}</div>
                    <div className="item-price">{formatPrice(item.price)}</div>
                  </div>
                  <div className="item-total">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="summary-divider"></div>
            
            {/* Price Breakdown */}
            <div className="summary-row">
              <span>Tạm tính:</span>
              <span>{formatPrice(calculateSubtotal())}</span>
            </div>
            
            <div className="summary-row">
              <span>Phí vận chuyển:</span>
              <span>{formatPrice(getShippingPrice())}</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row total">
              <span>Tổng cộng:</span>
              <span>{formatPrice(calculateTotal())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PurchaseOrderPage;