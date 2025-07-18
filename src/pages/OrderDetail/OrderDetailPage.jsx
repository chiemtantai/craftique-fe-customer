import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { productItemService } from '../../services/productItemService';
import { customProductService } from '../../services/customProductService';
import { Button } from '../../components/ui/button/Button';
import UpdateOrderStatus from '../../components/features/orders/UpdateOrderStatus';
import ProductImg from '../../components/features/products/ProductImg';
import './OrderDetailPage.css';

const OrderDetailPage = () => {
  const { orderID } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [productItems, setProductItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Định nghĩa các phương thức giao hàng (giống như trong PurchaseOrderPage)
  const shippingMethods = [
    { id: 1, name: 'Giao hàng nhanh', price: 20000, description: '3-5 ngày làm việc' },
    { id: 2, name: 'Giao hàng hỏa tốc', price: 50000, description: '1-2 ngày làm việc' }
  ];

  useEffect(() => {
    if (orderID) {
      fetchOrderDetail();
    }
  }, [orderID]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await orderService.getById(orderID);
      const orderData = response.data;
      console.log('orderData:', orderData);
      setOrder(orderData);
      if (orderData.orderDetails && orderData.orderDetails.length > 0) {
        await fetchProductItems(orderData.orderDetails);
      }
      setError(null);
    } catch (err) {
      setError('Không thể tải chi tiết đơn hàng');
      console.error('Error fetching order detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductItems = async (orderDetails) => {
    try {
      const productItemsData = {};

      const fetchPromises = orderDetails.map(async (detail) => {
        // Sản phẩm thường
        if (detail.productItemID && detail.productItemID !== 0) {
          try {
            const response = await productItemService.getById(detail.productItemID);
            const productData = response.data;
            productItemsData[`item-${detail.productItemID}`] = {
              name: productData.name || productData.productName || 'Không thể tải thông tin sản phẩm',
              sku: productData.sku || 'N/A',
              price: detail.price,
              productImgs: productData.productImgs || [],
              imageUrl: productData.productImgs?.[0]?.imageUrl || productData.imageUrl || null
            };
          } catch (error) {
            console.error(`Error fetching product item ${detail.productItemID}:`, error);
            productItemsData[`item-${detail.productItemID}`] = {
              name: 'Không thể tải thông tin sản phẩm',
              sku: 'N/A',
              price: detail.price,
              productImgs: [],
              imageUrl: null
            };
          }
        }
        // Sản phẩm custom
        if (detail.customProductFileID) {
          try {
            const response = await customProductService.getById(detail.customProductFileID);
            const customProductData = response.data;
            productItemsData[`custom-${detail.customProductFileID}`] = {
              name: customProductData.name || customProductData.productName || 'Sản phẩm custom',
              sku: customProductData.sku || 'CUSTOM',
              price: detail.price,
              productImgs: customProductData.productImgs || [],
              imageUrl: customProductData.productImgs?.[0]?.imageUrl || customProductData.imageUrl || null
            };
          } catch (error) {
            console.error(`Error fetching custom product ${detail.customProductFileID}:`, error);
            productItemsData[`custom-${detail.customProductFileID}`] = {
              name: 'Không thể tải thông tin sản phẩm custom',
              sku: 'N/A',
              price: detail.price,
              productImgs: [],
              imageUrl: null
            };
          }
        }
      });

      await Promise.all(fetchPromises);
      setProductItems(productItemsData);
    } catch (error) {
      console.error('Error fetching product items:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Processing': return 'status-processing';
      case 'Shipped': return 'status-shipped';
      case 'Delivered': return 'status-delivered';
      case 'Completed': return 'status-completed';
      case 'Cancelled': return 'status-cancelled';
      case 'RefundRequest': return 'status-refund-request';
      case 'Refunded': return 'status-refunded';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Pending': return 'Chờ xử lý';
      case 'Processing': return 'Đang xử lý';
      case 'Shipped': return 'Đã giao cho shipper';
      case 'Delivered': return 'Đã giao hàng';
      case 'Completed': return 'Hoàn thành';
      case 'Cancelled': return 'Đã hủy';
      case 'RefundRequest': return 'Yêu cầu hoàn tiền';
      case 'Refunded': return 'Đã hoàn tiền';
      default: return status;
    }
  };

  // Lấy thông tin phương thức giao hàng
  const getShippingMethod = () => {
    return shippingMethods.find(method => method.id === order?.shippingMethodID);
  };

  // Tính toán giá sản phẩm (subtotal)
  const calculateSubtotal = () => {
    return order?.orderDetails?.reduce((sum, detail) => sum + (detail.price * detail.quantity), 0) || 0;
  };

  // Tính phí ship
  const getShippingCost = () => {
    const shippingMethod = getShippingMethod();
    return shippingMethod?.price || 0;
  };

  const handleUpdateStatus = () => {
    setShowUpdateModal(true);
  };

  const handleStatusUpdated = () => {
    fetchOrderDetail();
    setShowUpdateModal(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="order-detail-loading">
        <div className="loading-spinner">Đang tải chi tiết đơn hàng...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-detail-error">
        <div className="error-message">{error}</div>
        <div className="error-actions">
          <Button onClick={fetchOrderDetail}>Thử lại</Button>
          <Button variant="outline" onClick={handleGoBack}>Quay lại</Button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-not-found">
        <div className="not-found-message">Không tìm thấy đơn hàng</div>
        <Button variant="outline" onClick={handleGoBack}>Quay lại</Button>
      </div>
    );
  }

  // Tổng số lượng sản phẩm
  const totalQuantity = order.orderDetails.reduce((sum, d) => sum + d.quantity, 0);
  const shippingMethod = getShippingMethod();
  const subtotal = calculateSubtotal();
  const shippingCost = getShippingCost();

  return (
    <div className="order-detail-modern">
      <div className="order-detail-main">
        {/* Header */}
        <div className="order-detail-header">
          <Button variant="outline" onClick={handleGoBack} className="back-btn">
            ← Quay lại
          </Button>
          <div>
            <h1>Chi tiết đơn hàng #{order.orderID}</h1>
            <div className="order-detail-desc">Quản lý thông tin đơn hàng chi tiết</div>
          </div>
        </div>
        
        {/* Thông tin đơn hàng */}
        <div className="order-info-card">
          <h2>Thông tin đơn hàng</h2>
          <div className="info-row"><span>Mã đơn hàng:</span> <b>#{order.orderID}</b></div>
          <div className="info-row"><span>Địa chỉ:</span> {order.address}</div>
          <div className="info-row"><span>Ngày đặt:</span> <b>{formatDate(order.orderDate)}</b></div>
          <div className="info-row"><span>Trạng thái:</span> <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>{getStatusText(order.orderStatus)}</span></div>
          <div className="info-row"><span>Khách hàng:</span> <b>{order.userID}</b></div>
          <div className="info-row"><span>Thanh toán:</span> <span>{order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}</span></div>
          
          {/* Thông tin giao hàng */}
          <div className="info-row">
            <span>Phương thức giao hàng:</span> 
            <span>
              <b>{shippingMethod?.name || 'Không xác định'}</b>
              {shippingMethod?.description && (
                <span className="shipping-desc"> - {shippingMethod.description}</span>
              )}
            </span>
          </div>
          <div className="info-row">
            <span>Phí giao hàng:</span> 
            <span><b>{formatPrice(shippingCost)}</b></span>
          </div>
        </div>
        
        {/* Chi tiết sản phẩm */}
        <div className="order-products-list">
          <h2>Chi tiết sản phẩm</h2>
          {order.orderDetails.map((detail) => {
            const keys = [];
            if (detail.productItemID && detail.productItemID !== 0) keys.push(`item-${detail.productItemID}`);
            if (detail.customProductFileID) keys.push(`custom-${detail.customProductFileID}`);
            const product = productItems[keys[0]];
            
            return (
              <div className="product-card" key={detail.orderDetailID}>
                <div className="product-img-wrap">
                  {product ? (
                    <ProductImg 
                      images={product.productImgs || []} 
                      height={120} 
                      borderRadius={8} 
                      objectFit="cover"
                    />
                  ) : (
                    <div className="no-image">Đang tải...</div>
                  )}
                </div>
                <div className="product-info">
                  <div className="product-name">{product?.name || 'Đang tải...'}</div>
                  <div className="product-sku">Mã: {product?.sku || 'N/A'}</div>
                  <div className="product-qty">Số lượng: {detail.quantity}</div>
                  <div className="product-price">Đơn giá: {formatPrice(detail.price)}</div>
                  <div className="product-subtotal">Thành tiền: <b>{formatPrice(detail.price * detail.quantity)}</b></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Cột phải: Tóm tắt & thao tác nhanh */}
      <div className="order-detail-side">
        <div className="order-summary-card">
          <h2>Tóm tắt đơn hàng</h2>
          <div className="summary-row"><span>Tổng số lượng:</span> <span>{totalQuantity}</span></div>
          <div className="summary-row"><span>Tổng số mặt hàng:</span> <span>{order.orderDetails.length}</span></div>
          
          {/* Chi tiết giá */}
          <div className="summary-divider"></div>
          <div className="summary-row"><span>Tạm tính (sản phẩm):</span> <span>{formatPrice(subtotal)}</span></div>
          <div className="summary-row">
            <span>Phí giao hàng:</span> 
            <span>{formatPrice(shippingCost)}</span>
          </div>
          <div className="summary-row">
            <span className="shipping-method-info">
              ({shippingMethod?.name || 'Không xác định'})
            </span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Tổng tiền:</span> 
            <span className="total-amount">{formatPrice(order.total)}</span>
          </div>
        </div>
        <div className="quick-actions-card">
          <Button onClick={handleUpdateStatus} className="main-action-btn">
            Cập nhật trạng thái
          </Button>
        </div>
      </div>
      
      {/* Modal cập nhật trạng thái */}
      {showUpdateModal && (
        <UpdateOrderStatus
          order={order}
          onClose={() => setShowUpdateModal(false)}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
};

export default OrderDetailPage;