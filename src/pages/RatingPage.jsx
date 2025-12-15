import React, { useState, useEffect } from 'react';
import { apiMethods } from '../utils/api-client';
import './RatingPage.css';

const StarRating = ({ rating, onRatingChange, disabled = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${
            (hoverRating || rating) >= star ? 'filled' : ''
          } ${disabled ? 'disabled' : ''}`}
          onMouseEnter={() => !disabled && setHoverRating(star)}
          onMouseLeave={() => !disabled && setHoverRating(0)}
          onClick={() => !disabled && onRatingChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const RatingPage = () => {
  const [activeTab, setActiveTab] = useState('driver');
  const [driverRating, setDriverRating] = useState(5);
  const [guideRating, setGuideRating] = useState(5);
  const [driverReview, setDriverReview] = useState('');
  const [guideReview, setGuideReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get trip data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const tripId = urlParams.get('tripId');
    const startLocation = urlParams.get('startLocation');
    const endLocation = urlParams.get('endLocation');
    const date = urlParams.get('date');
    const totalCost = urlParams.get('totalCost');
    const driverId = urlParams.get('driverId');
    const guideId = urlParams.get('guideId');

    if (tripId) {
      const data = {
        trip_id: tripId,
        start_location: decodeURIComponent(startLocation || ''),
        end_location: decodeURIComponent(endLocation || ''),
        date: date || '',
        total_cost: totalCost || '',
        driver_id: driverId,
        guide_id: guideId
      };
      setTripData(data);
      
      // Set default tab based on available services
      if (driverId && !guideId) {
        setActiveTab('driver');
      } else if (guideId && !driverId) {
        setActiveTab('guide');
      }
    }
    setLoading(false);
  }, []);

  const submitRating = async (serviceType, rating, review, serviceProviderId) => {
    try {
      const response = await fetch(`${apiMethods.getBackendUrl()}/api/ratings/submit-rating.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip_id: tripData.trip_id,
          service_provider_id: serviceProviderId,
          service_type: serviceType,
          rating: rating,
          review: review
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error submitting rating:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      const submissions = [];
      
      // Submit driver rating if available
      if (tripData.driver_id && driverRating > 0) {
        submissions.push(
          submitRating('driver', driverRating, driverReview, tripData.driver_id)
        );
      }
      
      // Submit guide rating if available
      if (tripData.guide_id && guideRating > 0) {
        submissions.push(
          submitRating('guide', guideRating, guideReview, tripData.guide_id)
        );
      }
      
      const results = await Promise.all(submissions);
      const allSuccessful = results.every(result => result.success);
      
      if (allSuccessful) {
        setSubmitMessage('✅ Thank you! Your ratings have been submitted successfully.');
        
        // Mark trip as rated
        await fetch(`${apiMethods.getBackendUrl()}/api/trips/mark-trip-rated.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trip_id: tripData.trip_id })
        });
        
        // Close window after 2 seconds
        setTimeout(() => {
          window.close();
        }, 2000);
      } else {
        const failedResults = results.filter(result => !result.success);
        setSubmitMessage(`❌ Error: ${failedResults[0].message}`);
      }
    } catch (error) {
      setSubmitMessage('❌ An error occurred while submitting your ratings.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    window.close();
  };

  if (loading) {
    return (
      <div className="rating-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!tripData) {
    return (
      <div className="rating-page">
        <div className="error">No trip data found. Please try again.</div>
      </div>
    );
  }

  const hasDriver = tripData.driver_id;
  const hasGuide = tripData.guide_id;

  return (
    <div className="rating-page">
      <div className="rating-container">
        <div className="header">
          <h1>Rate Your Trip Experience</h1>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>

        <div className="trip-info">
          <h2>Trip #{tripData.trip_id}</h2>
          <p className="route">{tripData.start_location} → {tripData.end_location}</p>
          <p className="details">Date: {tripData.date} | Cost: Rs. {tripData.total_cost}</p>
        </div>

        {submitMessage && (
          <div className={`message ${submitMessage.includes('✅') ? 'success' : 'error'}`}>
            {submitMessage}
          </div>
        )}

        <div className="tab-container">
          {hasDriver && (
            <button
              className={`tab ${activeTab === 'driver' ? 'active' : ''}`}
              onClick={() => setActiveTab('driver')}
            >
              🚗 Rate Driver
            </button>
          )}
          {hasGuide && (
            <button
              className={`tab ${activeTab === 'guide' ? 'active' : ''}`}
              onClick={() => setActiveTab('guide')}
            >
              🗺️ Rate Guide
            </button>
          )}
        </div>

        <div className="tab-content">
          {activeTab === 'driver' && hasDriver && (
            <div className="rating-section">
              <h3>How was your driver?</h3>
              <div className="rating-row">
                <span>Rating:</span>
                <StarRating 
                  rating={driverRating} 
                  onRatingChange={setDriverRating}
                />
                <span className="rating-text">({driverRating}/5)</span>
              </div>
              <textarea
                className="review-input"
                placeholder="Share your experience with the driver... (optional)"
                value={driverReview}
                onChange={(e) => setDriverReview(e.target.value)}
                rows={4}
              />
            </div>
          )}

          {activeTab === 'guide' && hasGuide && (
            <div className="rating-section">
              <h3>How was your guide?</h3>
              <div className="rating-row">
                <span>Rating:</span>
                <StarRating 
                  rating={guideRating} 
                  onRatingChange={setGuideRating}
                />
                <span className="rating-text">({guideRating}/5)</span>
              </div>
              <textarea
                className="review-input"
                placeholder="Share your experience with the guide... (optional)"
                value={guideReview}
                onChange={(e) => setGuideReview(e.target.value)}
                rows={4}
              />
            </div>
          )}
        </div>

        <div className="footer">
          <button 
            className="cancel-button" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            className="submit-button" 
            onClick={handleSubmit}
            disabled={isSubmitting || (!hasDriver && !hasGuide)}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Ratings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingPage;