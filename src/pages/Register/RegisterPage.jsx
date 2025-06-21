import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import registerService from '../../services/registerService';
import googleService from '../../services/googleService';
import './RegisterPage.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess('');

    // Validate dữ liệu phía client
    const validation = registerService.validateRegisterData(
      formData.name,
      formData.email,
      formData.password,
      formData.confirmPassword
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      setLoading(false);
      return;
    }

    try {
      await registerService.register(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      
      setSuccess('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Chuyển đến trang login sau 2 giây
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      if (error.errors) {
        // Lỗi validation từ server
        const serverErrors = {};
        Object.keys(error.errors).forEach(key => {
          const fieldName = key.toLowerCase();
          serverErrors[fieldName] = error.errors[key][0] || error.errors[key];
        });
        setErrors(serverErrors);
      } else {
        setErrors({ general: error.message || 'Đăng ký thất bại' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrors({});
    setSuccess('');

    try {
      await googleService.loginWithGoogle();
      navigate('/home');
    } catch (error) {
      setErrors({ general: error.message || 'Đăng nhập Google thất bại' });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="logo-section" onClick={handleBackToHome}>
          <h1 className="brand-name">Craftique</h1>
        </div>
        
        <h2 className="register-title">Đăng Ký</h2>
        
        {errors.general && <div className="error-message">{errors.general}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Họ và tên"
              value={formData.name}
              onChange={handleInputChange}
              required
              className={`register-input ${errors.name ? 'error' : ''}`}
              disabled={loading || googleLoading}
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={`register-input ${errors.email ? 'error' : ''}`}
              disabled={loading || googleLoading}
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleInputChange}
              required
              className={`register-input ${errors.password ? 'error' : ''}`}
              disabled={loading || googleLoading}
            />
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className={`register-input ${errors.confirmPassword ? 'error' : ''}`}
              disabled={loading || googleLoading}
            />
            {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
          </div>
          
          <button type="submit" className="register-button" disabled={loading || googleLoading}>
            {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
          </button>
          
          <div className="divider">
            <span>hoặc</span>
          </div>
          
          <button 
            type="button" 
            className="google-register-button" 
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
            {googleLoading ? 'Đang đăng nhập...' : 'Đăng ký với Google'}
          </button>
          
          <div className="login-link">
            <span>Đã có tài khoản? </span>
            <button type="button" className="link-button" onClick={handleGoToLogin}>
              Đăng nhập ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;