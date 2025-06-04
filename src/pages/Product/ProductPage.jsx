import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import './ProductPage.css';

const ProductPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceFilter, setPriceFilter] = useState({
    under100k: false,
    between100k200k: false,
    above200k: false
  });
  const [sortBy, setSortBy] = useState('default');

  // Fetch categories và products khi component mount
  useEffect(() => {
    fetchCategoriesAndProducts();
  }, []);

  const fetchCategoriesAndProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch categories và products đồng thời
      const [categoriesResult, productsResult] = await Promise.all([
        categoryService.getAllCategories(),
        productService.getAllProductItems()
      ]);

      // Xử lý categories
      if (categoriesResult.success && categoriesResult.data) {
        setCategories(categoriesResult.data);
      } else {
        console.warn('Lỗi khi lấy categories:', categoriesResult.message);
        setCategories([]);
      }

      // Xử lý products
      if (productsResult.success && productsResult.data.items) {
        const mappedProducts = productsResult.data.items.map(item => {
          // Tìm category name từ danh sách categories đã fetch
          const categoryId = item.product?.categoryID || item.categoryID;
          const category = categoriesResult.success && categoriesResult.data 
            ? categoriesResult.data.find(cat => cat.categoryID === categoryId)
            : null;
          
          return {
            id: item.productItemID,
            name: item.product?.name || item.name || 'Sản phẩm không tên',
            categoryId: categoryId,
            categoryName: category?.name || 'Khác',
            price: parseFloat(item.price) || 0,
            priceFormatted: item.price?.toLocaleString('vi-VN') || '0',
            image: item.productImages?.[0]?.imageUrl || '/api/placeholder/200/200',
            description: item.description || item.product?.description || 'Sản phẩm chất lượng cao',
            quantity: item.quantity || 0,
            displayIndex: item.displayIndex || 0,
            isDeleted: item.isDeleted || false
          };
        });
        
        // Lọc bỏ sản phẩm đã bị xóa
        const activeProducts = mappedProducts.filter(product => !product.isDeleted);
        setProducts(activeProducts);
      } else {
        setError(productsResult.message);
        setProducts([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error);
      setCategories([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Tạo danh sách categories với count
  const getCategoriesWithCount = () => {
    const allCount = products.length;
    const categoriesWithCount = [
      { id: 'all', name: 'Tất cả sản phẩm', count: allCount }
    ];

    categories.forEach(category => {
      if (!category.isDeleted) {
        const count = products.filter(p => p.categoryId === category.categoryID).length;
        categoriesWithCount.push({
          id: category.categoryID,
          name: category.name,
          count: count
        });
      }
    });

    return categoriesWithCount;
  };

  // Filter products theo các điều kiện
  const getFilteredProducts = () => {
    let filtered = products;

    // Filter theo category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.categoryId === selectedCategory);
    }

    // Filter theo search term
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter theo giá
    if (priceFilter.under100k || priceFilter.between100k200k || priceFilter.above200k) {
      filtered = filtered.filter(product => {
        const price = product.price;
        return (
          (priceFilter.under100k && price < 100000) ||
          (priceFilter.between100k200k && price >= 100000 && price <= 200000) ||
          (priceFilter.above200k && price > 200000)
        );
      });
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => b.displayIndex - a.displayIndex);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Giữ thứ tự mặc định
        break;
    }

    return filtered;
  };

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId);
    
    // Nếu chọn category cụ thể, có thể fetch products theo category để có dữ liệu mới nhất
 if (categoryId !== 'all') {
      setLoading(true);
      try {
        const result = await categoryService.getProductsByCategory(categoryId);
        if (result.success && result.data.items) {
          const mappedProducts = result.data.items.map(item => {
            // Tìm category name từ danh sách categories hiện tại
            const currentCategoryId = item.product?.categoryID || item.categoryID;
            const category = categories.find(cat => cat.categoryID === currentCategoryId);
            
            return {
              id: item.productItemID,
              name: item.product?.name || item.name || 'Sản phẩm không tên',
              categoryId: currentCategoryId,
              categoryName: category?.name || 'Khác',
              price: parseFloat(item.price) || 0,
              priceFormatted: item.price?.toLocaleString('vi-VN') || '0',
              image: item.productImages?.[0]?.imageUrl || '/api/placeholder/200/200',
              description: item.description || item.product?.description || 'Sản phẩm chất lượng cao',
              quantity: item.quantity || 0,
              displayIndex: item.displayIndex || 0,
              isDeleted: item.isDeleted || false
            };
          });
          
          const activeProducts = mappedProducts.filter(product => !product.isDeleted);
          // Merge với products hiện tại hoặc update toàn bộ tùy logic
          setProducts(prevProducts => {
            const otherCategoryProducts = prevProducts.filter(p => p.categoryId !== categoryId);
            return [...otherCategoryProducts, ...activeProducts];
          });
        }
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm theo category:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePriceFilterChange = (filterType) => {
    setPriceFilter(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  const filteredProducts = getFilteredProducts();
  const categoriesWithCount = getCategoriesWithCount();

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

      {/* Error message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="product-layout">
        {/* Sidebar Filter */}
        <aside className="product-sidebar">
          <div className="filter-section">
            <h3>Danh mục sản phẩm</h3>
            <ul className="category-list">
              {categoriesWithCount.map(category => (
                <li key={category.id}>
                  <button
                    className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(category.id)}
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
                  onChange={() => handlePriceFilterChange('under100k')}
                /> 
                Dưới 100.000đ
              </label>
              <label>
                <input 
                  type="checkbox"
                  checked={priceFilter.between100k200k}
                  onChange={() => handlePriceFilterChange('between100k200k')}
                /> 
                100.000đ - 200.000đ
              </label>
              <label>
                <input 
                  type="checkbox"
                  checked={priceFilter.above200k}
                  onChange={() => handlePriceFilterChange('above200k')}
                /> 
                Trên 200.000đ
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
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
                <option value="newest">Mới nhất</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-message">
              <p>Đang tải sản phẩm...</p>
            </div>
          ) : (
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
                    <p className="product-category">{product.categoryName}</p>
                    <p className="product-description">{product.description}</p>
                    <div className="product-price">{product.priceFormatted}đ</div>
                    <button className="add-to-cart-btn">Thêm vào giỏ</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="no-products">
              <p>Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn.</p>
              <button 
                className="clear-filter-btn"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchTerm('');
                  setPriceFilter({ under100k: false, between100k200k: false, above200k: false });
                }}
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;