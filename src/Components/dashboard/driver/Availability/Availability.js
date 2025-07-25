import React from 'react';
import './Availability.css';

const Availability = ({ status, setStatus }) => {
  return (
    <div className="availability-panel">
      <h2>Availability & Info</h2>
      <p><strong>Status:</strong> <span className={status.toLowerCase()}>{status}</span></p>
      <button className="toggle-btn" onClick={() => setStatus(status === 'Available' ? 'Unavailable' : 'Available')}>
        Change Status
      </button>
      <div className="driver-info">
        <p><strong>Working Hours:</strong> 9:00 AM – 6:00 PM</p>
        <p><strong>Contact:</strong> 077 123 4567</p>
        <p><strong>Vehicle:</strong> Toyota Prius / WP CAB 1234</p>
        <p><strong>Languages:</strong>
          <input type="text" defaultValue="Sinhala, English" />
        </p>
        <button className="save-btn">Save Changes</button>
      </div>
    </div>
  );
};

export default Availability;
