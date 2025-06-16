import { useState, useEffect } from 'react';
import { productItemService } from '../../../services/productItemService';
import ProductImg from './ProductImg';
import AddToCart from './AddToCart';

function ProductItemList({ selectedCategory, searchTerm, sortBy, onCartUpdate }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productItemService.getAll();
      setProducts(response.data?.items || []);
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
      setError('Không thể tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on category and search term
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === null || 
      product.product?.categoryID === selectedCategory;
    
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch && !product.isDeleted;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return a.displayIndex - b.displayIndex;
    }
  });

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

  if (sortedProducts.length === 0) {
    return (
      <div className="product-list-container">
        <div className="no-products">Không tìm thấy sản phẩm nào</div>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="product-count">
        Hiển thị {sortedProducts.length} sản phẩm
      </div>
      
      <div className="products-grid">
        {sortedProducts.map(product => (
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
    </div>
  );
}

export default ProductItemList;