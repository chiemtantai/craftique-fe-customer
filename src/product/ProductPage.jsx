import React, { useState } from 'react';
import './ProductPage.css';

const ProductPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample product data
  const products = [
    { id: 1, name: 'Ly gốm sứ trắng cao cấp', category: 'ly', price: '125.000', image: '/api/placeholder/200/200', description: 'Ly gốm sứ cao cấp với thiết kế tinh tế' },
    { id: 2, name: 'Chén cơm truyền thống', category: 'chen', price: '85.000', image: '/api/placeholder/200/200', description: 'Chén cơm gốm sứ truyền thống Việt Nam' },
    { id: 3, name: 'Dĩa tráng miệng xinh xắn', category: 'dia', price: '95.000', image: '/api/placeholder/200/200', description: 'Dĩa tráng miệng với họa tiết đẹp mắt' },
    { id: 4, name: 'Ly uống trà hoa sen', category: 'ly', price: '150.000', image: '/api/placeholder/200/200', description: 'Ly trà với họa tiết hoa sen thanh nhã' },
    { id: 5, name: 'Chén súp gốm men', category: 'chen', price: '110.000', image: '/api/placeholder/200/200', description: 'Chén súp gốm với lớp men bóng đẹp' },
    { id: 6, name: 'Dĩa cơm gia đình', category: 'dia', price: '75.000', image: '/api/placeholder/200/200', description: 'Dĩa cơm size lớn cho gia đình' },
    { id: 7, name: 'Ly cà phê espresso', category: 'ly', price: '135.000', image: '/api/placeholder/200/200', description: 'Ly cà phê espresso phong cách Italy' },
    { id: 8, name: 'Set chén đĩa cao cấp', category: 'set', price: '450.000', image: '/api/placeholder/200/200', description: 'Bộ chén đĩa cao cấp 6 món' },
    { id: 9, name: 'Ly thủy tinh trong suốt', category: 'ly', price: '65.000', image: '/api/placeholder/200/200', description: 'Ly thủy tinh cao cấp trong suốt' },
    { id: 10, name: 'Chén trà đạo Nhật Bản', category: 'chen', price: '180.000', image: '/api/placeholder/200/200', description: 'Chén trà đạo phong cách Nhật Bản' },
    { id: 11, name: 'Dĩa salad ceramic', category: 'dia', price: '120.000', image: '/api/placeholder/200/200', description: 'Dĩa salad ceramic màu pastel' },
    { id: 12, name: 'Ly sinh tố đáy dày', category: 'ly', price: '90.000', image: '/api/placeholder/200/200', description: 'Ly sinh tố với đáy dày chống vỡ' }
  ];

  const categories = [
    { id: 'all', name: 'Tất cả sản phẩm', count: products.length },
    { id: 'ly', name: 'Ly', count: products.filter(p => p.category === 'ly').length },
    { id: 'chen', name: 'Chén', count: products.filter(p => p.category === 'chen').length },
    { id: 'dia', name: 'Dĩa', count: products.filter(p => p.category === 'dia').length },
    { id: 'set', name: 'Set đồ ăn', count: products.filter(p => p.category === 'set').length }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="product-page">
      <div className="page-header">
        <h1>Sản phẩm gốm sứ thủ công</h1>
        <p>Khám phá bộ sưu tập gốm sứ được chế tác thủ công với tình yêu và sự tỉ mỉ</p>
      </div>

      {/* Search Bar */}
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

      <div className="product-layout">
        {/* Sidebar Filter */}
        <aside className="product-sidebar">
          <div className="filter-section">
            <h3>Danh mục sản phẩm</h3>
            <ul className="category-list">
              {categories.map(category => (
                <li key={category.id}>
                  <button
                    className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
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
                <input type="checkbox" /> Dưới 100.000đ
              </label>
              <label>
                <input type="checkbox" /> 100.000đ - 200.000đ
              </label>
              <label>
                <input type="checkbox" /> Trên 200.000đ
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="product-main">
          <div className="product-header">
            <div className="product-count">
              Hiển thị {filteredProducts.length} sản phẩm
            </div>
            <div className="sort-options">
              <select className="sort-select">
                <option value="default">Sắp xếp mặc định</option>
                <option value="price-low">Giá thấp đến cao</option>
                <option value="price-high">Giá cao đến thấp</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>
          </div>

          <div className="product-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-overlay">
                    <button className="quick-view-btn">Xem nhanh</button>
                  </div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-price">{product.price}đ</div>
                  <button className="add-to-cart-btn">Thêm vào giỏ</button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="no-products">
              <p>Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;