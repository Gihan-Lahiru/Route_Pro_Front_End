// LocalGuidesSection.jsx
import React, { useState } from "react";
import "./LocalGuidesSection.css";

const guides = [
  {
    name: "Ayesha Kumar",
    image: "/images/guide1.jpg",
    rating: 5,
    availability: "Available",
    languages: ["English", "Sinhala", "Tamil"],
    hometown: "Colombo",
    email: "ayesha.kumar@email.com",
    mobile: "+94 77 987 6543",
    reviews: 25,
  },
  {
    name: "Rohan Perera",
    image: "/images/guide2.jpg",
    rating: 4,
    availability: "Not Available",
    languages: ["English", "Sinhala"],
    hometown: "Kandy",
    email: "rohanp@email.com",
    mobile: "+94 76 111 2233",
    reviews: 17,
  },
  {
    name: "Rohan Perera",
    image: "/images/guide2.jpg",
    rating: 4,
    availability: "Available",
    languages: ["English", "Sinhala"],
    hometown: "Kandy",
    email: "rohanp@email.com",
    mobile: "+94 76 111 2233",
    reviews: 17,
  },
  {
    name: "Rohan Perera",
    image: "/images/guide2.jpg",
    rating: 4,
    availability: "Available",
    languages: ["English", "Sinhala"],
    hometown: "Kandy",
    email: "rohanp@email.com",
    mobile: "+94 76 111 2233",
    reviews: 17,
  },
  {
    name: "Rohan Perera",
    image: "/images/guide2.jpg",
    rating: 4,
    availability: "Not Available",
    languages: ["English", "Sinhala"],
    hometown: "Kandy",
    email: "rohanp@email.com",
    mobile: "+94 76 111 2233",
    reviews: 17,
  },
  {
    name: "Rohan Perera",
    image: "/images/guide2.jpg",
    rating: 4,
    availability: "Available",
    languages: ["English", "Sinhala"],
    hometown: "Kandy",
    email: "rohanp@email.com",
    mobile: "+94 76 111 2233",
    reviews: 17,
  },
  {
    name: "Rohan Perera",
    image: "/images/guide2.jpg",
    rating: 4,
    availability: "Available",
    languages: ["English", "Sinhala"],
    hometown: "Kandy",
    email: "rohanp@email.com",
    mobile: "+94 76 111 2233",
    reviews: 17,
  },
  {
    name: "Rohan Perera",
    image: "/images/guide2.jpg",
    rating: 4,
    availability: "Not Available",
    languages: ["English", "Sinhala"],
    hometown: "Kandy",
    email: "rohanp@email.com",
    mobile: "+94 76 111 2233",
    reviews: 17,
  },
  
  // ➜ Add more guides with email & mobile too!
];

const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < rating ? "star filled" : "star"}>
      &#9733;
    </span>
  ));
};

export default function LocalGuidesSection() {
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [bookedMessage, setBookedMessage] = useState("");

  const handleGuideClick = (guide) => {
    setSelectedGuide(guide);
    setBookedMessage("");
  };

  const handleCloseModal = () => {
    setSelectedGuide(null);
    setBookedMessage("");
  };

  const handleBookNow = () => {
    setBookedMessage("✅ Booking confirmed! Thank you.");
  };

  return (
    <section className="drivers-section">
      <div className="container">
        <h2>
          MEET YOUR <span className="highlight">LOCAL GUIDES</span>
        </h2>
        <p className="subtitle">Friendly guides ready to show you around!</p>
        <div className="cards">
          {guides.map((guide, index) => (
            <article
              key={index}
              className="driver-card"
              onClick={() => handleGuideClick(guide)}
            >
              <img
                src={guide.image}
                alt={guide.name}
                className="driver-image"
              />
              <span className="abvailability-badge">{guide.availability}</span>
              <div className="card-body">
                <div className="rating">{renderStars(guide.rating)}</div>
                <h3>{guide.name}</h3>
                <ul className="driver-info">
                  <li>
                    <strong>Languages:</strong> {guide.languages.join(", ")}
                  </li>
                  <li>
                    <strong>Hometown:</strong> {guide.hometown}
                  </li>
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedGuide && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>
              &times;
            </button>
            <img
              src={selectedGuide.image}
              alt={selectedGuide.name}
              className="driver-image"
            />
            <h3>{selectedGuide.name}</h3>
            <p>📍 {selectedGuide.hometown}</p>
            <p>📧 {selectedGuide.email}</p>
            <p>📞 {selectedGuide.mobile}</p>
            <div className="rating">{renderStars(selectedGuide.rating)}</div>
            <p>Reviews: {selectedGuide.reviews}</p>
            <p>
              <strong>Languages:</strong> {selectedGuide.languages.join(", ")}
            </p>
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
