import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { whiteProducts } from './whiteProducts'; // file data sản phẩm nền trắng
import './CustomProductDetailPage.css';
import { FaUpload, FaRegCommentDots, FaUser, FaPhone, FaPlus, FaMinus, FaShoppingCart, FaMagic } from 'react-icons/fa';
import { customProductService } from '../../services/customProductService';
import { customProductFileService } from '../../services/customProductFileService';

function CustomProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    customProductService.getById(id)
      .then(res => setProduct(res.data))
      .catch(() => setProduct(null));
  }, [id]);

  const [form, setForm] = useState({
    idea: '',
    image: null,
    quantity: 1,
    name: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleQuantity = (delta) => {
    setForm(prev => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + delta)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await customProductFileService.upload({
        CustomProductID: product.customProductID,
        File: form.image,
        CustomText: form.idea,
        Quantity: form.quantity,
      });

      // --- Logic thêm vào giỏ hàng giống sản phẩm thường ---
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      // Kiểm tra đã có sản phẩm custom này (theo customProductID và customText) chưa
      const existingIndex = cartItems.findIndex(
        item =>
          item.id === product.customProductID &&
          item.isCustom === true &&
          item.customText === form.idea
      );

      if (existingIndex !== -1) {
        // Nếu đã có, cộng dồn số lượng
        cartItems[existingIndex].quantity += form.quantity;
      } else {
        // Nếu chưa có, thêm mới
        cartItems.push({
          id: product.customProductID,
          name: product.customName,
          price: product.price,
          quantity: form.quantity,
          imageUrl: product.imageUrl,
          isCustom: true,
          customText: form.idea,
          // Có thể thêm customFileName nếu muốn show file đã upload
        });
      }
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      // Dispatch event để các nơi khác cập nhật giỏ hàng
      window.dispatchEvent(new Event('cartUpdated'));

      alert("Gửi yêu cầu custom thành công và đã thêm vào giỏ hàng!");
      // Optionally: chuyển hướng sang trang giỏ hàng
      // navigate('/cart');
    } catch (err) {
      alert("Gửi yêu cầu thất bại!");
    }
  };

  if (!product) return <div>Không tìm thấy sản phẩm!</div>;

  const API_BASE_URL = "https://localhost:7218";
  const totalPrice = (product.price || 0) * (form.quantity || 1);

  return (
    <div className="custom-detail-container">
      <div className="custom-detail-left">
        <div className="custom-image-wrapper">
          <img
            src={product.imageUrl ? API_BASE_URL + product.imageUrl : 'https://via.placeholder.com/120x120?text=No+Image'}
            alt={product.customName}
            className="white-product-img"
          />
        </div>
        <h2>{product.customName}</h2>
      </div>
      <div className="custom-detail-right">
        <h1>{product.customName.toUpperCase()} IN THEO YÊU CẦU</h1>
        <div className="custom-price">{product.price?.toLocaleString()}đ <span className="custom-price-note">Giá tuỳ chỉnh</span></div>
        <div className="custom-note">Lưu ý: Giá có thể cập nhật tự động theo số lượng đặt hàng trong giỏ hàng.</div>
        <form className="custom-detail-form" onSubmit={handleSubmit}>
          {/* Upload box */}
          <div className="custom-upload-box">
            <label htmlFor="custom-file-upload" className="custom-upload-label-area">
              <div className="custom-upload-icon"><FaUpload /></div>
              <span className="custom-upload-label">Thêm ảnh | logo | file, ...</span>
              <div className="custom-upload-desc">
                PNG, JPG, PDF, DOC (Max 5 files)
              </div>
              <input
                id="custom-file-upload"
                name="image"
                type="file"
                accept="image/*,.pdf,.doc"
                style={{ display: "none" }}
                onChange={handleChange}
              />
              <button
                type="button"
                className="custom-upload-btn"
                tabIndex={-1}
                style={{ pointerEvents: "none" }}
                disabled
              >
                Thêm
              </button>
            </label>
            {form.image && (
              <div className="custom-upload-file-info">
                Đã chọn: <span>{form.image.name}</span>
              </div>
            )}
          </div>

          {/* Yêu cầu in ấn */}
          <div className="custom-request-box">
            <span className="custom-request-label">Nhập yêu cầu in ấn của bạn:</span>
            <textarea name="idea" placeholder="Nhập nội dung bạn muốn in trên sản phẩm, yêu cầu đặc biệt..." rows={3} onChange={handleChange} />
            <div className="custom-request-desc">
              Mô tả chi tiết giúp chúng tôi thực hiện đúng yêu cầu của bạn
            </div>
          </div>

          {/* Số lượng */}
          <div className="custom-qty-box">
            <span className="custom-qty-label">Số lượng:</span>
            <button type="button" className="custom-qty-btn" onClick={() => handleQuantity(-1)}>-</button>
            <span className="custom-qty-value">{form.quantity}</span>
            <button type="button" className="custom-qty-btn" onClick={() => handleQuantity(1)}>+</button>
          </div>

          {/* Nút thêm vào giỏ hàng */}
          <button
            type="submit"
            className="custom-addcart-btn"
            onClick={() => navigate(`/custom-product/${product.customProductID}`)}
          >
            <FaShoppingCart style={{marginRight: 8}} /> Thêm vào giỏ hàng - {totalPrice.toLocaleString()}đ
          </button>
        </form>
      </div>
    </div>
  );
}

export default CustomProductDetailPage;
