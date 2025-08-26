import React, { useState } from "react";
import { FaCar, FaPhoneAlt, FaMapMarkerAlt, FaIdCard, FaUser } from "react-icons/fa";
import "./DriverDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import BookConfirmPopup from "./BookConfirmPopup";
import BookingSuccessPopup from "./BookingSuccessPopup";
import drivers from "./driversData";

// Sample reviews for drivers
const sampleReviews = [
  "Very professional and friendly! Highly recommended.",
  "Clean vehicle and safe driving. Will book again!",
  "Excellent service and knows all the best routes.",
  "Punctual and courteous driver, great experience!"
];

export default function DriverDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  
  // Find driver by id (convert string to number)
  const driver = drivers.find(driver => driver.id === parseInt(id));
  
  console.log('DriverDetails - ID from params:', id);
  console.log('DriverDetails - Found driver:', driver);

  if (!driver) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Driver Not Found</h2>
        <p>The driver you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/bookdriver')}>Back to Drivers</button>
      </div>
    );
  }

  const handleBook = () => setShowPopup(true);
  
  const handleConfirm = (selectedDate) => {
    setShowPopup(false);
    setBookingDate(selectedDate);
    setShowSuccess(true);
    // Mark driver as booked by updating the driver object
    const driverIndex = drivers.findIndex(d => d.id === parseInt(id));
    if (driverIndex !== -1) {
      drivers[driverIndex].booked = true;
      drivers[driverIndex].bookedDate = selectedDate; // Store the booking date
    }
    console.log(`Driver booked for date: ${selectedDate}`);
  };

  const handleCancel = () => setShowPopup(false);
  
  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/bookdriver'); // Navigate back to booking page
  };

  // Render stars for rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "star filled" : "star"}>
        ★
      </span>
    ));
  };

  // Get random reviews for this driver
  const driverReviews = sampleReviews.slice(0, 2);

  return (
    <div className="driver-details-page">
      <div style={{padding: '20px', background: 'red', color: 'white', fontSize: '24px'}}>
        DRIVER DETAILS COMPONENT IS RENDERING - ID: {id} - Driver Found: {driver ? 'YES' : 'NO'}
      </div>
      <div className="driver-details-window">
        {/* Book Now Button - Top Right Corner */}
        <button className="book-now-corner" onClick={handleBook}>
          Book Now
        </button>
        
        <div className="driver-details-content">
          {/* Left Side - Driver Image and Reviews */}
          <div className="driver-left-section">
            <div className="driver-image-container">
              <img 
                src={driver.image} 
                alt={driver.name} 
                className="driver-detail-image"
              />
            </div>
            
            {/* Reviews Below Image */}
            <div className="driver-reviews-section">
              <h4>Customer Reviews</h4>
              <div className="reviews-list">
                {driverReviews.map((review, index) => (
                  <div key={index} className="review-item">
                    <FaUser className="review-icon" />
                    <span className="review-text">"{review}"</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Driver Details */}
          <div className="driver-right-section">
            <div className="driver-header">
              <h2>{driver.name}</h2>
              <div className="driver-rating">
                {renderStars(driver.rating)}
                <span className="rating-number">({driver.rating}/5)</span>
              </div>
            </div>

            <div className="driver-info-grid">
              <div className="info-item">
                <FaMapMarkerAlt className="info-icon" />
                <div>
                  <label>Location:</label>
                  <span>{driver.city}</span>
                </div>
              </div>

              <div className="info-item">
                <FaCar className="info-icon" />
                <div>
                  <label>Vehicle:</label>
                  <span>{driver.vehicle}</span>
                </div>
              </div>

              <div className="info-item">
                <FaIdCard className="info-icon" />
                <div>
                  <label>License:</label>
                  <span>{driver.license}</span>
                </div>
              </div>

              <div className="info-item">
                <FaPhoneAlt className="info-icon" />
                <div>
                  <label>Contact:</label>
                  <span>{driver.contact}</span>
                </div>
              </div>

              <div className="info-item">
                <FaUser className="info-icon" />
                <div>
                  <label>Experience:</label>
                  <span>{driver.experience} years</span>
                </div>
              </div>

              <div className="info-item">
                <FaPhoneAlt className="info-icon" />
                <div>
                  <label>Email:</label>
                  <span>{driver.email}</span>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="driver-badges">
              {driver.verified && <span className="badge verified">✓ Verified</span>}
              {driver.recommended && <span className="badge recommended">⭐ Recommended</span>}
              <span className={`badge ${driver.availability === 'Available' ? 'available' : 'unavailable'}`}>
                {driver.availability}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Popups */}
      {showPopup && (
        <BookConfirmPopup
          item={driver}
          type="driver"
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      )}
      {showSuccess && (
        <BookingSuccessPopup 
          onClose={handleSuccessClose} 
          contact={driver.contact} 
          bookingDate={bookingDate}
        />
      )}
    </div>
  );
}
