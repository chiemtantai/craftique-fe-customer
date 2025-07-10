
import React, { useEffect, useState } from 'react';
import './OrderPage.css';
import orderService from '../../services/orderService';
import { useNavigate } from 'react-router-dom';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    orderService.getAll()
      .then(res => {
        console.log('Order data:', res.data.orders); // Xem object thực tế
        setOrders(res.data.orders);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchSearch =
      order.orderID.toString().includes(searchText) ||
      (order.address && order.address.toLowerCase().includes(searchText.toLowerCase()));
    const matchStatus = statusFilter ? order.orderStatus === statusFilter : true;
    return matchSearch && matchStatus;
  });

  return (
    <div className="order-page">
      <div className="order-page-header">
        <h1>Quản lý đơn hàng</h1>
        <p className="order-page-desc">Theo dõi và quản lý tất cả đơn hàng của bạn</p>
      </div>
      <div className="order-search-card">
        <div className="search-container">
          <span className="search-icon">
            <svg width="20" height="20" fill="none"><path d="M19 19l-4-4m2-5A7 7 0 1 1 5 5a7 7 0 0 1 12 5Z" stroke="#b46b3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          <input
            className="search-input"
            type="text"
            placeholder="Tìm kiếm theo mã đơn hàng, địa chỉ..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </div>
        <div className="filter-container">
          <select
            className="status-filter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Pending">Chờ xử lý</option>
            <option value="Cancelled">Đã hủy</option>
            <option value="Completed">Hoàn thành</option>
          </select>
        </div>
      </div>
      <div className="order-table-container">
        {loading ? (
          <div>Đang tải...</div>
        ) : (
          <table className="order-table">
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Ngày đặt</th>
                <th>Địa chỉ giao hàng</th>
                <th>Phương thức thanh toán</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6}>Bạn chưa có đơn hàng nào.</td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr
                    key={order.orderID}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/order/${order.orderID}`)}
                  >
                    <td className="order-id">#{order.orderID}</td>
                    <td className="order-date">{new Date(order.orderDate).toLocaleString()}</td>
                    <td className="order-address">{order.address}</td>
                    <td>
                      <span className="payment-method">{order.paymentMethod}</span>
                    </td>
                    <td className="order-total">{order.total} đ</td>
                    <td>
                      <span className={`status-badge status-${order.orderStatus.toLowerCase()}`}>
                        {order.orderStatus}
                      </span>
                      {order.orderStatus === 'Pending' && (
                        <button
                          className="cancel-btn"
                          style={{ marginLeft: 8 }}
                          onClick={async (e) => {
                            e.stopPropagation();
                            await orderService.cancelOrder(order.orderID);
                            orderService.getAll().then(res => setOrders(res.data.orders));
                          }}
                        >
                          Hủy
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderPage;