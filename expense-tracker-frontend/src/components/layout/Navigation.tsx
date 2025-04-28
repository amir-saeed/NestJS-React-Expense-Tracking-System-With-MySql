import React, { useState, useEffect } from 'react';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const navList = document.querySelector('.nav__list');
      const navToggle = document.querySelector('.nav__toggle');
      
      if (
        navList &&
        navToggle &&
        !navList.contains(event.target as Node) &&
        !navToggle.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <nav className="nav">
      <div 
        className={`nav__toggle ${isOpen ? 'active' : ''}`} 
        onClick={toggleMenu}
      >
        <span className="nav__toggle-bar"></span>
        <span className="nav__toggle-bar"></span>
        <span className="nav__toggle-bar"></span>
      </div>

      <div 
        className={`nav__overlay ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(false)}
      ></div>
      <div>
        SignIn 
      </div>
      <div>
        Dashboard
      </div>
      
    </nav>
  );
};

export default Navigation;