import React, { useState, useEffect } from 'react';
import { FaTruck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './MoversList.css';

const MoversList = () => {
  const [movingCompanies, setMovingCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const fetchMovingCompanies = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/moving_companies');
        if (response.ok) {
          const movingCompaniesData = await response.json();
          setMovingCompanies(movingCompaniesData.moving_companies);
        } else {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          setError('Failed to fetch moving companies');
        }
      } catch (error) {
        console.error('Error fetching moving companies:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMovingCompanies();
  }, []);

  const handleViewMore = (company) => {
    setSelectedCompany(company);
  };

  const handleBackToMovers = () => {
    setSelectedCompany(null);
  };

  const handleSelectCompany = () => {
    // Redirect to the booking page with the selected company's details
    // Replace '/booking' with the actual path to your booking page
    window.location.href = '/bookings';
  };

  return (
    <div className="movers-list-container">
      <h1 className='movers-title'>Available Movers</h1>
      {loading && <p>Loading moving companies...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {movingCompanies.map((company) => (
        <div key={company.id} className="company-card">
          <FaTruck className="truck-icon" size={72} color="orange" />
          <h2 className='movers-title'>{company.company_name}</h2>
          <p>Contact Person: {company.contact_person}</p>
          {selectedCompany === company ? (
  <div className="additional-details-card">
    <p>Contact Email: {company.contact_email}</p>
    <p>Contact Phone: {company.contact_phone}</p>
    <p>Extra Services: {company.extra_services}</p>
    <button onClick={handleBackToMovers} className="back-to-movers-button">
      Back to Movers
    </button>
    <button onClick={handleSelectCompany} className="select-moving-company-button">
      Select Moving Company
    </button>
  </div>
) : (
  <>
    <button onClick={() => handleViewMore(company)}>View More</button>
  </>
)}

        </div>
      ))}
    </div>
  );
};

export default MoversList;