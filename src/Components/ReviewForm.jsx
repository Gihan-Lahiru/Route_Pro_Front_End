import React, { useState, useEffect } from 'react';
import './ReviewForm.css';

const ReviewForm = ({ tripId, driverId, guideId, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    driverRating: 0,
    guideRating: 0,
    driverReview: '',
    guideReview: '',
    overallRating: 0,
    overallReview: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tripDetails, setTripDetails] = useState(null);

  useEffect(() => {
    // Fetch trip details if needed
    if (tripId) {
      fetchTripDetails();
    }
  }, [tripId]);

  const fetchTripDetails = async () => {
    try {
      const response = await fetch(`http://localhost/RoutePro-backend(02)/public/api/trips/trips.php?trip_id=${tripId}`);
      const data = await response.json();
      if (data.success) {
        setTripDetails(data.trip);
      }
    } catch (err) {
      console.error('Error fetching trip details:', err);
    }
  };

  const handleRatingChange = (type, rating) => {
    setFormData(prev => ({
      ...prev,
      [type]: rating
    }));
  };

  const handleTextChange = (type, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const reviews = [];

      // Submit driver review if driver exists and rating provided
      if (driverId && formData.driverRating > 0) {
        const driverReview = {
          trip_id: parseInt(tripId),
          traveler_id: parseInt(localStorage.getItem('traveler_id') || '1'), // Get from auth context
          driver_id: parseInt(driverId),
          rating: formData.driverRating,
          review_text: formData.driverReview,
          review_type: 'driver'
        };
        reviews.push(driverReview);
      }

      // Submit guide review if guide exists and rating provided
      if (guideId && formData.guideRating > 0) {
        const guideReview = {
          trip_id: parseInt(tripId),
          traveler_id: parseInt(localStorage.getItem('traveler_id') || '1'), // Get from auth context
          guide_id: parseInt(guideId),
          rating: formData.guideRating,
          review_text: formData.guideReview,
          review_type: 'guide'
        };
        reviews.push(guideReview);
      }

      // Submit overall review if provided
      if (formData.overallRating > 0) {
        const overallReview = {
          trip_id: parseInt(tripId),
          traveler_id: parseInt(localStorage.getItem('traveler_id') || '1'), // Get from auth context
          driver_id: driverId ? parseInt(driverId) : null,
          guide_id: guideId ? parseInt(guideId) : null,
          rating: formData.overallRating,
          review_text: formData.overallReview,
          review_type: 'both'
        };
        reviews.push(overallReview);
      }

      if (reviews.length === 0) {
        setError('Please provide at least one rating');
        setLoading(false);
        return;
      }

      // Submit all reviews
      const submitPromises = reviews.map(review => 
        fetch('http://localhost/RoutePro-backend(02)/public/api/reviews/reviews.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(review)
        })
      );

      const responses = await Promise.all(submitPromises);
      const results = await Promise.all(responses.map(res => res.json()));

      // Check if all reviews were submitted successfully
      const allSuccessful = results.every(result => result.success);
      
      if (allSuccessful) {
        setSuccess(true);
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
        // Reset form
        setFormData({
          driverRating: 0,
          guideRating: 0,
          driverReview: '',
          guideReview: '',
          overallRating: 0,
          overallReview: ''
        });
      } else {
        setError('Failed to submit some reviews. Please try again.');
      }

    } catch (err) {
      console.error('Error submitting review:', err);
      setError('An error occurred while submitting your review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ rating, onRatingChange, label }) => (
    <div className="rating-group">
      <label className="rating-label">{label}</label>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${star <= rating ? 'active' : ''}`}
            onClick={() => onRatingChange(star)}
            disabled={loading}
          >
            ★
          </button>
        ))}
        <span className="rating-text">
          {rating === 0 ? 'Not rated' : 
           rating === 1 ? 'Poor' :
           rating === 2 ? 'Fair' :
           rating === 3 ? 'Good' :
           rating === 4 ? 'Very Good' : 'Excellent'}
        </span>
      </div>
    </div>
  );

  if (success) {
    return (
      <div className="review-success">
        <div className="success-icon">✓</div>
        <h3>Thank you for your review!</h3>
        <p>Your feedback has been submitted successfully and will help us improve our services.</p>
        <button 
          className="btn-secondary" 
          onClick={() => setSuccess(false)}
        >
          Submit Another Review
        </button>
      </div>
    );
  }

  return (
    <div className="review-form-container">
      <div className="review-form-header">
        <h2>Rate Your Trip Experience</h2>
        {tripDetails && (
          <div className="trip-info">
            <p><strong>Route:</strong> {tripDetails.route_name}</p>
            <p><strong>Date:</strong> {new Date(tripDetails.date).toLocaleDateString()}</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="review-form">
        {error && <div className="error-message">{error}</div>}

        {driverId && (
          <div className="review-section">
            <h3>Rate Your Driver</h3>
            <StarRating
              rating={formData.driverRating}
              onRatingChange={(rating) => handleRatingChange('driverRating', rating)}
              label="Driver Rating"
            />
            <div className="text-review">
              <label htmlFor="driverReview">Tell us about your driver experience (optional)</label>
              <textarea
                id="driverReview"
                value={formData.driverReview}
                onChange={(e) => handleTextChange('driverReview', e.target.value)}
                placeholder="How was your driver? Any specific feedback?"
                rows="3"
                disabled={loading}
              />
            </div>
          </div>
        )}

        {guideId && (
          <div className="review-section">
            <h3>Rate Your Guide</h3>
            <StarRating
              rating={formData.guideRating}
              onRatingChange={(rating) => handleRatingChange('guideRating', rating)}
              label="Guide Rating"
            />
            <div className="text-review">
              <label htmlFor="guideReview">Tell us about your guide experience (optional)</label>
              <textarea
                id="guideReview"
                value={formData.guideReview}
                onChange={(e) => handleTextChange('guideReview', e.target.value)}
                placeholder="How was your guide? Any specific feedback?"
                rows="3"
                disabled={loading}
              />
            </div>
          </div>
        )}

        <div className="review-section">
          <h3>Overall Trip Experience</h3>
          <StarRating
            rating={formData.overallRating}
            onRatingChange={(rating) => handleRatingChange('overallRating', rating)}
            label="Overall Rating"
          />
          <div className="text-review">
            <label htmlFor="overallReview">Share your overall experience (optional)</label>
            <textarea
              id="overallReview"
              value={formData.overallReview}
              onChange={(e) => handleTextChange('overallReview', e.target.value)}
              placeholder="How was your overall trip experience? Any suggestions for improvement?"
              rows="4"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading || (formData.driverRating === 0 && formData.guideRating === 0 && formData.overallRating === 0)}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
