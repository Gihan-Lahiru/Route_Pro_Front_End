import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TravelerDashboard.module.css';

import ProfileInfo from './ProfileInfo';
import QuickActions from './QuickActions';
import UpcomingTrips from './UpcomingTrips';
import RecentActivity from './RecentActivity';

const TravelerDashboard = () => {
  const [userName, setUserName] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the logged-in user's email from localStorage (set during login)
    const userEmail = localStorage.getItem('userEmail') || 
                     localStorage.getItem('email') ||
                     'test.traveller@example.com'; // Using an email that exists in DB

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
        console.log('🔍 Dashboard API Response:', data);
        if (data.success && data.data) {
          console.log('✅ Dashboard data received:', data.data);
          setUserName(data.data.name || 'Traveller');
        } else {
          console.error('❌ Error fetching traveller info:', data.message || 'Unknown error');
          console.error('❌ Full dashboard response:', data);
          setUserName('Traveller'); // Fallback
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setUserName('Traveller'); // Fallback
      });
  }, [refreshTrigger]); // Add refreshTrigger as dependency

  const handleProfileUpdate = () => {
    setRefreshTrigger(prev => prev + 1); // Trigger re-fetch
  };

  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.removeItem('userEmail');
    localStorage.removeItem('email');
    localStorage.removeItem('userRole');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('name');
    localStorage.removeItem('userRating');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('sessionStartTime');
    
    // Dispatch event to notify Header component
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'userEmail',
      newValue: null
    }));
    
    // Navigate to homepage
    navigate('/homepage');
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.headerRow}>
        <h2>Welcome back, {userName || 'Traveller'}!</h2>
        <button className="action-button" onClick={handleLogout}>Log Out</button>
      </div>

      <ProfileInfo onProfileUpdate={handleProfileUpdate} />
      <QuickActions />
      <UpcomingTrips />
      <RecentActivity />
    </div>
  );
};

export default TravelerDashboard;
