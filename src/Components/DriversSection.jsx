// DriversSection.jsx
import React, { useState } from "react";
import "./DriversSection.css";

const drivers = [
  {
    name: "Cabral 422",
    image: "/images/driver1.jpg",
    reviews: 4,
    rating: 5,
    location: "Negombo",
    vehicle: "Car (2 Pax)",
    license: "Private Chauffeur Guide",
    verified: true,
    recommended: false,
    availability: "Available",
    email: "cabral422@email.com",
    mobile: "+94 71 123 4567",
  },
  {
    name: "Silva 012",
    image: "/images/driver2.jpg",
    reviews: 5,
    rating: 5,
    location: "Colombo",
    vehicle: "Car (2 Pax)",
    license: "Private Chauffeur Guide",
    verified: true,
    recommended: true,
    availability: "Not Available",
    email: "silva012@email.com",
    mobile: "+94 77 222 3333",
  },
  {
    name: "Silva 012",
    image: "/images/driver2.jpg",
    reviews: 5,
    rating: 5,
    location: "Colombo",
    vehicle: "Car (2 Pax)",
    license: "Private Chauffeur Guide",
    verified: true,
    recommended: true,
    availability: "Available",
    email: "silva012@email.com",
    mobile: "+94 77 222 3333",
  },
  {
    name: "Silva 012",
    image: "/images/driver2.jpg",
    reviews: 5,
    rating: 5,
    location: "Colombo",
    vehicle: "Car (2 Pax)",
    license: "Private Chauffeur Guide",
    verified: true,
    recommended: true,
    availability: "Available",
    email: "silva012@email.com",
    mobile: "+94 77 222 3333",
  },
  {
    name: "Silva 012",
    image: "/images/driver2.jpg",
    reviews: 5,
    rating: 5,
    location: "Colombo",
    vehicle: "Car (2 Pax)",
    license: "Private Chauffeur Guide",
    verified: true,
    recommended: true,
    availability: "Available",
    email: "silva012@email.com",
    mobile: "+94 77 222 3333",
  },
  {
    name: "Silva 012",
    image: "/images/driver2.jpg",
    reviews: 5,
    rating: 5,
    location: "Colombo",
    vehicle: "Car (2 Pax)",
    license: "Private Chauffeur Guide",
    verified: true,
    recommended: true,
    availability: "Not Available",
    email: "silva012@email.com",
    mobile: "+94 77 222 3333",
  },
  {
    name: "Silva 012",
    image: "/images/driver2.jpg",
    reviews: 5,
    rating: 5,
    location: "Colombo",
    vehicle: "Car (2 Pax)",
    license: "Private Chauffeur Guide",
    verified: true,
    recommended: true,
    availability: "Not Available",
    email: "silva012@email.com",
    mobile: "+94 77 222 3333",
  },
  {
    name: "Silva 012",
    image: "/images/driver2.jpg",
    reviews: 5,
    rating: 5,
    location: "Colombo",
    vehicle: "Car (2 Pax)",
    license: "Private Chauffeur Guide",
    verified: true,
    recommended: true,
    availability: "Available",
    email: "silva012@email.com",
    mobile: "+94 77 222 3333",
  },
  // ➜ Add more drivers with email & mobile too!
];

const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < rating ? "star filled" : "star"}>
      &#9733;
    </span>
  ));
};

export default function DriversSection() {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [bookedMessage, setBookedMessage] = useState("");

  const handleDriverClick = (driver) => {
    setSelectedDriver(driver);
    setBookedMessage("");
  };

  const handleCloseModal = () => {
    setSelectedDriver(null);
    setBookedMessage("");
  };

  const handleBookNow = () => {
    setBookedMessage("✅ Booking confirmed! Thank you.");
  };

  return (
    <section className="drivers-section">
      <h2>MEET YOUR LOCAL DRIVERS</h2>
      <p className="subtitle">Over 200+ drivers with 800+ amazing reviews!</p>
      <div className="cards">
        {drivers.map((driver, index) => (
          <article
            key={index}
            className="driver-card"
            onClick={() => handleDriverClick(driver)}
          >
            <div className="image-container">
              <img
                src={driver.image}
                alt={driver.name}
                className="driver-image"
              />
              <span className="price-badge">{driver.availability}</span>
              {driver.verified && (
                <span className="badge verified">Verified</span>
              )}
              {driver.recommended && (
                <span className="badge recommended">Recommended</span>
              )}
            </div>
            <div className="card-body">
              <div className="rating">{renderStars(driver.rating)}</div>
              <h3>{driver.name}</h3>
              <ul className="driver-info">
                <li>🚗 {driver.vehicle}</li>
                <li>🌐 English</li>
                <li>📍 {driver.location}</li>
                <li>✅ {driver.license}</li>
              </ul>
            </div>
          </article>
        ))}
      </div>

      {selectedDriver && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>
              &times;
            </button>
            <img
              src={selectedDriver.image}
              alt={selectedDriver.name}
              className="driver-image"
            />
            <h3>{selectedDriver.name}</h3>
            <p>📍 {selectedDriver.location}</p>
            <p>📧 {selectedDriver.email}</p>
            <p>📞 {selectedDriver.mobile}</p>
            <div className="rating">{renderStars(selectedDriver.rating)}</div>
            <p>Reviews: {selectedDriver.reviews}</p>
            {!bookedMessage && (
              <button className="book-now" onClick={handleBookNow}>
                Book Now
              </button>
            )}
            {bookedMessage && (
              <p className="booking-message">{bookedMessage}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
