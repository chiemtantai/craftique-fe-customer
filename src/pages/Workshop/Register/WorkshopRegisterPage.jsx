import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workshopService } from '../../../services/workshopService';
import './WorkshopRegisterPage.css';

function WorkshopRegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    workshopName: ''
  });
  const [loading, setLoading] = useState(false);
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }
    
    if (!formData.workshopName.trim()) {
      newErrors.workshopName = 'Vui lòng nhập tên workshop';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess('');

    // Validate dữ liệu phía client
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      await workshopService.create(formData);
      
      setSuccess('Đăng ký workshop thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        workshopName: ''
      });

      // Chuyển về trang workshop sau 3 giây
      setTimeout(() => {
        navigate('/workshop');
      }, 3000);

    } catch (error) {
      if (error.response?.data?.errors) {
        // Lỗi validation từ server
        const serverErrors = {};
        Object.keys(error.response.data.errors).forEach(key => {
          const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
          serverErrors[fieldName] = error.response.data.errors[key][0] || error.response.data.errors[key];
        });
        setErrors(serverErrors);
      } else {
        setErrors({ general: error.response?.data?.message || error.message || 'Đăng ký thất bại' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToWorkshop = () => {
    navigate('/workshop');
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  return (
    <div className="workshop-register-container">
      <div className="workshop-register-card">
        <div className="logo-section" onClick={handleBackToHome}>
          <h1 className="brand-name">Craftique</h1>
        </div>
        
        <h2 className="workshop-register-title">Đăng Ký Workshop</h2>
        
        {errors.general && <div className="error-message">{errors.general}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="workshop-register-form">
          <div className="form-group">
            <input
              type="text"
              name="fullName"
              placeholder="Họ và tên"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className={`workshop-register-input ${errors.fullName ? 'error' : ''}`}
              disabled={loading}
            />
            {errors.fullName && <div className="field-error">{errors.fullName}</div>}
          </div>
          
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={`workshop-register-input ${errors.email ? 'error' : ''}`}
              disabled={loading}
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Số điện thoại"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              className={`workshop-register-input ${errors.phoneNumber ? 'error' : ''}`}
              disabled={loading}
            />
            {errors.phoneNumber && <div className="field-error">{errors.phoneNumber}</div>}
          </div>
          
          <div className="form-group">
            <input
              type="text"
              name="workshopName"
              placeholder="Tên workshop muốn tham gia"
              value={formData.workshopName}
              onChange={handleInputChange}
              required
              className={`workshop-register-input ${errors.workshopName ? 'error' : ''}`}
              disabled={loading}
            />
            {errors.workshopName && <div className="field-error">{errors.workshopName}</div>}
          </div>
          
          <button type="submit" className="workshop-register-button" disabled={loading}>
            {loading ? 'Đang đăng ký...' : 'Đăng Ký Workshop'}
          </button>
          
          <div className="back-link">
            <button type="button" className="link-button" onClick={handleBackToWorkshop}>
              ← Quay lại trang Workshop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WorkshopRegisterPage;