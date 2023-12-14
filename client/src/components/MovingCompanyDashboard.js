import React, { useState, useEffect } from 'react';
import { FaUser, FaBell, FaCheckCircle } from 'react-icons/fa';
import Logout from './Logout';
import MyProfile from './MyProfile';
import Requests from './Requests';
import './MovingCompanyDashboard.css'

const MovingCompanyDashboard = () => {
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
      
      case 'MyProfile':
        return <MyProfile />;
      case 'requests':
        return <Requests />;
      case 'logout':
        return <Logout />;
      default:
        return null; // Render nothing when no component is selected
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
          
          <li onClick={() => handleComponentChange('MyProfile')}>My Profile</li>
          <li onClick={() => handleComponentChange('requests')}>Bookings</li>
          <li onClick={() => handleComponentChange('logout')}>Logout</li>
        </ul>
      </nav>
    </header>
    <main className="dashboard-main">{renderComponent()}</main>
  </div>
);
};

export default MovingCompanyDashboard;
