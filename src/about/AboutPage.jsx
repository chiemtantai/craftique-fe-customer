import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Common.css';
import './AboutPage.css'

function AboutPage() {
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
          <li><a href="#" onClick={() => handleNavClick('/about')} className="active">Giới thiệu</a></li>
          <li><a href="#" onClick={() => handleNavClick('/products')}>Sản phẩm</a></li>
          <li><a href="#" onClick={() => handleNavClick('/workshop')}>Workshop</a></li>
          <li><a href="#" onClick={() => handleNavClick('/media')}>Media</a></li>
          <li><a href="#" onClick={() => handleNavClick('/blog')}>Chuyện của gốm</a></li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* About Header */}
        <section className="about-header">
          <h1>Giới thiệu Craftique</h1>
        </section>

        {/* About Content */}
        <section className="about-content">
          <div className="about-text">
            <p>
              <strong>Craftique</strong> là một trang web chuyên cung cấp sản phẩm gốm sứ độc đáo, bao gồm chén, đĩa, ly và gốm sứ secondhand Nhật Bản. Chúng tôi cam kết cung cấp những sản phẩm độc đáo và thủ tự nhiều, đánh biến sắt phải của của và bền vững cho người tiêu dùng.
            </p>
            
            <p>
              Ngoài việc bán sản phẩm gốm sứ, chúng tôi còn tổ chức các buổi <strong>Workshop</strong> học làm việc các nghề thủ côn của những yêu thích kể, cho phép khách hàng tương tác và tận hưởng theo ý kiến. Craftique hướng dẫn đủ hướng hoa trẻ, đức biết là thể tìm Gen Z, những người yêu thích sử sáng tạo và cá tính.
            </p>
            
            <p>
              Ngoài ra, thông qua trang web, chúng tôi cũng cung cấp dể lý do thiết kể thành ảnh dẫn liên sản phẩm. Hơ có thể chọn mẫu sắc, hình dáng và màu sắc theo ý của cho để tạo ra những sản phẩm độc đáo và mang tính cá nhân.
            </p>
            
            <p>
              Đặc biệt, chúng tôi cũng cung cấp những gốm sứ secondhand từ Nhật Bản, mang đến sự đa dạng và phong phú cho bộ sưu tập, cho phép khách hàng khám phá những nét văn hóa độc đáo của đất nước Nhật Bản.
            </p>
            
            <p>
              Về cảm kết về chất lượng và bảo vệ, Craftique không chỉ mang đến những món đồ gốm tinh tế mà còn góp phần vào việc bảo vệ môi trường. Hãy cùng chúng tôi khám phá thế giới gốm sứ đầy sáng tạo nhé!
            </p>
          </div>
        </section>

        {/* Product Gallery */}
        <section className="product-gallery">
          <div className="gallery-grid">
            <div className="gallery-item">
              <img 
                src="https://via.placeholder.com/300x300?text=Heart+Pattern+Ceramics" 
                alt="Heart pattern ceramic collection"
              />
            </div>
            
            <div className="gallery-item">
              <img 
                src="https://via.placeholder.com/300x300?text=Colorful+Bowl+Collection" 
                alt="Colorful ceramic bowls"
              />
            </div>
            
            <div className="gallery-item">
              <img 
                src="https://via.placeholder.com/300x300?text=Pineapple+Teapot+Set" 
                alt="Pineapple shaped teapot and cups"
              />
            </div>
            
            <div className="gallery-item">
              <img 
                src="https://via.placeholder.com/300x300?text=Geometric+Mugs" 
                alt="Geometric design mugs"
              />
            </div>
          </div>
        </section>
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

export default AboutPage;