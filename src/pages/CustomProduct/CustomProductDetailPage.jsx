import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { whiteProducts } from "./whiteProducts"; // file data sản phẩm nền trắng
import "./CustomProductDetailPage.css";
import {
  FaUpload,
  FaRegCommentDots,
  FaUser,
  FaPhone,
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaMagic,
} from "react-icons/fa";
import { customProductService } from "../../services/customProductService";
import { customProductFileService } from "../../services/customProductFileService";

function CustomProductDetailPage() {
  // Nhận cả id (productID) và customProductFileID từ URL
  const { id, customProductFileID } = useParams();
  const navigate = useNavigate();

  // State cho chế độ xem chi tiết đơn custom
  const [customDetail, setCustomDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  // Nếu có customProductFileID: lấy chi tiết đơn custom
  useEffect(() => {
    if (customProductFileID) {
      setLoading(true);
      customProductFileService.getDetailById(customProductFileID)
        .then(async (res) => {
          const detail = res.data;
          // Lấy thêm thông tin sản phẩm gốc
          let productData = null;
          try {
            const productRes = await customProductService.getById(detail.productID || detail.customProductID);
            productData = productRes.data;
          } catch {
            productData = null;
          }
          setCustomDetail({ ...detail, productData });
          setLoading(false);
        })
        .catch(() => {
          setCustomDetail(null);
          setLoading(false);
        });
    } else if (id) {
      // Nếu không có customProductFileID: lấy thông tin sản phẩm gốc như cũ
      setLoading(true);
      customProductService
        .getById(id)
        .then((res) => {
          setProduct(res.data);
          setLoading(false);
        })
        .catch(() => {
          setProduct(null);
          setLoading(false);
        });
    }
  }, [id, customProductFileID]);

  const [form, setForm] = useState({
    idea: "",
    imageUrl: "",
    quantity: 1,
    name: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuantity = (delta) => {
    setForm((prev) => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + delta),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gửi link ảnh thay vì upload file
      const uploadRes = await customProductFileService.upload({
        CustomProductID: product.customProductID,
        ImageUrl: form.imageUrl,
        CustomText: form.idea,
        Quantity: form.quantity,
      });
      const customProductFileID = uploadRes.data.customProductFileID;

      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

      const existingIndex = cartItems.findIndex(
        (item) =>
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
          isCustom: true,
          customProductFileID,
          name: product.customName,
          price: product.price,
          quantity: form.quantity,
          imageUrl: product.imageUrl,
          customText: form.idea,
          customImageUrl: form.imageUrl,
          // KHÔNG có id!
        });
      }
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      // Dispatch event để các nơi khác cập nhật giỏ hàng
      window.dispatchEvent(new Event("cartUpdated"));

      alert("Gửi yêu cầu custom thành công và đã thêm vào giỏ hàng!");
      // Optionally: chuyển hướng sang trang giỏ hàng
      // navigate('/cart');
    } catch (err) {
      alert("Gửi yêu cầu thất bại!");
    }
  };

  // Nếu đang loading
  if (loading) return <div>Đang tải dữ liệu...</div>;

  // Nếu có customDetail: hiển thị chi tiết đơn custom
  if (customDetail) {
    const { fileUrl, customProductImageUrl, customProductName, customText, quantity, uploadedAt, productData } = customDetail;
    return (
      <div className="custom-detail-container">
        <div className="custom-detail-left">
          <div className="custom-image-wrapper">
            {fileUrl ? (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <img src={fileUrl} alt="Ảnh khách gửi" className="white-product-img" />
              </a>
            ) : (
              <img src="https://via.placeholder.com/120x120?text=No+Image" alt="Ảnh khách gửi" className="white-product-img" />
            )}
          </div>
          <h2>Ảnh khách gửi</h2>
        </div>
        <div className="custom-detail-right">
          <h1>CHI TIẾT ĐƠN CUSTOM</h1>
          <div className="custom-price">
            {productData?.price?.toLocaleString() || ''}đ <span className="custom-price-note">Giá tuỳ chỉnh</span>
          </div>
          <div className="custom-note">
            <b>Sản phẩm gốc:</b> {productData?.customName || customProductName || 'Không rõ'}
            <div style={{ margin: '12px 0' }}>
              {productData?.imageUrl || customProductImageUrl ? (
                <img src={productData?.imageUrl || customProductImageUrl} alt="Sản phẩm gốc" style={{ maxWidth: 120, borderRadius: 8 }} />
              ) : null}
            </div>
          </div>
          <div className="custom-detail-info-box">
            <div><b>Nội dung custom:</b> {customText || '(Không có)'}</div>
            <div><b>Số lượng:</b> {quantity}</div>
            <div><b>Ngày upload:</b> {uploadedAt ? new Date(uploadedAt).toLocaleString() : ''}</div>
          </div>
          <button className="custom-btn" onClick={() => navigate(-1)} style={{ marginTop: 16 }}>Quay lại</button>
        </div>
      </div>
    );
  }

  // Nếu không có customDetail, hiển thị form đặt custom như cũ
  if (!product) return <div>Không tìm thấy sản phẩm!</div>;


  const totalPrice = (product.price || 0) * (form.quantity || 1);

  return (
    <div className="custom-detail-container">
      <div className="custom-detail-left">
        <div className="custom-image-wrapper">
          {product.imageUrl ? (
            <a href={product.imageUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={product.imageUrl}
                alt={product.customName}
                className="white-product-img"
              />
            </a>
          ) : (
            <img
              src="https://via.placeholder.com/120x120?text=No+Image"
              alt={product.customName}
              className="white-product-img"
            />
          )}
        </div>
        <h2>{product.customName}</h2>
      </div>
      <div className="custom-detail-right">
        <h1>{product.customName.toUpperCase()} IN THEO YÊU CẦU</h1>
        <div className="custom-price">
          {product.price?.toLocaleString()}đ{" "}
          <span className="custom-price-note">Giá tuỳ chỉnh</span>
        </div>
        <div className="custom-note">
          Lưu ý: Giá có thể cập nhật tự động theo số lượng đặt hàng trong giỏ hàng.<br/>
          Bạn có thể gửi ảnh lên 
          <a href="https://postimages.org/" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 500 }}>
            https://postimages.org/
          </a>
          rồi upload link qua đây cho tụi mình nhé!
        </div>
        <form className="custom-detail-form" onSubmit={handleSubmit}>
          {/* Upload box */}
          <div className="custom-upload-box">
            <label className="custom-upload-label-area">
              <div className="custom-upload-icon">
                <FaUpload />
              </div>
              <span className="custom-upload-label">
                Nhập link ảnh | logo (URL)
              </span>
              <div className="custom-upload-desc">
                Dán đường dẫn ảnh (PNG, JPG, ...)
              </div>
              <input
                name="imageUrl"
                type="text"
                placeholder="https://..."
                value={form.imageUrl}
                onChange={handleChange}
                className="custom-upload-input"
              />
            </label>
            {form.imageUrl && (
              <div className="custom-upload-file-info">
                Đã nhập: <span>{form.imageUrl}</span>
              </div>
            )}
          </div>

          {/* Yêu cầu in ấn */}
          <div className="custom-request-box">
            <span className="custom-request-label">
              Nhập yêu cầu in ấn của bạn:
            </span>
            <textarea
              name="idea"
              placeholder="Nhập nội dung bạn muốn in trên sản phẩm, yêu cầu đặc biệt..."
              rows={3}
              onChange={handleChange}
            />
            <div className="custom-request-desc">
              Mô tả chi tiết giúp chúng tôi thực hiện đúng yêu cầu của bạn
            </div>
          </div>

          {/* Số lượng */}
          <div className="custom-qty-box">
            <span className="custom-qty-label">Số lượng:</span>
            <button
              type="button"
              className="custom-qty-btn"
              onClick={() => handleQuantity(-1)}
            >
              -
            </button>
            <span className="custom-qty-value">{form.quantity}</span>
            <button
              type="button"
              className="custom-qty-btn"
              onClick={() => handleQuantity(1)}
            >
              +
            </button>
          </div>

          {/* Nút thêm vào giỏ hàng */}
          <button
            type="submit"
            className="custom-addcart-btn"
            onClick={() =>
              navigate(`/custom-product/${product.customProductID}`)
            }
          >
            <FaShoppingCart style={{ marginRight: 8 }} /> Thêm vào giỏ hàng -{" "}
            {totalPrice.toLocaleString()}đ
          </button>
        </form>
      </div>
    </div>
  );
}

export default CustomProductDetailPage;
