import React, { useState, useEffect } from "react";
import ReviewDisplay from "../../../ReviewDisplay";
import "./ReviewsPanel.css";

const ReviewsPanel = () => {
  const [driverId, setDriverId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get driver ID from localStorage (userId for drivers)
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setDriverId(storedUserId);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="reviews-panel">
        <div className="loading">Loading reviews...</div>
      </div>
    );
  }

  if (!driverId) {
    return (
      <div className="reviews-panel">
        <div className="error">
          Unable to load driver information. Please log in again.
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-panel">
      <h2>Customer Reviews</h2>
      <ReviewDisplay
        type="driver"
        id={driverId}
        showStats={true}
        limit={10}
        showFilters={true}
      />
    </div>
  );
};

export default ReviewsPanel;
