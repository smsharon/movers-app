import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import './Requests.css'; 

const Requests = () => {
  const [bookingRequests, setBookingRequests] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch booking requests when the component mounts
    fetchBookingRequests();
  }, []);

  const fetchBookingRequests = async () => {
    try {
      const response = await fetch('https://mover-server.onrender.com/get_booking_requests', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookingRequests(data.bookingRequests);
      } else {
        console.error('Failed to fetch booking requests');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAccept = async (bookingId) => {
    try {
      const response = await fetch('/manage_booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          booking_id: bookingId,
          action: 'accept',
        }),
      });

      if (response.ok) {
        setSuccessMessage('Booking accepted successfully');
        // Refresh booking requests after accepting
        fetchBookingRequests();
      } else {
        console.error('Failed to accept booking');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDecline = async (bookingId) => {
    try {
      const response = await fetch('/manage_booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          booking_id: bookingId,
          action: 'decline',
        }),
      });

      if (response.ok) {
        setSuccessMessage('Booking declined successfully');
        // Refresh booking requests after declining
        fetchBookingRequests();
      } else {
        console.error('Failed to decline booking');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Container className="container">
      <h2>Booking Requests</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Moving Date</th>
            <th>Moving Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookingRequests.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.moving_date}</td>
              <td>{booking.moving_time}</td>
              <td>
                <Button variant="success" onClick={() => handleAccept(booking.id)}>
                  Accept
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDecline(booking.id)}>
                  Decline
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Requests;
