import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import './Bookings.css';

const Bookings = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Function to include the access token in requests
  const includeAccessToken = () => {
    const token = localStorage.getItem('access_token');
    return token ? `Bearer ${token}` : '';
  };

  const handleSchedule = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/make_booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': includeAccessToken(),
        },
        body: JSON.stringify({
          movingDate: selectedDate,
        }),
      });

      if (response.ok) {
        console.log('Booking request submitted successfully!');
        setSuccessMessage('Booking scheduled successfully. Please wait for confirmation from the mover.');
        // Redirect or navigate to another page after scheduling
        navigate('/customer-dashboard'); // Replace '/confirmation' with the actual path
  
      } else {
        console.error('Failed to submit booking request');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
    
  

  return (
    <Container className="container">
      <h2>Schedule Movement</h2>
      <Form>
        <Form.Group controlId="selectedDate" className="form-group">
          <Form.Label>Select Date and Time:</Form.Label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="form-control"
          />
        </Form.Group>

        <Button variant="primary" type="button" onClick={handleSchedule} className="button-container">
          Schedule Movement
        </Button>
        {successMessage && (
          <Alert variant="success" className="mt-3">
            {successMessage}
          </Alert>
        )}
      </Form>
    </Container>
  );
};

export default Bookings;
