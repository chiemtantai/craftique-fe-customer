import React from 'react';
import Logo from '../../components/ui/Logo';
import FaviconDemo from './FaviconDemo';
import './LogoDemoPage.css';

const LogoDemoPage = () => {
  const handleLogoClick = () => {
    console.log('Logo clicked!');
  };

  return (
    <div className="logo-demo-page">
      <div className="demo-container">
        <h1>Logo Demo</h1>
        <p>Đây là các variant khác nhau của logo Craftique Admin</p>
        
        <div className="demo-section">
          <h2>Logo Mặc định</h2>
          <Logo onClick={handleLogoClick} />
        </div>

        <div className="demo-section">
          <h2>Logo Nhỏ</h2>
          <Logo variant="small" onClick={handleLogoClick} />
        </div>

        <div className="demo-section">
          <h2>Logo Lớn</h2>
          <Logo variant="large" onClick={handleLogoClick} />
        </div>

        <div className="demo-section">
          <h2>Logo với Background khác</h2>
          <div className="demo-backgrounds">
            <div className="bg-light">
              <Logo onClick={handleLogoClick} />
            </div>
            <div className="bg-dark">
              <Logo onClick={handleLogoClick} />
            </div>
          </div>
        </div>

        <div className="demo-section">
          <h2>Logo trong Navbar</h2>
          <div className="navbar-demo">
            <Logo onClick={handleLogoClick} />
            <div className="nav-items">
              <span>Trang chủ</span>
              <span>Sản phẩm</span>
              <span>Giới thiệu</span>
            </div>
          </div>
        </div>

        <FaviconDemo />
      </div>
    </div>
  );
};

export default LogoDemoPage; 