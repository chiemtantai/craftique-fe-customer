import './HomePage.css';

function HomePage() {
  return (
    <>
      {/* Featured Products Section */}
      <section className="product-section">
        <h2>Các mẫu bán chạy</h2>
        <div className="product-grid">
          <div className="product-card">
            <img src="https://pos.nvncdn.com/7a38a7-47900/ps/20240506_EXgvtQI3jo.jpeg" alt="Colorful ceramic plates" />
          </div>
          <div className="product-card">
            <img src="https://gomsuhcm.com/wp-content/uploads/2019/08/ly-su-minh-long-16.jpg" alt="Milk cups and saucers" />
          </div>
          <div className="product-card">
            <img src="https://pos.nvncdn.com/cba2a3-7534/ps/20240530_vPmxlfe0fC.jpeg" alt="Cute bear mug" />
          </div>
        </div>
      </section>

      {/* Custom Ceramics Section */}
      <section className="product-section">
        <h2>Ly sứ in hình theo yêu cầu</h2>
        <div className="product-grid">
          <div className="product-card">
            <img src="https://product.hstatic.net/200000873845/product/ly-quai-to-cao_dbb7208bedd148daa37f2302bc9b1855.jpg" alt="Custom printed mugs" />
          </div>
          <div className="product-card">
            <img src="https://static.wixstatic.com/media/b8f00a_c31943769a374fdcad33bcda9dd56948~mv2.jpg/v1/fill/w_480,h_600,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/b8f00a_c31943769a374fdcad33bcda9dd56948~mv2.jpg" alt="Photo printed mugs" />
          </div>
          <div className="product-card">
            <img src="https://cdn.shopify.com/s/files/1/0584/6656/6249/files/minio_ly_su_capybara_225_3.jpg?v=1721023859" alt="Cute bear mug" />
          </div>
        </div>
      </section>

      {/* Japanese Secondhand Ceramics */}
      <section className="product-section">
        <h2>Gốm secondhand Nhật Bản</h2>
        <div className="product-grid">
          <div className="product-card">
            <img src="https://www.elledecoration.vn/wp-content/uploads/2024/08/japaneseceramicthmvb-800x600.jpg" alt="Japanese ceramics collection" />
          </div>
          <div className="product-card">
            <img src="https://afamilycdn.com/2019/10/8/4-15705333645371381034788.jpg" alt="Vintage Japanese pottery" />
          </div>
          <div className="product-card">
            <img src="https://hachihachi.com.vn/Uploads/_6/productimage/45000085-(2).jpg" alt="Cute bear mug" />
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;