import React from 'react';

const Notification = ({ companyName }) => {
  const handleNotify = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('Moving Scheduled', {
            body: `Your moving with ${companyName} has been scheduled.`,
          });
        }
      });
    }
  };

  return (
    <div>
      <button onClick={handleNotify}>Confirm Notification</button>
    </div>
  );
};

export default Notification;
