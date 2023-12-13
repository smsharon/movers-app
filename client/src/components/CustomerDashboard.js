import React, { useState, useEffect } from 'react';
import { FaUser, FaBell, FaCheckCircle } from 'react-icons/fa';
import Inventory from './Inventory';
import Bookings from './Bookings';
import MovingPriceCalculator from './MovingPriceCalculator';
import MyProfile from './MyProfile';
import Logout from './Logout';
import MoversList from './MoversList';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const [selectedComponent, setSelectedComponent] = useState(null); // Initialize to null
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const authToken = localStorage.getItem('access_token');
        const apiUrl = 'http://localhost:5000/user_profile';

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUserProfile(userData);
        } else {
          const errorData = await response.json();
          setError(errorData.error);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserProfile();
  }, []); // Empty dependency array means this effect runs once after the initial render

  const handleComponentChange = (component) => {
    setSelectedComponent(component);
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'moversList':
        return <MoversList />;
      case 'inventory':
        return <Inventory />;
      case 'bookings':
        return <Bookings />;
      case 'movingPriceCalculator':
        return <MovingPriceCalculator />;
      case 'MyProfile':
        return <MyProfile />;
      case 'logout':
        return <Logout />;
      default:
        return <MoversList />; // Render nothing when no component is selected
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="brand">
          <FaUser className="brand-icon" />
          <h1 className="brand-name">
            {userProfile ? `Hi ${userProfile.username}, welcome to your dashboard` : 'Loading...'}
            {userProfile?.profile_completed && <FaCheckCircle className="verified-icon" />}
          </h1>
        </div>
        <nav className="dashboard-nav">
          <ul>
            <li onClick={() => handleComponentChange('moversList')}>Movers</li>
            <li onClick={() => handleComponentChange('inventory')}>Inventory</li>
            <li onClick={() => handleComponentChange('bookings')}>Bookings</li>
            <li onClick={() => handleComponentChange('movingPriceCalculator')}>Moving Price Calculator</li>
            <li onClick={() => handleComponentChange('MyProfile')}>My Profile</li>
            <li onClick={() => handleComponentChange('logout')}>Logout</li>
          </ul>
        </nav>
      </header>
      <main className="dashboard-main">{renderComponent()}</main>
    </div>
  );
};

export default CustomerDashboard;
