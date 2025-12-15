import React, { useState, useEffect } from 'react';
import ReviewDisplay from '../../ReviewDisplay';
import './ReviewsPanel.css';

const ReviewsPanel = () => {
  const [travelerId, setTravelerId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get traveler ID from localStorage or context
    const storedTravelerId = localStorage.getItem('traveler_id');
    if (storedTravelerId) {
      setTravelerId(storedTravelerId);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="reviews-panel">
        <div className="loading">Loading your reviews...</div>
      </div>
    );
  }

  if (!travelerId) {
    return (
      <div className="reviews-panel">
        <div className="error">Unable to load traveler information</div>
      </div>
    );
  }

  return (
    <div className="reviews-panel">
      <h2>Your Reviews</h2>
      <p className="reviews-description">
        Here are the reviews you've submitted for your trips. You can see how your feedback helps improve our services.
      </p>
      <ReviewDisplay 
        type="traveler" 
        id={travelerId} 
        showStats={false}
        limit={15}
        showFilters={true}
      />
    </div>
  );
};

export default ReviewsPanel;
