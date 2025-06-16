import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCartItems();
  }, []);

  // Load cart items from localStorage
  const loadCartItems = () => {
    try {
      const savedCart = localStorage.getItem("cartItems");
      if (savedCart) {
        const items = JSON.parse(savedCart);
        setCartItems(items);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Update cart items to localStorage
  const updateCartItems = (newItems) => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(newItems));
      setCartItems(newItems);
      // Dispatch event để update cart count
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedItems = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    updateCartItems(updatedItems);
  };

  // Remove item from cart
  const handleRemoveItem = (productId) => {
    const updatedItems = cartItems.filter((item) => item.id !== productId);
    updateCartItems(updatedItems);
  };

  // Clear all cart
  const handleClearCart = () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?"
      )
    ) {
      updateCartItems([]);
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }
    navigate("/purchase-order");
  };

  // Continue shopping
  const handleContinueShopping = () => {
    navigate("/products");
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="loading">Đang tải giỏ hàng...</div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Giỏ hàng của bạn</h1>
        <div className="cart-actions">
          <button
            className="continue-shopping-btn"
            onClick={handleContinueShopping}
          >
            Tiếp tục mua sắm
          </button>
          {cartItems.length > 0 && (
            <button className="clear-cart-btn" onClick={handleClearCart}>
              Xóa tất cả
            </button>
          )}
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Giỏ hàng của bạn đang trống</h2>
          <p>
            Hãy khám phá những sản phẩm gốm sứ thủ công tuyệt đẹp của chúng tôi
          </p>
          <button className="shop-now-btn" onClick={handleContinueShopping}>
            Mua sắm ngay
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img
                    src={item.image || "/placeholder-image.jpg"}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                </div>

                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-price">{formatPrice(item.price)}</p>
                </div>

                <div className="item-quantity">
                  <label>Số lượng:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  <span className="total-label">Tổng:</span>
                  <span className="total-price">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>

                <div className="item-actions">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="remove-btn"
                    title="Xóa sản phẩm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Tóm tắt đơn hàng</h3>

              <div className="summary-row">
                <span>Số lượng sản phẩm:</span>
                <span>
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>

              <div className="summary-row">
                <span>Tạm tính:</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>

              {/* <div className="summary-row">
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div> */}

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>Tổng cộng:</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                Tiến hành thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
