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
  status: '',
  license_no: '',
  languages: '',
  experience: '',
  location: '',
});

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    fetch(`http://localhost/RoutePro-backend/get_guider_info.php?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
  setGuiderInfo({
    name: data.name,
    phone: data.phone,
    status: data.status,
    license_no: data.license_no,
    experience: data.experience,
    location: data.location,
  });
  setStatus(data.status); // Also update the status display
} else {
  console.error('Error fetching guider info:', data.error);
}

      
      })
      .catch((err) => console.error('Fetch error:', err));
  }, []);

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
