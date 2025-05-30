import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Common.css';
import './HomePage.css';

function HomePage() {
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
          <li><a href="#" onClick={() => handleNavClick('/home')} className="active">Trang chủ</a></li>
          <li><a href="#" onClick={() => handleNavClick('/about')}>Giới thiệu</a></li>
          <li><a href="#" onClick={() => handleNavClick('/products')}>Sản phẩm</a></li>
          <li><a href="#" onClick={() => handleNavClick('/workshop')}>Workshop</a></li>
          <li><a href="#" onClick={() => handleNavClick('/media')}>Media</a></li>
          <li><a href="#" onClick={() => handleNavClick('/blog')}>Chuyện của gốm</a></li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Featured Products Section */}
        <section className="product-section">
          <h2>Các mẫu bán chạy</h2>
          <div className="product-grid">
            <div className="product-card">
              <img src="https://via.placeholder.com/300x300" alt="Colorful ceramic plates" />
            </div>
            <div className="product-card">
              <img src="https://via.placeholder.com/300x300" alt="Milk cups and saucers" />
            </div>
            <div className="product-card">
              <img src="https://via.placeholder.com/300x300" alt="Cute bear mug" />
            </div>
          </div>
        </section>

        {/* Custom Ceramics Section */}
        <section className="product-section">
          <h2>Ly sứ in hình theo yêu cầu</h2>
          <div className="product-grid">
            <div className="product-card">
              <img src="https://via.placeholder.com/300x300" alt="Custom printed mugs" />
            </div>
            <div className="product-card">
              <img src="https://via.placeholder.com/300x300" alt="Photo printed mugs" />
            </div>
          </div>
        </section>

        {/* Japanese Secondhand Ceramics */}
        <section className="product-section">
          <h2>Gốm secondhand Nhật Bản</h2>
          <div className="product-grid">
            <div className="product-card">
              <img src="https://via.placeholder.com/300x300" alt="Japanese ceramics collection" />
            </div>
            <div className="product-card">
              <img src="https://via.placeholder.com/300x300" alt="Vintage Japanese pottery" />
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

export default HomePage;