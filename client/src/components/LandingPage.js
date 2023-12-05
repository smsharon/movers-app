// LandingPage.js
import React from 'react';
const LandingPage = () => {
  return (
    <div className="bg-cover bg-center bg-fixed" style={{backgroundImage: 'url("https://images.pexels.com/photos/7464491/pexels-photo-7464491.jpeg?auto=compress&cs=tinysrgb&w=600")'}}>
      <div className="container mx-auto px-4 mt-16">
        <h1 className="text-4xl font-bold text-white mb-8">Welcome to BOXDNLOADED</h1>
      

        {/* Your ultimate choice text */}
        <p className="absolute bottom-0 right-0 text-white mr-4 mb-4 text-sm">Your ultimate choice</p>
      </div>
    </div>
  );
};

export default LandingPage;
