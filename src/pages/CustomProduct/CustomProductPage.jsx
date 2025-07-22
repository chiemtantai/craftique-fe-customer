import React, { useEffect, useState } from "react";
import "./CustomProductPage.css";
import { useNavigate } from "react-router-dom";
import { FaRegSmile, FaMagic } from "react-icons/fa";
import { customProductService } from "../../services/customProductService";

function CustomProductPage() {
  const [customProducts, setCustomProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    customProductService
      .getAll()
      .then((res) => {
        setCustomProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setCustomProducts([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="custom-product-container">
      <h1>Danh sách sản phẩm custom</h1>
      <div className="white-product-list">
        {customProducts.map((product) => (
          <div className="white-product-card" key={product.customProductID}>
            <div className="white-product-img-wrapper">
              <img
                src={
                  product.imageUrl
                    ? product.imageUrl
                    : "https://via.placeholder.com/120x120?text=No+Image"
                }
                alt={product.customName}
                className="white-product-img"
              />
            </div>
            <h3>{product.customName}</h3>
            <p>{product.description}</p>
            <div style={{ color: "#b46b3d", fontWeight: 600, marginBottom: 8 }}>
              {product.price?.toLocaleString()}đ
            </div>
            <button
              className="custom-btn"
              onClick={() =>
                navigate(`/custom-product/${product.customProductID}`)
              }
            >
              <FaMagic style={{ marginRight: 8, fontSize: "1.1em" }} /> Custom
              ngay
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomProductPage;
