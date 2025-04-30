// src/components/Footer.jsx
import React from 'react';
import '/home.css'; // or wherever your CSS styles (e.g. bg-dark, py-1) are defined

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white py-1">
      <div className="footer-bottom text-center mt-4">
        <p>&copy; 2025 Redwan Seid. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
