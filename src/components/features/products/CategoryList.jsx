import { useState, useEffect } from 'react';
import { categoryService } from '../../../services/categoryService';

function CategoryList({ selectedCategory, onCategoryChange }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error);
      setError('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    onCategoryChange(categoryId === selectedCategory ? null : categoryId);
  };

  if (loading) {
    return (
      <div className="category-list">
        <h3>Danh mục sản phẩm</h3>
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-list">
        <h3>Danh mục sản phẩm</h3>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="category-list">
      <h3>Danh mục sản phẩm</h3>
      <ul className="category-items">
        <li 
          className={`category-item ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => handleCategoryClick(null)}
        >
          Tất cả sản phẩm
        </li>
        {categories.map(category => (
          <li 
            key={category.categoryID}
            className={`category-item ${selectedCategory === category.categoryID ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category.categoryID)}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryList;