import React, { useState } from 'react';

const BookingPage = () => {
  const [movingTime, setMovingTime] = useState('');
  const [movingDate, setMovingDate] = useState('');
  const [locationFrom, setLocationFrom] = useState('');
  const [locationTo, setLocationTo] = useState('');

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    // You can perform actions with the booking details here

    // For now, let's just log the details
    console.log('Moving Time:', movingTime);
    console.log('Moving Date:', movingDate);
    console.log('Location From:', locationFrom);
    console.log('Location To:', locationTo);
  };

  return (
    <div>
      <h2>Moving Booking</h2>
      <form onSubmit={handleBookingSubmit}>
        <label>
          Moving Time:
          <input
            type="time"
            value={movingTime}
            onChange={(e) => setMovingTime(e.target.value)}
            required
          />
        </label>
        <br />

        <label>
          Moving Date:
          <input
            type="date"
            value={movingDate}
            onChange={(e) => setMovingDate(e.target.value)}
            required
          />
        </label>
        <br />

        <label>
          Location From:
          <input
            type="text"
            value={locationFrom}
            onChange={(e) => setLocationFrom(e.target.value)}
            required
          />
        </label>
        <br />

        <label>
          Location To:
          <input
            type="text"
            value={locationTo}
            onChange={(e) => setLocationTo(e.target.value)}
            required
          />
        </label>
        <br />

        <button type="submit">Book Now</button>
      </form>
    </div>
  );
};

export default BookingPage;