import React from 'react';
import { useNavigate } from 'react-router-dom';
import BlogList from '../../components/features/blogs/BlogList';
import './BlogPage.css';

const BlogPage = () => {
  const navigate = useNavigate();

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  return (
    <div className="blog-page">
      <div className="blog-header">
        <h1 className="blog-main-title">Chuyện của gốm</h1>
        <p className="blog-subtitle">
          Khám phá thế giới gốm sứ qua những câu chuyện thú vị và kiến thức bổ ích
        </p>
      </div>

      <div className="blog-container">
        <div className="blog-content-section">
          <BlogList onBlogClick={handleBlogClick} />
        </div>
      </div>
    </div>
  );
};

export default BlogPage;