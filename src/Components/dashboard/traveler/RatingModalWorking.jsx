import React, { useState } from 'react';
import { apiMethods } from '../../../utils/api-client';
import styles from './RatingModalCard.module.css';

const StarRating = ({ rating, onRatingChange, disabled = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className={styles.starRating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${styles.star} ${
            (hoverRating || rating) >= star ? styles.filled : ''
          } ${disabled ? styles.disabled : ''}`}
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

const RatingModalWorking = ({ notification, onClose, onSubmit }) => {
  const [activeTab, setActiveTab] = useState('driver');
  const [driverRating, setDriverRating] = useState(5);
  const [guideRating, setGuideRating] = useState(5);
  const [driverReview, setDriverReview] = useState('');
  const [guideReview, setGuideReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const tripData = notification?.trip_data || {};
  const hasDriver = tripData.driver_id;
  const hasGuide = tripData.guide_id;

  // Get profile info
  const driverName = tripData.driver_name || 'Driver';
  const driverImage = tripData.driver_image;
  const guideName = tripData.guide_name || 'Guide';  
  const guideImage = tripData.guide_image;

  console.log('🔧 RatingModal rendered with:', { 
    notification, 
    tripData, 
    hasDriver, 
    hasGuide,
    driverName,
    driverImage,
    guideName,
    guideImage
  });

  // Auto-select appropriate tab based on available services
  React.useEffect(() => {
    if (hasDriver && !hasGuide) {
      setActiveTab('driver');
    } else if (hasGuide && !hasDriver) {
      setActiveTab('guide');
    }
  }, [hasDriver, hasGuide]);

  const submitRating = async (serviceType, rating, review, serviceProviderId) => {
    try {
      const response = await fetch(`${apiMethods.getBackendUrl()}/api/ratings/submit-rating.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip_id: notification.trip_id,
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
      if (hasDriver && driverRating > 0) {
        submissions.push(
          submitRating('driver', driverRating, driverReview, tripData.driver_id)
        );
      }
      
      // Submit guide rating if available
      if (hasGuide && guideRating > 0) {
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
          body: JSON.stringify({ trip_id: notification.trip_id })
        });
        
        setTimeout(() => {
          onSubmit && onSubmit();
          onClose();
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

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Rate Your Trip Experience</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.tripInfo}>
            <h3>Trip #{notification.trip_id}</h3>
            <p>{tripData.start_location} → {tripData.end_location}</p>
            <p>Date: {tripData.date} | Cost: Rs. {tripData.total_cost}</p>
          </div>

          {submitMessage && (
            <div className={`${styles.message} ${submitMessage.includes('✅') ? styles.success : styles.error}`}>
              {submitMessage}
            </div>
          )}

          <div className={styles.tabContainer}>
            {hasDriver && (
              <button
                className={`${styles.tab} ${activeTab === 'driver' ? styles.active : ''}`}
                onClick={() => setActiveTab('driver')}
              >
                🚗 Rate {driverName}
              </button>
            )}
            {hasGuide && (
              <button
                className={`${styles.tab} ${activeTab === 'guide' ? styles.active : ''}`}
                onClick={() => setActiveTab('guide')}
              >
                🗺️ Rate {guideName}
              </button>
            )}
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'driver' && hasDriver && (
              <div className={styles.ratingSection}>
                <div className={styles.profileHeader}>
                  {driverImage ? (
                    <img 
                      src={driverImage.startsWith('/') ? `http://localhost${driverImage}` : `/images/${driverImage}`}
                      alt={driverName}
                      className={styles.profileImage}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={styles.profileImagePlaceholder}
                    style={{ display: driverImage ? 'none' : 'flex' }}
                  >
                    {driverName.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.profileInfo}>
                    <h3 className={styles.profileName}>{driverName}</h3>
                    <p className={styles.profileRole}>Your Driver</p>
                  </div>
                </div>
                <h4>How was your experience with {driverName}?</h4>
                <div className={styles.ratingRow}>
                  <span style={{fontSize: '18px', fontWeight: '600', color: '#374151'}}>Rating:</span>
                  <StarRating 
                    rating={driverRating} 
                    onRatingChange={setDriverRating}
                  />
                  <span className={styles.ratingText}>({driverRating}/5)</span>
                </div>
                <textarea
                  className={styles.reviewInput}
                  placeholder={`Share your experience with ${driverName}... (optional)`}
                  value={driverReview}
                  onChange={(e) => setDriverReview(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            {activeTab === 'guide' && hasGuide && (
              <div className={styles.ratingSection}>
                <div className={styles.profileHeader}>
                  {guideImage ? (
                    <img 
                      src={guideImage.startsWith('/') ? `http://localhost${guideImage}` : `/images/${guideImage}`}
                      alt={guideName}
                      className={styles.profileImage}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={styles.profileImagePlaceholder}
                    style={{ display: guideImage ? 'none' : 'flex' }}
                  >
                    {guideName.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.profileInfo}>
                    <h3 className={styles.profileName}>{guideName}</h3>
                    <p className={styles.profileRole}>Your Guide</p>
                  </div>
                </div>
                <h4>How was your experience with {guideName}?</h4>
                <div className={styles.ratingRow}>
                  <span style={{fontSize: '18px', fontWeight: '600', color: '#374151'}}>Rating:</span>
                  <StarRating 
                    rating={guideRating} 
                    onRatingChange={setGuideRating}
                  />
                  <span className={styles.ratingText}>({guideRating}/5)</span>
                </div>
                <textarea
                  className={styles.reviewInput}
                  placeholder={`Share your experience with ${guideName}... (optional)`}
                  value={guideReview}
                  onChange={(e) => setGuideReview(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button 
            className={styles.cancelButton} 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            className={styles.submitButton} 
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

export default RatingModalWorking;