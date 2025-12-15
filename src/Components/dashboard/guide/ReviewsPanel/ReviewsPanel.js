import React, { useState, useEffect } from "react";
import ReviewDisplay from "../../../ReviewDisplay";
import "./ReviewsPanel.css";

const ReviewsPanel = () => {
  const [guideId, setGuideId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get guide ID from localStorage (userId for guides)
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setGuideId(storedUserId);
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

  if (!guideId) {
    return (
      <div className="reviews-panel">
        <div className="error">
          Unable to load guide information. Please log in again.
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-panel">
      <h2>Customer Reviews</h2>
      <ReviewDisplay
        type="guide"
        id={guideId}
        showStats={true}
        limit={10}
        showFilters={true}
      />
    </div>
  );
};

export default ReviewsPanel;
