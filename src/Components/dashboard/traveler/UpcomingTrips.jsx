import React, { useState, useEffect } from 'react';
import styles from './UpcomingTrips.module.css';
import { sessionUtils, apiMethods } from '../../../utils/api-client';

const UpcomingTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingTrips, setCancellingTrips] = useState(new Set());

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
    
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
        setError('User not logged in');
        return;
      }

      console.log('🔍 DEBUG: Current logged-in user details:', {
        userId: currentUser.userId,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role
      });

      const tripsUrl = `${apiMethods.getBackendUrl()}/api/trips/trips.php?traveler_id=${currentUser.userId}`;
      console.log('🔗 Trips API URL:', tripsUrl);
      console.log('🔍 DEBUG: Fetching trips for traveler_id:', currentUser.userId);
      
      const response = await fetch(tripsUrl);
      const data = await response.json();

      console.log('📊 DEBUG: API Response:', data);
      console.log('📊 DEBUG: Total trips found:', data.trips ? data.trips.length : 0);

      if (data.success) {
        // Show all trips first for debugging
        console.log('📊 DEBUG: All trips for this user:', data.trips);
        
        // Special check for trip 122
        const trip122 = data.trips ? data.trips.find(trip => trip.trip_id == 122) : null;
        if (trip122) {
          console.log('🎯 DEBUG: Found Trip 122!', trip122);
        } else {
          console.log('❌ DEBUG: Trip 122 NOT FOUND in API response');
          console.log('🔍 DEBUG: Looking for trip_id=122 in:', data.trips?.map(t => t.trip_id));
        }
        
        // Filter for upcoming trips (today and future dates, not cancelled)
        const currentDate = new Date();
        // Set current date to start of day for proper comparison
        const currentDateStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        console.log('📅 DEBUG: Current date for comparison:', currentDateStart);
        
        const upcomingTrips = data.trips.filter(trip => {
          const tripDate = new Date(trip.trip_date || trip.date);
          // Set trip date to start of day for proper comparison
          const tripDateStart = new Date(tripDate.getFullYear(), tripDate.getMonth(), tripDate.getDate());
          const isUpcoming = tripDateStart >= currentDateStart; // Include today's trips
          const isNotCancelled = trip.trip_status !== 'cancelled';
          
          console.log(`📊 DEBUG: Trip ${trip.trip_id}:`, {
            originalDate: trip.trip_date || trip.date,
            tripDateStart: tripDateStart,
            currentDateStart: currentDateStart,
            isUpcoming: isUpcoming,
            status: trip.trip_status,
            isNotCancelled: isNotCancelled,
            willShow: isUpcoming && isNotCancelled
          });
          
          return isUpcoming && isNotCancelled;
        });

        // Sort trips by trip_id descending (latest trips first: #123, #122, #121...)
        const sortedTrips = upcomingTrips.sort((a, b) => {
          const tripIdA = parseInt(a.trip_id);
          const tripIdB = parseInt(b.trip_id);
          return tripIdB - tripIdA; // Descending order (highest trip_id first)
        });

        console.log('📊 DEBUG: Filtered upcoming trips:', upcomingTrips);
        console.log('🔢 DEBUG: Sorted trips (latest first):', sortedTrips.map(t => `#${t.trip_id}`));
        setTrips(sortedTrips);
      } else {
        setError(data.message || 'Failed to fetch trips');
      }
    } catch (err) {
      console.error('Error fetching trips:', err);
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

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return styles.completed;
      case 'in_progress': return styles.inProgress;
      case 'cancelled': return styles.cancelled;
      case 'not_started':
      default: return styles.confirmed;
    }
  };

  if (loading) {
    return (
      <section className={styles.upcomingTrips}>
        <div className={styles.sectionHeader}>
          <h3>Upcoming Trips</h3>
        </div>
        <div className={styles.loading}>Loading trips...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.upcomingTrips}>
        <div className={styles.sectionHeader}>
          <h3>Upcoming Trips</h3>
        </div>
        <div className={styles.error}>Error: {error}</div>
      </section>
    );
  }

  return (
    <section className={styles.upcomingTrips}>
      <div className={styles.sectionHeader}>
        <h3>Upcoming Trips</h3>
        <span className={styles.tripCount}>{trips.length}</span>
      </div>
      
      {trips.length === 0 ? (
        <div className={styles.noTrips}>
          <p>No upcoming trips found.</p>
          <p>Start planning your next adventure!</p>
        </div>
      ) : (
        <div className={styles.tripGrid}>
          {trips.map(trip => (
            <div key={trip.trip_id} className={styles.tripCard}>
              <div className={styles.tripCardHeader}>
                <span className={`${styles.statusBadge} ${getStatusBadgeClass(trip.trip_status)}`}>
                  {trip.trip_status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Confirmed'}
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
                  <p><strong>Distance:</strong> {trip.distance_km} km</p>
                )}
                {trip.estimated_time && trip.estimated_time !== '0 hours' && (
                  <p><strong>Estimated Time:</strong> {trip.estimated_time}</p>
                )}
                {/* Driver and Guide Information - Always show both */}
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
                
                {/* Cost Breakdown - Always show all components */}
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
                <button className={styles.primaryBtn}>View Details</button>
                <button className={styles.secondaryBtn}>Contact Support</button>
                {trip.trip_status === 'not_started' && (
                  <button 
                    className={styles.dangerBtn}
                    onClick={() => handleCancelTrip(trip.trip_id)}
                    disabled={cancellingTrips.has(trip.trip_id)}
                  >
                    {cancellingTrips.has(trip.trip_id) ? 'Cancelling...' : 'Cancel Trip'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default UpcomingTrips;
