import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import accountService from '../../services/accountService';
import './LoginPage.css';
// import logoImage from './assets/craftique-logo.png'; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Xóa error khi user bắt đầu nhập lại
    if (error) setError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Xóa error khi user bắt đầu nhập lại
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await accountService.login(email, password);
      
      if (result.success) {
        // Đăng nhập thành công
        console.log('Login successful:', result.data);
        
        // Hiển thị thông báo thành công (tùy chọn)
        alert(result.message);
        
        // Redirect đến trang chính hoặc dashboard
        navigate('/home'); // Thay đổi route theo ý muốn
      } else {
        // Đăng nhập thất bại
        setError(result.message);
        console.error('Login failed:', result.error);
      }
    } catch (error) {
      // Xử lý lỗi không mong muốn
      console.error('Unexpected error:', error);
      setError('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-section" onClick={handleBackToHome}>
          {/* <img src={logoImage} alt="Craftique Logo" className="login-logo" /> */}
          <h1 className="brand-name">Craftique</h1>
        </div>
        
        <h2 className="login-title">Đăng Nhập</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              required
              className="login-input"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              placeholder="Mật Khẩu"
              value={password}
              onChange={handlePasswordChange}
              required
              className="login-input"
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
          
          <div className="forgot-password">
            <a href="/forgot-password">Quên mật khẩu?</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;