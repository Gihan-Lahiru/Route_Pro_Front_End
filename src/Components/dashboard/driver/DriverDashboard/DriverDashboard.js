import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthGuard from '../../../../hooks/useAuthGuard';
import { sessionUtils } from '../../../../utils/api-client';
import TripDetails from '../TripDetails/TripDetails';
import ReviewsPanel from '../ReviewsPanel/ReviewsPanel';
import './DriverDashboard.css';
import DriverHeader from '../DriverHeader/DriverHeader';

const DriverDashboard = () => {
  const [status, setStatus] = useState('available');
  const [activeView, setActiveView] = useState('trip');
  const [userName, setUserName] = useState('');
  const { isAuthenticated, isLoading } = useAuthGuard('driver');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return; // Only fetch data if authenticated
    
    console.log('🔍 Starting driver name fetch process...');
    
    // Debug: Log all localStorage values
    const localStorageData = {
      userName: localStorage.getItem('userName'),
      name: localStorage.getItem('name'),
      userEmail: localStorage.getItem('userEmail'),
      email: localStorage.getItem('email'),
      userId: localStorage.getItem('userId')
    };
    console.log('localStorage values:', localStorageData);
    
    // Try multiple sources for the user name
    const storedName = localStorage.getItem('userName') || localStorage.getItem('name');
    const currentUser = sessionUtils.getCurrentUser();
    
    console.log('currentUser from sessionUtils:', currentUser);
    
    // Check if we have a valid stored name (not null, undefined, or empty)
    if (storedName && storedName !== 'null' && storedName !== 'undefined' && storedName.trim() !== '') {
      setUserName(storedName);
      console.log('✅ Got driver name from localStorage:', storedName);
      return;
    }
    
    // Check sessionUtils for userName
    if (currentUser && currentUser.userName && currentUser.userName.trim() !== '') {
      setUserName(currentUser.userName);
      console.log('✅ Got driver name from session:', currentUser.userName);
      return;
    }
    
    // If no valid stored name, try to fetch from APIs
    console.log('⚠️ No valid stored name found, attempting API fetch...');
    
    // Try to get user ID directly
    const userId = localStorage.getItem('userId') || currentUser?.userId;
    const userEmail = localStorage.getItem('userEmail') || 
                     localStorage.getItem('email') ||
                     currentUser?.email;
    
    console.log('Available identifiers:', { userId, userEmail });
    
    if (userId) {
      console.log('🚀 Trying to fetch driver name using user ID:', userId);
      
      fetch(`http://localhost/RoutePro-backend(02)/public/api/auth/user-info.php?user_id=${userId}`)
        .then(res => {
          console.log('User info API response status:', res.status);
          return res.json();
        })
        .then(userData => {
          console.log('User info API response data:', userData);
          if (userData.success && userData.user && userData.user.name && userData.user.name.trim() !== '') {
            const userName = userData.user.name;
            setUserName(userName);
            localStorage.setItem('userName', userName);
            console.log('✅ Got driver name from user info API:', userName);
            return;
          }
          
          // If user info API doesn't have name, try driver profile API with email
          if (userEmail) {
            console.log('🚀 Trying driver profile API with email:', userEmail);
            
            return fetch(`http://localhost/RoutePro-backend(02)/public/driver/profile?email=${encodeURIComponent(userEmail)}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              }
            });
          } else {
            throw new Error('No email found for driver profile API');
          }
        })
        .then(res => {
          if (res) {
            console.log('Driver profile API response status:', res.status);
            return res.json();
          }
          return null;
        })
        .then((data) => {
          if (data) {
            console.log('Driver profile API response:', data);
            if (data.success && data.data && data.data.name && data.data.name.trim() !== '') {
              const driverName = data.data.name;
              setUserName(driverName);
              setStatus(data.data.status || 'available');
              localStorage.setItem('userName', driverName);
              console.log('✅ Got driver name from driver profile API:', driverName);
            } else {
              console.log('❌ No valid name found in driver profile API response');
              setUserName('Driver'); // Final fallback
            }
          } else {
            console.log('❌ No response from driver profile API');
            setUserName('Driver'); // Final fallback
          }
        })
        .catch((err) => {
          console.error('❌ API calls failed:', err);
          setUserName('Driver'); // Final fallback
        });
    } else if (userEmail) {
      // Try driver profile API directly if we have email but no user ID
      console.log('🚀 No user ID found, trying driver profile API with email:', userEmail);
      
      fetch(`http://localhost/RoutePro-backend(02)/public/driver/profile?email=${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(res => {
          console.log('Driver profile API response status:', res.status);
          return res.json();
        })
        .then((data) => {
          console.log('Driver profile API response:', data);
          if (data.success && data.data && data.data.name && data.data.name.trim() !== '') {
            const driverName = data.data.name;
            setUserName(driverName);
            setStatus(data.data.status || 'available');
            localStorage.setItem('userName', driverName);
            console.log('✅ Got driver name from driver profile API:', driverName);
          } else {
            console.log('❌ No valid name found in driver profile API');
            setUserName('Driver'); // Final fallback
          }
        })
        .catch((err) => {
          console.error('❌ Driver profile API failed:', err);
          setUserName('Driver'); // Final fallback
        });
    } else {
      console.error('❌ No user ID or email found anywhere');
      setUserName('Driver'); // Final fallback
    }
  }, [isAuthenticated]);

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

  const updateStatusInBackend = async (newStatus) => {
    try {
      const userEmail = localStorage.getItem('userEmail') || 
                       localStorage.getItem('email');
      
      if (!userEmail) {
        console.error('No user email found for status update');
        return;
      }

      console.log('🔄 Updating driver status to:', newStatus);

      const response = await fetch('http://localhost/RoutePro-backend(02)/public/driver/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          status: newStatus
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('✅ Status updated successfully in backend');
        setStatus(newStatus); // Update local state only after successful backend update
      } else {
        console.error('❌ Failed to update status in backend:', result.message);
        alert(`Failed to update status: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Error updating status:', error);
      alert('Network error while updating status. Please try again.');
    }
  };

  const userId = localStorage.getItem('userId');

  // Don't render dashboard if still loading or not authenticated
  if (isLoading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // useAuthGuard will handle redirect
  }

  return (
    <div className="dashboard">
      {/* Header with Welcome Text + Logout */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {userName || 'Driver'}!</h1>
          <p className="subtitle">Manage your trips and reviews.</p>
        </div>
        <button className="action-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      <DriverHeader status={status} setStatus={setStatus} userId={userId} setUserName={setUserName} />

      {/* Summary Row */}
      <div className="summary-row">
        <div className="summary-card">
          <h2>Active Trips</h2>
          <p>3 Active | 2 Scheduled Today</p>
        </div>
        <div className="summary-card">
          <h2>Average Rating</h2>
          <p>⭐ 4.8 (Based on 127 reviews)</p>
        </div>
        <div className="summary-card status-card">
         <h2>Status</h2>
<p className={`status ${status.toLowerCase()}`}>{status === 'available' ? 'Available' : 'Unavailable'}</p>
<button
  className={`status-toggle ${status.toLowerCase()}`}
  onClick={() => updateStatusInBackend(status === 'available' ? 'nonavailable' : 'available')}
>
  {status === 'available' ? 'Go Unavailable' : 'Go Available'}
</button>

        </div>
      </div>

      {/* View Toggle Buttons */}
      <div className="view-buttons">
        <button
          onClick={() => setActiveView('trip')}
          className={activeView === 'trip' ? 'active' : ''}
        >
          Trip Details
        </button>
        <button
          onClick={() => setActiveView('reviews')}
          className={activeView === 'reviews' ? 'active' : ''}
        >
          Reviews
        </button>
      </div>

      {/* Selected Section */}
      <div className="view-container">
        {activeView === 'trip' && <TripDetails />}
        {activeView === 'reviews' && <ReviewsPanel />}
      </div>
    </div>
  );
};

export default DriverDashboard;
