import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'
import "./Navbar.css"

const Navbar = () => {
  return (
    <section className = "h-wrapper">
      <div className='flexCenter paddings innerWidth h-container'>
        <img src="./logo.png" alt='logo' width={100} />
    <nav className='flexCenter h-menu'>
      <ul className="nav-list">
        <li className="nav-item"><Link to="/">Home</Link></li>
        <li className="nav-item"><Link to="/login">Login</Link></li>
        {/*<li><Link to="/complete_customer_profile">Complete Customer Profile</Link></li>
        <li><Link to="/complete_moving_company_profile">Complete Moving Company Profile</Link></li>*/}
        <li className="nav-item"><Link to="/signup">Signup</Link></li>
        {/*<li className="nav-item"><Link to="/locations">Location Calculator</Link></li>
        <li className="nav-item"><Link to="/Moving">Moving Price Calculator</Link></li>*/}
        <li className="nav-item"><Link to="/inventory">Inventory</Link></li>
        <li className="nav-item"><Link to="/logout">Logout</Link></li>
      </ul>
    </nav>
    </div>
    </section>
  );
};

export default Navbar;
