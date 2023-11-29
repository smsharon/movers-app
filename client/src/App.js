import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Landingpage from './Landingpage';
import Booking from './Booking'; // Import the Booking component

const CombinedPage = () => {
  return (
    <div style={{ display: 'flex' }}>
      {/* Content section */}
      <div style={{ flex: 1, padding: '20px' }}>
        {/* Landingpage component */}
        <Landingpage />

        {/* Booking component */}
        <Booking />
      </div>

      {/* Navbar component on the right */}
      <div style={{ width: '200px', padding: '20px' }}>
        <Navbar />
      </div>
    </div>
  );
};

export default CombinedPage;




