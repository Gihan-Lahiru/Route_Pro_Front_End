import React, { useState, useEffect } from 'react';
import './ReviewDisplay.css';

const ReviewDisplay = ({ 
  type, // 'driver', 'guide', 'traveler', 'trip', 'all'
  id, 
  showStats = true,
  limit = 10,
  showFilters = true 
}) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', '5', '4', '3', '2', '1'

  useEffect(() => {
    fetchReviews();
  }, [type, id, filter]);

  const fetchReviews = async () => {
    setLoading(true);
    setError('');

    try {
      let url = 'http://localhost/RoutePro-backend(02)/public/api/reviews/reviews.php?';
      
      switch (type) {
        case 'driver':
          url += `driver_id=${id}`;
          break;
        case 'guide':
          url += `guide_id=${id}`;
          break;
        case 'traveler':
          url += `traveler_id=${id}`;
          break;
        case 'trip':
          url += `trip_id=${id}`;
          break;
        default:
          url += 'all=true';
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        let filteredReviews = data.reviews || [];
        
        // Apply rating filter
        if (filter !== 'all') {
          filteredReviews = filteredReviews.filter(review => 
            review.rating === parseInt(filter)
          );
        }

        // Limit results
        filteredReviews = filteredReviews.slice(0, limit);
        
        setReviews(filteredReviews);
        setStats(data.stats || null);
      } else {
        setError(data.message || 'Failed to fetch reviews');
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('An error occurred while fetching reviews');
    } finally {
      setLoading(false);
    }
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return '#28a745';
    if (rating >= 3) return '#ffc107';
    return '#dc3545';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReviewTypeIcon = (reviewType) => {
    switch (reviewType) {
      case 'driver': return '🚗';
      case 'guide': return '🗺️';
      case 'both': return '🌟';
      default: return '⭐';
    }
  };

  if (loading) {
    return (
      <div className="review-display-loading">
        <div className="loading-spinner"></div>
        <p>Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-display-error">
        <p>❌ {error}</p>
        <button onClick={fetchReviews} className="btn-retry">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="review-display">
      {showStats && stats && (
        <div className="review-stats">
          <div className="stats-header">
            <h3>Review Statistics</h3>
            <div className="average-rating">
              <span className="rating-number">{parseFloat(stats.average_rating || 0).toFixed(1)}</span>
              <div className="stars">
                {getRatingStars(Math.round(parseFloat(stats.average_rating) || 0))}
              </div>
              <span className="total-reviews">({stats.total_reviews} reviews)</span>
            </div>
          </div>
          
          <div className="rating-breakdown">
            {[5, 4, 3, 2, 1].map(rating => {
              const ratingNames = {
                5: 'five_star',
                4: 'four_star', 
                3: 'three_star',
                2: 'two_star',
                1: 'one_star'
              };
              const count = stats[ratingNames[rating]] || 0;
              const percentage = stats.total_reviews > 0 ? (count / stats.total_reviews) * 100 : 0;
              
              return (
                <div key={rating} className="rating-bar">
                  <span className="rating-label">{rating}★</span>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="rating-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showFilters && (
        <div className="review-filters">
          <label>Filter by rating:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews found</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.review_id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <span className="reviewer-name">
                    {review.traveler_name || 'Anonymous'}
                  </span>
                  <span className="review-type">
                    {getReviewTypeIcon(review.review_type)} {review.review_type}
                  </span>
                </div>
                <div className="review-meta">
                  <div 
                    className="rating-stars"
                    style={{ color: getRatingColor(review.rating) }}
                  >
                    {getRatingStars(review.rating)}
                  </div>
                  <span className="review-date">
                    {formatDate(review.created_at)}
                  </span>
                </div>
              </div>
              
              {review.review_text && (
                <div className="review-text">
                  <p>{review.review_text}</p>
                </div>
              )}
              
              {review.route_name && (
                <div className="review-context">
                  <small>
                    Trip: {review.route_name} 
                    {review.start_location && review.end_location && 
                      ` (${review.start_location} → ${review.end_location})`
                    }
                  </small>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {reviews.length >= limit && (
        <div className="load-more">
          <button 
            onClick={() => {/* Implement load more functionality */}}
            className="btn-load-more"
          >
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewDisplay;
