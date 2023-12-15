import React, { useState } from 'react';
import MyProfile from './MyProfile';
import Logout from './Logout';
import './Account.css'; // Import a CSS file for styling

const Account = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleDropdownClick = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="account-container">
      <div className="account-dropdown" onClick={handleDropdownClick}>
        Account
      </div>

      {isDropdownVisible && (
        <div className="dropdown-content">
          <select value={selectedOption} onChange={handleOptionChange}>
            <option value="default" disabled hidden>Select an option</option>
            <option value="profile">My Profile</option>
            <option value="logout">Logout</option>
          </select>

          {selectedOption === 'profile' && <MyProfile />}
          {selectedOption === 'logout' && <Logout />}
        </div>
      )}
    </div>
  );
};

export default Account;
