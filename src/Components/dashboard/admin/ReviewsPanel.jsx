import React, { useState, useEffect } from 'react';
import ReviewDisplay from '../../ReviewDisplay';
import './ReviewsPanel.css';

const ReviewsPanel = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchReviewStats();
  }, []);

  const fetchReviewStats = async () => {
    try {
      const response = await fetch('http://localhost/RoutePro-backend(02)/public/api/reviews/reviews.php?stats=true');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching review stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="reviews-panel">
        <div className="loading">Loading review statistics...</div>
      </div>
    );
  }

  return (
    <div className="reviews-panel">
      <div className="reviews-header">
        <h2>Review Management</h2>
        <p>Monitor and manage all reviews across the platform</p>
      </div>

      {stats && (
        <div className="review-stats-overview">
          <div className="stat-card">
            <div className="stat-number">{stats.total_reviews || 0}</div>
            <div className="stat-label">Total Reviews</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.average_rating?.toFixed(1) || '0.0'}</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.five_star || 0}</div>
            <div className="stat-label">5-Star Reviews</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.one_star || 0}</div>
            <div className="stat-label">1-Star Reviews</div>
          </div>
        </div>
      )}

      <div className="all-reviews-section">
        <h3>All Reviews</h3>
        <ReviewDisplay 
          type="all" 
          showStats={false}
          limit={20}
          showFilters={true}
        />
      </div>
    </div>
  );
};

export default ReviewsPanel;
