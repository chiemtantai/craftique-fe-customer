import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Common.css';
import './BlogPage.css';

function BlogPage() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setEmail('');
  };
  
  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

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
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="contact-info">
          <span>📞0987654321</span>
          <span>📞0123456789</span>
          <span>📧Craftique2023@gmail.com</span>
        </div>
        <div className="logo-container">
          <h1 onClick={() => handleNavClick('/')}>Craftique</h1>
        </div>
        <div className="search-cart">
          <div className="search-box">
            <input type="text" placeholder="Tìm kiếm" />
          </div>
          <button className="cart-button"><i className="cart-icon">🛒</i></button>
          <button className="login-nav-button" onClick={handleLoginClick}>Đăng nhập</button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="main-nav">
        <ul>
          <li><a href="#" onClick={() => handleNavClick('/home')}>Trang chủ</a></li>
          <li><a href="#" onClick={() => handleNavClick('/about')}>Giới thiệu</a></li>
          <li><a href="#" onClick={() => handleNavClick('/products')}>Sản phẩm</a></li>
          <li><a href="#" onClick={() => handleNavClick('/workshop')}>Workshop</a></li>
          <li><a href="#" onClick={() => handleNavClick('/media')}>Media</a></li>
          <li><a href="#" onClick={() => handleNavClick('/blog')} className="active">Chuyện của gốm</a></li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="main-content">
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
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-column">
          <h3>Gốm sứ Craftique</h3>
          <p>📞0987654321</p>
          <p>📞0123456789</p>
          <p>📧Craftique2023@gmail.com</p>
        </div>
        
        <div className="footer-column">
          <h3>Hỗ trợ</h3>
          <ul>
            <li>Điều khoản giao dịch chung</li>
            <li>Chính sách mua hàng và thanh toán</li>
            <li>Chính sách vận chuyển và giao nhận</li>
            <li>Chính sách đổi trả và hoàn tiền</li>
            <li>Chính sách bảo mật thông tin</li>
            <li>Chính sách xử lý khiếu nại</li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>Đăng ký nhận thông tin</h3>
          <form onSubmit={handleSubmit} className="newsletter-form">
            <input 
              type="email" 
              placeholder="Nhập email của bạn" 
              value={email}
              onChange={handleEmailChange}
              required
            />
            <div className="form-buttons">
              <button type="submit" className="register-btn">Đăng ký</button>
              <div className="login-buttons">
                <button type="button" className="login-btn" onClick={handleLoginClick}>Đăng nhập</button>
                <button type="button" className="signup-btn">Đăng ký</button>
              </div>
            </div>
          </form>
        </div>
      </footer>
    </div>
  );
}

export default BlogPage;