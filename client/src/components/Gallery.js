import React, { useState } from 'react';
import './Gallery.css'; // Add your CSS for styling

const Gallery = () => {
  const images = [
    'https://images.pexels.com/photos/7464708/pexels-photo-7464708.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/7464681/pexels-photo-7464681.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/7464657/pexels-photo-7464657.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/5025669/pexels-photo-5025669.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/7464721/pexels-photo-7464721.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/7464473/pexels-photo-7464473.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/4554249/pexels-photo-4554249.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://plus.unsplash.com/premium_photo-1679858379227-1a9e4cd878d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bW92aW5nfGVufDB8fDB8fHww'
  ];

  return (
    <div className="gallery">
    <h1 style={{  marginLeft:"43%", marginRight:"38%", color:"white", backgroundColor:"grey"}}> BoxdNLoaded </h1>
      
      <div className="grid">
        {images.map((image, index) => (
          <div key={index} className="card">
            <img src={image} className="image" alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;