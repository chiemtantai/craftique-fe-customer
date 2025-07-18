import { useState, useEffect } from 'react';
import { productImgService } from '../../../services/productImgService'

function ProductImg({ 
  productId, 
  images = [], 
  height = 200, 
  borderRadius = 8, 
  objectFit = 'cover',
  showThumbnails = false,
  className = ''
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
      <div className={`product-img-container ${className}`} style={{ height }}>
        <div className="loading-placeholder" style={{ 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#f1f5f9',
          borderRadius,
          fontSize: '12px',
          color: '#64748b'
        }}>
          <span>Đang tải hình ảnh...</span>
        </div>
      </div>
    );
  }

  if (productImages.length === 0) {
    return (
      <div className={`product-img-container ${className}`} style={{ height }}>
        <div className="no-image" style={{ 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#f8fafc',
          borderRadius,
          fontSize: '12px',
          color: '#94a3b8',
          border: '1px dashed #cbd5e1'
        }}>
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

  // Modal xem ảnh lớn
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <div className={`product-img-container ${className}`} style={{ height }}>
        {/* Main Image */}
        <div 
          className="main-image" 
          style={{ 
            cursor: 'pointer', 
            height: '100%', 
            borderRadius,
            overflow: 'hidden',
            position: 'relative'
          }} 
          onClick={handleOpenModal}
        >
          <img 
            src={productImages[currentImageIndex]?.imageUrl} 
            alt="Product" 
            style={{
              width: '100%',
              height: '100%',
              objectFit,
              display: 'block'
            }}
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg'; // Fallback image
            }}
          />
          {/* Navigation arrows for multiple images */}
          {productImages.length > 1 && (
            <>
              <button 
                className="nav-btn prev-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                style={{
                  position: 'absolute',
                  left: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: '0.7',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.7'}
              >
                ‹
              </button>
              <button 
                className="nav-btn next-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: '0.7',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.7'}
              >
                ›
              </button>
            </>
          )}
        </div>
        
        {/* Thumbnails */}
        {showThumbnails && productImages.length > 1 && (
          <div className="thumbnails" style={{ 
            display: 'flex', 
            gap: '8px', 
            marginTop: '8px',
            justifyContent: 'center'
          }}>
            {productImages.map((img, index) => (
              <img
                key={index}
                src={img.imageUrl}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => handleImageClick(index)}
                style={{
                  width: '40px',
                  height: '40px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  border: index === currentImageIndex ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  opacity: index === currentImageIndex ? 1 : 0.7
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Modal xem ảnh lớn */}
      {showModal && (
        <div 
          className="image-preview-modal" 
          onClick={handleCloseModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div 
            className="image-preview-content" 
            onClick={e => e.stopPropagation()} 
            style={{
              padding: '18px', 
              borderRadius: '18px', 
              boxShadow: '0 8px 32px rgba(30,41,59,0.18)', 
              background: '#fff', 
              maxWidth: '90vw', 
              maxHeight: '80vh', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              position: 'relative'
            }}
          >
            <img
              src={productImages[currentImageIndex]?.imageUrl}
              alt="Product Preview"
              style={{ 
                maxWidth: '70vw', 
                maxHeight: '70vh', 
                borderRadius: 12, 
                objectFit: 'contain', 
                background: '#f1f5f9' 
              }}
            />
            <button 
              className="image-preview-close" 
              onClick={handleCloseModal} 
              style={{
                position:'absolute',
                top:8,
                right:12,
                background:'#fff',
                border:'none',
                borderRadius:'50%',
                width:36,
                height:36,
                fontSize:'1.5rem',
                color:'#334155',
                cursor:'pointer',
                boxShadow:'0 2px 8px rgba(30,41,59,0.10)',
                display:'flex',
                alignItems:'center',
                justifyContent:'center'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductImg;