import React, { useState } from 'react';
import { apiMethods } from '../../../utils/api-client';
import styles from './RatingModal.module.css';

const RatingModal = ({ notification, onClose, onSubmit, onSuccess, isOpen = true }) => {
  const [driverRating, setDriverRating] = useState(5);
  const [guideRating, setGuideRating] = useState(5);
  const [driverReview, setDriverReview] = useState('');
  const [guideReview, setGuideReview] = useState('');
  const [loading, setLoading] = useState(false);
  
  const trip = notification?.trip_data || {};
  const [currentTab, setCurrentTab] = useState(trip?.driver_id ? 'driver' : 'guide');

  const StarRating = ({ rating, onRatingChange, disabled = false }) => {
    return (
      <div className={styles['star-rating']}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${styles.star} ${star <= rating ? styles.filled : ''} ${disabled ? styles.disabled : ''}`}
            onClick={() => !disabled && onRatingChange(star)}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  const submitRating = async () => {
    if (!trip) return;

    setLoading(true);
    try {
      const ratings = [];

      // Submit driver rating if exists
      if (trip.driver_id && currentTab === 'driver') {
        ratings.push({
          trip_id: trip.trip_id,
          service_provider_id: trip.driver_id,
          service_type: 'driver',
          rating: driverRating,
          review: driverReview.trim()
        });
      }

      // Submit guide rating if exists  
      if (trip.guide_id && currentTab === 'guide') {
        ratings.push({
          trip_id: trip.trip_id,
          service_provider_id: trip.guide_id,
          service_type: 'guide',
          rating: guideRating,
          review: guideReview.trim()
        });
      }

      // Submit all ratings
      for (const ratingData of ratings) {
        const response = await fetch(`${apiMethods.getBackendUrl()}/api/ratings/submit-rating.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ratingData)
        });

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || 'Failed to submit rating');
        }
      }

      // Mark trip as rated
      await fetch(`${apiMethods.getBackendUrl()}/api/trips/mark-trip-rated.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trip_id: trip.trip_id })
      });

      if (onSuccess && typeof onSuccess === 'function') onSuccess();
      onClose();
      
      // Show success message
      alert('✅ Thank you for your feedback! Your rating has been submitted successfully.');

    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('❌ Failed to submit rating: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !trip) {
    console.log('🚫 RatingModal not rendering:', { isOpen, tripExists: !!trip });
    return null;
  }

  console.log('✅ RatingModal rendering for trip:', trip.trip_id);

  const hasDriver = trip.driver_id;
  const hasGuide = trip.guide_id;
  const hasBoth = hasDriver && hasGuide;

  return (
    <div className={styles['rating-modal-overlay']} onClick={onClose}>
      <div className={styles['rating-modal']} onClick={(e) => e.stopPropagation()}>
        <div className={styles['modal-header']}>
          <h2>🌟 Rate Your Experience</h2>
          <button className={styles['close-button']} onClick={onClose}>✕</button>
        </div>

        <div className={styles['trip-summary']}>
          <h3>Trip Details</h3>
          <p><strong>Route:</strong> {trip.start_location} → {trip.end_location}</p>
          <p><strong>Date:</strong> {trip.date}</p>
          <p><strong>Status:</strong> <span className={styles['status-completed']}>Completed ✅</span></p>
        </div>

        {hasBoth && (
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${currentTab === 'driver' ? styles.active : ''}`}
              onClick={() => setCurrentTab('driver')}
            >
              🚗 Rate Driver
            </button>
            <button 
              className={`${styles.tab} ${currentTab === 'guide' ? styles.active : ''}`}
              onClick={() => setCurrentTab('guide')}
            >
              🗺️ Rate Guide
            </button>
          </div>
        )}

        <div className={styles['rating-content']}>
          {(!hasBoth || currentTab === 'driver') && hasDriver && (
            <div className={styles['rating-section']}>
              <h3>🚗 Rate Your Driver</h3>
              <p className={styles['section-subtitle']}>How was your driving experience?</p>
              
              <div className={styles['rating-input']}>
                <label>Overall Rating:</label>
                <StarRating 
                  rating={driverRating} 
                  onRatingChange={setDriverRating}
                />
                <span className={styles['rating-text']}>
                  {driverRating === 5 ? 'Excellent! 🌟' : 
                   driverRating === 4 ? 'Very Good! 👍' :
                   driverRating === 3 ? 'Good 😊' :
                   driverRating === 2 ? 'Fair 😐' : 'Needs Improvement 😞'}
                </span>
              </div>

              <div className={styles['review-input']}>
                <label>Your Review (Optional):</label>
                <textarea
                  value={driverReview}
                  onChange={(e) => setDriverReview(e.target.value)}
                  placeholder="Share your experience about the driver's professionalism, safety, vehicle condition, etc..."
                  rows="4"
                />
              </div>
            </div>
          )}

          {(!hasBoth || currentTab === 'guide') && hasGuide && (
            <div className={styles['rating-section']}>
              <h3>🗺️ Rate Your Guide</h3>
              <p className={styles['section-subtitle']}>How was your guiding experience?</p>
              
              <div className={styles['rating-input']}>
                <label>Overall Rating:</label>
                <StarRating 
                  rating={guideRating} 
                  onRatingChange={setGuideRating}
                />
                <span className={styles['rating-text']}>
                  {guideRating === 5 ? 'Excellent! 🌟' : 
                   guideRating === 4 ? 'Very Good! 👍' :
                   guideRating === 3 ? 'Good 😊' :
                   guideRating === 2 ? 'Fair 😐' : 'Needs Improvement 😞'}
                </span>
              </div>

              <div className={styles['review-input']}>
                <label>Your Review (Optional):</label>
                <textarea
                  value={guideReview}
                  onChange={(e) => setGuideReview(e.target.value)}
                  placeholder="Share your experience about the guide's knowledge, communication, helpfulness, etc..."
                  rows="4"
                />
              </div>
            </div>
          )}
        </div>

        <div className={styles['modal-actions']}>
          <button 
            className={styles['cancel-button']} 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className={styles['submit-button']} 
            onClick={submitRating}
            disabled={loading}
          >
            {loading ? '⏳ Submitting...' : '⭐ Submit Rating'}
          </button>
        </div>

        {hasBoth && (
          <div className={styles['navigation-hint']}>
            💡 Use the tabs above to rate both your driver and guide
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingModal;