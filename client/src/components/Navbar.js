import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        {/*<li><Link to="/">Home</Link></li>*/}
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/complete_customer_profile">Complete Customer Profile</Link></li>
        <li><Link to="/complete_moving_company_profile">Complete Moving Company Profile</Link></li>
        <li><Link to="/signup">Signup</Link></li>
        <li><Link to="/locations">Location Calculator</Link></li>
        <li><Link to="/Moving">Moving Price Calculator</Link></li>
        <li><Link to="/inventory">Inventory</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
