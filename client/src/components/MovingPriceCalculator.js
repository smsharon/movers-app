import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MovingPriceCalculator = () => {
  const [residenceType, setResidenceType] = useState('bedsitter');
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [distance, setDistance] = useState(null);
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const navigate = useNavigate(); // Import the useNavigate hook

  useEffect(() => {
    // Fetch names and distance from backend when the component mounts
    fetchDistanceAndNamesFromBackend();
  }, []);

  const fetchDistanceAndNamesFromBackend = async () => {
    try {
      const response = await fetch('http://localhost:5000/locations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers, such as authorization token, if needed
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setDistance(data.distance);
        setStartAddress(data.startAddress);
        setEndAddress(data.endAddress);
      } else {
        console.error('Failed to fetch data from the backend.');
        // Handle error as needed
      }
    } catch (error) {
      console.error('Error while fetching data:', error);
      // Handle error as needed
    }
  };

  const calculatePrice = () => {
    const distanceRate = 200; // Rate per km
    const basePrice = 2000;    // Base price

    let residenceTypeRate = 1.2; // Default rate for bedsitter
    if (residenceType === 'oneBedroom') {
      residenceTypeRate = 2.0;
    } else if (residenceType === 'studio') {
      residenceTypeRate = 1.6;
    } else if (residenceType === 'twoBedroom') {
      residenceTypeRate = 2.5;
    }

    const totalPrice = basePrice + (distance * distanceRate) * residenceTypeRate;

    return totalPrice;
  };

  const handleCalculatePrice = () => {
    const totalPrice = calculatePrice();
    setEstimatedPrice(totalPrice.toFixed(2));

    // Redirect to Bookings component
    navigate('/bookings');
  };

  return (
    <div>
      <h2>Moving Price Calculator</h2>
      <label>
        Residence Type:
        <select value={residenceType} onChange={(e) => setResidenceType(e.target.value)}>
          <option value="bedsitter">Bedsitter</option>
          <option value="oneBedroom">One Bedroom</option>
          <option value="studio">Studio</option>
          <option value="twoBedroom">Two Bedroom</option>
        </select>
      </label>
      {distance !== null && startAddress && endAddress ? (
        <>
          <p>
            Move from {startAddress} to {endAddress} ({distance} miles)
          </p>
          <button onClick={handleCalculatePrice}>Calculate Moving Price</button>
          {estimatedPrice !== null && (
            <p>
              Estimated Price: ${estimatedPrice}
            </p>
          )}
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default MovingPriceCalculator;
