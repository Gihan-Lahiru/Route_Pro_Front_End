import React from 'react';
import './termsconditions.css';

const TermsCondition = () => {
  return (
    <div className="terms-container">
      <header className="terms-header">
        <h1>Terms and Conditions</h1>
        <p>Welcome to RoutePro! By using our platform, you agree to the following terms:</p>
      </header>

      <section className="terms-section">
        <h2>Use of the Platform</h2>
        <p>
          RoutePro is a travel planning platform that connects travelers with verified drivers and tour guides. You can use our services to:
        </p>
        <ul>
          <li>Plan routes across Sri Lanka</li>
          <li>Book vehicles and guides</li>
          <li>Explore recommended sightseeing spots</li>
        </ul>
      </section>

      <section className="terms-section">
        <h2>User Responsibilities</h2>
        <ul>
          <li>You must be 18 years or older to create an account.</li>
          <li>You agree to provide accurate, complete, and updated information.</li>
          <li>You are responsible for keeping your account login information secure.</li>
        </ul>
      </section>

      <section className="terms-section">
        <h2>Bookings and Payments</h2>
        <ul>
          <li>All bookings are confirmed directly between the traveler and the service provider (driver or guide).</li>
          <li>Payments must be processed through the RoutePro system.</li>
          <li>Cancellations and refunds will follow our platform’s policy.</li>
        </ul>
      </section>

      <section className="terms-section">
        <h2>Ratings and Account Monitoring</h2>
        <ul>
          <li>After a trip, travelers can rate and review the service.</li>
          <li>Any driver or guide who receives an average rating below <strong>2.5</strong> will be flagged for admin review.</li>
          <li>Accounts that consistently perform poorly may be suspended or removed from the system.</li>
        </ul>
      </section>

      <section className="terms-section">
        <h2>Account Termination</h2>
        <p>
          We reserve the right to suspend or delete any account that violates our terms or receives repeated complaints or low ratings.
        </p>
      </section>

      <section className="terms-section">
        <h2>Data Privacy</h2>
        <p>
          Your personal information is protected under our Privacy Policy. We do not share or sell your data to third parties.
        </p>
      </section>

      <section className="terms-section">
        <h2>Contact Us</h2>
        <p>
          If you have any questions or concerns, please contact us at: <strong>support@routepro.com</strong>
        </p>
      </section>
    </div>
  );
};

export default TermsCondition;
