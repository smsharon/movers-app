import React, { useState, useEffect } from 'react';

const MyProfile = ({ user }) => {
  const [profileData, setProfileData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Fetch user profile data based on the user's ID
    if (user && user.id) {
      fetch(`http://localhost:5000/users/${user.id}`)
        .then((response) => response.json())
        .then((data) => {
          setProfileData(data); // Set the fetched profile data
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error.message);
        });
    }
  }, [user]);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div>
      <h2 onClick={toggleDetails}>My Profile</h2>
      {showDetails && (
        <div>
          <p>Username: {user && user.username}</p>
          <p>Email: {user && user.email}</p>
          <p>Role: {user && user.role}</p>
          {/* Conditionally render customer or moving company details */}
          {user && user.role === 'customer' && profileData ? (
            <div>
              <p>Full Name: {profileData.full_name}</p>
              <p>Contact Phone: {profileData.contact_phone}</p>
              <p>Address: {profileData.address}</p>
              <p>Preferred Contact Method: {profileData.preferred_contact_method}</p>
            </div>
          ) : null}
          {user && user.role === 'moving_company' && profileData ? (
            <div>
              <p>Company Name: {profileData.company_name}</p>
              <p>Contact Person: {profileData.contact_person}</p>
              <p>Contact Email: {profileData.contact_email}</p>
              <p>Contact Phone: {profileData.contact_phone}</p>
              <p>Extra Services: {profileData.extra_services}</p>
              {/* Add more details as needed */}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default MyProfile;
