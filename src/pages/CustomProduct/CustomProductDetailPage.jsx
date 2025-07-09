import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { whiteProducts } from './whiteProducts'; // file data sản phẩm nền trắng
import './CustomProductDetailPage.css';
import { FaUpload, FaRegCommentDots, FaUser, FaPhone, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';

function CustomProductDetailPage() {
  const { id } = useParams();
  const product = whiteProducts.find(p => p.id === Number(id));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Xử lý thêm vào giỏ hàng custom
    alert('Đã gửi yêu cầu custom!');
  };

  if (!product) return <div>Không tìm thấy sản phẩm!</div>;

  return (
    <div className="custom-detail-container">
      <div className="custom-detail-left">
        <img src={product.image} alt={product.name} style={{width: '100%'}} />
        <h2>{product.name}</h2>
      </div>
      <div className="custom-detail-right">
        <h1>{product.name.toUpperCase()} IN THEO YÊU CẦU</h1>
        <div className="custom-price">50.000đ <span className="custom-price-note">Giá tuỳ chỉnh</span></div>
        <div className="custom-note">Lưu ý: Giá có thể cập nhật tự động theo số lượng đặt hàng trong giỏ hàng.</div>
        <form className="custom-detail-form" onSubmit={handleSubmit}>
          {/* Upload box */}
          <div className="custom-upload-box">
            <div className="custom-upload-icon"><FaUpload /></div>
            <span className="custom-upload-label">Thêm hình ảnh, file,... cần in cho sản phẩm này:</span>
            <div className="custom-upload-desc">
              Thêm ảnh | logo | file, ...<br />
              <span style={{fontSize: '0.93em'}}>PNG, JPG, PDF, DOC (Max 5 files)</span>
            </div>
            <input name="image" type="file" accept="image/*,.pdf,.doc" style={{marginBottom: 8}} onChange={handleChange} />
            <button type="button" className="custom-upload-btn">Thêm</button>
          </div>

          {/* Yêu cầu in ấn */}
          <div className="custom-request-box">
            <span className="custom-request-label">Nhập yêu cầu in ấn của bạn:</span>
            <textarea name="idea" placeholder="Nhập nội dung bạn muốn in trên sản phẩm, yêu cầu đặc biệt..." rows={3} required onChange={handleChange} />
            <div className="custom-request-desc">
              Mô tả chi tiết giúp chúng tôi thực hiện đúng yêu cầu của bạn
            </div>
          </div>

          {/* Số lượng */}
          <div className="custom-qty-box">
            <span className="custom-qty-label">Số lượng:</span>
            <button type="button" className="custom-qty-btn" onClick={() => handleQuantity(-1)}><FaMinus /></button>
            <span className="custom-qty-value">{form.quantity}</span>
            <button type="button" className="custom-qty-btn" onClick={() => handleQuantity(1)}><FaPlus /></button>
          </div>

          {/* Nút thêm vào giỏ hàng */}
          <button type="submit" className="custom-addcart-btn">
            <FaShoppingCart style={{marginRight: 8}} /> Thêm vào giỏ hàng - 50.000đ
          </button>
        </form>
      </div>
    </div>
  );
}

export default CustomProductDetailPage;
