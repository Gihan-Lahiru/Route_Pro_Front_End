import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TravelerDashboard.module.css';

import ProfileInfo from './ProfileInfo';
import QuickActions from './QuickActions';
import UpcomingTrips from './UpcomingTrips';
import RecentActivity from './RecentActivity';

const TravelerDashboard = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get the logged-in user's email from localStorage (set during login)
    const userEmail = localStorage.getItem('userEmail') || 
                     localStorage.getItem('email') ||
                     'emma@traveller.com'; // Fallback for testing

    console.log('🚀 Fetching traveller data for dashboard:', userEmail);

    // Use proper TravellerController endpoint with email parameter
    fetch(`http://localhost/RoutePro-backend(02)/public/traveller/profile?email=${encodeURIComponent(userEmail)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success && data.data) {
          setUserName(data.data.name || 'Traveller');
        } else {
          console.error('Error fetching traveller info:', data.message || 'Unknown error');
          setUserName('Traveller'); // Fallback
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setUserName('Traveller'); // Fallback
      });
  }, []);

  const handleLogout = () => {
    // Optional: clear auth/session data here
    navigate('/homepage');
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.headerRow}>
        <h2>Welcome back, {userName || 'Traveller'}!</h2>
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
