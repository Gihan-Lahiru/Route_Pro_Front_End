import React from 'react';
import './BecomeProviderSection.css';
import { useNavigate } from 'react-router-dom';

const BecomeProviderSection = () => {
  const navigate = useNavigate();

  return (
    <section className="provider-section">
      <h1 className="title">BECOME A SERVICE PROVIDER</h1>
      <p className="description">
        Plan your perfect journey with optimized routes, discover hidden gems,
        experience local culture, and provide unforgettable services in the heart of Sri Lanka.
      </p>
      <div className="button-group">
        <button
          className="provider-btn guide"
          onClick={() => navigate('/guide-registration')}
        >
          Become a Guide
        </button>
        <button className="provider-btn driver"
        onClick={() => navigate('/driver-registration')}
        >
          Become a Driver
        </button>
      </div>
    </section>
  );
};

export default BecomeProviderSection;
