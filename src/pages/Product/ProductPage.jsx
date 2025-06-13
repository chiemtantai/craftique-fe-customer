import React, { useState, useEffect } from "react";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import "./ProductPage.css";

const ProductPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceFilter, setPriceFilter] = useState({
    under100k: false,
    between100k200k: false,
    above200k: false,
  });
  const [sortBy, setSortBy] = useState("default");
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    fetchCategoriesAndProducts();
  }, []);

  // Hàm xử lý URL hình ảnh
  const processImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl === "") {
      return "/api/placeholder/200/200"; // Fallback image
    }

    // Nếu là URL từ Shopify CDN, thêm https nếu thiếu
    if (imageUrl.startsWith("//")) {
      return `https:${imageUrl}`;
    }

    // Nếu đã có https hoặc http, trả về như cũ
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    // Nếu là đường dẫn tương đối, thêm domain
    if (imageUrl.startsWith("/")) {
      return `https://localhost:7218${imageUrl}`;
    }

    // Trường hợp khác, trả về URL gốc
    return imageUrl;
  };

  const fetchCategoriesAndProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const [categoriesResult, productsResult] = await Promise.all([
        categoryService.getAllCategories(),
        productService.getAllProductItems(),
      ]);

      if (categoriesResult.success && categoriesResult.data) {
        setCategories(categoriesResult.data);
      } else {
        setCategories([]);
      }

      if (productsResult.success && productsResult.data.items) {
        const mappedProducts = productsResult.data.items.map((item) => {
          const categoryId = item.product?.categoryID || item.categoryID;
          const category =
            categoriesResult.success && categoriesResult.data
              ? categoriesResult.data.find(
                  (cat) => cat.categoryID === categoryId
                )
              : null;

          // Xử lý hình ảnh - SỬA ĐỔI TẠI ĐÂY
          let imageUrl = "/api/placeholder/200/200"; // Default fallback

          // Thay đổi từ item.productImages thành item.productImgs
          if (item.productImgs && item.productImgs.length > 0) {
            const firstImage = item.productImgs[0];
            imageUrl = processImageUrl(firstImage.imageUrl);
          }

          return {
            id: item.productItemID,
            name: item.product?.name || item.name || "Sản phẩm không tên",
            categoryId: categoryId,
            categoryName: category?.name || "Khác",
            price: parseFloat(item.price) || 0,
            priceFormatted: item.price?.toLocaleString("vi-VN") || "0",
            image: imageUrl,
            description:
              item.description ||
              item.product?.description ||
              "Sản phẩm chất lượng cao",
            quantity: item.quantity || 0,
            isDeleted: item.isDeleted || false,
            // Thêm thông tin debug - cũng sửa tên trường
            originalImageUrl: item.productImgs?.[0]?.imageUrl || "No image",
          };
        });

        const activeProducts = mappedProducts.filter(
          (product) => !product.isDeleted
        );
        setProducts(activeProducts);

        // Debug: Log để kiểm tra
        console.log(
          "Processed products with images:",
          activeProducts.map((p) => ({
            name: p.name,
            originalImageUrl: p.originalImageUrl,
            processedImageUrl: p.image,
          }))
        );
      } else {
        setError(productsResult.message);
        setProducts([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      setError("Không thể tải sản phẩm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const ProductImage = ({ src, alt, className = "" }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    console.warn(`Failed to load image: ${imgSrc}`);
    setIsLoading(false);
    setHasError(true);
    // Fallback to placeholder
    if (imgSrc !== "/api/placeholder/200/200") {
      setImgSrc("/api/placeholder/200/200");
    }
  };

  useEffect(() => {
    if (src !== imgSrc) {
      setImgSrc(src);
      setIsLoading(true);
      setHasError(false);
    }
  }, [src]);

  return (
    <div className={`image-container ${className}`}>
      {isLoading && !hasError && (
        <div className="image-loading">
          <div className="loading-spinner">Đang tải...</div>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{
          display: hasError && imgSrc === "/api/placeholder/200/200" ? "none" : "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.3s ease"
        }}
      />
      {hasError && imgSrc === "/api/placeholder/200/200" && (
        <div className="image-placeholder">
          <div className="placeholder-content">
            <span>📷</span>
            <p>Không thể tải hình ảnh</p>
          </div>
        </div>
      )}
    </div>
  );
};

  const addToCart = (product) => {
    try {
      if (product.quantity <= 0) {
        alert("Sản phẩm hiện tại đã hết hàng!");
        return;
      }

      const existingCart = JSON.parse(
        localStorage.getItem("cartItems") || "[]"
      );
      const existingItemIndex = existingCart.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex !== -1) {
        const currentQuantityInCart = existingCart[existingItemIndex].quantity;

        if (currentQuantityInCart >= product.quantity) {
          alert(
            `Không thể thêm thêm sản phẩm này. Kho chỉ còn ${product.quantity} sản phẩm!`
          );
          return;
        }

        existingCart[existingItemIndex].quantity += 1;
      } else {
        const cartItem = {
          id: product.id,
          name: product.name,
          categoryId: product.categoryId,
          categoryName: product.categoryName,
          price: product.price,
          image: product.image,
          description: product.description,
          quantity: 1,
          maxQuantity: product.quantity,
        };

        existingCart.push(cartItem);
      }

      localStorage.setItem("cartItems", JSON.stringify(existingCart));
      alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng!");
    }
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const getCategoriesWithCount = () => {
    const allCount = products.length;
    const categoriesWithCount = [
      { id: "all", name: "Tất cả sản phẩm", count: allCount },
    ];

    categories.forEach((category) => {
      if (!category.isDeleted) {
        const count = products.filter(
          (p) => p.categoryId === category.categoryID
        ).length;
        categoriesWithCount.push({
          id: category.categoryID,
          name: category.name,
          count: count,
        });
      }
    });

    return categoriesWithCount;
  };

  const getFilteredProducts = () => {
    let filtered = products;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.categoryId === selectedCategory
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (
      priceFilter.under100k ||
      priceFilter.between100k200k ||
      priceFilter.above200k
    ) {
      filtered = filtered.filter((product) => {
        const price = product.price;
        return (
          (priceFilter.under100k && price < 100000) ||
          (priceFilter.between100k200k && price >= 100000 && price <= 200000) ||
          (priceFilter.above200k && price > 200000)
        );
      });
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  };

  const handlePriceFilterChange = (filterType) => {
    setPriceFilter((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setPriceFilter({
      under100k: false,
      between100k200k: false,
      above200k: false,
    });
    setSortBy("default");
  };

  const filteredProducts = getFilteredProducts();
  const categoriesWithCount = getCategoriesWithCount();

  return (
    <div className="product-page">
      <div className="page-header">
        <h1>Sản phẩm gốm sứ thủ công</h1>
        <p>
          Khám phá bộ sưu tập gốm sứ được chế tác thủ công với tình yêu và sự tỉ
          mỉ
        </p>
      </div>

      <div className="product-search">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="product-layout">
        <aside className="product-sidebar">
          <div className="filter-section">
            <h3>Danh mục sản phẩm</h3>
            <ul className="category-list">
              {categoriesWithCount.map((category) => (
                <li key={category.id}>
                  <button
                    className={`category-btn ${
                      selectedCategory === category.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className="category-name">{category.name}</span>
                    <span className="category-count">({category.count})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-section">
            <h3>Khoảng giá</h3>
            <div className="price-filter">
              <label>
                <input
                  type="checkbox"
                  checked={priceFilter.under100k}
                  onChange={() => handlePriceFilterChange("under100k")}
                />
                Dưới 100.000đ
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={priceFilter.between100k200k}
                  onChange={() => handlePriceFilterChange("between100k200k")}
                />
                100.000đ - 200.000đ
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={priceFilter.above200k}
                  onChange={() => handlePriceFilterChange("above200k")}
                />
                Trên 200.000đ
              </label>
            </div>
          </div>
        </aside>

        <div className="product-main">
          <div className="product-header">
            <div className="product-count">
              Hiển thị {filteredProducts.length} sản phẩm
              {loading && <span> - Đang tải...</span>}
            </div>
            <div className="sort-options">
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Sắp xếp mặc định</option>
                <option value="price-low">Giá thấp đến cao</option>
                <option value="price-high">Giá cao đến thấp</option>
                <option value="name">Theo tên A-Z</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-message">
              <p>Đang tải sản phẩm...</p>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <ProductImage src={product.image} alt={product.name} />
                    <div className="product-overlay">
                      <button
                        className="quick-view-btn"
                        onClick={() => handleQuickView(product)}
                      >
                        Xem nhanh
                      </button>
                    </div>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category">{product.categoryName}</p>
                    <p className="product-description">{product.description}</p>
                    <div className="product-price">
                      {product.priceFormatted}đ
                    </div>
                    <div className="product-stock">
                      {product.quantity > 0 ? (
                        <span className="in-stock">
                          Còn {product.quantity} sản phẩm
                        </span>
                      ) : (
                        <span className="out-of-stock">Hết hàng</span>
                      )}
                    </div>
                    <button
                      className={`add-to-cart-btn ${
                        product.quantity <= 0 ? "disabled" : ""
                      }`}
                      onClick={() => addToCart(product)}
                      disabled={product.quantity <= 0}
                    >
                      {product.quantity > 0 ? "Thêm vào giỏ" : "Hết hàng"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="no-products">
              <p>Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn.</p>
              <button className="clear-filter-btn" onClick={clearFilters}>
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="modal-overlay" onClick={closeQuickView}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeQuickView}>
              ×
            </button>
            <div className="quick-view-content">
              <div className="quick-view-image">
                <ProductImage
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                />
              </div>
              <div className="quick-view-info">
                <h2>{quickViewProduct.name}</h2>
                <p className="quick-view-category">
                  {quickViewProduct.categoryName}
                </p>
                <div className="quick-view-price">
                  {quickViewProduct.priceFormatted}đ
                </div>
                <div className="quick-view-description">
                  <h4>Mô tả:</h4>
                  <p>{quickViewProduct.description}</p>
                </div>
                <div className="quick-view-quantity">
                  <h4>Số lượng còn lại:</h4>
                  <span
                    className={
                      quickViewProduct.quantity > 0
                        ? "in-stock"
                        : "out-of-stock"
                    }
                  >
                    {quickViewProduct.quantity > 0
                      ? `${quickViewProduct.quantity} sản phẩm`
                      : "Hết hàng"}
                  </span>
                </div>
                <button
                  className={`add-to-cart-btn ${
                    quickViewProduct.quantity <= 0 ? "disabled" : ""
                  }`}
                  onClick={() => {
                    addToCart(quickViewProduct);
                    closeQuickView();
                  }}
                  disabled={quickViewProduct.quantity <= 0}
                >
                  {quickViewProduct.quantity > 0
                    ? "Thêm vào giỏ hàng"
                    : "Hết hàng"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
