import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LocationCalculator from './components/Location';
import SignupForm from './components/Signup';
import Login from './components/Login';
import CompleteCustomerProfile from './components/Customer';
import CompleteMovingCompanyProfile from './components/MovingCompany';
import Inventory from './components/Inventory';
import Logout from './components/Logout';
import Home from './components/Home';
import Bookings from './components/Bookings';  // Import the Booking component
import Notification from './components/Notification';
import About from './components/About';
import Services from './components/Services';
import MovingPriceCalculator from './components/MovingPriceCalculator';
import CustomerDashboard from './components/CustomerDashboard';
import MovingCompanyDashboard from './components/MovingCompanyDashboard';
//import UserProfilePage from './components/UserProfilePage';
import MyProfile from './components/MyProfile';
import MoversList from './components/MoversList';

function App() {
  return (
    <div className="App">
     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/complete_customer_profile" element={<CompleteCustomerProfile />} />
        <Route path="/complete_moving_company_profile" element={<CompleteMovingCompanyProfile />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/locations" element={<LocationCalculator />} />
        <Route path="/Moving" element={<MovingPriceCalculator />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/bookings" element={<Bookings />} /> 
        <Route path="/notification" element={<Notification />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/bookings" element={<Bookings />} /> {/* Add this line for the Booking component */}
        <Route path="/MovingPriceCalculator" element={<MovingPriceCalculator />} />
        <Route path="/MyProfile" element={<MyProfile />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/moving-company-dashboard" element={<MovingCompanyDashboard />} />
        <Route path="/moving_companies" element={<MoversList />} />
      </Routes>
    </div>
  );
}

export default App;





