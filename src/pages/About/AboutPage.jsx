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
              src="https://file.hstatic.net/1000382508/file/59596310189_1011234648089407772_n__1__7a4dad7247944eeb80c73d954b6f4e52_grande.jpg" 
              alt="Heart pattern ceramic collection"
            />
          </div>
          
          <div className="gallery-item">
            <img 
              src="https://file.hstatic.net/1000382508/file/059659646310184_1208375329163644622_n_9964065dbd6f4cb584ac258ef7188568_grande.jpg" 
              alt="Colorful ceramic bowls"
            />
          </div>
          
          <div className="gallery-item">
            <img 
              src="https://file.hstatic.net/1000382508/file/59532976862_9089999697914508310_n__1__e3245d397ba34caaad4f226bda393f12_grande.jpg" 
              alt="Pineapple shaped teapot and cups"
            />
          </div>
          
          <div className="gallery-item">
            <img 
              src="https://file.hstatic.net/1000382508/file/059664212976394_7865611530544305488_n_06cd96a709324df681e11065a8ea92f5_grande.jpg" 
              alt="Geometric design mugs"
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutPage;