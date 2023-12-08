import React, { useState, useEffect } from 'react';
import './MovingPriceCalculator.css';

const MovingPriceCalculator = () => {
  const [residenceType, setResidenceType] = useState('bedsitter'); // Default residence type
  const [distance, setDistance] = useState('');
  const [movingPrice, setMovingPrice] = useState(null);

  const basePrice = 30; // Define the base price

  useEffect(() => {
    // Function to include the access token in requests
    const includeAccessToken = () => {
      const token = localStorage.getItem('access_token');
      return token ? `Bearer ${token}` : '';
    };

    // Function to fetch residence type for the logged-in user
    const fetchResidenceType = async () => {
      try {
        const response = await fetch('/user/residence-type', {
          headers: {
            Authorization: includeAccessToken(),
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setResidenceType(data.residenceType);
          console.log('Fetched residence type:', data.residenceType);
        } else {
          console.error('Failed to fetch residence type.');
        }
      } catch (error) {
        console.error('Error while fetching residence type:', error);
      }
    };

    // Fetch residence type on component mount
    fetchResidenceType();
  }, []);

  // Calculate moving price based on residence type rate
  useEffect(() => {
    let residenceTypeRate = 1.2; // Default rate for bedsitter

    if (residenceType === 'oneBedroom') {
      residenceTypeRate = 2.0;
    } else if (residenceType === 'studio') {
      residenceTypeRate = 1.6;
    } else if (residenceType === 'twoBedroom') {
      residenceTypeRate = 2.5;
    }

    // Calculate moving price
    const calculatedMovingPrice = distance ? distance * residenceTypeRate + basePrice * residenceTypeRate : null;
    setMovingPrice(calculatedMovingPrice);
  }, [distance, residenceType, basePrice]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add additional validation here before updating the distance state
    // For simplicity, assuming the input is always a valid number
    setDistance(e.target.elements.distance.value);
  };

  return (
    <div className='moving-price'>
      <h2>Moving Price Calculator</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Distance (km):
          <input type="number" name="distance" value={distance} onChange={(e) => setDistance(e.target.value)} />
        </label>
        <br />
        <label>
          Residence Type:
          <select value={residenceType} onChange={(e) => setResidenceType(e.target.value)}>
            <option value="bedsitter">Bedsitter</option>
            <option value="oneBedroom">One Bedroom</option>
            <option value="studio">Studio</option>
            <option value="twoBedroom">Two Bedroom</option>
          </select>
        </label>
        <br />
        <button type="submit">Calculate Moving Price</button>
      </form>
      {distance !== null && residenceType !== null && (
        <>
          <p>Distance: {distance} km</p>
          <p>Residence Type: {residenceType}</p>
          <p>Moving Price: ${movingPrice !== null ? movingPrice.toFixed(2) : 'N/A'}</p>
        </>
      )}
    </div>
  );
};

export default MovingPriceCalculator;