// Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="paddings innerwidth flexCenter footer-container">
        <div className="footer-content">
          <div className="footer-info">
            <h3>Contact Us</h3>
            <p>Email: boxdnloaded@gmail.com</p>
            <p>Phone: +25769876543</p>
            {/* Add more contact information as needed */}
          </div>
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
            <div class="quick-links">
              <li><a href="/">Home</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact Us</a></li>
              </div>
              {/* Add more links to relevant pages */}
            </ul>
          </div>
          <div className="footer-social">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
              <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
              <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
              {/* Add more social media icons and links */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
