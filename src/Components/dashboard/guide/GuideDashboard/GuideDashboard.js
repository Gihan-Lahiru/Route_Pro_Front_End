import React, { useState } from 'react';
import TripDetails from '../TripDetails/TripDetails';
import Availability from '../../admin/Availability/Availability';
import ReviewsPanel from '../ReviewsPanel/ReviewsPanel';
import './GuideDashboard.css';
import GuideHeader from '../GuideHeader/GuideHeader';



const GuideDashboard = () => {
  const [status, setStatus] = useState('Available');
  const [activeView, setActiveView] = useState('trip');

  return (
    <div className="dashboard">
      <h1>Welcome back, Chamari!</h1>
      <p className="subtitle">Manage your trips, availability and reviews.</p>


    <GuideHeader status={status} setStatus={setStatus} />

      {/* Summary Row */}
      <div className="summary-row">
        <div className="summary-card">
          <h2>Active Trips</h2>
          <p>3 Active | 2 Scheduled Today</p>
        </div>
        <div className="summary-card">
          <h2>Average Rating</h2>
          <p>⭐ 4.8 (Based on 127 reviews)</p>
        </div>
        <div className="summary-card status-card">
          <h2>Status</h2>
          <p className={`status ${status.toLowerCase()}`}>{status}</p>
          <button onClick={() => setStatus(status === 'Available' ? 'Unavailable' : 'Available')}>
            {status === 'Available' ? 'Go Unavailable' : 'Go Available'}
          </button>
        </div>
      </div>

      {/* View Toggle Buttons */}
      <div className="view-buttons">
        <button onClick={() => setActiveView('trip')} className={activeView === 'trip' ? 'active' : ''}>Trip Details</button>
        <button onClick={() => setActiveView('availability')} className={activeView === 'availability' ? 'active' : ''}>Availability</button>
        <button onClick={() => setActiveView('reviews')} className={activeView === 'reviews' ? 'active' : ''}>Reviews</button>
      </div>

      {/* Selected Section */}
      <div className="view-container">
        {activeView === 'trip' && <TripDetails />}
        {activeView === 'availability' && <Availability status={status} setStatus={setStatus} />}
        {activeView === 'reviews' && <ReviewsPanel />}
      </div>
    </div>
  );
};

export default GuideDashboard;
