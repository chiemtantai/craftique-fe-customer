// src/components/FeaturedSections.jsx
import { BookOpen, Info, ShoppingBag, Palette, Users } from "lucide-react"; // hoặc react-icons

const sections = [
  {
    title: "Giới thiệu Craftique",
    description: "Tìm hiểu về hành trình và triết lý của chúng tôi trong việc tạo ra những sản phẩm gốm sứ độc đáo.",
    icon: <Info size={28} color="#fff" />,
    color: "#b7c7b0",
    link: "/about",
    highlights: ["Câu chuyện thương hiệu", "Triết lý sáng tạo", "Đội ngũ nghệ nhân"]
  },
  {
    title: "Bộ sưu tập sản phẩm",
    description: "Khám phá kho tàng sản phẩm gốm sứ đa dạng từ đồ gia dụng đến nghệ thuật trang trí.",
    icon: <ShoppingBag size={28} color="#fff" />,
    color: "#e7b98b",
    link: "/products",
    highlights: ["Gốm thủ công", "Secondhand Nhật Bản", "Đồ gia dụng cao cấp"]
  },
  {
    title: "Custom Product",
    description: "Tạo ra những sản phẩm độc nhất theo ý tưởng và sở thích riêng của bạn.",
    icon: <Palette size={28} color="#fff" />,
    color: "#c97b4d",
    link: "/custom-product",
    highlights: ["Thiết kế cá nhân", "In hình theo yêu cầu", "Tư vấn miễn phí"]
  },
  {
    title: "Workshop gốm sứ",
    description: "Tham gia các buổi học thực hành để trải nghiệm quá trình tạo ra sản phẩm gốm sứ.",
    icon: <Users size={28} color="#fff" />,
    color: "#a05a2c",
    link: "/workshop",
    highlights: ["Học từ nghệ nhân", "Trải nghiệm thực tế", "Không gian sáng tạo"]
  },
  {
    title: "Chuyện của gốm",
    description: "Khám phá những câu chuyện thú vị và kiến thức bổ ích về thế giới gốm sứ.",
    icon: <BookOpen size={28} color="#fff" />,
    color: "#e0e0e0",
    link: "/blog",
    highlights: ["Câu chuyện văn hóa", "Kỹ thuật chế tác", "Xu hướng mới"]
  }
];

function FeaturedSections() {
  return (
    <section style={{ background: "#faf8f4", padding: "60px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: 36, fontWeight: 700, color: "#3d1a06", marginBottom: 16 }}>
          Khám phá thế giới Craftique
        </h2>
        <p style={{ textAlign: "center", color: "#7a5c3e", fontSize: 20, marginBottom: 40 }}>
          Từ việc tìm hiểu về chúng tôi đến tạo ra sản phẩm riêng, hãy cùng khám phá mọi khía cạnh của nghệ thuật gốm sứ
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 32
        }}>
          {sections.map((section, idx) => (
            <div
              key={idx}
              style={{
                background: "#fff",
                borderRadius: 20,
                boxShadow: "0 4px 24px #0001",
                padding: 32,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 340,
                transition: "box-shadow 0.2s, transform 0.2s",
                position: "relative",
                overflow: "visible"
              }}
              onMouseOver={e => {
                e.currentTarget.style.boxShadow = "0 12px 32px #b46a3620";
                e.currentTarget.style.transform = "translateY(-4px) scale(1.03)";
                // Hiện nút
                const btn = e.currentTarget.querySelector('.card-btn');
                if (btn) {
                  btn.style.opacity = 1;
                  btn.style.pointerEvents = "auto";
                  btn.style.transform = "translateY(0)";
                }
              }}
              onMouseOut={e => {
                e.currentTarget.style.boxShadow = "0 4px 24px #0001";
                e.currentTarget.style.transform = "none";
                // Ẩn nút
                const btn = e.currentTarget.querySelector('.card-btn');
                if (btn) {
                  btn.style.opacity = 0;
                  btn.style.pointerEvents = "none";
                  btn.style.transform = "translateY(8px)";
                }
              }}
            >
              <div>
                <div style={{
                  width: 44,
                  height: 44,
                  background: section.color,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20
                }}>
                  {section.icon}
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: "#2d1a06", marginBottom: 12 }}>{section.title}</h3>
                <p style={{ color: "#7a5c3e", marginBottom: 16 }}>{section.description}</p>
                <ul style={{ color: "#a05a2c", marginBottom: 24, paddingLeft: 18 }}>
                  {section.highlights.map((h, i) => <li key={i} style={{ marginBottom: 4, fontSize: 16, listStyle: "disc" }}>{h}</li>)}
                </ul>
              </div>
              <a
                href={section.link}
                className="card-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  background: "#fff",
                  color: "#b46a36",
                  border: "2px solid #b46a36",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 16,
                  padding: "12px 24px",
                  marginTop: 8,
                  cursor: "pointer",
                  transition: "background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s, opacity 0.2s",
                  opacity: 0,
                  pointerEvents: "none",
                  transform: "translateY(8px)",
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = "#a05a2c";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.boxShadow = "0 2px 8px #b46a3620";
                  e.currentTarget.style.transform = "scale(1.04)";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.color = "#b46a36";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "none";
                }}
              >
                Khám phá ngay
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 6 }}>
                  <path d="M5 12h8M11 8l4 4-4 4" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedSections;
