import React from 'react';
import { useNavigate } from 'react-router-dom';

const Notification = ({ companyName }) => {
  const navigate = useNavigate();
  const handleNotify = () => {
    if ('Notification' in window) {
      if (typeof Notification.requestPermission === 'function') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification('Moving Scheduled', {
              body: `Your moving has been scheduled.`,
            });
          }
        });
      } else {
        alert(`Your moving has been scheduled.`);
        navigate('/gallery')
      }
    } else {
      alert(`Your moving has been scheduled.`);
    }
  };

  return (
    <div>
      <button onClick={handleNotify}>Confirm Notification</button>
    </div>
  );
};

export default Notification;