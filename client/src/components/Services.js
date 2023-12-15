// Services.js
import React from 'react';

const Services = () => {
  return (
    <div className="services-wrapper">
      <div className="paddings innerwidth services-container">
        <h2>Our Services</h2>
        <div className="services-list">
          <div className="service-card">
            <h3>Household Moving</h3>
            <p>
              We specialize in seamless household moving services, ensuring the safe and timely transportation of your belongings to your new home.
            </p>
          </div>
          <div className="service-card">
            <h3>Commercial Moving</h3>
            <p>
              Our commercial moving services are designed to make your business relocation efficient and stress-free, minimizing downtime for your operations.
            </p>
          </div>
          <div className="service-card">
            <h3>Packing and Unpacking</h3>
            <p>
              Let our experts handle the packing and unpacking process, ensuring that your items are securely packed and unpacked with care.
            </p>
          </div>
          {/* Add more service cards as needed */}
        </div>
      </div>
    </div>
  );
};

export default Services;
