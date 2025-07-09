import React from 'react';
import './CustomProductPage.css';
import { useNavigate } from 'react-router-dom';
import { whiteProducts } from './whiteProducts';
import { FaRegSmile, FaMagic } from 'react-icons/fa';

function CustomProductPage() {
  const navigate = useNavigate();

  const handleCustomClick = (id) => {
    navigate(`/custom-product/${id}`);
  };

  return (
    <div className="custom-product-container">
      <h1>Chọn sản phẩm nền trắng để custom</h1>
      <p className="desc">
        Lựa chọn mẫu chén, bát, đĩa trắng bên dưới để bắt đầu thiết kế sản phẩm gốm sứ theo ý tưởng riêng của bạn!
      </p>
      <div className="white-product-list">
        {whiteProducts.map(product => (
          <div className="white-product-card" key={product.id}>
            <div className="white-product-img-wrapper">
              <img src={product.image} alt={product.name} className="white-product-img" />
              <FaRegSmile className="white-product-icon" />
            </div>
            <h3>{product.name}</h3>
            <p>{product.desc}</p>
            <button className="custom-btn" onClick={() => handleCustomClick(product.id)}>
              <FaMagic style={{marginRight: 8, fontSize: '1.1em'}} /> Custom ngay
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomProductPage;
