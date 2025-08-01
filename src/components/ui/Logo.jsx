import React from 'react';
import './Logo.css';

const Logo = ({ variant = 'default', onClick, className = '' }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`logo-container ${variant} ${className}`}
      onClick={handleClick}
    >
      <div className="logo-icon">
        <span className="logo-letter">C</span>
      </div>
      <div className="logo-text">
        <div className="logo-title">Craftique</div>
      </div>
    </div>
  );
};

export default Logo; 