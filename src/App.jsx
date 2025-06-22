import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout.jsx';
import HomePage from './pages/Homepage/HomePage.jsx';
import LoginPage from './pages/Login/LoginPage.jsx';
import RegisterPage from './pages/Register/RegisterPage.jsx';
import AboutPage from './pages/About/AboutPage.jsx';
import WorkshopPage from './pages/Workshop/WorkshopPage.jsx';
import WorkshopRegisterPage from './pages/Workshop/Register/WorkshopRegisterPage.jsx';
import ProductPage from './pages/Product/ProductPage.jsx';
import BlogPage from './pages/Blog/BlogPage.jsx';
import BlogDetailPage from './pages/BlogDetail/BlogDetailPage.jsx';
import CartPage from './pages/Cart/CartPage.jsx';
import OrderPage from './pages/Order/OrderPage.jsx';
import OrderDetailPage from './pages/OrderDetail/OrderDetailPage.jsx';
import PurchaseOrder from './pages/PurchaseOrder/PurchaseOrderPage.jsx';
import PaymentCallback from './components/features/payment/PaymentCallback.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route cho login (không có Layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Các route khác có Layout */}
        <Route path="/home" element={<Layout><HomePage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/workshop" element={<Layout><WorkshopPage /></Layout>} />
        <Route path="/workshop/register" element={<Layout><WorkshopRegisterPage /></Layout>} />
        <Route path="/products" element={<Layout><ProductPage /></Layout>} />
        <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
        <Route path="/blog/:blogID" element={<Layout><BlogDetailPage /></Layout>} />
        <Route path="/cart" element={<Layout><CartPage /></Layout>} />
        <Route path="/order" element={<Layout><OrderPage /></Layout>} />
        <Route path="/order/:orderID" element={<Layout><OrderDetailPage /></Layout>} />
        <Route path="/purchase-order" element={<Layout><PurchaseOrder /></Layout>} />
        <Route path="/payment-callback" element={<Layout><PaymentCallback /></Layout>} />
        {/* Default route */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;