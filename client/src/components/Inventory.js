import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Image } from 'react-bootstrap';
import './Inventory.css';
const Inventory = () => {
  const [residenceTypes, setResidenceTypes] = useState([]);
  const [selectedResidenceTypes, setSelectedResidenceTypes] = useState([]);

  const residenceImages = {
    1: './bedsitter.jpg',
    2: './one-bedroom.jpg',
    3: './two-bedroom.jpg',
    4: './studio.jpg',
  };

  useEffect(() => {
    const fetchResidenceTypes = async () => {
      try {
        const response = await fetch('/residences');  // Assuming this is the endpoint to fetch residence types
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
      if (prevSelectedResidenceTypes.includes(residenceTypeId)) {
        // Deselect the residence type if already selected
        return prevSelectedResidenceTypes.filter((id) => id !== residenceTypeId);
      } else {
        // Select the residence type if not selected
        return [...prevSelectedResidenceTypes, residenceTypeId];
      }
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          residence_types: selectedResidenceTypes,
        }),
      });

      if (response.status === 201) {
        console.log('Inventory saved successfully.');
        // Reset form or navigate to another page
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
        <Form.Group controlId="residenceTypes" className="residence-box">
          {residenceTypes.map((residence) => (
            <div key={residence.id} className="residence-item">
              <Form.Check
                type="checkbox"
                label={residence.name}
                checked={selectedResidenceTypes.includes(residence.id)}
                onChange={() => handleResidenceTypeChange(residence.id)}
              />
              {residenceImages[residence.id] && (
                <Image
                  src={residenceImages[residence.id]}
                  alt={`Image for ${residence.name}`}
                  className="residence-image"
                />
              )}
            </div>
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
