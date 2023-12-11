import React, { useState } from 'react';
//import Account from './Account';
import Inventory from './Inventory';
import Bookings from './Bookings';
import MovingPriceCalculator from './MovingPriceCalculator';
import MyProfile from './MyProfile';
import Logout from './Logout';
import './CustomerDashboard.css'; // Import a CSS file for styling

const CustomerDashboard = () => {
  const [selectedComponent, setSelectedComponent] = useState('account');

  const handleComponentChange = (component) => {
    setSelectedComponent(component);
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      
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
        return null;
    }
  };

  return (
    <div className='dash'>
      <h1> Hello you!Welcome to the Customer Dashboard</h1>

      {/* Navbar */}
      <nav className="navbars">
        
        <button onClick={() => handleComponentChange('inventory')}>Inventory</button>
        <button onClick={() => handleComponentChange('bookings')}>Bookings</button>
        <button onClick={() => handleComponentChange('movingPriceCalculator')}>Moving Price Calculator</button>
        <button onClick={() => handleComponentChange('MyProfile')}>My Profile</button>
        <button onClick={() => handleComponentChange('logout')}>Logout</button>
      </nav>

      {/* Welcome Message */}
      
      {/* Render the selected component */}
      {renderComponent()}
    </div>
  );
};

export default CustomerDashboard;
