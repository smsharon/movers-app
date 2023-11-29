import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Landingpage = () => {
  return (
    <div className="container-fluid d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="row">
        <div className="col-md-6 text-center">
          <h1>Welcome to BoxdNLoaded</h1>
          <img
            src="https://images.pexels.com/photos/7464222/pexels-photo-7464222.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Moving Truck"
            className="img-fluid"
          />
          <p>
            We make moving easy! Whether you're relocating to a new city or just around the corner,
            our movers are here to assist you.
          </p>
          <p>Explore our services and get a quote today.</p>
        </div>
      </div>
    </div>
  );
};

export default Landingpage;


