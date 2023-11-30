import React, { useState } from 'react';

const CompleteMovingCompanyProfile = () => {
  const [profileData, setProfileData] = useState({
    company_name: '',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    extra_services: '',
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
      const response = await fetch('http://localhost:5000/complete_moving_company_profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        // Profile completion successful, you can redirect or show a success message
        console.log('Profile completed successfully');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Profile completion failed');
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
      <h2>Complete Moving Company Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>Company Name:</label>
        <input type="text" name="company_name" value={profileData.company_name} onChange={handleInputChange} />
        <label>Contact Person:</label>
        <input type="text" name="contact_person" value={profileData.contact_person} onChange={handleInputChange} />
        <label>Contact Email:</label>
        <input type="email" name="contact_email" value={profileData.contact_email} onChange={handleInputChange} />
        <label>Contact Phone:</label>
        <input type="text" name="contact_phone" value={profileData.contact_phone} onChange={handleInputChange} />
        <label>Extra Services:</label>
        <input type="text" name="extra_services" value={profileData.extra_services} onChange={handleInputChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Completing Profile...' : 'Complete Profile'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CompleteMovingCompanyProfile;
