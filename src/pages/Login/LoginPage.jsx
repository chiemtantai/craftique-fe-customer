import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import accountService from '../../services/accountService';
import googleService from '../../services/googleService';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await accountService.login(email, password);
      
      if (!accountService.hasCustomerAccess()) {
        accountService.logout();
        setError('Bạn không có quyền truy cập vào hệ thống này. Chỉ Customer được phép.');
        return;
      }

      navigate('/home');
    } catch (error) {
      setError(error.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      await googleService.loginWithGoogle();
      
      if (!accountService.hasCustomerAccess()) {
        googleService.logoutGoogle();
        setError('Bạn không có quyền truy cập vào hệ thống này. Chỉ Customer được phép.');
        return;
      }

      navigate('/home');
    } catch (error) {
      setError(error.message || 'Đăng nhập Google thất bại');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-section" onClick={handleBackToHome}>
          <h1 className="brand-name">Craftique</h1>
        </div>
        
        <h2 className="login-title">Đăng Nhập</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              required
              className="login-input"
              disabled={loading || googleLoading}
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
              disabled={loading || googleLoading}
            />
          </div>
          
          <button type="submit" className="login-button" disabled={loading || googleLoading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
          
          <div className="divider">
            <span>hoặc</span>
          </div>
          
          <button 
            type="button" 
            className="google-login-button" 
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
          >
            <div className="google-icon">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            {googleLoading ? 'Đang đăng nhập...' : 'Đăng nhập với Google'}
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