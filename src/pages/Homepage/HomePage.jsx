import Hero from '../../components/Hero';
import FeaturedSections from '../../components/FeaturedSections';
// import './HomePage.css'; // Nếu muốn giữ lại section sản phẩm nổi bật

function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedSections />
      {/* Nếu muốn giữ lại các section sản phẩm nổi bật thì render tiếp ở đây */}
    </>
  );
}
export default HomePage;