import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
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
        {/* Default route is homepage */}
        <Route path="/home" element={<HomePage />} />
        
        {/* Login route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/workshop" element={<WorkshopPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/blog" element={<BlogPage />} />
      </Routes>
    </Router>
  );
}

export default App;