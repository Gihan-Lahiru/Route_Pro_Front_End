import React from 'react';
import './PopularDestinations.css';

import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';


const destinations = [
  {
    name: "Sigiriya Rock Fortress",
    province: "Central Province",
    rating: 4.9,
    image: "/images/sigiriya.jpeg", 
    description: "Ancient palace built on a massive rock formation with stunning views and historical significance.",
    tags: ["UNESCO World Heritage", "Ancient Frescoes", "Lion's Gate"]
  },
  {
    name: "Ella Rock",
    province: "Uva Province",
    rating: 4.8,
    image: "/images/ella.jpeg", 
    description: "Breathtaking hiking destination with panoramic views of tea plantations and valleys.",
    tags: ["Hiking Trails", "Tea Plantations", "Nine Arch Bridge"]
  },
  {
    name: "Yala National Park",
    province: "Southern Province",
    rating: 4.9,
    image: "/images/yala.jpeg", 
    description: "Premier wildlife sanctuary famous for leopards, elephants, and diverse bird species.",
    tags: ["Wildlife Safari", "Leopard Spotting", "Bird Watching"]
  },
  {
    name: "Temple of thr Tooth",
    province: "Central Province",
    rating: 4.9,
    image: "/images/temple.jpeg",
    description: "Sacred Buddhist temple housing the relic of Buddha's tooth, a UNESCO World Heritage site.",
    tags: ["Buddhist Temple", "Cultural Heritage", "Sacred Relic"]
  },
  {
    name: "Yala National Park",
    province: "Southern Province",
    rating: 4.9,
    image: "/images/yala.jpeg", 
    description: "Premier wildlife sanctuary famous for leopards, elephants, and diverse bird species.",
    tags: ["Wildlife Safari", "Leopard Spotting", "Bird Watching"]
  },
  {
    name: "Temple of thr Tooth",
    province: "Central Province",
    rating: 4.9,
    image: "/images/temple.jpeg",
    description: "Sacred Buddhist temple housing the relic of Buddha's tooth, a UNESCO World Heritage site.",
    tags: ["Buddhist Temple", "Cultural Heritage", "Sacred Relic"]
  }
];

const PopularDestinations = () => {
  return (
    <div className="destinations-section">
      <h1>
        Popular <span className="highlight">Destinations</span>
      </h1>
      <p>
        Explore the most beloved destinations in Sri Lanka, carefully curated for unforgettable experiences and cultural immersion.
      </p>

      <div className="cards-container">
        {destinations.map((item, index) => (
          <div className="destination-card" key={index}>
            <div
              className="destination-image"
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className="rating-badge">
                <FaStar className="star" /> {item.rating}
              </div>
              <div className="destination-title">
                <h2>{item.name}</h2>
                <p><FaMapMarkerAlt /> <strong className="province-highlight">{item.province}</strong></p>

              </div>
            </div>
            <div className="destination-body">
              <p>{item.description}</p>
              <div className="tags">
                {item.tags.map((tag, idx) => (
                  <span className="tag" key={idx}>{tag}</span>
                ))}
              </div>
              <button className="learn-more-btn">Learn More →</button>
            </div>
          </div>
        ))}
      </div>
      <div>
              <button className="learn-more-btn">Explore All Destinations →</button>
            </div>
    </div>
  );
};

export default PopularDestinations;
