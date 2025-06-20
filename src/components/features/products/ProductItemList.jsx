import { useState, useEffect } from 'react';
import { productItemService } from '../../../services/productItemService';
import ProductImg from './ProductImg';
import AddToCart from './AddToCart';

function ProductItemList({ selectedCategory, searchTerm, sortBy, onCartUpdate, currentPage, onPageChange }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    pageNumber: 1,
    pageSize: 12,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    pages: []
  });

  useEffect(() => {
    loadProducts();
  }, [currentPage, selectedCategory, searchTerm, sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {
        pageNumber: currentPage,
        pageSize: 10
      };

      // Add category filter if selected
      if (selectedCategory !== null) {
        params.categoryId = selectedCategory;
      }

      // Add search term if provided
      if (searchTerm) {
        params.searchTerm = searchTerm;
      }

      // Add sort parameter
      if (sortBy && sortBy !== 'default') {
        params.sortBy = sortBy;
      }

      const response = await productItemService.getAll(params);
      
      if (response.data) {
        setProducts(response.data.items || []);
        setPagination({
          totalItems: response.data.totalItems || 0,
          pageNumber: response.data.pageNumber || 1,
          pageSize: response.data.pageSize || 12,
          totalPages: response.data.totalPages || 0,
          hasNextPage: response.data.hasNextPage || false,
          hasPreviousPage: response.data.hasPreviousPage || false,
          pages: response.data.pages || []
        });
      }
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
      setError('Không thể tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = (product) => {
    const cartProduct = {
      id: product.productItemID,
      name: product.name,
      price: product.price,
      image: product.productImgs?.[0]?.imageUrl || '/placeholder-image.jpg'
    };
    
    if (onCartUpdate) {
      onCartUpdate(cartProduct);
    }
  };

  const handlePageClick = (pageNumber) => {
    if (onPageChange) {
      onPageChange(pageNumber);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.hasPreviousPage && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="product-list-container">
        <div className="loading">Đang tải sản phẩm...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-list-container">
        <div className="no-products">Không tìm thấy sản phẩm nào</div>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="product-count">
        Hiển thị {products.length} trong tổng số {pagination.totalItems} sản phẩm
      </div>
      
      <div className="products-grid">
        {products.map(product => (
          <div key={product.productItemID} className="product-card">
            <div className="product-image">
              <ProductImg images={product.productImgs || []} />
              {product.quantity <= 0 && (
                <div className="out-of-stock">Hết hàng</div>
              )}
            </div>
            
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              
              <div className="product-details">
                <div className="product-price">
                  {formatPrice(product.price)}
                </div>
                <div className="product-quantity">
                  Còn lại: {product.quantity}
                </div>
              </div>
              
              <div className="product-actions">
                <AddToCart 
                  product={{
                    id: product.productItemID,
                    name: product.name,
                    price: product.price,
                    image: product.productImgs?.[0]?.imageUrl || '/placeholder-image.jpg'
                  }}
                  onCartUpdate={() => handleAddToCart(product)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination">
            {/* Previous Button */}
            <button
              className={`pagination-btn pagination-prev ${!pagination.hasPreviousPage ? 'disabled' : ''}`}
              onClick={handlePreviousPage}
              disabled={!pagination.hasPreviousPage}
            >
              ‹ Trước
            </button>

            {/* Page Numbers */}
            <div className="pagination-numbers">
              {pagination.pages.map(pageNum => (
                <button
                  key={pageNum}
                  className={`pagination-number ${pageNum === pagination.pageNumber ? 'active' : ''}`}
                  onClick={() => handlePageClick(pageNum)}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              className={`pagination-btn pagination-next ${!pagination.hasNextPage ? 'disabled' : ''}`}
              onClick={handleNextPage}
              disabled={!pagination.hasNextPage}
            >
              Sau ›
            </button>
          </div>

          {/* Page Info */}
          <div className="pagination-info">
            Trang {pagination.pageNumber} / {pagination.totalPages}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductItemList;