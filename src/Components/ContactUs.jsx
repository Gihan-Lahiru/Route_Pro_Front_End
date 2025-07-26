import React from "react";
import "./contactus.css";

export default function ContactUs() {
  return (
    <div className="contact-card">
      <h3>Contact Us</h3>

      <div className="contact-section">
        <h5>MEMBER RELATIONS AND SUPPORT</h5>
        <p>support@routepro.com</p>
      </div>

      <div className="contact-section">
        <h5>PARTNERSHIPS & BRAND ENQUIRIES</h5>
        <p>partnerships@routepro.com</p>
      </div>

      <div className="contact-section">
        <h5>REPORT A SECURITY ISSUE</h5>
        <p>security@routepro.com</p>
      </div>

      <div className="contact-section">
        <h5>INVESTORS</h5>
        <p>www.routeproinvest.com</p>
        <p>investors@routepro.com</p>
      </div>
    </div>
  );
}
