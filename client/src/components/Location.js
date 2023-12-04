import React, { useState } from 'react';
import "./Location.css"
const LocationCalculator = () => {
  const [startCity, setStartCity] = useState('');
  const [endCity, setEndCity] = useState('');
  const [distance, setDistance] = useState(null);
  const [validated, setValidated] = useState(false);

  const handleCalculateDistance = async () => {
    try {
      const form = document.getElementById('locationForm');
      if (form.checkValidity() === false) {
        setValidated(true);
        return;
      }

      if (!startCity || !endCity) {
        throw new Error('Please enter both start and end cities.');
      }

      const calculatedDistance = await getDistance(startCity, endCity);
      setDistance(calculatedDistance.toFixed(2));
      
      // Call sendDistanceToBackend after successfully calculating the distance
      await sendDistanceToBackend(startCity, endCity, calculatedDistance);
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
        const calculatedDistance = data.rows[0].elements[0].distance.value;
        return calculatedDistance / 1000; // Convert meters to kilometers
      } else {
        throw new Error('Distance Matrix failed: Invalid status or no results');
      }
    } catch (error) {
      console.error('Error getting distance:', error);
      throw error;
    }
  };
  
   // Function to include the access token in requests
   const includeAccessToken = () => {
    const token = localStorage.getItem('access_token');
    return token ? `Bearer ${token}` : '';
  };
  const sendDistanceToBackend = async (currentAddress, newAddress, distance) => {
    try {
      const response = await fetch('/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': includeAccessToken(),
        },
        body: JSON.stringify({
          current_address: currentAddress,
          new_address: newAddress,
          distance: distance,
          
        }),
      });

      if (response.status === 200) {
        console.log('Distance stored successfully on the backend.');
      } else {
        throw new Error('Failed to store distance on the backend.');
      }
    } catch (error) {
      console.error('Error while sending distance to the backend:', error);
    }
  };

  return (
    <div className="location">
      <form
        id="locationForm"
        noValidate
        validated={validated}
        onSubmit={(e) => {
          e.preventDefault();
          handleCalculateDistance();
        }}
        style={{ width: '50%' }}
      >
        <div className="mb-3 row">
          <div className="col-md-6">
            <label htmlFor="startCity" className="form-label h5">
              Start City:
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="startCity"
              placeholder="Enter start city"
              value={startCity}
              onChange={(e) => setStartCity(e.target.value)}
              required
            />
            
          </div>
          <div className="col-md-6">
            <label htmlFor="endCity" className="form-label h5">
              End City:
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              id="endCity"
              placeholder="Enter end city"
              value={endCity}
              onChange={(e) => setEndCity(e.target.value)}
              required
            />
            
          </div>
        </div>
        
        <button type="submit" className="btn btn-lg btn-primary">
          Calculate Distance
        </button>

      </form>

      {distance !== null && (
        <p className="mt-3">
          The distance between {startCity} and {endCity} is {distance} km.
        </p>
      )}
    </div>
  );
};

export default LocationCalculator;