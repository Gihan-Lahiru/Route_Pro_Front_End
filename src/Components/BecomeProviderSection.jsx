import React from 'react';
import './BecomeProviderSection.css';

const BecomeProviderSection = () => {
  return (
    <section className="provider-section">
      <h1 className="title">BECOME A SERVICE PROVIDER</h1>
      <p className="description">
        Plan your perfect journey with optimized routes, discover hidden gems,
        experience local culture, and provide unforgettable services in the heart of Sri Lanka.
      </p>
      <div className="button-group">
        <button className="provider-btn guide">Become a Guide</button>
        <button className="provider-btn driver">Become a Driver</button>
      </div>
    </section>
  );
};

export default BecomeProviderSection;
