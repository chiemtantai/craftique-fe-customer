import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { orderService } from '../../../services/orderService';

function PaymentCallback() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Đang xử lý thanh toán...');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Sử dụng useRef để đảm bảo chỉ xử lý một lần
  const isProcessing = useRef(false);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Ngăn chặn xử lý nhiều lần
    if (hasProcessed.current || isProcessing.current) {
      return;
    }
    
    handlePaymentCallback();
  }, []);

  const handlePaymentCallback = async () => {
    // Kiểm tra nếu đang xử lý hoặc đã xử lý rồi
    if (isProcessing.current || hasProcessed.current) {
      return;
    }

    // Đánh dấu đang xử lý
    isProcessing.current = true;

    try {
      const code = searchParams.get('code');
      const id = searchParams.get('id');
      const status = searchParams.get('status');
      const cancel = searchParams.get('cancel');
      const orderCode = searchParams.get('orderCode');

      console.log('Payment callback params:', {
        code, id, status, cancel, orderCode
      });

      // If payment was cancelled
      if (cancel === 'true') {
        setMessage('Thanh toán đã bị hủy.');
        hasProcessed.current = true;
        setTimeout(() => {
          navigate('/purchase-order');
        }, 2000);
        return;
      }

      // If payment was successful
      if (code === '00' && status === 'PAID') {
        setMessage('Thanh toán thành công! Đang tạo đơn hàng...');
        
        // Get pending order data from localStorage
        const pendingOrderData = localStorage.getItem('pendingOrderData');
        
        if (!pendingOrderData) {
          setMessage('Không tìm thấy thông tin đơn hàng. Vui lòng liên hệ hỗ trợ.');
          hasProcessed.current = true;
          setTimeout(() => {
            navigate('/cart');
          }, 3000);
          return;
        }

        const orderData = JSON.parse(pendingOrderData);
        
        // Thêm timestamp để tránh duplicate
        const orderWithTimestamp = {
          ...orderData,
          processingTimestamp: Date.now(),
          paymentCallbackId: `${code}_${id}_${Date.now()}`
        };

        console.log('Creating order with data:', orderWithTimestamp);
        
        // Create the order
        const response = await orderService.create(orderWithTimestamp);
        
        if (response.data) {
          // Đánh dấu đã xử lý thành công
          hasProcessed.current = true;
          
          // Clear cart and pending order data immediately
          localStorage.removeItem('cartItems');
          localStorage.removeItem('pendingOrderData');
          
          // Thêm flag để đánh dấu đã xử lý thanh toán thành công
          localStorage.setItem('paymentProcessed', 'true');
          
          window.dispatchEvent(new Event('cartUpdated'));
          
          setMessage('Đặt hàng thành công! Đang chuyển hướng...');
          
          setTimeout(() => {
            localStorage.removeItem('paymentProcessed');
            navigate('/order', { 
              state: { 
                success: true, 
                message: 'Thanh toán và đặt hàng thành công!' 
              },
              replace: true // Sử dụng replace để tránh back button issues
            });
          }, 2000);
        } else {
          throw new Error('Không thể tạo đơn hàng');
        }
      } else {
        // Payment failed
        hasProcessed.current = true;
        setMessage('Thanh toán thất bại. Vui lòng thử lại.');
        setTimeout(() => {
          navigate('/purchase-order');
        }, 3000);
      }
    } catch (error) {
      console.error('Lỗi khi xử lý thanh toán:', error);
      hasProcessed.current = true;
      
      // Kiểm tra nếu là lỗi duplicate
      if (error.response?.status === 409 || error.message?.includes('duplicate')) {
        setMessage('Đơn hàng đã được tạo trước đó. Đang chuyển hướng...');
        // Clear data và chuyển hướng
        localStorage.removeItem('cartItems');
        localStorage.removeItem('pendingOrderData');
        setTimeout(() => {
          navigate('/order');
        }, 2000);
      } else {
        setMessage('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng liên hệ hỗ trợ.');
        setTimeout(() => {
          navigate('/purchase-order');
        }, 3000);
      }
    } finally {
      setLoading(false);
      isProcessing.current = false;
    }
  };

  // Ngăn chặn user refresh page hoặc back
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isProcessing.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handlePopState = (e) => {
      if (isProcessing.current) {
        e.preventDefault();
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        {loading && (
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
        )}
        
        <h2 style={{
          color: '#333',
          marginBottom: '20px'
        }}>
          Xử lý thanh toán
        </h2>
        
        <p style={{
          color: '#666',
          fontSize: '16px',
          lineHeight: '1.5'
        }}>
          {message}
        </p>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default PaymentCallback;