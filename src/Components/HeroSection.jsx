import React from 'react';
import './HeroSection.css';


const HeroSection = () => {
  return (
    <div className="hero-section">
     

      <div className="hero-buttons">
        <button className="primary-btn">Start Planning Your Trip</button>
        <button className="secondary-btn">Explore Attractions</button>
      </div>

        <div className="stats" >
        <div className="stat-card" class="feature-card">
          
          <h2>500+</h2>
          <p>Tourist Destinations</p>
        </div>

        <div className="stat-card" class="feature-card">
         
          <h2>10,000+</h2>
          <p>Happy Travelers</p>
        </div>

        <div className="stat-card" class="feature-card">
          
          <h2>50+</h2>
          <p>Cultural Events</p>
        </div>
        </div>
      </div>
      );
};

export default HeroSection;
