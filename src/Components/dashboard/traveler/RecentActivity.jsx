import React, { useState, useEffect } from 'react';
import { sessionUtils } from '../../../utils/api-client';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      
      // Get the current user's traveler ID
      const currentUser = sessionUtils.getCurrentUser();
      if (!currentUser || !currentUser.userId) {
        setActivities([]);
        return;
      }

      const response = await fetch(`http://localhost/RoutePro-backend(02)/public/api/trips/trips.php?traveler_id=${currentUser.userId}`);
      const data = await response.json();

      if (data.success) {
        // Convert trips to activity format, sorted by most recent
        const recentTrips = data.trips
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5) // Get only the 5 most recent
          .map(trip => {
            const createdDate = new Date(trip.created_at);
            const timeAgo = getTimeAgo(createdDate);
            
            let activityText = '';
            switch (trip.trip_status) {
              case 'completed':
                activityText = `Completed trip from ${trip.start_location} to ${trip.end_location}`;
                break;
              case 'cancelled':
                activityText = `Cancelled trip from ${trip.start_location} to ${trip.end_location}`;
                break;
              case 'in_progress':
                activityText = `Started trip from ${trip.start_location} to ${trip.end_location}`;
                break;
              default:
                activityText = `Booked trip from ${trip.start_location} to ${trip.end_location}`;
            }
            
            return {
              id: trip.trip_id,
              text: activityText,
              timeAgo: timeAgo
            };
          });

        setActivities(recentTrips);
      }
    } catch (err) {
      console.error('Error fetching recent activity:', err);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return diffMins <= 1 ? '1 minute ago' : `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else {
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    }
  };

  if (loading) {
    return (
      <section>
        <h3>Recent Activity</h3>
        <p>Loading recent activity...</p>
      </section>
    );
  }

  return (
    <section>
      <h3>Recent Activity</h3>
      {activities.length === 0 ? (
        <p>No recent activity found.</p>
      ) : (
        <ul>
          {activities.map(activity => (
            <li key={activity.id}>
              {activity.text} ({activity.timeAgo})
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default RecentActivity;
