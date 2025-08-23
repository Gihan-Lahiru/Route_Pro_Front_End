//import React from 'react';
// import './DriverHeader.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DriverHeader.css";

const DriverHeader = () => {
  const [status, setStatus] = useState("Available");
  const [activeView, setActiveView] = useState("trip");
  //const [userName, setUserName] = useState('');
  const [driverInfo, setDriverInfo] = useState({
    name: "",
    phone: "",
    status: "",
    license_no: "",
    vehicle_type: "",
    experience: "",
    location: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    fetch(
      `http://localhost/RoutePro-backend/get_driver_info.php?userId=${userId}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setDriverInfo({
            name: data.name,
            phone: data.phone,
            status: data.status,
            license_no: data.license_no,
            vehicle_type: data.vehicle_type,
            experience: data.experience,
            location: data.location,
          });
          setStatus(data.status); // Also update the status display
        } else {
          console.error("Error fetching driver info:", data.error);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

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
        {/* <div className="status-display">
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
