import React, { useState } from 'react';

const LocationCalculator = () => {
 const [startCity, setStartCity] = useState('');
 const [endCity, setEndCity] = useState('');
 const [distance, setDistance] = useState(null);

 const handleCalculateDistance = async () => {
  try {
    if (!startCity || !endCity) {
      throw new Error('Please enter both start and end cities.');
    }

    const distance = await getDistance(startCity, endCity);
    setDistance(distance.toFixed(2));
  } catch (error) {
    console.error('Error while calculating distance:', error);
    alert('Error while calculating distance. Please try again.');
  }
};

 const getDistance = async (origin, destination) => {
    try {
      const apiKey = 'oFVllqJzQLH2BJhHYAD8WXm80SYoYDmCzu0W3rM59CQXgMmuwLfg8PTPjW8AeNjc';
      const apiUrl = `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.status === 'OK' && data.rows.length > 0 && data.rows[0].elements.length > 0) {
        const distance = data.rows[0].elements[0].distance.value;
        return distance / 1000; // Convert meters to kilometers
      } else {
        throw new Error('Distance Matrix failed: Invalid status or no results');
      }
    } catch (error) {
      console.error('Error getting distance:', error);
      throw error;
    }
 };


 return (
  <div>
    <form onSubmit={(e) => e.preventDefault()}>
      <label>Start City:</label>
      <input value={startCity} onChange={(e) => setStartCity(e.target.value)} required />

      <label>End City:</label>
      <input value={endCity} onChange={(e) => setEndCity(e.target.value)} required />

      <button onClick={handleCalculateDistance}>Calculate Distance</button>
    </form>

    {distance !== null && (
      <p>
        The distance between {startCity} and {endCity} is {distance} km.
      </p>
    )}
  </div>
);
};

export default LocationCalculator;