import React from 'react';
import './DriverHeader.css';

const DriverHeader = ({ status }) => {
  return (
    <div className="driver-header">
      <img src="/pic.jpg" alt="Driver" className="driver-photo" />

      <div className="driver-info">
        <h2>Michael Rodriguez</h2>
        <p>⭐ 4.7 (1247 rides)</p>
        <p><strong>Vehicle:</strong> Honda Civic 2022 — ABC-1234</p>
        <p><strong>Location:</strong> Downtown Area</p>
        <p><strong>Member Since:</strong> March 2022</p>
        <p><strong>Contact:</strong> +1 (555) 123-4567 | michael.r@driver.com</p>
        <div className="status-display">
          <span>Status: </span>
          <span className={`status-label ${status.toLowerCase()}`}>{status}</span>
        </div>
      </div>

      {/* 📊 Earnings Summary Panel */}
      <div className="earnings-column">
        <div className="earning-card">
          <h4>Today</h4>
          <p>$285</p>
        </div>
        <div className="earning-card">
          <h4>This Week</h4>
          <p>$1250</p>
        </div>
        <div className="earning-card">
          <h4>This Month</h4>
          <p>$4850</p>
        </div>
      </div>
    </div>
  );
};

export default DriverHeader;
