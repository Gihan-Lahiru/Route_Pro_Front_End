// DriversSection.jsx
import React from "react";
import "./DriversSection.css";
import { useNavigate } from "react-router-dom";
import drivers from "./driversData";

const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < rating ? "star filled" : "star"}>
      &#9733;
    </span>
  ));
};

export default function DriversSection() {
  const navigate = useNavigate();
  
  // Get trip dates from localStorage
  const tripDatesStr = localStorage.getItem('tripDates');
  let tripDates = null;
  
  if (tripDatesStr) {
    try {
      tripDates = JSON.parse(tripDatesStr);
    } catch (error) {
      console.log('Error parsing trip dates');
    }
  }
  
  // Helper function to check if a driver is available for selected dates
  const isDriverAvailable = (driver) => {
    // If already marked as booked entirely, not available
    if (driver.booked && driver.availability !== "Available") {
      return false;
    }
    
    // If no trip dates selected or invalid, show all "Available" drivers
    if (!tripDates || !tripDates.fromDate || !tripDates.toDate) {
      return driver.availability === "Available";
    }
    
    // Selected trip dates
    const requestStart = new Date(tripDates.fromDate);
    const requestEnd = new Date(tripDates.toDate);
    
    // Check if any of the driver's bookings overlap with requested dates
    const hasOverlappingBooking = driver.bookings.some(booking => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      
      // Check for overlap
      return (bookingStart <= requestEnd && bookingEnd >= requestStart);
    });
    
    // Driver is available if there's no overlap with existing bookings
    return !hasOverlappingBooking && driver.availability === "Available";
  };
  
  // Filter drivers based on availability during selected trip dates
  const availableDrivers = drivers.filter(isDriverAvailable);
  
  return (
    <section className="drivers-section">
      <h2>MEET YOUR LOCAL DRIVERS</h2>
      <p className="subtitle">
        {tripDates && tripDates.fromDate && tripDates.toDate ? 
          `Professional, verified drivers available from ${new Date(tripDates.fromDate).toLocaleDateString()} to ${new Date(tripDates.toDate).toLocaleDateString()}!` : 
          "Professional, verified drivers ready to make your journey memorable!"}
      </p>
      <div className="cards">
        {availableDrivers.map((driver) => (
          <article key={driver.id} className="driver-card">
            <div className="image-container">
              <img src={driver.image} alt={driver.name} className="driver-image" />
              <span className="price-badge">{driver.availability}</span>
              {driver.verified && <span className="badge verified">Verified</span>}
              {driver.recommended && <span className="badge recommended">Recommended</span>}
            </div>
            <div className="card-body">
              <h3>{driver.name}</h3>
              <ul className="driver-info">
                <li>🚗 {driver.vehicle}</li>
                <li>📍 {driver.location}</li>
                <li>✅ {driver.license}</li>
              </ul>
              <button className="view-details-btn" onClick={() => navigate(`/driver/${driver.id}`)}>View Details</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

