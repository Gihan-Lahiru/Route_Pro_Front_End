import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GuideHeader.css';

const GuideHeader = () => {
  const [status, setStatus] = useState('Available');
  const [activeView, setActiveView] = useState('trip');
  //const [userName, setUserName] = useState('');
  const [guiderInfo, setGuiderInfo] = useState({
  name: '',
  phone: '',
  email: '',
  status: '',
  license_no: '',
  nic: '',
  languages: '',
  experience: '',
  location: '',
});

  const navigate = useNavigate();

  useEffect(() => {
    // Get the logged-in user's email from localStorage (set during login)
    const userEmail = localStorage.getItem('userEmail') || 
                     localStorage.getItem('email') ||
                     'priya@guide.com'; // Fallback for testing

    console.log('🚀 Fetching guide data for logged-in user:', userEmail);

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
          setGuiderInfo({
            name: data.data.name || '',
            phone: data.data.phone || '',
            email: data.data.email || '',
            status: data.data.status || 'Available',
            license_no: data.data.license_no || '',
            nic: data.data.nic || '',
            languages: data.data.languages || '',
            experience: data.data.experience || '',
            location: data.data.location || '',
          });
          setStatus(data.data.status || 'Available'); // Update status display
        } else {
          console.error('Error fetching guide info:', data.message || 'Unknown error');
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        // Handle network errors or authentication failures
        if (err.message.includes('401') || err.message.includes('403')) {
          navigate('/login'); // Redirect to login if unauthorized
        }
      });
  }, [navigate]);

  const handleLogout = () => {
    // Optional: clear localStorage if needed
    navigate('/homepage');
  };

  const userId = localStorage.getItem('userId');



  return (
    <div className="driver-header">
      <img src="images/guiderUser.png" alt="Driver" className="driver-photo" />
<div className="guide-info">
  <h2>{guiderInfo.name}</h2>
  <p>⭐ 4.9 (362 tours)</p>
  <p><strong>license_no:</strong>  {guiderInfo.license_no || 'Not specified'}</p>
  <p><strong>location:</strong>  {guiderInfo.location || 'Unknown'}</p>
  <p><strong>Guiding Experience:</strong> {guiderInfo.experience} years</p>
  <p><strong>Contact:</strong> {guiderInfo.phone || 'N/A'}</p>
  {/* <div className="status-display">
    <span>Status: </span>
    <span className={`status-label ${status.toLowerCase()}`}>{status}</span>
  </div> */}
</div>

      {/* 📊 Earnings Summary Panel */}
      <div className="earnings-column">
        <div className="earning-card">
          <h4>Today</h4>
          <p>Rs 50</p>
        </div>
        <div className="earning-card">
          <h4>This Week</h4>
          <p>Rs 1250</p>
        </div>
        <div className="earning-card">
          <h4>This Month</h4>
          <p>Rs 15000</p>
        </div>
      </div>
    </div>
  );
};

export default GuideHeader;
