import React, { useState, useEffect } from 'react';
import styles from './UpcomingTrips.module.css';
import { sessionUtils, apiMethods } from '../../../utils/api-client';
import RatingModal from './RatingModal';

const UpcomingTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingTrips, setCancellingTrips] = useState(new Set());
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedTripForRating, setSelectedTripForRating] = useState(null);

  useEffect(() => {
    fetchTravelerTrips();
    
    // Check if there's a latest trip from booking
    checkForLatestTrip();
    
    // Set up an interval to refresh trips every 30 seconds to catch new bookings
    const refreshInterval = setInterval(() => {
      console.log('🔄 Auto-refreshing trips to catch new bookings...');
      fetchTravelerTrips();
    }, 30000);
    
    // Listen for storage events (when user books from another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'latestTrip' && e.newValue) {
        console.log('📍 New trip detected from another tab, refreshing...');
        setTimeout(() => fetchTravelerTrips(), 1000);
      }
    };

    // Listen for trip auto-completion events
    const handleTripAutoCompleted = (event) => {
      console.log('🎉 Trip auto-completed event received:', event.detail);
      fetchTravelerTrips(); // Refresh trips to show updated status
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('tripAutoCompleted', handleTripAutoCompleted);
    
    // Cleanup
    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tripAutoCompleted', handleTripAutoCompleted);
    };
  }, []); // Empty dependency array to run only once

  // Separate useEffect for rating modal events that needs current trips
  useEffect(() => {
    const handleShowRatingModal = (event) => {
      // Prevent duplicate modal opening if already open
      if (showRatingModal) {
        console.log('⚠️ Rating modal already open, ignoring auto-completion request');
        return;
      }
      
      const { tripId } = event.detail;
      const trip = trips.find(t => t.trip_id === tripId);
      if (trip) {
        handleRateTrip(trip);
      }
    };

    window.addEventListener('showRatingModal', handleShowRatingModal);
    
    return () => {
      window.removeEventListener('showRatingModal', handleShowRatingModal);
    };
  }, [trips, showRatingModal]); // Add showRatingModal to dependencies

  const checkForLatestTrip = () => {
    const latestTrip = localStorage.getItem('latestTrip');
    if (latestTrip) {
      const tripData = JSON.parse(latestTrip);
      console.log('📍 Latest trip found:', tripData);
      
      // Show a special notification for the latest booked trip
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
        color: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        z-index: 1000;
        max-width: 350px;
        font-family: Arial, sans-serif;
      `;
      
      const serviceInfo = [];
      if (tripData.driver_name) serviceInfo.push(`🚗 Driver: ${tripData.driver_name}`);
      if (tripData.guide_name) serviceInfo.push(`🗺️ Guide: ${tripData.guide_name}`);
      
      notification.innerHTML = `
        <h4 style="margin: 0 0 15px 0; font-size: 18px;">🎉 Trip Booked Successfully!</h4>
        <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; margin-bottom: 10px;">
          <p style="margin: 0 0 5px 0; font-weight: bold;">📋 Trip ID: ${tripData.trip_id}</p>
          <p style="margin: 0 0 5px 0;">📅 Date: ${tripData.date}</p>
          <p style="margin: 0 0 5px 0;">⏰ Time: ${tripData.start_time}</p>
          ${tripData.start_location && tripData.end_location ? 
            `<p style="margin: 0 0 5px 0;">📍 Route: ${tripData.start_location} → ${tripData.end_location}</p>` : ''}
        </div>
        ${serviceInfo.length > 0 ? `
          <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; margin-bottom: 10px;">
            ${serviceInfo.map(info => `<p style="margin: 0 0 5px 0;">${info}</p>`).join('')}
          </div>
        ` : ''}
        <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px;">
          <p style="margin: 0; font-weight: bold;">💰 Total Cost: Rs. ${tripData.total_cost?.toFixed(2) || '0.00'}</p>
        </div>
        <p style="margin: 15px 0 0 0; font-size: 12px; opacity: 0.9;">Your trip details will appear below shortly...</p>
      `;
      
      document.body.appendChild(notification);
      
      // Remove notification after 8 seconds (increased time for more content)
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 8000);
      
      // Clear the latest trip from localStorage
      localStorage.removeItem('latestTrip');
      
      // Refresh trips list after a short delay to show the new trip
      setTimeout(() => {
        console.log('🔄 Refreshing trips list to show new booking...');
        fetchTravelerTrips();
      }, 1500); // Slightly shorter delay for faster visibility
      
      // Also refresh again after 5 seconds to ensure it appears
      setTimeout(() => {
        console.log('🔄 Secondary refresh to ensure trip visibility...');
        fetchTravelerTrips();
      }, 5000);
    }
  };

  const fetchTravelerTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the current user's traveler ID
      const currentUser = sessionUtils.getCurrentUser();
      if (!currentUser || !currentUser.userId) {
        console.log('❌ User not logged in, clearing trips');
        setTrips([]); // Clear trips when user is not logged in
        setError('User not logged in');
        return;
      }

      console.log('🔍 DEBUG: Current logged-in user details:', {
        userId: currentUser.userId,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role
      });

      // Fetch ALL trips for the traveler (no date filtering - show complete trip history)
      const tripsUrl = `${apiMethods.getBackendUrl()}/api/trips/trips.php?traveler_id=${currentUser.userId}&limit=100`;
      console.log('🔗 Trips API URL:', tripsUrl);
      console.log('🔍 DEBUG: Fetching ALL trips for traveler_id:', currentUser.userId);
      
      const response = await fetch(tripsUrl);
      const data = await response.json();

      console.log('📊 DEBUG: API Response:', data);
      console.log('📊 DEBUG: Total trips found:', data.trips ? data.trips.length : 0);

      if (data.success) {
        // Show all trips that the traveler was engaged with
        console.log('📊 DEBUG: All trips for this user:', data.trips);
        
        // Filter only for valid database trips (no date filtering - show all history)
        const validTrips = data.trips.filter(trip => {
          // First check if trip has a valid trip_id from database
          if (!trip.trip_id || (!trip.trip_date && !trip.date)) {
            console.log('❌ Filtering out invalid trip (missing trip_id or date):', trip);
            return false;
          }
          
          // Include all valid trips regardless of status or date - this is trip history
          console.log(`📊 DEBUG: Valid Trip ${trip.trip_id}:`, {
            originalDate: trip.trip_date || trip.date,
            status: trip.trip_status,
            traveler: trip.traveler_name,
            driver: trip.driver_name,
            guide: trip.guide_name
          });
          
          return true; // Include all valid trips
        });

        // Sort trips by trip_id descending (latest trips first: #123, #122, #121...)
        const sortedTrips = validTrips.sort((a, b) => {
          const tripIdA = parseInt(a.trip_id);
          const tripIdB = parseInt(b.trip_id);
          return tripIdB - tripIdA; // Descending order (highest trip_id first)
        });

        console.log('📊 DEBUG: All valid trips (complete history):', validTrips);
        console.log('🔢 DEBUG: Sorted trips (latest first):', sortedTrips.map(t => `#${t.trip_id} - ${t.trip_status}`));
        setTrips(sortedTrips);
      } else {
        console.log('❌ API returned error, clearing trips');
        setTrips([]); // Clear trips when API returns error
        setError(data.message || 'Failed to fetch trips');
      }
    } catch (err) {
      console.error('Error fetching trips:', err);
      setTrips([]); // Clear trips when there's a network/fetch error
      setError('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTrip = async (tripId) => {
    try {
      // Show confirmation dialog
      const confirmed = window.confirm('Are you sure you want to cancel this trip? This action cannot be undone.');
      
      if (!confirmed) {
        return;
      }

      // Add this trip to the cancelling set
      setCancellingTrips(prev => new Set([...prev, tripId]));
      
      const currentUser = sessionUtils.getCurrentUser();
      
      if (!currentUser || !currentUser.userId) {
        setError('User not logged in');
        alert('Please log in to cancel trips');
        return;
      }

      const deleteUrl = `${apiMethods.getBackendUrl()}/api/trips/trips.php?trip_id=${tripId}&traveler_id=${currentUser.userId}`;
      console.log('🗑️ Delete trip URL:', deleteUrl);
      const response = await fetch(
        deleteUrl,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Delete response:', data); // Debug log

      if (data.success) {
        // Refresh the trip data from server to ensure consistency
        await fetchTravelerTrips();
        alert('Trip cancelled successfully!');
      } else {
        console.error('Cancel failed:', data);
        setError(data.message || 'Failed to cancel trip');
        alert('Failed to cancel trip: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error cancelling trip:', err);
      setError('Failed to cancel trip');
      alert('Failed to cancel trip. Please try again. Error: ' + err.message);
    } finally {
      // Remove this trip from the cancelling set
      setCancellingTrips(prev => {
        const newSet = new Set(prev);
        newSet.delete(tripId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleViewDetails = (trip) => {
    // Create a more user-friendly detailed view
    const getStatusEmoji = (status) => {
      switch (status?.toLowerCase()) {
        case 'completed': return '✅';
        case 'cancelled': return '❌';
        case 'confirmed': 
        default: return '📅';
      }
    };

    const statusText = trip.trip_status?.charAt(0).toUpperCase() + trip.trip_status?.slice(1).replace('_', ' ');
    
    const tripDetails = `
${getStatusEmoji(trip.trip_status)} TRIP DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆔 Trip ID: #${trip.trip_id}
📅 Date: ${formatDate(trip.trip_date || trip.date)}
🕐 Start Time: ${formatTime(trip.start_time)}
📍 From: ${trip.start_location}
📍 To: ${trip.end_location}
${trip.distance_km ? `📏 Distance: ${trip.distance_km && trip.distance_km < 1 ? (trip.distance_km * 1000).toFixed(1) : trip.distance_km} km` : ''}
${trip.estimated_time && trip.estimated_time !== '0' ? `⏱️ Duration: ${trip.estimated_time}` : ''}

👥 SERVICE PROVIDERS
🚗 Driver: ${trip.driver_name || 'Not assigned'}
🗺️ Guide: ${trip.guide_name || 'Not assigned'}

💰 COST BREAKDOWN
• Route Cost: Rs. ${trip.route_cost || '0.00'}
• Driver Cost: Rs. ${trip.driver_cost || '0.00'}
• Guide Cost: Rs. ${trip.guide_cost || '0.00'}
• Service Fee: Rs. ${trip.system_fee || '0.00'}
• Total Cost: Rs. ${trip.total_cost || '0.00'}

📋 Status: ${statusText}
${trip.special_requests ? `💬 Special Requests: ${trip.special_requests}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();
    
    alert(tripDetails);
  };

  const handleContactSupport = (trip) => {
    // Create support contact modal or redirect to contact page
    const supportMessage = `
Need Help with Trip #${trip.trip_id}?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 Support Hotline: +94 77 123 4567
📧 Email: support@routepro.com
💬 Live Chat: Available 24/7

For immediate assistance, please include:
• Trip ID: ${trip.trip_id}
• Date: ${formatDate(trip.trip_date || trip.date)}
• Your concern or question

We're here to help make your journey smooth!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;
    
    if (window.confirm(supportMessage + '\n\nWould you like to open our contact page?')) {
      // You can redirect to contact page or open email client
      window.open('mailto:support@routepro.com?subject=Support Request - Trip #' + trip.trip_id);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return styles.completed;
      case 'cancelled': return styles.cancelled;
      case 'confirmed':
      default: return styles.confirmed;
    }
  };

  const handleRateTrip = (trip) => {
    // Prevent opening modal if it's already open to avoid blinking
    if (showRatingModal) {
      console.log('⚠️ Rating modal already open, ignoring duplicate request');
      return;
    }
    console.log('🌟 Opening rating modal for trip:', trip.trip_id);
    setSelectedTripForRating(trip);
    setShowRatingModal(true);
  };

  const handleCloseRatingModal = () => {
    console.log('❌ Closing rating modal');
    setShowRatingModal(false);
    setSelectedTripForRating(null);
  };

  const handleSubmitRating = async (ratingData) => {
    try {
      const submitUrl = `${apiMethods.getBackendUrl()}/mock-submit-rating.php`;
      
      const response = await fetch(submitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ratingData)
      });

      const result = await response.json();

      if (result.success) {
        // Update the trip to mark it as rated
        setTrips(prevTrips => 
          prevTrips.map(trip => 
            trip.trip_id === ratingData.trip_id 
              ? { ...trip, has_rating: true }
              : trip
          )
        );
        
        // Clear rating modal tracking for this trip
        if (window.tripAutoCompletion) {
          window.tripAutoCompletion.clearRatingModalTracking(ratingData.trip_id);
        }
        
        alert('Thank you for your rating! Your feedback helps us improve our service.');
        handleCloseRatingModal();
      } else {
        throw new Error(result.message || 'Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      throw error; // Re-throw to be handled by RatingModal
    }
  };

  if (loading) {
    return (
      <section className={styles.upcomingTrips}>
        <div className={styles.sectionHeader}>
          <h3>My Trips</h3>
        </div>
        <div className={styles.loading}>Loading trips...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.upcomingTrips}>
        <div className={styles.sectionHeader}>
          <h3>My Trips</h3>
        </div>
        <div className={styles.error}>Error: {error}</div>
      </section>
    );
  }

  return (
    <section className={styles.upcomingTrips}>
      <div className={styles.sectionHeader}>
        <h3>My Trips</h3>
        <span className={styles.tripCount}>{trips.length}</span>
      </div>
      
      {trips.length === 0 ? (
        <div className={styles.noTrips}>
          <p>No trips found.</p>
          <p>Start planning your next adventure!</p>
        </div>
      ) : (
        <>
          {/* Upcoming/Confirmed Trips */}
          {trips.filter(trip => trip.trip_status === 'confirmed').length > 0 && (
            <div className={styles.tripSection}>
              <h4 className={styles.sectionTitle}>🚀 Upcoming Trips</h4>
              <div className={styles.tripGrid}>
                {trips
                  .filter(trip => trip.trip_status === 'confirmed')
                  .map(trip => (
                    <div key={trip.trip_id} className={styles.tripCard}>
                      <div className={styles.tripCardHeader}>
                        <span className={`${styles.statusBadge} ${getStatusBadgeClass(trip.trip_status)}`}>
                          {trip.trip_status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Confirmed'}
                          {trip.trip_status === 'confirmed' && (
                            <span className={styles.autoCompleteTimer} title="Auto-completes in 5 minutes">
                              ⏰
                            </span>
                          )}
                        </span>
                        <span className={styles.tripId}>#{trip.trip_id}</span>
                      </div>
                      
                      <div className={styles.tripInfo}>
                        <h4 className={styles.destination}>
                          {trip.start_location && trip.end_location 
                            ? `${trip.start_location} → ${trip.end_location}` 
                            : `Trip #${trip.trip_id} - Custom Route`}
                        </h4>
                        <p><strong>Date:</strong> {formatDate(trip.trip_date || trip.date)}</p>
                        <p><strong>Time:</strong> {formatTime(trip.start_time)}</p>
                        {trip.distance_km && trip.distance_km !== '0' && (
                          <p><strong>Distance:</strong> {
                            trip.distance_km && trip.distance_km < 1 
                              ? (trip.distance_km * 1000).toFixed(1) 
                              : trip.distance_km
                          } km</p>
                        )}
                        {trip.estimated_time && trip.estimated_time !== '0 hours' && (
                          <p><strong>Estimated Time:</strong> {trip.estimated_time}</p>
                        )}
                        <p><strong>Driver:</strong> {
                          trip.driver_name && trip.driver_name !== 'Not assigned' && trip.driver_name !== 'null' 
                            ? trip.driver_name 
                            : <em>Not assigned yet</em>
                        }</p>
                        <p><strong>Guide:</strong> {
                          trip.guide_name && trip.guide_name !== 'Not assigned' && trip.guide_name !== 'null'
                            ? trip.guide_name 
                            : <em>Not assigned yet</em>
                        }</p>
                        <p className={styles.fee}><strong>Total Cost:</strong> Rs. {trip.total_cost || trip.route_cost}</p>
                        
                        <div className={styles.costBreakdown}>
                          <p className={styles.subFee}>
                            <strong>Driver Cost:</strong> Rs. {trip.driver_cost || '0.00'}
                          </p>
                          <p className={styles.subFee}>
                            <strong>Guide Cost:</strong> Rs. {trip.guide_cost || '0.00'}
                          </p>
                          <p className={styles.subFee}>
                            <strong>Service Fee:</strong> Rs. {trip.system_fee || '0.00'}
                          </p>
                        </div>
                      </div>
                      
                      <div className={styles.tripActions}>
                        <button 
                          className={styles.primaryBtn}
                          onClick={() => handleViewDetails(trip)}
                        >
                          View Details
                        </button>
                        <button 
                          className={styles.secondaryBtn}
                          onClick={() => handleContactSupport(trip)}
                        >
                          Contact Support
                        </button>
                        <button 
                          className={styles.dangerBtn}
                          onClick={() => handleCancelTrip(trip.trip_id)}
                          disabled={cancellingTrips.has(trip.trip_id)}
                        >
                          {cancellingTrips.has(trip.trip_id) ? 'Cancelling...' : 'Cancel Trip'}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Completed Trips */}
          {trips.filter(trip => trip.trip_status === 'completed').length > 0 && (
            <div className={styles.tripSection}>
              <h4 className={styles.sectionTitle}>✅ Completed Trips</h4>
              <div className={styles.tripGrid}>
                {trips
                  .filter(trip => trip.trip_status === 'completed')
                  .map(trip => (
                    <div key={trip.trip_id} className={styles.tripCard}>
                      <div className={styles.tripCardHeader}>
                        <span className={`${styles.statusBadge} ${getStatusBadgeClass(trip.trip_status)}`}>
                          Completed
                        </span>
                        <span className={styles.tripId}>#{trip.trip_id}</span>
                      </div>
                      
                      <div className={styles.tripInfo}>
                        <h4 className={styles.destination}>
                          {trip.start_location && trip.end_location 
                            ? `${trip.start_location} → ${trip.end_location}` 
                            : `Trip #${trip.trip_id} - Custom Route`}
                        </h4>
                        <p><strong>Date:</strong> {formatDate(trip.trip_date || trip.date)}</p>
                        <p><strong>Time:</strong> {formatTime(trip.start_time)}</p>
                        <p><strong>Driver:</strong> {trip.driver_name || <em>Not assigned</em>}</p>
                        <p><strong>Guide:</strong> {trip.guide_name || <em>Not assigned</em>}</p>
                        <p className={styles.fee}><strong>Total Cost:</strong> Rs. {trip.total_cost || trip.route_cost}</p>
                        {trip.completed_at && (
                          <p><strong>Completed:</strong> {formatDate(trip.completed_at)} at {formatTime(trip.completed_at)}</p>
                        )}
                      </div>
                      
                      <div className={styles.tripActions}>
                        <button 
                          className={styles.primaryBtn}
                          onClick={() => handleViewDetails(trip)}
                        >
                          View Details
                        </button>
                        {!trip.has_rating && (
                          <button 
                            className={styles.ratingBtn}
                            onClick={() => handleRateTrip(trip)}
                          >
                            ⭐ Rate Trip
                          </button>
                        )}
                        {trip.has_rating && (
                          <div className={styles.ratedStatus}>
                            ✅ Rated
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Cancelled Trips */}
          {trips.filter(trip => trip.trip_status === 'cancelled').length > 0 && (
            <div className={styles.tripSection}>
              <h4 className={styles.sectionTitle}>❌ Cancelled Trips</h4>
              <div className={styles.tripGrid}>
                {trips
                  .filter(trip => trip.trip_status === 'cancelled')
                  .map(trip => (
                    <div key={trip.trip_id} className={styles.tripCard}>
                      <div className={styles.tripCardHeader}>
                        <span className={`${styles.statusBadge} ${getStatusBadgeClass(trip.trip_status)}`}>
                          Cancelled
                        </span>
                        <span className={styles.tripId}>#{trip.trip_id}</span>
                      </div>
                      
                      <div className={styles.tripInfo}>
                        <h4 className={styles.destination}>
                          {trip.start_location && trip.end_location 
                            ? `${trip.start_location} → ${trip.end_location}` 
                            : `Trip #${trip.trip_id} - Custom Route`}
                        </h4>
                        <p><strong>Date:</strong> {formatDate(trip.trip_date || trip.date)}</p>
                        <p><strong>Time:</strong> {formatTime(trip.start_time)}</p>
                        <p><strong>Driver:</strong> {trip.driver_name || <em>Not assigned</em>}</p>
                        <p><strong>Guide:</strong> {trip.guide_name || <em>Not assigned</em>}</p>
                        <p className={styles.fee}><strong>Total Cost:</strong> Rs. {trip.total_cost || trip.route_cost}</p>
                      </div>
                      
                      <div className={styles.tripActions}>
                        <button 
                          className={styles.primaryBtn}
                          onClick={() => handleViewDetails(trip)}
                        >
                          View Details
                        </button>
                        <div className={styles.cancelledStatus}>
                          ❌ Trip Cancelled
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Rating Modal */}
      {console.log('🔍 Modal render check:', { showRatingModal, selectedTripForRating: !!selectedTripForRating })}
      {showRatingModal && selectedTripForRating && (
        <RatingModal
          notification={{ trip_data: selectedTripForRating }}
          onClose={handleCloseRatingModal}
          onSubmit={handleSubmitRating}
          isOpen={showRatingModal}
        />
      )}
    </section>
  );
};

export default UpcomingTrips;
