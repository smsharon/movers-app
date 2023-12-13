import React, { useState, useEffect } from 'react';

const MyProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [showDetails, setShowDetails] = useState(true); // Set to true by default

  // Function to include the access token in requests
  const includeAccessToken = () => {
    const token = localStorage.getItem('access_token');
    return token ? `Bearer ${token}` : '';
  };

  useEffect(() => {
    // Fetch user profile data based on the user's role
    const apiUrl = 'http://localhost:5000/user_profile';

    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': includeAccessToken(),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProfileData(data); // Set the fetched profile data
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error.message);
      });
  }, []);

  return (
    <div>
      <h2>My Profile</h2>
      {showDetails && profileData && (
        <div>
          <p>Username: {profileData.username}</p>
          <p>Email: {profileData.email}</p>
          <p>Role: {profileData.role}</p>
          <p>Profile Completed: {profileData.profile_completed ? 'Yes' : 'No'}</p>
          {profileData.role === 'customer' && (
            <div>
              <p>Full Name: {profileData.full_name}</p>
              <p>Contact Phone: {profileData.contact_phone}</p>
              <p>Address: {profileData.address}</p>
              <p>Preferred Contact Method: {profileData.preferred_contact_method}</p>
            </div>
          )}
          {profileData.role === 'moving_company' && (
            <div>
              <p>Company Name: {profileData.company_name}</p>
              <p>Contact Person: {profileData.contact_person}</p>
              <p>Contact Email: {profileData.contact_email}</p>
              <p>Contact Phone: {profileData.contact_phone}</p>
              <p>Extra Services: {profileData.extra_services}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyProfile;
