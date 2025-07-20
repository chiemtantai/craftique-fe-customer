function Hero() {
  // Fallback images
  const fallbackHandmade = "https://gomsuhcm.com/wp-content/uploads/2019/08/ly-su-minh-long-16.jpg";
  const fallbackCustom = "https://product.hstatic.net/200000873845/product/ly-quai-to-cao_dbb7208bedd148daa37f2302bc9b1855.jpg";

  return (
    <section style={{
      minHeight: "70vh",
      display: "flex",
      alignItems: "center",
      background: "linear-gradient(90deg, #fbeee6 0%, #e7b98b 100%)"
    }}>
      <div style={{
        width: "100%",
        maxWidth: 1400,
        margin: "0 auto",
        padding: 40,
        display: "flex",
        gap: 60,
        alignItems: "center",
        justifyContent: "flex-start"
      }}>
        {/* Left: Text + Button */}
        <div style={{
          flex: 1.2,
          minWidth: 350,
          maxWidth: 600,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center"
        }}>
          <h1 style={{
            fontSize: 55,
            fontWeight: 900,
            color: "#2d1a06",
            lineHeight: 1.1,
            marginBottom: 12,
            textAlign: "left"
          }}>
            Khám phá thế giới <br />
            <span style={{ color: "#b46a36", fontSize: 60 }}>gốm sứ độc đáo</span>
          </h1>
          <p style={{
            fontSize: 18,
            color: "#a07c5b",
            marginBottom: 32,
            maxWidth: 520,
            textAlign: "left"
          }}>
            Craftique mang đến những sản phẩm gốm sứ thủ công tinh tế, từ đồ gia dụng hàng ngày đến những tác phẩm nghệ thuật độc đáo.
          </p>
          <div style={{
            display: "flex",
            gap: 16,
            width: "100%",
            flexWrap: "nowrap",
            justifyContent: "flex-start"
          }}>
            <a
              href="/products"
              className="hero-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#b46a36",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 17,
                border: "none",
                boxShadow: "0 2px 8px #0001",
                transition: "background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s",
                cursor: "pointer",
                outline: "none"
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
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#fff",
                color: "#b46a36",
                padding: "12px 24px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 17,
                border: "2px solid #b46a36",
                boxShadow: "none",
                transition: "background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s",
                cursor: "pointer",
                outline: "none"
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
          flex: 1,
          minWidth: 350,
          maxWidth: 650,
          display: "flex",
          gap: 32,
          justifyContent: "center",
          alignItems: "flex-end"
        }}>
          {/* Card Gốm thủ công */}
          <a href="/products" style={{
            textDecoration: "none",
            flex: 1,
            display: "flex"
          }}>
            <div style={{
              background: "#fff",
              borderRadius: 24,
              padding: "40px 32px 32px 32px",
              boxShadow: "0 8px 32px #0002",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 260,
              maxWidth: 350,
              height: 320,
              marginBottom: 40,
              transition: "box-shadow 0.2s, transform 0.2s"
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
                width: 180,
                height: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f8f8f8",
                borderRadius: 18,
                marginBottom: 32
              }}>
                <img
                  src="https://cdn.tgdd.vn/Files/2021/07/13/1366702/lysu1-1200x676.jpg"
                  alt="Gốm thủ công"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain"
                  }}
                  onError={e => { e.currentTarget.src = fallbackHandmade; }}
                />
              </div>
              <h3 style={{ fontWeight: 700, color: "#2d1a06", fontSize: 22, marginBottom: 8 }}>Gốm thủ công</h3>
              <p style={{ color: "#a07c5b", fontSize: 17 }}>Sản phẩm độc đáo</p>
            </div>
          </a>
          {/* Card Custom Design */}
          <a href="/custom-product" style={{
            textDecoration: "none",
            flex: 1,
            display: "flex"
          }}>
            <div style={{
              background: "#fff",
              borderRadius: 24,
              padding: "40px 32px 32px 32px",
              boxShadow: "0 8px 32px #0002",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 260,
              maxWidth: 350,
              height: 320,
              marginBottom: 0,
              transition: "box-shadow 0.2s, transform 0.2s"
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
                width: 180,
                height: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f8f8f8",
                borderRadius: 18,
                marginBottom: 32
              }}>
                <img
                  src="https://bizweb.dktcdn.net/100/438/408/products/ly-su-in-hinh-theo-yeu-cau-1.jpg?v=1684749648000"
                  alt="Custom Design"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain"
                  }}
                  onError={e => { e.currentTarget.src = fallbackCustom; }}
                />
              </div>
              <h3 style={{ fontWeight: 700, color: "#2d1a06", fontSize: 22, marginBottom: 8 }}>Custom Design</h3>
              <p style={{ color: "#a07c5b", fontSize: 17 }}>Thiết kế theo yêu cầu</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
export default Hero;
