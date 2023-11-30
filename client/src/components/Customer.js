import React, { useState } from 'react';

const CompleteCustomerProfile = () => {
  const [profileData, setProfileData] = useState({
    full_name: '',
    contact_phone: '',
    address: '',
    preferred_contact_method: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);
      const response = await fetch('/complete_customer_profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
  
      if (response.status === 200) {
        // Profile completion successful, you can redirect or show a success message
        console.log('Profile completed successfully');
      } else {
        const errorText = await response.text(); // Get the response as text
        console.error('Error response:', errorText);
        setError('Profile completion failed');
      }
    } catch (error) {
      console.error('Error during profile completion:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2>Complete Customer Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>Full Name:</label>
        <input type="text" name="full_name" value={profileData.full_name} onChange={handleInputChange} />
        <label>Contact Phone:</label>
        <input type="text" name="contact_phone" value={profileData.contact_phone} onChange={handleInputChange} />
        <label>Address:</label>
        <input type="text" name="address" value={profileData.address} onChange={handleInputChange} />
        <label>Preferred Contact Method:</label>
        <input
          type="text"
          name="preferred_contact_method"
          value={profileData.preferred_contact_method}
          onChange={handleInputChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Completing Profile...' : 'Complete Profile'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CompleteCustomerProfile;
