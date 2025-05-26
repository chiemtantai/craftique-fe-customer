import React from 'react';
import './WorkshopPage.css';

const WorkshopPage = () => {
  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="contact-info">
          <span>0935736298</span>
          <span>0783697755</span>
          <span>Craftique0201@gmail.com.vn</span>
        </div>
        <div className="logo-container">
          <h1>Craftique</h1>
        </div>
        <div className="search-cart">
          <div className="search-box">
            <input type="text" placeholder="Tìm kiếm" />
            <button>🔍</button>
          </div>
          <button className="cart-button">Giỏ hàng</button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="main-nav">
        <ul>
          <li><a href="/">Trang chủ</a></li>
          <li><a href="/about">Giới thiệu</a></li>
          <li><a href="/products">Sản phẩm</a></li>
          <li><a href="/workshop" className="active">Workshop</a></li>
          <li><a href="/media">Media</a></li>
          <li><a href="/stories">Chuyện của gốm</a></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="workshop-container">
          <div className="workshop-content">
            <h1 className="workshop-title">Hướng dẫn đăng ký</h1>
            
            <div className="workshop-info">
              <div className="workshop-images">
                <div className="workshop-image">
                  <img src="/api/placeholder/200/150" alt="Hình ảnh Workshop 1" />
                  <p className="image-caption">Hình ảnh Workshop</p>
                </div>
                <div className="workshop-image">
                  <img src="/api/placeholder/200/150" alt="Hình ảnh Workshop 2" />
                </div>
                <div className="workshop-image">
                  <img src="/api/placeholder/200/150" alt="Hình ảnh Workshop 3" />
                </div>
                <div className="workshop-image">
                  <img src="/api/placeholder/200/150" alt="Hình ảnh Workshop 4" />
                </div>
              </div>
              
              <div className="workshop-details">
                <div className="workshop-description">
                  <p>
                    Tại Craftique, không gian rộng và ấm cúng, phù hợp tổ chức các buổi sinh
                    hoạt nhóm, gia đình, teambuilding, sự kiện tham quan, trải nghiệm làm
                    gốm...
                  </p>
                  <p>
                    Đến với không gian trải nghiệm làm gốm thủ công tại Craftique, chúng ta
                    sẽ được:
                  </p>
                  <ul>
                    <li>- Tham quan không gian Craftique, một không gian gốm Nam bộ độc đáo</li>
                    <li>- Tham gia trải nghiệm tự tay làm gốm, nhờ về lần đầu góp, nặn hình
                    những ngôi nhà, thú gốm, sẵn phẩm yêu thích hoặc tự tay xoay góm trên
                    bàn xoay.</li>
                  </ul>
                </div>
                
                <div className="contact-info-section">
                  <p><span className="label">Hotline:</span> <span className="hotline">0935736298</span> | <span className="label">Mail:</span> <a href="mailto:Craftique0201@gmail.com.vn" className="email">Craftique0201@gmail.com.vn</a></p>
                  <p><span className="label">Fanpage:</span> <a href="#" className="link">craftique.studio</a> | <a href="#" className="link">craftique</a></p>
                  <p><span className="label">Social Network:</span> <a href="#" className="link">Instagram</a> | <a href="#" className="link">Facebook</a></p>
                  <p><span className="label">Bảng giá workshop:</span> <a href="#" className="price-link">Bảng giá</a></p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="register-section">
            <button className="register-button">
              <span className="register-icon">📥</span>
              Đăng ký tại đây
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-column">
          <h3>Gốm sứ Craftique</h3>
          <p>0935736298</p>
          <p>0783697755</p>
          <p>Craftique0201@gmail.com.vn</p>
        </div>
        <div className="footer-column">
          <h3>Hỗ trợ</h3>
          <ul>
            <li>Điều khoản giao dịch chung</li>
            <li>Chính sách bảo hành và thông tin hoàn trả</li>
            <li>Chính sách đổi hàng và giao nhận</li>
            <li>Chính sách kiểm hàng</li>
            <li>Chính sách đổi trả và hoàn tiền</li>
            <li>Chính sách báo về thông tin khách hàng</li>
            <li>Chính sách xử lý khiếu nại</li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Đăng ký nhận thông tin</h3>
          <p>Để nhận được những tin mới nhất về Craftique</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Nhập email của bạn" />
            <div className="form-buttons">
              <button className="register-btn">Đăng ký</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WorkshopPage;