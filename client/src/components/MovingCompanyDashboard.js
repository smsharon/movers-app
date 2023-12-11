import React, { useState, useEffect } from 'react';
import MyProfile from './MyProfile';

const MovingCompanyDashboard = () => {
  // You can add additional state or logic specific to the moving company dashboard

  return (
    <div>
      <h1>Welcome to the Moving Company Dashboard</h1>
      <MyProfile />
      {/* Add more moving company-specific components or actions here */}
    </div>
  );
};

export default MovingCompanyDashboard;
