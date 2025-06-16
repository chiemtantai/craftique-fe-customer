import { useState, useEffect } from 'react';
import { productImgService } from '../../../services/productImgService'

function ProductImg({ productId, images = [] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Nếu có images được truyền từ props, sử dụng trực tiếp
    if (images && images.length > 0) {
      const validImages = images.filter(img => !img.isDeleted);
      setProductImages(validImages);
    } 
    // Nếu có productId, fetch images từ API
    else if (productId) {
      fetchProductImages();
    }
  }, [productId, images]);

  const fetchProductImages = async () => {
    try {
      setLoading(true);
      const response = await productImgService.getAll();
      
      // Lọc images theo productId và loại bỏ những image bị xóa
      const filteredImages = response.data
        .filter(img => img.productId === productId && !img.isDeleted);
      
      setProductImages(filteredImages);
    } catch (error) {
      console.error('Error fetching product images:', error);
      setProductImages([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="product-img-container">
        <div className="loading-placeholder">
          <span>Đang tải hình ảnh...</span>
        </div>
      </div>
    );
  }

  if (productImages.length === 0) {
    return (
      <div className="product-img-container">
        <div className="no-image">
          <span>Không có hình ảnh</span>
        </div>
      </div>
    );
  }

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="product-img-container">
      {/* Main Image */}
      <div className="main-image">
        <img 
          src={productImages[currentImageIndex]?.imageUrl} 
          alt="Product" 
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg'; // Fallback image
          }}
        />
        
        {/* Navigation arrows for multiple images */}
        {productImages.length > 1 && (
          <>
            <button className="img-nav-btn prev" onClick={handlePrevImage}>
              ❮
            </button>
            <button className="img-nav-btn next" onClick={handleNextImage}>
              ❯
            </button>
          </>
        )}
      </div>

      {/* Thumbnail images */}
      {productImages.length > 1 && (
        <div className="thumbnail-container">
          {productImages.map((img, index) => (
            <div 
              key={img.productImgID}
              className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => handleImageClick(index)}
            >
              <img 
                src={img.imageUrl} 
                alt={`Thumbnail ${index + 1}`}
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductImg;