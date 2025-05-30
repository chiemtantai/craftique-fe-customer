import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './layout/Layout.jsx';
import HomePage from './homepage/HomePage.jsx';
import LoginPage from './login/LoginPage.jsx';
import AboutPage from './about/AboutPage';
import WorkshopPage from './workshop/WorkshopPage.jsx';
import ProductPage from './product/ProductPage.jsx';
import BlogPage from './blog/BlogPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route cho login (không có Layout) */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Các route khác có Layout */}
        <Route path="/home" element={<Layout><HomePage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/workshop" element={<Layout><WorkshopPage /></Layout>} />
        <Route path="/products" element={<Layout><ProductPage /></Layout>} />
        <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
        
        {/* Default route */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;