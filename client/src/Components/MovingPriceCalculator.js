import React, { useState } from 'react';

const MovingPriceCalculator = ({ distance }) => {
 const [residenceType, setResidenceType] = useState('bedsitter');

 const calculatePrice = () => {
    const distanceRate = 200; // Rate per mile
    const basePrice = 500;     // Base price

    let residenceTypeRate = 1.0; // Default rate for bedsitter
    if (residenceType === 'oneBedroom') {
      residenceTypeRate = 1.2;
    } else if (residenceType === 'studio') {
      residenceTypeRate = 1.1;
    } else if (residenceType === 'twoBedroom') {
      residenceTypeRate = 1.3;
    }

    const totalPrice = basePrice + (distance * distanceRate) * residenceTypeRate;

    return totalPrice;
 };

 const handleCalculatePrice = () => {
    const totalPrice = calculatePrice();
    console.log(`Estimated Price: $${totalPrice.toFixed(2)}`);
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
      <p>Distance: {distance} miles</p>
      <button onClick={handleCalculatePrice}>Calculate Moving Price</button>
      {distance !== null && (
        <p>
          Estimated Price: ${calculatePrice().toFixed(2)}
        </p>
      )}
    </div>
 );
};

export default MovingPriceCalculator;