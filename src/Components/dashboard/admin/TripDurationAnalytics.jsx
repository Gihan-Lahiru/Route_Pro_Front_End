import React, { useState, useEffect } from 'react';
import { tripDurationTracker } from '../../../utils/tripDurationTracker';
import './TripDurationAnalytics.css';

const TripDurationAnalytics = () => {
  const [durations, setDurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrips: 0,
    averageDuration: 0,
    quickTrips: 0, // ≤5 minutes
    fastTrips: 0,  // 5-10 minutes
    longTrips: 0,  // >10 minutes
    targetAchievement: 0 // % of trips completing in ≤5 minutes
  });

  useEffect(() => {
    fetchTripDurations();
  }, []);

  const fetchTripDurations = async () => {
    try {
      setLoading(true);
      const data = await tripDurationTracker.getTripDurations({
        status: 'completed',
        limit: 100 // Last 100 completed trips
      });
      
      setDurations(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error fetching trip durations:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (!data || data.length === 0) {
      setStats({
        totalTrips: 0,
        averageDuration: 0,
        quickTrips: 0,
        fastTrips: 0,
        longTrips: 0,
        targetAchievement: 0
      });
      return;
    }

    const totalTrips = data.length;
    const totalDuration = data.reduce((sum, trip) => sum + (trip.actual_duration_minutes || 0), 0);
    const averageDuration = Math.round(totalDuration / totalTrips);

    let quickTrips = 0;
    let fastTrips = 0;
    let longTrips = 0;

    data.forEach(trip => {
      const duration = trip.actual_duration_minutes || 0;
      if (duration <= 5) {
        quickTrips++;
      } else if (duration <= 10) {
        fastTrips++;
      } else {
        longTrips++;
      }
    });

    const targetAchievement = Math.round((quickTrips / totalTrips) * 100);

    setStats({
      totalTrips,
      averageDuration,
      quickTrips,
      fastTrips,
      longTrips,
      targetAchievement
    });
  };

  const getStatusIcon = (duration) => {
    if (duration <= 5) return '🎯';
    if (duration <= 10) return '⚡';
    return '🐌';
  };

  const getStatusText = (duration) => {
    if (duration <= 5) return 'Quick';
    if (duration <= 10) return 'Fast';
    return 'Extended';
  };

  const getStatusClass = (duration) => {
    if (duration <= 5) return 'quick';
    if (duration <= 10) return 'fast';
    return 'extended';
  };

  if (loading) {
    return (
      <div className="duration-analytics">
        <h3>Trip Duration Analytics</h3>
        <div className="loading">Loading duration data...</div>
      </div>
    );
  }

  return (
    <div className="duration-analytics">
      <h3>Trip Duration Analytics</h3>
      
      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalTrips}</div>
            <div className="stat-label">Total Trips</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <div className="stat-value">{stats.averageDuration}m</div>
            <div className="stat-label">Average Duration</div>
          </div>
        </div>
        
        <div className="stat-card target">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <div className="stat-value">{stats.targetAchievement}%</div>
            <div className="stat-label">≤5 Min Target</div>
          </div>
        </div>
      </div>

      {/* Duration Breakdown */}
      <div className="duration-breakdown">
        <h4>Duration Distribution</h4>
        <div className="breakdown-grid">
          <div className="breakdown-item quick">
            <div className="breakdown-icon">🎯</div>
            <div className="breakdown-info">
              <div className="breakdown-count">{stats.quickTrips}</div>
              <div className="breakdown-label">Quick (≤5 min)</div>
            </div>
          </div>
          
          <div className="breakdown-item fast">
            <div className="breakdown-icon">⚡</div>
            <div className="breakdown-info">
              <div className="breakdown-count">{stats.fastTrips}</div>
              <div className="breakdown-label">Fast (5-10 min)</div>
            </div>
          </div>
          
          <div className="breakdown-item extended">
            <div className="breakdown-icon">🐌</div>
            <div className="breakdown-info">
              <div className="breakdown-count">{stats.longTrips}</div>
              <div className="breakdown-label">Extended (&gt;10 min)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trips Table */}
      <div className="recent-durations">
        <h4>Recent Trip Durations</h4>
        {durations.length > 0 ? (
          <div className="durations-table">
            <div className="table-header">
              <div>Trip ID</div>
              <div>Route</div>
              <div>Duration</div>
              <div>Status</div>
              <div>Completed</div>
            </div>
            {durations.slice(0, 10).map((trip) => (
              <div key={trip.trip_id} className="table-row">
                <div className="trip-id">#{trip.trip_id}</div>
                <div className="route">
                  {trip.start_location} → {trip.end_location}
                </div>
                <div className="duration">
                  {tripDurationTracker.formatDuration(trip.actual_duration_minutes)}
                </div>
                <div className={`status ${getStatusClass(trip.actual_duration_minutes)}`}>
                  {getStatusIcon(trip.actual_duration_minutes)} {getStatusText(trip.actual_duration_minutes)}
                </div>
                <div className="completed-time">
                  {new Date(trip.completed_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">No completed trips with duration data found.</div>
        )}
      </div>

      {/* Target Achievement Info */}
      <div className="target-info">
        <h4>5-Minute Target Analysis</h4>
        <div className="target-details">
          <p>
            <strong>{stats.targetAchievement}%</strong> of trips are completing within the 5-minute target.
          </p>
          {stats.targetAchievement >= 80 ? (
            <div className="achievement-good">
              🎉 Excellent! Most trips are meeting the quick completion target.
            </div>
          ) : stats.targetAchievement >= 50 ? (
            <div className="achievement-ok">
              ⚡ Good performance, but room for improvement to reach 80%+ target achievement.
            </div>
          ) : (
            <div className="achievement-poor">
              📈 Many trips are taking longer than 5 minutes. Consider optimizing routes and processes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDurationAnalytics;