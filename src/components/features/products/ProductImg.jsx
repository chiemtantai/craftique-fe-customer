import { useState, useEffect } from 'react';
import { productImgService } from '../../../services/productImgService'

function ProductImg({ productId, images = [] }) {
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

  // Modal xem ảnh lớn
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <div className="product-img-container">
        {/* Main Image */}
        <div className="main-image" style={{ cursor: 'pointer' }} onClick={handleOpenModal}>
          <img 
            src={productImages[currentImageIndex]?.imageUrl} 
            alt="Product" 
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg'; // Fallback image
            }}
          />
        </div>
      </div>
      {/* Modal xem ảnh lớn */}
      {showModal && (
        <div className="image-preview-modal" onClick={handleCloseModal}>
          <div className="image-preview-content" onClick={e => e.stopPropagation()} style={{padding: '18px', borderRadius: '18px', boxShadow: '0 8px 32px rgba(30,41,59,0.18)', background: '#fff', maxWidth: '90vw', maxHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
            <img
              src={productImages[currentImageIndex]?.imageUrl}
              alt="Product Preview"
              style={{ maxWidth: '70vw', maxHeight: '70vh', borderRadius: 12, objectFit: 'contain', background: '#f1f5f9' }}
            />
            <button className="image-preview-close" onClick={handleCloseModal} style={{position:'absolute',top:8,right:12,background:'#fff',border:'none',borderRadius:'50%',width:36,height:36,fontSize:'2rem',color:'#334155',cursor:'pointer',boxShadow:'0 2px 8px rgba(30,41,59,0.10)',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductImg;