
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('https://mover-server.onrender.com/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        // Clear the access token from localStorage
        localStorage.removeItem('access_token');

        // Redirect to the login page or any other page you prefer
        navigate('/login');
      } else {
        // Handle logout error
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    // Trigger the logout function on component mount
    handleLogout();
  }, []);

  return (
    <div className="logout-container">
      <h2>Logging Out...</h2>
      <p>Are you sure you want to log out?</p>
      <button type="button" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default Logout;
