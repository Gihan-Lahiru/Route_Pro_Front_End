import React from 'react';
import './GuideHeader.css';

const GuideHeader = ({ status }) => {
  return (
    <div className="driver-header">
      <img src="/pic.jpg" alt="Driver" className="driver-photo" />
<div className="guide-info">
  <h2>Chamari Perera</h2>
  <p>⭐ 4.9 (362 tours)</p>
  <p><strong>Expertise:</strong> Cultural, Wildlife, Historical</p>
  <p><strong>Based In:</strong> Ella, Uva Province</p>
  <p><strong>Guiding Since:</strong> 2015</p>
  <p><strong>Contact:</strong> +94 77 456 7890 | chamari.guide@travel.lk</p>
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

export default GuideHeader;
