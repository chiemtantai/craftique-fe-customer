import './AboutPage.css';

function AboutPage() {
  return (
    <>
      {/* About Header */}
      <section className="about-header">
        <h1>Giới thiệu Craftique</h1>
      </section>

      {/* About Content */}
      <section className="about-content">
        <div className="about-text">
          <p>
            <strong>Craftique</strong> là một trang web chuyên cung cấp sản phẩm gốm sứ độc đáo, bao gồm chén, đĩa, ly và gốm sứ secondhand Nhật Bản. Chúng tôi cam kết cung cấp những sản phẩm độc đáo và thủ tự nhiều, đánh biến sắt phải của của và bền vững cho người tiêu dùng.
          </p>
          
          <p>
            Ngoài việc bán sản phẩm gốm sứ, chúng tôi còn tổ chức các buổi <strong>Workshop</strong> học làm việc các nghề thủ côn của những yêu thích kể, cho phép khách hàng tương tác và tận hưởng theo ý kiến. Craftique hướng dẫn đủ hướng hoa trẻ, đức biết là thể tìm Gen Z, những người yêu thích sử sáng tạo và cá tính.
          </p>
          
          <p>
            Ngoài ra, thông qua trang web, chúng tôi cũng cung cấp dể lý do thiết kể thành ảnh dẫn liên sản phẩm. Hơ có thể chọn mẫu sắc, hình dáng và màu sắc theo ý của cho để tạo ra những sản phẩm độc đáo và mang tính cá nhân.
          </p>
          
          <p>
            Đặc biệt, chúng tôi cũng cung cấp những gốm sứ secondhand từ Nhật Bản, mang đến sự đa dạng và phong phú cho bộ sưu tập, cho phép khách hàng khám phá những nét văn hóa độc đáo của đất nước Nhật Bản.
          </p>
          
          <p>
            Về cảm kết về chất lượng và bảo vệ, Craftique không chỉ mang đến những món đồ gốm tinh tế mà còn góp phần vào việc bảo vệ môi trường. Hãy cùng chúng tôi khám phá thế giới gốm sứ đầy sáng tạo nhé!
          </p>
        </div>
      </section>

      {/* Product Gallery */}
      <section className="product-gallery">
        <div className="gallery-grid">
          <div className="gallery-item">
            <img 
              src="https://via.placeholder.com/300x300?text=Heart+Pattern+Ceramics" 
              alt="Heart pattern ceramic collection"
            />
          </div>
          
          <div className="gallery-item">
            <img 
              src="https://via.placeholder.com/300x300?text=Colorful+Bowl+Collection" 
              alt="Colorful ceramic bowls"
            />
          </div>
          
          <div className="gallery-item">
            <img 
              src="https://via.placeholder.com/300x300?text=Pineapple+Teapot+Set" 
              alt="Pineapple shaped teapot and cups"
            />
          </div>
          
          <div className="gallery-item">
            <img 
              src="https://via.placeholder.com/300x300?text=Geometric+Mugs" 
              alt="Geometric design mugs"
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutPage;