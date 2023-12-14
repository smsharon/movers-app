// About.js
import React from 'react';
import './About.css'; // Import your custom styling for the About page

const About = () => {
  const movingImage = 'https://images.pexels.com/photos/7464491/pexels-photo-7464491.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

  return (
    <div className="about-wrapper">
      <div className="paddings innerwidth about-container">
        <h2>About BoxdNLoaded</h2>
        <div className="about-card">
          <img src={movingImage} alt="Moving Company" className="about-image" />
          <div className="about-text">
            <p>
              Welcome to BoxdNLoaded! We are a reliable moving company dedicated to providing top-notch moving services. Our team is committed to ensuring a smooth and stress-free moving experience for our customers.
            </p>
            <p>
              At BoxdNLoaded, we understand the importance of a seamless relocation, whether it's for residential or commercial purposes. Our skilled professionals and efficient services make us the go-to choice for all your moving needs.
            </p>
            <p>
              Why choose BoxdNLoaded?
            </p>
            <ul>
              <li>Experienced and trained moving professionals</li>
              <li>Secure and timely transportation of your belongings</li>
              <li>Customized moving solutions tailored to your needs</li>
              <li>Transparent and competitive pricing</li>
            </ul>
            <p>
              Contact us today to experience a hassle-free moving process with BoxdNLoaded.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
