// App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import LocationCalculator from './components/Location';
import MovingPriceCalculator from './components/MovingPriceCalculator';
import SignupForm from './components/Signup';
import Login from './components/Login';
import CompleteCustomerProfile from './components/Customer';
import CompleteMovingCompanyProfile from './components/MovingCompany';
import Inventory from './components/Inventory';
function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/complete_customer_profile" element={<CompleteCustomerProfile />} />
        <Route path="/complete_moving_company_profile" element={<CompleteMovingCompanyProfile />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/locations" element={<LocationCalculator />} />
        <Route path="/Moving" element={<MovingPriceCalculator />} />
        <Route path="/inventory" element={<Inventory/>} />
      </Routes>

     
    </div>
  );
}

export default App;

