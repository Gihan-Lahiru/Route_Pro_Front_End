import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewForm from '../Components/ReviewForm';
import './ReviewPage.css';

const ReviewPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [tripDetails, setTripDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tripId) {
      fetchTripDetails();
    } else {
      setError('No trip ID provided');
      setLoading(false);
    }
  }, [tripId]);

  const fetchTripDetails = async () => {
    try {
      const response = await fetch(`http://localhost/RoutePro-backend(02)/public/api/trips/trips.php?trip_id=${tripId}`);
      const data = await response.json();
      
      if (data.success && data.trip) {
        setTripDetails(data.trip);
      } else {
        setError('Trip not found or you do not have permission to review this trip');
      }
    } catch (err) {
      console.error('Error fetching trip details:', err);
      setError('Failed to load trip details');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    // Show success message and redirect after a delay
    setTimeout(() => {
      navigate('/dashboard'); // Redirect to dashboard or appropriate page
    }, 3000);
  };

  if (loading) {
    return (
      <div className="review-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Unable to Load Review</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!tripDetails) {
    return (
      <div className="review-page">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2>Trip Not Found</h2>
          <p>The trip you're trying to review could not be found.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="review-page">
      <div className="review-page-container">
        <div className="review-page-header">
          <h1>Rate Your Trip Experience</h1>
          <p>Your feedback helps us improve our services and helps other travelers make informed decisions.</p>
        </div>

        <div className="trip-summary">
          <h3>Trip Summary</h3>
          <div className="trip-details">
            <div className="trip-detail-item">
              <span className="label">Route:</span>
              <span className="value">{tripDetails.route_name || 'N/A'}</span>
            </div>
            <div className="trip-detail-item">
              <span className="label">Date:</span>
              <span className="value">{new Date(tripDetails.date).toLocaleDateString()}</span>
            </div>
            <div className="trip-detail-item">
              <span className="label">Start Time:</span>
              <span className="value">{tripDetails.start_time || 'N/A'}</span>
            </div>
            {tripDetails.start_location && (
              <div className="trip-detail-item">
                <span className="label">From:</span>
                <span className="value">{tripDetails.start_location}</span>
              </div>
            )}
            {tripDetails.end_location && (
              <div className="trip-detail-item">
                <span className="label">To:</span>
                <span className="value">{tripDetails.end_location}</span>
              </div>
            )}
            {tripDetails.driver_name && (
              <div className="trip-detail-item">
                <span className="label">Driver:</span>
                <span className="value">{tripDetails.driver_name}</span>
              </div>
            )}
            {tripDetails.guide_name && (
              <div className="trip-detail-item">
                <span className="label">Guide:</span>
                <span className="value">{tripDetails.guide_name}</span>
              </div>
            )}
          </div>
        </div>

        <ReviewForm
          tripId={tripId}
          driverId={tripDetails.driver_id}
          guideId={tripDetails.guide_id}
          onReviewSubmitted={handleReviewSubmitted}
        />

        <div className="review-guidelines">
          <h4>Review Guidelines</h4>
          <ul>
            <li>Be honest and constructive in your feedback</li>
            <li>Focus on your actual experience with the service</li>
            <li>Avoid personal attacks or inappropriate language</li>
            <li>Your review will be visible to other travelers</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
