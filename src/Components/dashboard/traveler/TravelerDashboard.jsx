import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TravelerDashboard.module.css';

import ProfileInfo from './ProfileInfo';
import QuickActions from './QuickActions';
import UpcomingTrips from './UpcomingTrips';
import RecentActivity from './RecentActivity';

const TravelerDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optional: clear auth/session data here
    navigate('/homepage');
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.headerRow}>
        <h2>Welcome back, Sarah Johnson</h2>
        <button className="action-button" onClick={handleLogout}>Log Out</button>
      </div>

      <ProfileInfo />
      <QuickActions />
      <UpcomingTrips />
      <RecentActivity />
    </div>
  );
};

export default TravelerDashboard;
