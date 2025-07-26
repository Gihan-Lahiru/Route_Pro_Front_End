import React from "react";
import "./Footer.css";
import {
  FaFacebookF,
  FaTwitter,
  FaTiktok,
  FaYoutube,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section about">
          <h2 className="logo">
            <span className="routepro-brand">Route</span>
            <span className="yellow">Pro.</span>
          </h2>
          <p>
            Your ultimate travel companion for exploring Sri Lanka. Discover
            amazing destinations, plan efficient routes, and experience
            authentic local culture.
          </p>
          <div className="social-icons">
            <FaFacebookF />
            <FaTwitter />
            <FaTiktok />
            <FaYoutube />
          </div>
        </div>

        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="#">Route Planning</a>
            </li>
            <li>
              <a href="#">Attractions</a>
            </li>
            <li>
              <a href="#">Culture</a>
            </li>
            <li>
              <a href="#">Packages</a>
            </li>
          </ul>
        </div>

        <div className="footer-section info">
          <h4>Information</h4>
          <ul>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Terms and Conditions</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h4>Contact</h4>
          <p>
            <FaEnvelope className="icon" /> info@routepro.lk
          </p>
          <p>
            <FaPhoneAlt className="icon" /> +94 11 234 567
          </p>
        </div>

        <div className="footer-bottom">
      <p>
        © 2025 RoutePro All Rights Reserved.
     </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;