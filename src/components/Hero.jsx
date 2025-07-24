import { useEffect, useState } from 'react';

function Hero() {
  // Fallback images
  const fallbackHandmade = "https://gomsuhcm.com/wp-content/uploads/2019/08/ly-su-minh-long-16.jpg";
  const fallbackCustom = "https://product.hstatic.net/200000873845/product/ly-quai-to-cao_dbb7208bedd148daa37f2302bc9b1855.jpg";

  // Responsive: detect mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section style={{
      minHeight: isMobile ? 'auto' : '70vh',
      display: 'flex',
      alignItems: isMobile ? 'flex-start' : 'center',
      background: 'linear-gradient(90deg, #fbeee6 0%, #e7b98b 100%)',
      padding: isMobile ? '12px 0' : undefined
    }}>
      <div style={{
        width: '100%',
        maxWidth: 1400,
        margin: '0 auto',
        padding: isMobile ? 10 : 40,
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? 18 : 60,
        alignItems: isMobile ? 'center' : 'flex-start',
        justifyContent: isMobile ? 'flex-start' : 'flex-start'
      }}>
        {/* Left: Text + Button */}
        <div style={{
          width: '100%',
          maxWidth: isMobile ? 500 : 600,
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMobile ? 'center' : 'flex-start',
          justifyContent: 'center',
          marginBottom: isMobile ? 18 : 0
        }}>
          <h1 style={{
            fontSize: isMobile ? 32 : 55,
            fontWeight: 900,
            color: '#2d1a06',
            lineHeight: 1.1,
            marginBottom: isMobile ? 8 : 12,
            textAlign: isMobile ? 'center' : 'left'
          }}>
            Khám phá thế giới <br />
            <span style={{ color: '#b46a36', fontSize: isMobile ? 36 : 60 }}>gốm sứ độc đáo</span>
          </h1>
          <p style={{
            fontSize: isMobile ? 15 : 18,
            color: '#a07c5b',
            marginBottom: isMobile ? 18 : 32,
            maxWidth: 520,
            textAlign: isMobile ? 'center' : 'left'
          }}>
            Craftique mang đến những sản phẩm gốm sứ thủ công tinh tế, từ đồ gia dụng hàng ngày đến những tác phẩm nghệ thuật độc đáo.
          </p>
          <div style={{
            display: 'flex',
            gap: isMobile ? 8 : 16,
            width: isMobile ? '100%' : '100%',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            justifyContent: isMobile ? 'center' : 'flex-start'
          }}>
            <a
              href="/products"
              className="hero-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#b46a36',
                color: '#fff',
                padding: isMobile ? '10px 16px' : '12px 24px',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: isMobile ? 15 : 17,
                border: 'none',
                boxShadow: '0 2px 8px #0001',
                transition: 'background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s',
                cursor: 'pointer',
                outline: 'none'
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#a05a2c';
                e.currentTarget.style.boxShadow = '0 4px 16px #b46a3640';
                e.currentTarget.style.transform = 'scale(1.04)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = '#b46a36';
                e.currentTarget.style.boxShadow = '0 2px 8px #0001';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Khám phá sản phẩm
              <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8 }}>
                <path d="M5 12h8M11 8l4 4-4 4" />
              </svg>
            </a>
            <a
              href="/workshop"
              className="hero-btn hero-btn-outline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#fff',
                color: '#b46a36',
                padding: isMobile ? '10px 16px' : '12px 24px',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: isMobile ? 15 : 17,
                border: '2px solid #b46a36',
                boxShadow: 'none',
                transition: 'background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s',
                cursor: 'pointer',
                outline: 'none'
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = '#fbeee6';
                e.currentTarget.style.color = '#a05a2c';
                e.currentTarget.style.boxShadow = '0 4px 16px #b46a3620';
                e.currentTarget.style.transform = 'scale(1.04)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = '#b46a36';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Tham gia Workshop
            </a>
          </div>
        </div>
        {/* Right: Cards */}
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 12 : 32,
          justifyContent: 'center',
          alignItems: isMobile ? 'center' : 'flex-end',
          marginTop: isMobile ? 8 : 0
        }}>
          {/* Card Gốm thủ công */}
          <a href="/products" style={{
            textDecoration: 'none',
            width: isMobile ? '100%' : 'auto',
            display: 'flex',
            marginBottom: isMobile ? 12 : 0,
            justifyContent: 'center'
          }}>
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: isMobile ? '18px 10px 14px 10px' : '40px 32px 32px 32px',
              boxShadow: '0 8px 32px #0002',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: isMobile ? 0 : 260,
              maxWidth: isMobile ? '100%' : 350,
              height: isMobile ? 180 : 320,
              marginBottom: isMobile ? 0 : 40,
              transition: 'box-shadow 0.2s, transform 0.2s'
            }}
            onMouseOver={e => {
              e.currentTarget.style.boxShadow = '0 16px 48px #b46a3620';
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.boxShadow = '0 8px 32px #0002';
              e.currentTarget.style.transform = 'none';
            }}
            >
              <div style={{
                width: isMobile ? 90 : 180,
                height: isMobile ? 60 : 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8f8f8',
                borderRadius: 10,
                marginBottom: isMobile ? 12 : 32
              }}>
                <img
                  src="https://cdn.tgdd.vn/Files/2021/07/13/1366702/lysu1-1200x676.jpg"
                  alt="Gốm thủ công"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                  onError={e => { e.currentTarget.src = fallbackHandmade; }}
                />
              </div>
              <h3 style={{ fontWeight: 700, color: '#2d1a06', fontSize: isMobile ? 15 : 22, marginBottom: 8, textAlign: 'center' }}>Gốm thủ công</h3>
              <p style={{ color: '#a07c5b', fontSize: isMobile ? 13 : 17, textAlign: 'center' }}>Sản phẩm độc đáo</p>
            </div>
          </a>
          {/* Card Custom Design */}
          <a href="/custom-product" style={{
            textDecoration: 'none',
            width: isMobile ? '100%' : 'auto',
            display: 'flex',
            marginBottom: isMobile ? 0 : 0,
            justifyContent: 'center'
          }}>
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: isMobile ? '18px 10px 14px 10px' : '40px 32px 32px 32px',
              boxShadow: '0 8px 32px #0002',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: isMobile ? 0 : 260,
              maxWidth: isMobile ? '100%' : 350,
              height: isMobile ? 180 : 320,
              marginBottom: isMobile ? 0 : 0,
              transition: 'box-shadow 0.2s, transform 0.2s'
            }}
            onMouseOver={e => {
              e.currentTarget.style.boxShadow = '0 16px 48px #b46a3620';
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.boxShadow = '0 8px 32px #0002';
              e.currentTarget.style.transform = 'none';
            }}
            >
              <div style={{
                width: isMobile ? 90 : 180,
                height: isMobile ? 60 : 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8f8f8',
                borderRadius: 10,
                marginBottom: isMobile ? 12 : 32
              }}>
                <img
                  src="https://bizweb.dktcdn.net/100/438/408/products/ly-su-in-hinh-theo-yeu-cau-1.jpg?v=1684749648000"
                  alt="Custom Design"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                  onError={e => { e.currentTarget.src = fallbackCustom; }}
                />
              </div>
              <h3 style={{ fontWeight: 700, color: '#2d1a06', fontSize: isMobile ? 15 : 22, marginBottom: 8, textAlign: 'center' }}>Custom Design</h3>
              <p style={{ color: '#a07c5b', fontSize: isMobile ? 13 : 17, textAlign: 'center' }}>Thiết kế theo yêu cầu</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
export default Hero;
