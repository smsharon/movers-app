import React, { useState } from 'react';
import { Container, Form, Button, Card, InputGroup, Image, Row, Col } from 'react-bootstrap';

const Inventory = () => {
  const [residenceType, setResidenceType] = useState('');
  const [componentStates, setComponentStates] = useState({
    furniture: false,
    electronics: false,
    kitchenAppliances: false,
    clothing: false,
  });

  const componentImages = {
    furniture: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
    electronics: 'https://images.pexels.com/photos/15313403/pexels-photo-15313403/free-photo-of-a-pile-of-old-televisions-and-other-electronics.jpeg?auto=compress&cs=tinysrgb&w=600',
    kitchenAppliances: 'https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg?auto=compress&cs=tinysrgb&w=600',
    clothing: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=600',
  };

  const handleCheckboxChange = (component) => {
    setComponentStates((prevComponentStates) => ({
      ...prevComponentStates,
      [component]: !prevComponentStates[component],
    }));
  };

  const handleResidenceTypeChange = (e) => {
    setResidenceType(e.target.value);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          residence_type: residenceType,
          components: componentStates,
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
    <Container>
      <h2>Inventory Form</h2>
      <Form>
        <Form.Group controlId="residenceType">
          <Form.Label>Residence Type:</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              value={residenceType}
              onChange={handleResidenceTypeChange}
              aria-label="Residence Type"
              aria-describedby="residenceType"
            />
          </InputGroup>
        </Form.Group>

        <Row>
          <Col md={6}>
            <Card style={{ marginBottom: '10px' }}>
              <Card.Body>
                <Form.Check
                  type="checkbox"
                  label="Furniture"
                  checked={componentStates.furniture}
                  onChange={() => handleCheckboxChange('furniture')}
                />
                {componentStates.furniture && (
                  <Card.Img
                    variant="top"
                    src={componentImages.furniture}
                    alt="Furniture sample"
                    style={{ width: '30%' }}
                  />
                )}

                <Form.Check
                  type="checkbox"
                  label="Clothing"
                  checked={componentStates.clothing}
                  onChange={() => handleCheckboxChange('clothing')}
                />
                {componentStates.clothing && (
                  <Card.Img
                    variant="top"
                    src={componentImages.clothing}
                    alt="Clothing sample"
                    style={{ width: '30%' }}
                  />
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card style={{ marginBottom: '10px' }}>
              <Card.Body>
                <Form.Check
                  type="checkbox"
                  label="Electronics"
                  checked={componentStates.electronics}
                  onChange={() => handleCheckboxChange('electronics')}
                />
                {componentStates.electronics && (
                  <Card.Img
                    variant="top"
                    src={componentImages.electronics}
                    alt="Electronics sample"
                    style={{ width: '30%' }}
                  />
                )}

                <Form.Check
                  type="checkbox"
                  label="Kitchen Appliances"
                  checked={componentStates.kitchenAppliances}
                  onChange={() => handleCheckboxChange('kitchenAppliances')}
                />
                {componentStates.kitchenAppliances && (
                  <Card.Img
                    variant="top"
                    src={componentImages.kitchenAppliances}
                    alt="Kitchen Appliances sample"
                    style={{ width: '30%' }}
                  />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Button variant="primary" type="button" onClick={handleSave}>
          Save
        </Button>
      </Form>
    </Container>
  );
};

export default Inventory;