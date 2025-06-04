import { useState } from 'react';
import './BlogPage.css';

function BlogPage() {
  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "LỄ HỘI HOA GỐM - KHÁM PHÁ NGHỆ THUẬT TRUYỀN THỐNG VỚI DI SẢN THỦ CÔNG",
      date: "15.03.2025",
      image: "https://via.placeholder.com/400x250",
      excerpt: "Hòa mình vào không gian sáng tạo với hàng trăm tác phẩm gốm nghệ thuật, cùng có hội tự tay chế tác những sản phẩm mang dấu ấn riêng.",
      category: "Sự kiện"
    },
    {
      id: 2,
      title: "SỰ KIỆN TRI ÂN - NHẬN NGAY QUÀ TẶNG GỐM THỦ CÔNG ĐỘC QUYỀN",
      date: "05.04.2025",
      image: "https://via.placeholder.com/400x250",
      excerpt: "🎁 Tuần lễ tri ân khách hàng chính thức bắt đầu! Đến ngay Vườn Nhà Gốm để nhận quà tặng đặc biệt và tham gia các hoạt động vui chơi hấp dẫn!",
      category: "Khuyến mãi"
    },
    {
      id: 3,
      title: "THỦ TÁI HOA SỨ - VẺ GỐM THEO PHONG CÁCH RIÊNG",
      date: "22.03.2025",
      image: "https://via.placeholder.com/400x250",
      excerpt: "🏺 Không cần biết vẽ, chỉ cần yêu thích nghệ thuật! Hướng dẫn chi tiết từ nghệ nhân sẽ giúp bạn tạo nên những sản phẩm mang dấu ấn cá nhân.",
      category: "Workshop"
    },
    {
      id: 4,
      title: "NGHỆ THUẬT GỐM SỨ VIỆT NAM - TRUYỀN THỐNG VÀ HIỆN ĐẠI",
      date: "10.03.2025",
      image: "https://via.placeholder.com/400x250",
      excerpt: "Khám phá hành trình phát triển của nghệ thuật gốm sứ Việt Nam từ những làng nghề truyền thống đến các xu hướng hiện đại ngày nay.",
      category: "Kiến thức"
    },
    {
      id: 5,
      title: "CÁCH BẢO QUẢN GỐM SỨ ĐỂ SẢN PHẨM BỀN ĐẸP THEO THỜI GIAN",
      date: "28.02.2025",
      image: "https://via.placeholder.com/400x250",
      excerpt: "Những mẹo nhỏ giúp bạn bảo quản đồ gốm sứ đúng cách, giữ cho sản phẩm luôn bền đẹp và tăng tuổi thọ sử dụng.",
      category: "Hướng dẫn"
    },
    {
      id: 6,
      title: "GỐM SECONDHAND NHẬT BẢN - XU HƯỚNG SỐNG BỀN VỮNG",
      date: "15.02.2025",
      image: "https://via.placeholder.com/400x250",
      excerpt: "Tìm hiểu về xu hướng sử dụng gốm secondhand Nhật Bản - không chỉ tiết kiệm mà còn góp phần bảo vệ môi trường.",
      category: "Xu hướng"
    }
  ];

  const categories = ["Tất cả", "Sự kiện", "Workshop", "Kiến thức", "Hướng dẫn", "Khuyến mãi", "Xu hướng"];
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const filteredPosts = selectedCategory === "Tất cả" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="blog-page">
      <div className="page-header">
        <h1>Chuyện của gốm</h1>
        <p>Khám phá thế giới gốm sứ qua những câu chuyện thú vị và kiến thức bổ ích</p>
      </div>

      <div className="blog-layout">
        {/* Blog Sidebar */}
        <aside className="blog-sidebar">
          <div className="sidebar-section">
            <h3>Danh mục bài viết</h3>
            <ul className="category-list">
              {categories.map(category => (
                <li key={category}>
                  <button
                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-section">
            <h3>Bài viết nổi bật</h3>
            <div className="featured-posts">
              {blogPosts.slice(0, 3).map(post => (
                <div key={post.id} className="featured-post">
                  <img src={post.image} alt={post.title} />
                  <div className="featured-post-content">
                    <h4>{post.title}</h4>
                    <span className="post-date">{post.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Blog Main */}
        <div className="blog-main">
          <div className="blog-header">
            <div className="post-count">
              Hiển thị {filteredPosts.length} bài viết
            </div>
            <div className="sort-options">
              <select className="sort-select">
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="popular">Phổ biến</option>
              </select>
            </div>
          </div>

          <div className="blog-grid">
            {filteredPosts.map(post => (
              <article key={post.id} className="blog-card">
                <div className="blog-image">
                  <img src={post.image} alt={post.title} />
                  <div className="blog-category">{post.category}</div>
                </div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="blog-date">{post.date}</span>
                  </div>
                  <h2 className="blog-title">{post.title}</h2>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <button className="read-more-btn">Đọc tiếp</button>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="no-posts">
              <p>Không tìm thấy bài viết nào trong danh mục này.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogPage;