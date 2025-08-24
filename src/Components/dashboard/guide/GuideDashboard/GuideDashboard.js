import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Add this
import TripDetails from '../TripDetails/TripDetails';
import Availability from '../Availability/Availability';
import ReviewsPanel from '../ReviewsPanel/ReviewsPanel';
import './GuideDashboard.css';
import GuideHeader from '../GuideHeader/GuideHeader';

const GuideDashboard = () => {
  const [status, setStatus] = useState('Available');
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
    // Optional: clear localStorage if needed
    navigate('/homepage');
  };
 const userId = localStorage.getItem('userId');

  
  return (
    <div className="dashboard">
      {/* Header with Welcome Text + Logout */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {userName || 'Guide'}!</h1>
          <p className="subtitle">Manage your trips, availability and reviews.</p>
        </div>
        <button className="action-button" onClick={handleLogout}>Log Out</button>
      </div>

      {/* Status toggle header */}
      <GuideHeader status={status} setStatus={setStatus} userId={userId} />

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
         
          <p className={`status ${status.toLowerCase()}`}>{status}</p>
<button
  className={`status-toggle ${status.toLowerCase()}`}
  onClick={() =>
    setStatus(status === 'Available' ? 'Unavailable' : 'Available')
  }
>
  {status === 'Available' ? 'Go Unavailable' : 'Go Available'}
</button>
        </div>
      </div>

      {/* View Toggle Buttons */}
      <div className="view-buttons">
        <button onClick={() => setActiveView('trip')} className={activeView === 'trip' ? 'active' : ''}>Trip Details</button>
        <button onClick={() => setActiveView('availability')} className={activeView === 'availability' ? 'active' : ''}>Availability</button>
        <button onClick={() => setActiveView('reviews')} className={activeView === 'reviews' ? 'active' : ''}>Reviews</button>
      </div>

      {/* Selected Section */}
      <div className="view-container">
        {activeView === 'trip' && <TripDetails />}
        {activeView === 'availability' && <Availability status={status} setStatus={setStatus} />}
        {activeView === 'reviews' && <ReviewsPanel />}
      </div>
    </div>
  );
};

export default GuideDashboard;
