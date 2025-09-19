import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    monthlyRevenue: { amount: 0, formatted: 'Rs. 0', percentageChange: 0, tripCount: 0 },
    totalTrips: { total: 0, today: 0 },
    totalTravelers: { total: 0, thisWeek: 0 },
    totalDriversGuides: { total: 0, drivers: 0, guides: 0 },
    recentTrips: [],
    revenueTrend: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching dashboard stats...');
      
      const response = await fetch('http://localhost:80/RoutePro-backend(02)/public/api/admin/system-stats.php');
      
      console.log('Response received:', response);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Data received:', data);
      
      if (data.success) {
        setStats(data.data);
        console.log('Stats updated successfully');
      } else {
        throw new Error(data.message || 'API returned unsuccessful response');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(`Failed to load dashboard: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error-container">
          <h3>Error loading dashboard</h3>
          <p>{error}</p>
          <button onClick={fetchDashboardStats} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h3>Monthly Revenue</h3>
            <span className="stat-icon">💰</span>
          </div>
          <div className="stat-value">{stats.monthlyRevenue.formatted}</div>
          <div className={`stat-change ${stats.monthlyRevenue.percentageChange >= 0 ? 'positive' : 'negative'}`}>
            {stats.monthlyRevenue.percentageChange >= 0 ? '+' : ''}{stats.monthlyRevenue.percentageChange}% from last month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Total Trips</h3>
            <span className="stat-icon">📍</span>
          </div>
          <div className="stat-value">{stats.totalTrips.total.toLocaleString()}</div>
          <div className="stat-change">+{stats.totalTrips.today} new today</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Travelers</h3>
            <span className="stat-icon">👥</span>
          </div>
          <div className="stat-value">{stats.totalTravelers.total.toLocaleString()}</div>
          <div className="stat-change">+{stats.totalTravelers.thisWeek} new this week</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Drivers & Guides</h3>
            <span className="stat-icon">🚗</span>
          </div>
          <div className="stat-value">{stats.totalDriversGuides.total}</div>
          <div className="stat-change">{stats.totalDriversGuides.drivers} drivers, {stats.totalDriversGuides.guides} guides</div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="revenue-chart">
          <h3>Revenue Trend (Last 5 Months)</h3>
          <div className="chart-container">
            {stats.revenueTrend.length > 0 ? (
              stats.revenueTrend.map((month, index) => {
                const maxRevenue = Math.max(...stats.revenueTrend.map(m => m.revenue));
                const percentage = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;
                
                return (
                  <div key={index} className="chart-item">
                    <span className="month">{month.month}</span>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <span className="amount">{month.formatted}</span>
                  </div>
                );
              })
            ) : (
              <div className="no-data">No revenue data available</div>
            )}
          </div>
        </div>

        <div className="recent-trips">
          <h3>Recent Trips</h3>
          {stats.recentTrips.length > 0 ? (
            stats.recentTrips.map((trip, index) => (
              <div key={index} className="trip-item">
                <div className="trip-info">
                  <div className="trip-id">
                    <span className="trip-code">TR{String(trip.trip_id).padStart(3, '0')}</span>
                    <span className={`trip-status ${trip.status}`}>{trip.status}</span>
                  </div>
                  <div className="trip-details">
                    <div className="traveler">{trip.traveler?.name || 'Unknown'}</div>
                    <div className="route">{trip.route}</div>
                  </div>
                </div>
                <div className="trip-meta">
                  <div className="trip-amount">Rs. {trip.system_fee?.toFixed(2)}</div>
                  <div className="trip-staff">
                    {trip.driver?.name && trip.guide?.name 
                      ? `${trip.driver.name} | ${trip.guide.name}`
                      : trip.driver?.name || trip.guide?.name || 'No staff assigned'
                    }
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">No recent trips found</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
