// Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-8 bg-gray-800 text-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div>
            {/* Your footer content goes here */}
            <p>&copy; 2023 BOXEDNLOADED</p>
            <p>Email: <a href="mailto:boxednloaded@gmail.com">boxednloaded@gmail.com</a></p>
            <p>Phone: +254 700 000 000</p>
          </div>
          <div>
            {/* Social media icons */}
            <a href="#" className="text-gray-300 hover:text-white mx-2">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-300 hover:text-white mx-2">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="text-gray-300 hover:text-white mx-2">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
