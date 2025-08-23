import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DriverHeader.css";

const DriverHeader = () => {
  const [status, setStatus] = useState("Available");
  const [activeView, setActiveView] = useState("trip");
  const [driverInfo, setDriverInfo] = useState({
    name: '',
    phone: '',
    email: '',
    status: '',
    license_no: '',
    vehicle_type: '',
    experience: '',
    location: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Get the logged-in user's email from localStorage (set during login)
    const userEmail = localStorage.getItem('userEmail') || 
                     localStorage.getItem('email') ||
                     'admin@gmail.com'; // Fallback for testing

    console.log('🚀 Fetching driver data for logged-in user:', userEmail);

    // Use proper DriverController endpoint with email parameter
    fetch(`http://localhost/RoutePro-backend(02)/public/driver/profile?email=${encodeURIComponent(userEmail)}`, {
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
          setDriverInfo({
            name: data.data.name || '',
            phone: data.data.phone || '',
            email: data.data.email || '',
            status: data.data.status || 'Available',
            license_no: data.data.license_no || '',
            vehicle_type: data.data.vehicle_type || '',
            experience: data.data.experience || '',
            location: data.data.location || '',
          });
          setStatus(data.data.status || 'Available'); // Update status display
        } else {
          console.error('Error fetching driver info:', data.message || 'Unknown error');
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
    navigate("/homepage");
  };

  const userId = localStorage.getItem("userId");

  return (
    <div className="driver-header">
      <img src="/images/guide1.jpg" alt="Driver" className="driver-photo" />

      <div className="driver-info">
        <h2>{driverInfo.name || "Driver"}</h2>
        <p>⭐ 4.7 (1247 rides)</p>
        <p>
          <strong>Vehicle:</strong> {driverInfo.vehicle_type || "Not specified"}
        </p>
        <p>
          <strong>License No:</strong> {driverInfo.license_no || "N/A"}
        </p>
        <p>
          <strong>Experience:</strong> {driverInfo.experience} years
        </p>
        <p>
          <strong>Location:</strong> {driverInfo.location || "Unknown"}
        </p>
        <p>
          <strong>Contact:</strong> {driverInfo.phone || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {driverInfo.email || "N/A"}
        </p>
        
        <div className="status-display">
          <span>Status: </span>
          <span className={`status-label ${status.toLowerCase()}`}>{status}</span>
        </div>
      </div>

      {/* 📊 Earnings Summary Panel */}
      <div className="earnings-column">
        <div className="earning-card">
          <h4>Today</h4>
          <p>$285</p>
        </div>
        <div className="earning-card">
          <h4>This Week</h4>
          <p>$1250</p>
        </div>
        <div className="earning-card">
          <h4>This Month</h4>
          <p>$4850</p>
        </div>
      </div>
    </div>
  );
};

export default DriverHeader;