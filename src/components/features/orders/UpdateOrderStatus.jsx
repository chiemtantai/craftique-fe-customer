import React, { useState } from "react";
import { orderService } from '../../../services/orderService';

const UpdateOrderStatus = ({ order, onClose, onStatusUpdated }) => {
  const [newStatus, setNewStatus] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getAvailableStatuses = (currentStatus) => {
    switch (currentStatus) {
      case "Pending":
        return [{ value: "Cancelled", label: "Hủy" }];
      case "Delivered":
        return [{ value: "Completed", label: "Hoàn thành" }];
      case "Completed":
        return [{ value: "RefundRequested", label: "Yêu cầu hoàn tiền" }];
      default:
        return [];
    }
  };

  const availableStatuses = getAvailableStatuses(order.orderStatus);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newStatus) {
      setError("Vui lòng chọn trạng thái mới");
      return;
    }

    if (newStatus === "RefundRequested" && !refundReason.trim()) {
      setError("Vui lòng nhập lý do hoàn tiền");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await orderService.updateOrderStatus(
        order.orderID,
        newStatus,
        newStatus === "RefundRequested" ? refundReason : null
      );

      onStatusUpdated();
    } catch (err) {
      setError("Không thể cập nhật trạng thái đơn hàng");
      console.error("Error updating order status:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Cập nhật trạng thái đơn hàng #{order.orderID}</h3>
        </div>

        <div className="modal-body">
          <div className="order-info">
            <p>
              <strong>Trạng thái hiện tại:</strong> {order.orderStatus}
            </p>
            <p>
              <strong>Tổng tiền:</strong>{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(order.total)}
            </p>
          </div>

          {availableStatuses.length === 0 ? (
            <p className="no-updates">
              Không thể cập nhật trạng thái cho đơn hàng này
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="newStatus">Trạng thái mới:</label>
                <select
                  id="newStatus"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  required
                >
                  <option value="">-- Chọn trạng thái --</option>
                  {availableStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {newStatus === "RefundRequested" && (
                <div className="form-group">
                  <label htmlFor="refundReason">Lý do hoàn tiền:</label>
                  <textarea
                    id="refundReason"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    placeholder="Nhập lý do yêu cầu hoàn tiền..."
                    rows="3"
                    required
                  />
                </div>
              )}

              {error && <div className="error-message">{error}</div>}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={onClose}
                  disabled={loading}
                >
                  Hủy
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? "Đang cập nhật..." : "Cập nhật"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateOrderStatus;
