import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

// Site footer with brand info, links, and social icons
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <h3 className="footer-logo">✦ LUMIÈRE</h3>
          <p className="footer-desc">
            Crafting the finest fragrances for the modern connoisseur. 
            Luxury in every drop, elegance in every scent.
          </p>
        </div>
        
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><a href="#collection">Collections</a></li>
            <li><a href="#about">About Us</a></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="#ig">Instagram</a>
            <a href="#tw">Twitter</a>
            <a href="#fb">Facebook</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Lumière Perfumes. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
