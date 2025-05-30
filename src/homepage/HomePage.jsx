import './HomePage.css';

function HomePage() {
  return (
    <>
      {/* Featured Products Section */}
      <section className="product-section">
        <h2>Các mẫu bán chạy</h2>
        <div className="product-grid">
          <div className="product-card">
            <img src="https://via.placeholder.com/300x300" alt="Colorful ceramic plates" />
          </div>
          <div className="product-card">
            <img src="https://via.placeholder.com/300x300" alt="Milk cups and saucers" />
          </div>
          <div className="product-card">
            <img src="https://via.placeholder.com/300x300" alt="Cute bear mug" />
          </div>
        </div>
      </section>

      {/* Custom Ceramics Section */}
      <section className="product-section">
        <h2>Ly sứ in hình theo yêu cầu</h2>
        <div className="product-grid">
          <div className="product-card">
            <img src="https://via.placeholder.com/300x300" alt="Custom printed mugs" />
          </div>
          <div className="product-card">
            <img src="https://via.placeholder.com/300x300" alt="Photo printed mugs" />
          </div>
        </div>
      </section>

      {/* Japanese Secondhand Ceramics */}
      <section className="product-section">
        <h2>Gốm secondhand Nhật Bản</h2>
        <div className="product-grid">
          <div className="product-card">
            <img src="https://via.placeholder.com/300x300" alt="Japanese ceramics collection" />
          </div>
          <div className="product-card">
            <img src="https://via.placeholder.com/300x300" alt="Vintage Japanese pottery" />
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;