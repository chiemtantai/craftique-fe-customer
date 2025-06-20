import { useState } from 'react';
import CategoryList from '../../components/features/products/CategoryList';
import ProductItemList from '../../components/features/products/ProductItemList';
import './ProductPage.css';

function ProductPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCartUpdate = (product) => {
    const cartUpdatedEvent = new CustomEvent('cartUpdated', {
      detail: { product, timestamp: Date.now() }
    });
    window.dispatchEvent(cartUpdatedEvent);
    
    // Thêm delay nhỏ để đảm bảo localStorage đã được cập nhật
    setTimeout(() => {
      window.dispatchEvent(new Event('cartUpdated'));
    }, 100);
  };

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
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onCartUpdate={handleCartUpdate}
          />
        </main>
      </div>
    </div>
  );
}

export default ProductPage;