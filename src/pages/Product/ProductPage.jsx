import { useState } from 'react';
import CategoryList from '../../components/features/products/CategoryList';
import ProductItemList from '../../components/features/products/ProductItemList';
import './ProductPage.css';

function ProductPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  // const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // const handlePriceRangeChange = (e) => {
  //   const { name, value } = e.target;
  //   setPriceRange(prev => ({
  //     ...prev,
  //     [name]: parseInt(value) || 0
  //   }));
  // };

const handleCartUpdate = (product) => {
    // Dispatch event để Layout component cập nhật cart count ngay lập tức
    const cartUpdatedEvent = new CustomEvent('cartUpdated', {
      detail: { product, timestamp: Date.now() }
    });
    window.dispatchEvent(cartUpdatedEvent);
    
    // Thêm delay nhỏ để đảm bảo localStorage đã được cập nhật
    setTimeout(() => {
      window.dispatchEvent(new Event('cartUpdated'));
    }, 100);
  };

  // const resetFilters = () => {
  //   setSelectedCategory(null);
  //   setSearchTerm('');
  //   setSortBy('default');
  //   setPriceRange({ min: 0, max: 1000000 });
  // };

  return (
    <div className="product-page">
      <div className="page-header">
        <h1>Sản phẩm</h1>
        <p>Khám phá bộ sưu tập gốm sứ thủ công độc đáo</p>
      </div>

      <div className="product-content">
        {/* Sidebar */}
        <aside className="product-sidebar">
          {/* Category Filter */}
          <CategoryList 
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          {/* Price Filter */}
          {/* <div className="filter-section">
            <h3>Lọc theo giá</h3>
            <div className="price-inputs">
              <input
                type="number"
                name="min"
                placeholder="Từ"
                value={priceRange.min}
                onChange={handlePriceRangeChange}
                className="price-input"
              />
              <span>-</span>
              <input
                type="number"
                name="max"
                placeholder="Đến"
                value={priceRange.max}
                onChange={handlePriceRangeChange}
                className="price-input"
              />
            </div>
          </div> */}

          {/* Reset Filters */}
          {/* <button className="reset-filters-btn" onClick={resetFilters}>
            Xóa bộ lọc
          </button> */}
        </aside>

        {/* Main Content */}
        <main className="product-main">
          {/* Search and Sort Bar */}
          <div className="product-controls">
            <div className="search-section">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
              <button className="search-btn">🔍</button>
            </div>

            <div className="sort-section">
              <label htmlFor="sort-select">Sắp xếp:</label>
              <select 
                id="sort-select"
                value={sortBy} 
                onChange={handleSortChange}
                className="sort-select"
              >
                <option value="default">Mặc định</option>
                <option value="name">Tên A-Z</option>
                <option value="price-low">Giá thấp đến cao</option>
                <option value="price-high">Giá cao đến thấp</option>
              </select>
            </div>
          </div>

          {/* Product List */}
          <ProductItemList
            selectedCategory={selectedCategory}
            searchTerm={searchTerm}
            sortBy={sortBy}
            // priceRange={priceRange}
            onCartUpdate={handleCartUpdate}
          />
        </main>
      </div>
    </div>
  );
}

export default ProductPage;