import React from 'react';
import './aboutus.css';

const AboutUs = () => {
  return (
    <div className="aboutus-container">
      <header className="aboutus-header">
        <h1>About RoutePro</h1>
        <p>Your All-in-One Travel Planner & Sightseeing Guide</p>
      </header>

      <section className="aboutus-section">
  <h2>Get to Know Us</h2>
  <p>
    <strong>RoutePro</strong> is an all-in-one digital trip planning platform designed to make exploring Sri Lanka seamless, scenic, and culturally immersive. Whether you're mapping out a road trip, booking trusted local services, or uncovering hidden gems across the island, RoutePro simplifies every step — from route planning and vehicle booking to food trails and festival highlights.
  </p>
</section>


      <section className="aboutus-section">
        <h2>Our Mission</h2>
        <p>
          To develop a unified, user-friendly travel planner that streamlines journey planning and promotes immersive cultural experiences across Sri Lanka.
        </p>
      </section>

      <section className="aboutus-section">
        <h2>Our Objectives</h2>
        <ul>
          <li>Centralize route planning, vehicle booking, guide services, and sightseeing discovery</li>
          <li>Provide flexible, budget-conscious travel packages for different user preferences</li>
          <li>Enable travelers to discover district-specific foods and traditional festivals</li>
          <li>Integrate smart routing with scenic and cultural attraction highlights</li>
          <li>Support user feedback through ratings and review systems</li>
          <li>Empower local service providers through a digital marketplace</li>
        </ul>
      </section>

      

    
    </div>
  );
};

export default AboutUs;
