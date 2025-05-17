import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './homepage/HomePage.jsx';
import LoginPage from './login/LoginPage.jsx';

function App() {

  return (
    <Router>
      <Routes>
        {/* Default route is homepage */}
        <Route path="/" element={<HomePage />} />
        
        {/* Login route */}
        <Route path="/login" element={<LoginPage />} />
        
      </Routes>
    </Router>
  );
}

export default App;