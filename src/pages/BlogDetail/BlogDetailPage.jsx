import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import './BlogDetailPage.css';

const BlogDetailPage = () => {
  const { blogID } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchBlogDetail();
  }, [blogID]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      const response = await blogService.getById(blogID);
      setBlog(response.data);
    } catch (err) {
      setError('Không thể tải chi tiết blog');
      console.error('Error fetching blog detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleImageNavigation = (direction) => {
    if (!blog?.blogImages?.length) return;
    
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev === blog.blogImages.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? blog.blogImages.length - 1 : prev - 1
      );
    }
  };

  const handleGoBack = () => {
    navigate('/blog');
  };

  if (loading) {
    return (
      <div className="blog-detail-page">
        <div className="blog-detail-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-detail-page">
        <div className="blog-detail-error">
          <h2>⚠️ Có lỗi xảy ra</h2>
          <p>{error || 'Không tìm thấy bài viết'}</p>
          <button onClick={handleGoBack} className="back-button">
            ← Quay lại danh sách blog
          </button>
        </div>
      </div>
    );
  }

  const mainImage = blog.blogImages && blog.blogImages.length > 0 
    ? blog.blogImages[currentImageIndex].imageUrl 
    : '/api/placeholder/800/400';

  return (
    <div className="blog-detail-page">
      <div className="blog-detail-container">
        {/* Navigation Bar */}
        <div className="blog-nav">
          <button onClick={handleGoBack} className="back-button">
            ← Quay lại danh sách blog
          </button>
          <div className="blog-nav-title">Chuyện của gốm</div>
        </div>

        {/* Article Header */}
        <article className="blog-article">
          <header className="blog-article-header">
            <h1 className="blog-article-title">{blog.title}</h1>
            
            <div className="blog-article-meta">
              <div className="blog-meta-left">
                <span className="blog-author">
                  ✍️ <strong>{blog.author}</strong>
                </span>
                <span className="blog-date">
                  📅 {formatDate(blog.uploadDate)}
                </span>
                {blog.updateDate !== blog.uploadDate && (
                  <span className="blog-update-date">
                    🔄 Cập nhật: {formatDate(blog.updateDate)}
                  </span>
                )}
              </div>
              
              <div className="blog-meta-right">
                <span className="blog-views">👁️ {blog.view.toLocaleString()} lượt xem</span>
                <span className="blog-likes">❤️ {blog.like.toLocaleString()} lượt thích</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {blog.blogImages && blog.blogImages.length > 0 && (
            <div className="blog-image-section">
              <div className="blog-image-container">
                <img 
                  src={mainImage}
                  alt={blog.title}
                  className="blog-featured-image"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/800/400';
                  }}
                />
                
                {blog.blogImages.length > 1 && (
                  <>
                    <button 
                      className="image-nav-button prev"
                      onClick={() => handleImageNavigation('prev')}
                    >
                      ‹
                    </button>
                    <button 
                      className="image-nav-button next"
                      onClick={() => handleImageNavigation('next')}
                    >
                      ›
                    </button>
                    
                    <div className="image-indicators">
                      {blog.blogImages.map((_, index) => (
                        <button
                          key={index}
                          className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {blog.blogImages.length > 1 && (
                <div className="image-thumbnails">
                  {blog.blogImages.map((image, index) => (
                    <img
                      key={image.blogImageID}
                      src={image.imageUrl}
                      alt={`${blog.title} - Hình ${index + 1}`}
                      className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                      onError={(e) => {
                        e.target.src = '/api/placeholder/100/60';
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Article Content */}
          <div className="blog-article-content">
            <div className="blog-content-text">
              {blog.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Article Footer */}
          <footer className="blog-article-footer">
            <div className="blog-tags">
              <span className="tag">Gốm sứ</span>
              <span className="tag">Nghệ thuật</span>
              <span className="tag">Thủ công</span>
            </div>
            
            <div className="blog-social-actions">
              <button className="social-button like">
                ❤️ Thích ({blog.like})
              </button>
              <button className="social-button share">
                🔗 Chia sẻ
              </button>
            </div>
          </footer>
        </article>

        {/* Related Articles Placeholder */}
        <section className="related-articles">
          <h3>Bài viết liên quan</h3>
          <p className="coming-soon">Tính năng đang được phát triển...</p>
        </section>
      </div>
    </div>
  );
};

export default BlogDetailPage;