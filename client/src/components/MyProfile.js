import React, { useState, useEffect } from 'react';

const MyProfile = ({ user }) => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Fetch user profile data based on the user's ID
    // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint to fetch user profile
    fetch(`YOUR_API_ENDPOINT/users/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        setProfileData(data); // Set the fetched profile data
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error.message);
      });
  }, [user.id]);

  return (
    <div>
      <h2>My Profile</h2>
      {profileData ? (
        <div>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          {/* Display additional profile details fetched from the API */}
          <p>Full Name: {profileData.full_name}</p>
          <p>Contact Phone: {profileData.contact_phone}</p>
          <p>Address: {profileData.address}</p>
          <p>Preferred Contact Method: {profileData.preferred_contact_method}</p>
          {/* Add more details as needed */}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default MyProfile;

