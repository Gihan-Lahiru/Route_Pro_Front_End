import React from "react";
import "./contactus.css";

const ContactUs = () => {
  return (
    <div className="contact-container">
      <header className="contact-header">
        <h1>Contact Us</h1>
        <p>We’re here to help you with support, partnerships, security, and investment inquiries.</p>
      </header>

      <section className="contact-section">
        <h2>Member Relations & Support</h2>
        <p>Email: <strong>support@routepro.com</strong></p>
      </section>

      <section className="contact-section">
        <h2>Partnerships & Brand Enquiries</h2>
        <p>Email: <strong>partnerships@routepro.com</strong></p>
      </section>

      <section className="contact-section">
        <h2>Report a Security Issue</h2>
        <p>Email: <strong>security@routepro.com</strong></p>
      </section>

      <section className="contact-section">
        <h2>Investors</h2>
        <p>Website: <a href="https://www.routeproinvest.com" target="_blank" rel="noopener noreferrer">www.routeproinvest.com</a></p>
        <p>Email: <strong>investors@routepro.com</strong></p>
      </section>
    </div>
  );
};

export default ContactUs;
