import React from 'react';
import './FaviconDemo.css';

const FaviconDemo = () => {
  return (
    <div className="favicon-demo">
      <h2>Favicon Demo</h2>
      <div className="favicon-container">
                 <div className="favicon-item">
           <h3>Favicon chính</h3>
           <div className="favicon-preview">
             <img src="/favicon.svg" alt="Craftique Favicon" />
           </div>
           <p>Logo tròn trắng với chữ "C" màu nâu</p>
         </div>
        
                 <div className="favicon-item">
           <h3>Favicon đơn giản</h3>
           <div className="favicon-preview">
             <img src="/favicon-simple.svg" alt="Craftique Simple Favicon" />
           </div>
           <p>Phiên bản đơn giản với chữ "C" màu nâu</p>
         </div>
      </div>
      
      <div className="browser-tab-demo">
        <h3>Mô phỏng tab browser</h3>
        <div className="browser-tab">
          <div className="tab-favicon">
            <img src="/favicon.svg" alt="Favicon" />
          </div>
          <div className="tab-title">Craftique Shop</div>
          <div className="tab-close">×</div>
        </div>
      </div>
    </div>
  );
};

export default FaviconDemo; 