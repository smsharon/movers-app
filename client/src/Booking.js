import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Assuming you have a "booking" action file or you can create one
import { bookMove } from '../redux/bookingActions'; 

const Booking = () => {
  const dispatch = useDispatch();

  const [movingDate, setMovingDate] = useState('');
  const [movingTime, setMovingTime] = useState('');

  const user = useSelector((state) => state.user);
  const inventory = useSelector((state) => state.inventory);

  // Define your custom bookMove action
  const customBookMove = () => {
    // Custom logic for booking action
    // You can dispatch your action here
    dispatch(bookMove({ movingDate, movingTime, user, inventory }));
  };

  return (
    <div>
      <h2>Confirm Your Booking</h2>

      {/* Form for selecting moving date and time */}
      <div>
        <label htmlFor="movingDate">Moving Date:</label>
        <input
          type="date"
          id="movingDate"
          value={movingDate}
          onChange={(e) => setMovingDate(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="movingTime">Moving Time:</label>
        <input
          type="time"
          id="movingTime"
          value={movingTime}
          onChange={(e) => setMovingTime(e.target.value)}
        />
      </div>

      {/* Display other relevant information, such as pricing or inventory details */}

      {/* Button to confirm booking */}
      <button onClick={customBookMove}>Confirm Booking</button>
    </div>
  );
};

export default Booking;
