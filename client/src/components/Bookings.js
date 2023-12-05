import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import './Bookings.css';

const Bookings = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSchedule = () => {
    // You can perform any actions related to scheduling here
    // For example, send the selected date and time to the server
    console.log('Scheduled for:', selectedDate);

    // Redirect or navigate to another page after scheduling
    navigate('/confirmation'); // Replace '/confirmation' with the actual path
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
      </Form>
    </Container>
  );
};

export default Bookings;
