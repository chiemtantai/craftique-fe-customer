import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import accountService from '../../services/accountService'
import AddToCart from '../features/products/AddToCart';
import './Layout.css';

function Layout({ children }) {
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleCartUpdate = () => {
      loadCartItemCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    checkAuthStatus();
    loadCartItemCount();
  }, []);
  
  useEffect(() => {
    checkAuthStatus();
    loadCartItemCount();
  }, [location.pathname]);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load cart item count from localStorage
  const loadCartItemCount = () => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        setCartItemCount(totalCount);
        console.log('Cart count updated:', totalCount); // Debug log
      } else {
        setCartItemCount(0);
      }
    } catch (error) {
      console.error('Error loading cart count:', error);
      setCartItemCount(0);
    }
  };

  useEffect(() => {
    const handleCartUpdate = (event) => {
      // Load lại cart count ngay lập tức
      loadCartItemCount();
      
      // Log để debug
      if (event.detail) {
        console.log('Cart updated with product:', event.detail.product);
      }
    };

    // Lắng nghe cả event thường và custom event
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const checkAuthStatus = () => {
    try {
      const isAuth = accountService.isAuthenticated();
      const currentUser = accountService.getCurrentUser();
      
      setIsLoggedIn(isAuth);
      
      if (isAuth && currentUser) {
        // Ưu tiên hiển thị name, sau đó userName, cuối cùng là userID
        const displayName = currentUser.name || 
                           currentUser.userName || 
                           currentUser.userID ||
                           'User';
        setUserName(displayName);
        console.log('User đã đăng nhập:', displayName);
      } else {
        setUserName('');
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', error);
      setIsLoggedIn(false);
      setUserName('');
    } finally {
      setIsLoading(false);
    }
  };
  
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

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleLogout = () => {
    try {
      // Gọi logout từ accountService (không cần await vì nó không phải async)
      accountService.logout();
      
      // Cập nhật state
      setIsLoggedIn(false);
      setUserName('');
      setShowUserDropdown(false);
      
      console.log('Đăng xuất thành công');
      
      // Điều hướng về trang login
      navigate('/login');
      
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  const isActiveNav = (path) => {
    return location.pathname === path;
  };

  const getDisplayUserName = (name) => {
    if (!name) return 'User';
    return name.length > 20 ? name.substring(0, 20) + '...' : name;
  };

  const handleUserNameClick = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const handleViewOrders = () => {
    setShowUserDropdown(false);
    navigate('/order');
  };

  const handleViewProfile = () => {
    setShowUserDropdown(false);
    navigate('/profile');
  };


  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="contact-info">
          <span>📞0987654321</span>
          <span>📞0123456789</span>
          <span>📧craftique68@gmail.com</span>
        </div>
        <div className="logo-container">
          <h1 onClick={() => handleNavClick('/')}>Craftique</h1>
        </div>
        <div className="search-cart">
          <button className="cart-button" onClick={handleCartClick}>
            <i className="cart-icon">🛒</i>
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </button>
          
          {/* Hiển thị khác nhau dựa trên trạng thái đăng nhập */}
          {isLoading ? (
            <div className="loading-section">
              <span>Đang tải...</span>
            </div>
          ) : isLoggedIn ? (
            <div className="user-section" ref={dropdownRef}>
              <div className="user-dropdown-container">
                <span 
                  className="username clickable" 
                  title={userName}
                  onClick={handleUserNameClick}
                >
                  {getDisplayUserName(userName)} ▼
                </span>
                
                {showUserDropdown && (
                  <div className="user-dropdown">
                    <div className="dropdown-item" onClick={handleViewProfile}>
                      <span className="dropdown-icon">👤</span>
                      Thông tin tài khoản
                    </div>
                    <div className="dropdown-item" onClick={handleViewOrders}>
                      <span className="dropdown-icon">📦</span>
                      Xem đơn hàng
                    </div>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-item logout" onClick={handleLogout}>
                      <span className="dropdown-icon">🚪</span>
                      Đăng xuất
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button className="login-nav-button" onClick={handleLoginClick}>
              Đăng nhập
            </button>
          )}
        </div>
      </header>

      {/* Navigation */}
      <nav className="main-nav">
        <ul>
          <li>
            <a 
              href="#" 
              onClick={() => handleNavClick('/home')} 
              className={isActiveNav('/home') || isActiveNav('/') ? 'active' : ''}
            >
              Trang chủ
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={() => handleNavClick('/about')}
              className={isActiveNav('/about') ? 'active' : ''}
            >
              Giới thiệu
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={() => handleNavClick('/products')}
              className={isActiveNav('/products') ? 'active' : ''}
            >
              Sản phẩm
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={() => handleNavClick('/workshop')}
              className={isActiveNav('/workshop') ? 'active' : ''}
            >
              Workshop
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={() => handleNavClick('/blog')}
              className={isActiveNav('/blog') ? 'active' : ''}
            >
              Chuyện của gốm
            </a>
          </li>
        </ul>
      </nav>

      {/* Main Content - sẽ render các component con */}
      <main className="main-content">
        {children}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-column">
          <h3>Gốm sứ Craftique</h3>
          <p>📞0987654321</p>
          <p>📞0123456789</p>
          <p>📧craftique68@gmail.com</p>
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
                {isLoggedIn ? (
                  <button 
                    type="button" 
                    className="logout-footer-btn" 
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                ) : (
                  <>
                    <button type="button" className="login-btn" onClick={handleLoginClick}>
                      Đăng nhập
                    </button>
                    <button type="button" className="signup-btn">Đăng ký</button>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      </footer>
    </div>
  );
}

export { AddToCart };
export default Layout;