import React, { useState, useEffect, useCallback } from 'react';
import './RatingModal.css';

const RatingModal = React.memo(({ trip, onClose, onSubmit }) => {
  const [driverRating, setDriverRating] = useState(0);
  const [guideRating, setGuideRating] = useState(0);
  const [driverComment, setDriverComment] = useState('');
  const [guideComment, setGuideComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Add escape key listener
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  const handleStarClick = useCallback((rating, type) => {
    if (type === 'driver') {
      setDriverRating(rating);
    } else {
      setGuideRating(rating);
    }
  }, []);

  const handleOverlayClick = useCallback((e) => {
    // Only close if clicking the overlay itself, not its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleModalClick = useCallback((e) => {
    // Prevent event propagation when clicking inside the modal
    e.stopPropagation();
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if driver rating is required
    if (trip.driver_name && driverRating === 0) {
      alert('Please provide a rating for the driver');
      return;
    }

    // Check if guide rating is required (only if guide was assigned)
    if (trip.guide_name && guideRating === 0) {
      alert('Please provide a rating for the guide');
      return;
    }

    // If no guide was assigned, set guide rating to 5 (default)
    const finalGuideRating = trip.guide_name ? guideRating : 5;

    setIsSubmitting(true);

    try {
      const ratingData = {
        trip_id: trip.trip_id,
        driver_rating: driverRating,
        guide_rating: finalGuideRating,
        driver_comment: driverComment.trim(),
        guide_comment: trip.guide_name ? guideComment.trim() : 'No guide assigned for this trip'
      };

      await onSubmit(ratingData);
    } catch (error) {
      console.error('Rating submission error:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [trip, driverRating, guideRating, driverComment, guideComment, onSubmit]);

  const renderStars = (currentRating, type) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= currentRating ? 'filled' : ''}`}
          onClick={() => handleStarClick(i, type)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="rating-modal-overlay" onClick={handleOverlayClick}>
      <div className="rating-modal" onClick={handleModalClick}>
        <div className="rating-modal-header">
          <h2>Rate Your Trip Experience</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="trip-summary">
          <h3>Trip Summary</h3>
          <p><strong>From:</strong> {trip.start_location}</p>
          <p><strong>To:</strong> {trip.end_location}</p>
          <p><strong>Date:</strong> {new Date(trip.trip_date).toLocaleDateString()}</p>
          {trip.auto_completed && (
            <p className="auto-completed-notice">
              <span className="auto-icon">⏰</span>
              This trip was automatically completed
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="rating-form">
          {/* Driver Rating */}
          {trip.driver_name && (
            <div className="rating-section">
              <h4>Rate Your Driver: {trip.driver_name}</h4>
              <div className="stars-container">
                {renderStars(driverRating, 'driver')}
                <span className="rating-text">
                  {driverRating > 0 && `${driverRating}/5`}
                </span>
              </div>
              <textarea
                placeholder="Share your experience with the driver..."
                value={driverComment}
                onChange={(e) => setDriverComment(e.target.value)}
                onFocus={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                rows="3"
                maxLength="500"
              />
            </div>
          )}

          {/* Guide Rating */}
          {trip.guide_name ? (
            <div className="rating-section">
              <h4>Rate Your Guide: {trip.guide_name}</h4>
              <div className="stars-container">
                {renderStars(guideRating, 'guide')}
                <span className="rating-text">
                  {guideRating > 0 && `${guideRating}/5`}
                </span>
              </div>
              <textarea
                placeholder="Share your experience with the guide..."
                value={guideComment}
                onChange={(e) => setGuideComment(e.target.value)}
                onFocus={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                rows="3"
                maxLength="500"
              />
            </div>
          ) : (
            <div className="rating-section">
              <div className="no-guide-notice">
                <p><strong>No Guide Assigned</strong></p>
                <p>This trip was completed without a guide service.</p>
              </div>
            </div>
          )}

          <div className="rating-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting || (trip.driver_name && driverRating === 0) || (trip.guide_name && guideRating === 0)}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default RatingModal;