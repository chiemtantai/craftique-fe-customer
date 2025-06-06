import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartPage.css'

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load cart items from localStorage on component mount
  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      }
    } catch (error) {
      console.error('Error loading cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save cart items to localStorage
  const saveCartItems = (items) => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart items:', error);
    }
  };

  // Update quantity of an item
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }

    const updatedItems = cartItems.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCartItems(updatedItems);
    saveCartItems(updatedItems);
  };

  // Remove item from cart
  const removeItem = (productId) => {
    const updatedItems = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedItems);
    saveCartItems(updatedItems);
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  // Continue shopping
  const continueShopping = () => {
    navigate('/products');
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Giỏ hàng của bạn đang trống!');
      return;
    }
    // Navigate to checkout page or show checkout modal
    console.log('Proceeding to checkout with items:', cartItems);
    alert('Chức năng thanh toán sẽ được phát triển sau!');
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="loading-message">
          <p>Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="page-header">
        <h1>Giỏ hàng của bạn</h1>
        {cartItems.length > 0 && (
          <p>Bạn có {cartItems.length} sản phẩm trong giỏ hàng</p>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Giỏ hàng của bạn đang trống</h2>
          <p>Hãy khám phá những sản phẩm gốm sứ thủ công tuyệt đẹp của chúng tôi</p>
          <button className="continue-shopping-btn" onClick={continueShopping}>
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-header">
              <span className="header-product">Sản Phẩm</span>
              <span className="header-price">Đơn Giá</span>
              <span className="header-quantity">Số Lượng</span>
              <span className="header-total">Thành Tiền</span>
              <span className="header-action">Thao Tác</span>
            </div>

            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-product">
                  <img src={item.image} alt={item.name} className="item-image" />
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-category">{item.categoryName}</p>
                    <p className="item-description">{item.description}</p>
                  </div>
                </div>

                <div className="item-price">
                  {item.price.toLocaleString('vi-VN')}đ
                </div>

                <div className="item-quantity">
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn minus"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button 
                      className="quantity-btn plus"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                </div>

                <div className="item-action">
                  <button 
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                    title="Xóa sản phẩm"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Tóm tắt đơn hàng</h3>
              
              <div className="summary-row">
                <span>Tạm tính:</span>
                <span>{calculateTotal().toLocaleString('vi-VN')}đ</span>
              </div>
              
              <div className="summary-row">
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              
              <div className="summary-row total-row">
                <span>Tổng cộng:</span>
                <span className="total-price">{calculateTotal().toLocaleString('vi-VN')}đ</span>
              </div>

              <div className="cart-actions">
                <button className="continue-shopping-btn" onClick={continueShopping}>
                  Tiếp tục mua sắm
                </button>
                <button className="checkout-btn" onClick={proceedToCheckout}>
                  Thanh toán
                </button>
              </div>

              <div className="cart-footer-actions">
                <button className="clear-cart-btn" onClick={clearCart}>
                  Xóa toàn bộ giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;