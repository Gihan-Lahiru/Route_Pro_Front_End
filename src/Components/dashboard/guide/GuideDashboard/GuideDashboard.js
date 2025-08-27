import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Add this
import TripDetails from '../TripDetails/TripDetails';
import ReviewsPanel from '../ReviewsPanel/ReviewsPanel';
import './GuideDashboard.css';
import GuideHeader from '../GuideHeader/GuideHeader';

const GuideDashboard = () => {
  const [status, setStatus] = useState('available');
  const [activeView, setActiveView] = useState('trip');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate(); // 👈 Initialize useNavigate

  useEffect(() => {
    // Get the logged-in user's email from localStorage (set during login)
    const userEmail = localStorage.getItem('userEmail') || 
                     localStorage.getItem('email') ||
                     'priya@guide.com'; // Fallback for testing

    console.log('🚀 Fetching guide data for dashboard:', userEmail);

    // Use proper GuideController endpoint with email parameter
    fetch(`http://localhost/RoutePro-backend(02)/public/guide/profile?email=${encodeURIComponent(userEmail)}`, {
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
          setUserName(data.data.name || 'Guide');
          setStatus(data.data.status || 'available'); // Update status from backend
        } else {
          console.error('Error fetching guide info:', data.message || 'Unknown error');
          setUserName('Guide'); // Fallback
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setUserName('Guide'); // Fallback
      });
  }, []);

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
    
    // Dispatch custom event to notify Header component
    window.dispatchEvent(new Event('localStorageCleared'));
    
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

      console.log('🔄 Updating guide status to:', newStatus);

      const response = await fetch('http://localhost/RoutePro-backend(02)/public/guide/status', {
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

  
  return (
    <div className="dashboard">
      {/* Header with Welcome Text + Logout */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {userName || 'Guide'}!</h1>
          <p className="subtitle">Manage your trips and reviews.</p>
        </div>
        <button className="action-button" onClick={handleLogout}>Log Out</button>
      </div>

      {/* Status toggle header */}
      <GuideHeader status={status} setStatus={setStatus} userId={userId} setUserName={setUserName} />

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
        <button onClick={() => setActiveView('trip')} className={activeView === 'trip' ? 'active' : ''}>Trip Details</button>
        <button onClick={() => setActiveView('reviews')} className={activeView === 'reviews' ? 'active' : ''}>Reviews</button>
      </div>

      {/* Selected Section */}
      <div className="view-container">
        {activeView === 'trip' && <TripDetails />}
        {activeView === 'reviews' && <ReviewsPanel />}
      </div>
    </div>
  );
};

export default GuideDashboard;
