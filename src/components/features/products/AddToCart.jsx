import { useState } from 'react';

function AddToCart({ product, onCartUpdate, isCustom = false, customProductFileID }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Hàm thêm sản phẩm vào giỏ hàng
  const handleAddToCart = () => {
    if (!product) {
      console.error('Không có thông tin sản phẩm');
      return;
    }

    setIsAdding(true);

    try {
      // Lấy giỏ hàng hiện tại từ localStorage
      const savedCart = localStorage.getItem('cartItems');
      let cartItems = savedCart ? JSON.parse(savedCart) : [];

      if (isCustom && customProductFileID) {
        // Sản phẩm custom
        cartItems.push({
          isCustom: true,
          customProductFileID,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        });
      } else {
        // Sản phẩm thường
        const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
        if (existingItemIndex !== -1) {
          cartItems[existingItemIndex].quantity += quantity;
        } else {
          cartItems.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity,
          });
        }
      }

      // Lưu vào localStorage
      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      // Dispatch event để update cart count
      window.dispatchEvent(new Event('cartUpdated'));

      // Callback để parent component biết cart đã được update
      if (onCartUpdate) {
        onCartUpdate();
      }

      console.log('Đã thêm sản phẩm vào giỏ hàng:', product.name);
      
      // Reset quantity về 1 sau khi thêm
      setQuantity(1);

      // Hiển thị thông báo (có thể thay bằng toast notification)
      alert(`Đã thêm ${product.name} vào giỏ hàng!`);

    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
      alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng');
    } finally {
      setIsAdding(false);
    }
  };

  // Hàm tăng số lượng
  const handleQuantityIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  // Hàm giảm số lượng
  const handleQuantityDecrease = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  // Hàm thay đổi số lượng bằng input
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  return (
    <div className="add-to-cart-container">
      <div className="quantity-selector compact">
        <label htmlFor="quantity">Số lượng:</label>
        <div className="quantity-controls compact">
          <button 
            type="button" 
            onClick={handleQuantityDecrease}
            disabled={quantity <= 1}
            className="quantity-btn compact"
          >
            -
          </button>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            className="quantity-input compact"
          />
          <button 
            type="button" 
            onClick={handleQuantityIncrease}
            className="quantity-btn compact"
          >
            +
          </button>
        </div>
      </div>
      
      <button
        onClick={handleAddToCart}
        disabled={isAdding || !product}
        className={`add-to-cart-btn ${isAdding ? 'adding' : ''}`}
      >
        {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
      </button>
    </div>
  );
}

export default AddToCart;