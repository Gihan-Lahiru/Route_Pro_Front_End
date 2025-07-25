import React from 'react';
import './FeaturesSection.css';


const FeaturesSection = () => {
  return (
    <section className="features-section">
      <h1><span>Everything You Need</span> for the <span className="green-text">Perfect Trip</span></h1>
      <p className="subtitle">RoutePro combines intelligent planning with local expertise to create unforgettable travel experiences across Sri Lanka.</p>

      <div className="features-grid">
        <FeatureCard
         
          title="Smart Route Planning"
          desc="Find the shortest and most efficient routes between destinations with real-time traffic updates."
          color="green"
        />
        <FeatureCard
          
          title="Tourist Attractions"
          desc="Discover hidden gems and popular tourist spots along your route with detailed information."
          color="teal"
        />
        <FeatureCard
          
          title="Cultural Experiences"
          desc="Learn about local festivals, traditions, and authentic Sri Lankan cultural experiences."
          color="blue"
        />
        <FeatureCard
         
          title="Budget Packages"
          desc="Affordable plans that fit your travel budget without compromising on experience."
          color="purple"
        />
        <FeatureCard
          title="Guide Booking"
          desc="Hire professional local guides to enhance your journey with authentic insights."
          color="red"
        />
        <FeatureCard
          
          title="Local Cuisine"
          desc="Taste traditional Sri Lankan dishes recommended by local experts."
          color="orange"
        />
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, desc, color }) => (
  <div className="feature-card">
    <div className={`icon-wrapper ${color}`}>
      {icon}
    </div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </div>
);

export default FeaturesSection;
