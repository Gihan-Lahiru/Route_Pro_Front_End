import React, { useState, useEffect } from 'react';
import { sessionUtils, apiMethods } from '../../../utils/api-client';

const TravelStats = () => {
  const [stats, setStats] = useState({
    completedTrips: 0,
    upcomingTrips: 0,
    totalDistance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTravelStats();
  }, []);

  const fetchTravelStats = async () => {
    try {
      const currentUser = sessionUtils.getCurrentUser();
      if (!currentUser?.userId) return;

      // Get all trips for this traveller
      const tripsUrl = `${apiMethods.getBackendUrl()}/api/trips/trips.php?traveler_id=${currentUser.userId}`;
      const response = await fetch(tripsUrl);
      const data = await response.json();

      if (data.success && data.trips) {
        const completedTrips = data.trips.filter(trip => trip.trip_status === 'completed').length;
        const upcomingTrips = data.trips.filter(trip => 
          trip.trip_status === 'not_started' || trip.trip_status === 'in_progress'
        ).length;
        
        // Calculate total distance from completed trips
        const totalDistance = data.trips
          .filter(trip => trip.trip_status === 'completed')
          .reduce((sum, trip) => sum + (parseFloat(trip.distance_km) || 0), 0);

        setStats({
          completedTrips,
          upcomingTrips,
          totalDistance: Math.round(totalDistance)
        });
      }
    } catch (error) {
      console.error('Error fetching travel stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section>
        <h3>Travel Stats</h3>
        <p>Loading stats...</p>
      </section>
    );
  }

  return (
    <section>
      <h3>Travel Stats</h3>
      <ul>
        <li>Trips Completed: {stats.completedTrips}</li>
        <li>Upcoming Trips: {stats.upcomingTrips}</li>
        <li>Total Distance: {stats.totalDistance} km</li>
      </ul>
    </section>
  );
};

export default TravelStats;
