// MovingPriceCalculator.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MovingPriceCalculator.css';

const MovingPriceCalculator = () => {
  const navigate = useNavigate();

  const [residenceType, setResidenceType] = useState('bedsitter');
  const [distance, setDistance] = useState('');
  const [movingPrice, setMovingPrice] = useState(null);

  const basePrice = 30;

  useEffect(() => {
    const includeAccessToken = () => {
      const token = localStorage.getItem('access_token');
      return token ? `Bearer ${token}` : '';
    };

    const fetchResidenceType = async () => {
      try {
        const response = await fetch('https://mover-server.onrender.com/user/residence-type', {
          headers: {
            Authorization: includeAccessToken(),
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setResidenceType(data.residenceType);
        } else {
          console.error('Failed to fetch residence type.');
        }
      } catch (error) {
        console.error('Error while fetching residence type:', error);
      }
    };

    fetchResidenceType();
  }, []);

  useEffect(() => {
    let residenceTypeRate = 1.2;

    if (residenceType === 'oneBedroom') {
      residenceTypeRate = 2.0;
    } else if (residenceType === 'studio') {
      residenceTypeRate = 2.5;
    }

    const calculatedMovingPrice = distance ? distance * residenceTypeRate + basePrice * residenceTypeRate : null;
    setMovingPrice(calculatedMovingPrice);
  }, [distance, residenceType, basePrice]);

  const handleCompanySelection = () => {
    navigate('/moving_companies');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
          <button onClick={handleCompanySelection}>Select Moving Company</button>
        </>
      )}
    </div>
  );
};

export default MovingPriceCalculator;
