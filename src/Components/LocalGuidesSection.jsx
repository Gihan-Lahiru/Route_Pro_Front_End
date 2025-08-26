// LocalGuidesSection.jsx
import React from "react";
import "./LocalGuidesSection.css";
import { useNavigate } from "react-router-dom";
import guides from "./guidesData";

const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < rating ? "star filled" : "star"}>
      &#9733;
    </span>
  ));
};

export default function LocalGuidesSection() {
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
  
  // Helper function to check if a guide is available for selected dates
  const isGuideAvailable = (guide) => {
    // If already marked as booked entirely, not available
    if (guide.booked && guide.availability !== "Available") {
      return false;
    }
    
    // If no trip dates selected or invalid, show all "Available" guides
    if (!tripDates || !tripDates.fromDate || !tripDates.toDate) {
      return guide.availability === "Available";
    }
    
    // Selected trip dates
    const requestStart = new Date(tripDates.fromDate);
    const requestEnd = new Date(tripDates.toDate);
    
    // Check if any of the guide's bookings overlap with requested dates
    const hasOverlappingBooking = guide.bookings.some(booking => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      
      // Check for overlap
      return (bookingStart <= requestEnd && bookingEnd >= requestStart);
    });
    
    // Guide is available if there's no overlap with existing bookings
    return !hasOverlappingBooking && guide.availability === "Available";
  };
  
  // Filter guides based on availability during selected trip dates
  const availableGuides = guides.filter(isGuideAvailable);
  
  return (
    <section className="guides-section">
      <h2>MEET YOUR LOCAL GUIDES</h2>
      <p className="subtitle">
        {tripDates && tripDates.fromDate && tripDates.toDate ? 
          `Expert local guides available from ${new Date(tripDates.fromDate).toLocaleDateString()} to ${new Date(tripDates.toDate).toLocaleDateString()}!` : 
          "Expert local guides to unlock the hidden gems of Sri Lanka!"}
      </p>
      <div className="cards">
        {availableGuides.map((guide) => (
          <article key={guide.id} className="guide-card">
            <div className="image-container">
              <img src={guide.image} alt={guide.name} className="guide-image" />
              <span className="price-badge">{guide.availability}</span>
              {guide.verified && <span className="badge verified">Verified</span>}
              {guide.recommended && <span className="badge recommended">Recommended</span>}
            </div>
            <div className="card-body">
              <h3>{guide.name}</h3>
              <ul className="guide-info">
                <li>🌍 {guide.specialization}</li>
                <li>📍 {guide.location}</li>
                <li>⭐ {renderStars(guide.rating)} ({guide.reviews} reviews)</li>
              </ul>
              <button className="view-details-btn" onClick={() => navigate(`/guide/${guide.id}`)}>View Details</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
