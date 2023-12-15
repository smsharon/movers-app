import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import './Inventory.css';
import { useNavigate } from 'react-router-dom';


const Inventory = () => {
  const [residenceTypes, setResidenceTypes] = useState([]);
  const [selectedResidenceTypes, setSelectedResidenceTypes] = useState([]);
  
  const navigate = useNavigate();
  useEffect(() => {
    const fetchResidenceTypes = async () => {
      try {
        const response = await fetch('https://mover-server.onrender.com/residences');  // Assuming this is the endpoint to fetch residence types
        const data = await response.json();

        if (response.status === 200) {
          setResidenceTypes(data.residences);
          console.log('Fetched residence types:', data.residences); // Add this line
        } else {
          console.error('Failed to fetch residence types.');
        }
      } catch (error) {
        console.error('Error while fetching residence types:', error);
      }
    };

    fetchResidenceTypes();
  }, []);

  const handleResidenceTypeChange = (residenceTypeId) => {
    setSelectedResidenceTypes((prevSelectedResidenceTypes) => {
      // Use a single value instead of an array
      const newSelectedResidenceType = prevSelectedResidenceTypes[0] === residenceTypeId ? null : residenceTypeId;
  
      return newSelectedResidenceType !== null ? [newSelectedResidenceType] : [];
    });
  };
  

  // Function to include the access token in requests
  const includeAccessToken = () => {
    const token = localStorage.getItem('access_token');
    return token ? `Bearer ${token}` : '';
  };
  

  const handleSave = async () => {
    try {
      const response = await fetch('/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': includeAccessToken(),
        },
        body: JSON.stringify({
          residence_type_id: selectedResidenceTypes[0],
        }),
      });

      if (response.status === 201) {
        console.log('Inventory saved successfully.');
        // Navigate to the location page upon successful save
        navigate('/locations'); // Replace '/location' with the actual path of your location page
      } else {
        console.error('Failed to save inventory.');
      }
    } catch (error) {
      console.error('Error while saving inventory:', error);
    }
  };
  return (
    <Container className="container">
      <h2>Inventory Form</h2>
      <Form>
        <Form.Group controlId="residenceTypes" className="form-group">
          <Form.Label>Residence Types:</Form.Label>
          {residenceTypes.map((residence) => (
            <Form.Check
              key={residence.id}
              type="checkbox"
              label={residence.name} /* Make sure the property name is correct */
              checked={selectedResidenceTypes.includes(residence.id)}
              onChange={() => handleResidenceTypeChange(residence.id)}
              className="form-check"
            />
          ))}
        </Form.Group>
  
        <Button variant="primary" type="button" onClick={handleSave} className="button-container">
          Save
        </Button>
      </Form>
    </Container>
  );
  
};

export default Inventory;

