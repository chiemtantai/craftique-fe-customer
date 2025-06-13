import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService from '../../services/orderService';
import accountService from '../../services/accountService';
import './PurchaseOrder.css';

function PurchaseOrder() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra xem user đã đăng nhập chưa
    if (!accountService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    loadUserOrders();
  }, [navigate]);

  const loadUserOrders = async () => {
    setIsLoading(true);
    setError('');

    try {
      const currentUser = accountService.getCurrentUser();
      console.log('Current user in loadUserOrders:', currentUser);
      
      if (!currentUser) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }

      // Gọi API để lấy tất cả đơn hàng
      const result = await orderService.getAllOrders();
      console.log('API Response:', result);
      
      if (result.success) {
        // Lấy tất cả đơn hàng từ response
        const allOrders = result.data.orders || [];
        console.log('All orders:', allOrders);
        
        // Filter đơn hàng theo userId của user hiện tại
        if (currentUser.userId) {
          const userOrders = allOrders.filter(order => 
            order.userID === currentUser.userId || order.userId === currentUser.userId
          );
          console.log('Filtered user orders:', userOrders);
          setOrders(userOrders);
        } else {
          // Nếu không có userId, hiển thị tất cả (tạm thời)
          console.log('No userId found, showing all orders');
          setOrders(allOrders);
        }
        
        // Nếu muốn filter theo user cụ thể, cần thêm thông tin userId vào localStorage
        // khi login thành công
      } else {
        setError(result.message || 'Không thể tải danh sách đơn hàng');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Đã xảy ra lỗi khi tải danh sách đơn hàng: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewOrderDetails = async (orderId) => {
    try {
      const result = await orderService.getOrderById(orderId);
      if (result.success) {
        setSelectedOrder(result.data);
        setShowModal(true);
      } else {
        alert('Không thể tải chi tiết đơn hàng');
      }
    } catch (error) {
      console.error('Error loading order details:', error);
      alert('Đã xảy ra lỗi khi tải chi tiết đơn hàng');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      try {
        // Gọi API update order status thay vì cancelOrder
        const result = await orderService.updateOrderStatus(orderId, 'Cancelled');
        if (result.success) {
          alert('Hủy đơn hàng thành công');
          // Reload danh sách đơn hàng
          loadUserOrders();
        } else {
          alert(result.message || 'Không thể hủy đơn hàng');
        }
      } catch (error) {
        console.error('Error canceling order:', error);
        alert('Đã xảy ra lỗi khi hủy đơn hàng');
      }
    }
  };

  const handleCompleteOrder = async (orderId) => {
    if (window.confirm('Bạn có chắc chắn đã nhận được đơn hàng này?')) {
      try {
        const result = await orderService.updateOrderStatus(orderId, 'Completed');
        if (result.success) {
          alert('Xác nhận hoàn thành đơn hàng thành công');
          loadUserOrders();
        } else {
          alert(result.message || 'Không thể cập nhật trạng thái đơn hàng');
        }
      } catch (error) {
        console.error('Error completing order:', error);
        alert('Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng');
      }
    }
  };

  const handleRequestRefund = async (orderId) => {
    if (window.confirm('Bạn có chắc chắn muốn yêu cầu hoàn tiền cho đơn hàng này?')) {
      try {
        const result = await orderService.updateOrderStatus(orderId, 'RefundRequested');
        if (result.success) {
          alert('Yêu cầu hoàn tiền đã được gửi thành công');
          loadUserOrders();
        } else {
          alert(result.message || 'Không thể gửi yêu cầu hoàn tiền');
        }
      } catch (error) {
        console.error('Error requesting refund:', error);
        alert('Đã xảy ra lỗi khi gửi yêu cầu hoàn tiền');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      'Pending': 'Chờ xử lý',
      'Processing': 'Đang xử lý',
      'Shipped': 'Đang vận chuyển',
      'Delivered': 'Đã giao hàng',
      'Completed': 'Hoàn thành',
      'Cancelled': 'Đã hủy',
      'RefundRequested': 'Yêu cầu hoàn tiền'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    const statusClassMap = {
      'Pending': 'status-pending',
      'Processing': 'status-processing',
      'Shipped': 'status-shipped',
      'Delivered': 'status-delivered',
      'Completed': 'status-completed',
      'Cancelled': 'status-cancelled',
      'RefundRequested': 'status-refund'
    };
    return statusClassMap[status] || 'status-default';
  };

  // Kiểm tra xem customer có thể thực hiện action nào trên đơn hàng
  const canCancelOrder = (status) => {
    return status === 'Pending';
  };

  const canCompleteOrder = (status) => {
    return status === 'Delivered';
  };

  const canRequestRefund = (status) => {
    return status === 'Delivered';
  };

  if (isLoading) {
    return (
      <div className="purchase-order-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải danh sách đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="purchase-order-container">
      <div className="page-header">
        <button 
          className="back-button"
          onClick={() => navigate('/home')}
        >
          ← Quay lại
        </button>
        <h1>Đơn Hàng Của Tôi</h1>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadUserOrders} className="retry-button">
            Thử lại
          </button>
        </div>
      )}

      {!error && orders.length === 0 && (
        <div className="empty-orders">
          <div className="empty-icon">📦</div>
          <h3>Chưa có đơn hàng nào</h3>
          <p>Bạn chưa thực hiện đơn hàng nào. Hãy bắt đầu mua sắm!</p>
          <button 
            className="shop-now-button"
            onClick={() => navigate('/products')}
          >
            Mua sắm ngay
          </button>
        </div>
      )}

      {!error && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.orderID} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Đơn hàng #{order.orderID}</h3>
                  <p className="order-date">
                    Ngày đặt: {formatDate(order.orderDate)}
                  </p>
                </div>
                <div className="order-status">
                  <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>
                    {getStatusText(order.orderStatus)}
                  </span>
                </div>
              </div>

              <div className="order-body">
                <div className="order-summary">
                  <div className="summary-item">
                    <span>Địa chỉ giao hàng:</span>
                    <span>{order.address}</span>
                  </div>
                  <div className="summary-item">
                    <span>Phương thức thanh toán:</span>
                    <span>{order.paymentMethod}</span>
                  </div>
                  <div className="summary-item">
                    <span>Tổng tiền:</span>
                    <span className="total-amount">{formatCurrency(order.total)}</span>
                  </div>
                </div>

                <div className="order-products">
                  <h4>Sản phẩm đã đặt:</h4>
                  {order.orderDetails && order.orderDetails.length > 0 ? (
                    <div className="products-list">
                      {order.orderDetails.slice(0, 3).map((detail, index) => (
                        <div key={index} className="product-item">
                          <span className="product-name">
                            {detail.productName || `Sản phẩm #${detail.productItemID}`}
                          </span>
                          <span className="product-quantity">x{detail.quantity}</span>
                          <span className="product-price">
                            {formatCurrency(detail.price)}
                          </span>
                        </div>
                      ))}
                      {order.orderDetails.length > 3 && (
                        <p className="more-products">
                          và {order.orderDetails.length - 3} sản phẩm khác...
                        </p>
                      )}
                    </div>
                  ) : (
                    <p>Không có thông tin chi tiết sản phẩm</p>
                  )}
                </div>
              </div>

              <div className="order-actions">
                <button 
                  className="view-details-button"
                  onClick={() => handleViewOrderDetails(order.orderID)}
                >
                  Xem chi tiết
                </button>
                
                {canCancelOrder(order.orderStatus) && (
                  <button 
                    className="cancel-order-button"
                    onClick={() => handleCancelOrder(order.orderID)}
                  >
                    Hủy đơn hàng
                  </button>
                )}
                
                {canCompleteOrder(order.orderStatus) && (
                  <button 
                    className="complete-order-button"
                    onClick={() => handleCompleteOrder(order.orderID)}
                  >
                    Đã nhận hàng
                  </button>
                )}
                
                {canRequestRefund(order.orderStatus) && (
                  <button 
                    className="refund-request-button"
                    onClick={() => handleRequestRefund(order.orderID)}
                  >
                    Yêu cầu hoàn tiền
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal chi tiết đơn hàng */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết đơn hàng #{selectedOrder.orderID}</h2>
              <button className="close-button" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="order-detail-section">
                <h3>Thông tin đơn hàng</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Mã đơn hàng:</label>
                    <span>#{selectedOrder.orderID}</span>
                  </div>
                  <div className="detail-item">
                    <label>Ngày đặt:</label>
                    <span>{formatDate(selectedOrder.orderDate)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Trạng thái:</label>
                    <span className={`status-badge ${getStatusClass(selectedOrder.orderStatus)}`}>
                      {getStatusText(selectedOrder.orderStatus)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Địa chỉ giao hàng:</label>
                    <span>{selectedOrder.address}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phương thức thanh toán:</label>
                    <span>{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="detail-item">
                    <label>Tổng tiền:</label>
                    <span className="total-amount">{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              <div className="order-detail-section">
                <h3>Chi tiết sản phẩm</h3>
                <div className="products-detail-list">
                  {selectedOrder.orderDetails && selectedOrder.orderDetails.map((detail, index) => (
                    <div key={index} className="product-detail-item">
                      <div className="product-info">
                        <h4>{detail.productName || `Sản phẩm #${detail.productItemID}`}</h4>
                        <p>Số lượng: {detail.quantity}</p>
                        <p>Đơn giá: {formatCurrency(detail.price)}</p>
                        <p className="product-total">
                          Thành tiền: {formatCurrency(detail.price * detail.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PurchaseOrder;