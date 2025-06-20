import React, { useState, useEffect } from 'react';
import { blogService } from '../../../services/blogService';

const BlogList = ({ onBlogClick }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAll();
      setBlogs(response.data);
    } catch (err) {
      setError('Không thể tải danh sách blog');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const getCategoryTag = (index) => {
    const categories = ['Sự kiện', 'Khuyến mãi', 'Workshop', 'Kiến thức', 'Hướng dẫn', 'Xu hướng'];
    const colors = ['#8B4513', '#D2691E', '#CD853F', '#A0522D', '#B8860B', '#DAA520'];
    return {
      name: categories[index % categories.length],
      color: colors[index % colors.length]
    };
  };

  if (loading) {
    return <div className="blog-loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="blog-error">{error}</div>;
  }

  return (
    <div className="blog-list">
      {blogs.map((blog, index) => {
        const category = getCategoryTag(index);
        const mainImage = blog.blogImages && blog.blogImages.length > 0 
          ? blog.blogImages[0].imageUrl 
          : '/api/placeholder/300/200';

        return (
          <div 
            key={blog.blogID} 
            className="blog-card"
            onClick={() => onBlogClick(blog.blogID)}
          >
            <div className="blog-image-container">
              <img 
                src={mainImage} 
                alt={blog.title}
                className="blog-image"
                onError={(e) => {
                  e.target.src = '/api/placeholder/300/200';
                }}
              />
              <span 
                className="blog-category-tag"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </span>
            </div>
            
            <div className="blog-content">
              <div className="blog-date">
                📅 {formatDate(blog.uploadDate)}
              </div>
              
              <h3 className="blog-title">{blog.title}</h3>
              
              <p className="blog-excerpt">
                {truncateContent(blog.content)}
              </p>
              
              <div className="blog-meta">
                <div className="blog-author">
                  <span>✍️ {blog.author}</span>
                </div>
                <div className="blog-stats">
                  <span>👁️ {blog.view}</span>
                  <span>❤️ {blog.like}</span>
                </div>
              </div>
              
              <button className="blog-read-more">
                Đọc tiếp
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BlogList;