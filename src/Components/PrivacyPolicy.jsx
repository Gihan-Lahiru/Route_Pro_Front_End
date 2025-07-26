import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <header className="privacy-header">
        <h1>Privacy Policy</h1>
        <p><strong>Effective Date:</strong> [Insert Date]</p>
        <p>This Privacy Policy explains how we collect, use, and protect your personal data on RoutePro.</p>
      </header>

      <section className="privacy-section">
        <h2>Information We Collect</h2>
        <ul>
          <li>Personal details like name, email, phone number, and location when you register.</li>
          <li>Trip preferences, booking details, and ratings you provide.</li>
          <li>Technical data such as IP address, browser type, and usage patterns.</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2>How We Use Your Information</h2>
        <ul>
          <li>To manage user accounts and process bookings.</li>
          <li>To match travelers with drivers and guides based on trip needs.</li>
          <li>To improve the quality and security of our platform.</li>
          <li>To send trip updates, notifications, or support messages.</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2>Data Sharing</h2>
        <p>We do not sell or rent your information. Data is only shared with:</p>
        <ul>
          <li>Verified drivers or guides when you make a booking.</li>
          <li>Service providers that help us run RoutePro (e.g., email services, payment processors).</li>
          <li>Authorities, if required by law or to enforce our Terms of Service.</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2>Your Privacy Rights</h2>
        <ul>
          <li>You can update or delete your personal information from your account settings.</li>
          <li>You may request to deactivate your account at any time.</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2>Data Security</h2>
        <p>We use secure technologies like HTTPS and encrypted databases to protect your personal data from unauthorized access.</p>
      </section>

      <section className="privacy-section">
        <h2>Cookies</h2>
        <p>We use cookies to improve your experience on our website. You can disable cookies in your browser settings.</p>
      </section>

      <section className="privacy-section">
        <h2>Contact</h2>
        <p>If you have any questions or concerns about our Privacy Policy, please contact us at: <strong>support@routepro.com</strong></p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
