import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import accountService from '../../services/accountService';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGoogleInitialized, setIsGoogleInitialized] = useState(false);
  const navigate = useNavigate();

  // Load Google Sign-In API
  useEffect(() => {
    const loadGoogleScript = () => {
      // Kiểm tra xem script đã được load chưa
      if (window.google && window.google.accounts) {
        initializeGoogleSignIn();
        return;
      }

      // Kiểm tra xem script đã tồn tại chưa
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        existingScript.addEventListener('load', initializeGoogleSignIn);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      script.onerror = () => {
        console.error('Failed to load Google Sign-In script');
        setError('Không thể tải Google Sign-In. Vui lòng kiểm tra kết nối mạng.');
      };
      document.head.appendChild(script);
    };

    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        try {
          window.google.accounts.id.initialize({
            client_id: '179173077002-gtmjcru7psvi0397dl9edothj8acjkt1.apps.googleusercontent.com',
            callback: handleGoogleCallback,
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: false
          });
          
          setIsGoogleInitialized(true);
          console.log('Google Sign-In initialized successfully');
        } catch (error) {
          console.error('Failed to initialize Google Sign-In:', error);
          setError('Không thể khởi tạo Google Sign-In.');
        }
      }
    };

    loadGoogleScript();

    // Cleanup function
    return () => {
      // Không cần cleanup Google script vì nó có thể được tái sử dụng
    };
  }, []);

  const handleGoogleCallback = async (response) => {
    if (!response.credential) {
      console.error('No credential received from Google');
      setError('Không nhận được thông tin từ Google. Vui lòng thử lại.');
      return;
    }

    setIsGoogleLoading(true);
    setError('');

    try {
      console.log('Google ID Token received:', response.credential);
      
      // Gọi API backend với Google ID token
      const result = await accountService.googleLogin(response.credential);
      
      if (result.success) {
        console.log('Google login successful:', result.data);
        
        // Hiển thị thông báo thành công (có thể thay bằng toast notification)
        // alert(result.message);
        
        // Redirect đến trang chính
        navigate('/home');
      } else {
        setError(result.message || 'Đăng nhập Google thất bại');
        console.error('Google login failed:', result.error);
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError('Đã xảy ra lỗi khi đăng nhập bằng Google. Vui lòng thử lại.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    if (!isGoogleInitialized) {
      setError('Google Sign-In chưa được khởi tạo. Vui lòng thử lại sau vài giây.');
      return;
    }

    if (window.google && window.google.accounts) {
      setError('');
      setIsGoogleLoading(true);
      
      try {
        // Sử dụng prompt() để hiển thị popup Google Sign-In
        window.google.accounts.id.prompt((notification) => {
          console.log('Google prompt notification:', notification);
          
          if (notification.isNotDisplayed()) {
            const reason = notification.getNotDisplayedReason();
            console.log('Google Sign-In popup was not displayed - reason:', reason);
            
            // Xử lý các trường hợp cụ thể
            if (reason === 'suppressed_by_user') {
              setError('Bạn đã từ chối popup Google. Vui lòng cho phép popup và thử lại.');
            } else if (reason === 'unregistered_origin') {
              setError('Domain không được đăng ký với Google. Vui lòng liên hệ admin.');
            } else {
              setError('Không thể hiển thị popup Google. Vui lòng kiểm tra popup blocker hoặc thử lại.');
            }
            setIsGoogleLoading(false);
          } else if (notification.isSkippedMoment()) {
            const reason = notification.getSkippedReason();
            console.log('Google Sign-In was skipped - reason:', reason);
            setError('Đăng nhập Google bị bỏ qua.');
            setIsGoogleLoading(false);
          } else if (notification.isDismissedMoment()) {
            const reason = notification.getDismissedReason();
            console.log('Google Sign-In was dismissed - reason:', reason);
            
            if (reason === 'credential_returned') {
              // Thành công, callback sẽ được gọi
              console.log('Google credential will be processed by callback');
            } else {
              setError('Đăng nhập Google bị hủy.');
              setIsGoogleLoading(false);
            }
          }
        });
      } catch (error) {
        console.error('Error prompting Google Sign-In:', error);
        setError('Có lỗi khi mở Google Sign-In.');
        setIsGoogleLoading(false);
      }
    } else {
      setError('Google Sign-In chưa được tải. Vui lòng thử lại sau vài giây.');
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Vui lòng nhập email hợp lệ.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await accountService.login(email.trim(), password);
      
      if (result.success) {
        console.log('Login successful:', result.data);
        // alert(result.message); // Có thể thay bằng toast notification
        navigate('/home');
      } else {
        setError(result.message);
        console.error('Login failed:', result.error);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate('/forgot-password');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-section" onClick={handleBackToHome}>
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
              disabled={isLoading || isGoogleLoading}
              autoComplete="email"
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
              disabled={isLoading || isGoogleLoading}
              autoComplete="current-password"
            />
          </div>
          
          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || isGoogleLoading}
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
          
          <div className="divider">
            <span>hoặc</span>
          </div>
          
          <button 
            type="button"
            onClick={handleGoogleSignIn}
            className={`google-login-button ${isGoogleLoading ? 'loading' : ''}`}
            disabled={isLoading || isGoogleLoading || !isGoogleInitialized}
          >
            <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isGoogleLoading ? 'Đang xử lý...' : !isGoogleInitialized ? 'Đang tải Google...' : 'Đăng nhập bằng Google'}
          </button>
          
          <div className="forgot-password">
            <a href="/forgot-password" onClick={handleForgotPassword}>
              Quên mật khẩu?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;