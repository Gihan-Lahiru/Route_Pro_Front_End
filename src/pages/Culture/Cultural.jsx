import React, { useState } from "react";
import "./Cultural.css";

// All 24 districts (you can add more)
const allDistricts = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar",
  "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee",
  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa",
  "Badulla", "Monaragala", "Ratnapura", "Kegalle"
];

// Example data structure — extend this!
const eventsData = {
  "Most Favorites": [
    {
      id: 1,
      title: "Kandy Esala Perahera",
      image: "/images/esala-perahera.jpg",
      month: "July - August",
      location: "Kandy",
      description: "A spectacular procession with elephants, dancers and fire shows."
    },
    {
      id: 2,
      title: "Sri Lankan Rice & Curry",
      image: "/images/rice-curry.jpg",
      month: "All Year",
      location: "Islandwide",
      description: "A classic Sri Lankan meal served with rice, lentils, curries and sambols."
    },
    {
      id: 3,
      title: "Colombo Street Food Festival",
      image: "/images/kottu-roti.jpg",
      month: "Every Month",
      location: "Colombo",
      description: "Taste authentic street food: kottu, hoppers and more."
    },
    {
      id: 4,
      title: "Galle Seafood Fiesta",
      image: "/images/galleseafood.jpg",
      month: "November",
      location: "Galle",
      description: "Enjoy fresh seafood and coastal cuisine."
    }
  ],
  Kandy: [
    {
      id: 1,
      title: "Kandy Esala Perahera",
      image: "/images/esala-perahera.jpg",
      month: "July - August",
      location: "Kandy City",
      description: "A historic Buddhist festival with majestic tuskers."
    },
    {
      id: 2,
      title: "Temple of the Tooth",
      image: "/images/dalada-maligawa.jpg",
      month: "All Year",
      location: "Kandy",
      description: "Visit the sacred temple where Buddha's tooth relic is kept."
    },
    {
      id: 3,
      title: "Kandy Snacks",
      image: "/images/kandy_food.jpg",
      month: "All Year",
      location: "Kandy Markets",
      description: "Try local sweets like kavum, kokis and milk rice."
    },
    {
      id: 4,
      title: "Peradeniya Gardens",
      image: "/images/garden.jpg",
      month: "All Year",
      location: "Peradeniya",
      description: "A beautiful botanical garden with exotic plants."
    }
  ],
  Colombo: [
    {
      id: 1,
      title: "Navam Perahera",
      image: "/images/navam.jpg",
      month: "February",
      location: "Gangaramaya Temple",
      description: "A colorful night parade in Colombo."
    },
    {
      id: 2,
      title: "Colombo Street Food",
      image: "/images/colombo_food.jpg",
      month: "All Year",
      location: "Galle Face",
      description: "Sample kottu, isso wade, and ice cream by the ocean."
    },
    {
      id: 3,
      title: "Colombo Night Market",
      image: "/images/market.jpg",
      month: "Every Friday",
      location: "Colombo City",
      description: "Street food, music and local handicrafts."
    },
    {
      id: 4,
      title: "Dutch Hospital Dining",
      image: "/images/dutch.jpg",
      month: "All Year",
      location: "Fort, Colombo",
      description: "Trendy eateries in a colonial setting."
    }
  ]
  // ➜ Add more districts the same way!
};

export default function Cultural() {
  const [selectedDistrict, setSelectedDistrict] = useState("Most Favorites");

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const selectedData = eventsData[selectedDistrict] || eventsData["Most Favorites"];

  return (
    <div className="cultural-container">
      <h1>Discover Sri Lankan foods and festivals</h1>
      <p>Explore the rich cultural heritage and delicious cuisine of the Pearl of the Indian Ocean</p>

      <select value={selectedDistrict} onChange={handleDistrictChange}>
        <option value="Most Favorites">All Districts (Most Favorites)</option>
        {allDistricts.map((district) => (
          <option key={district} value={district}>{district}</option>
        ))}
      </select>

      <div className="cards-grid">
        {selectedData.map((item) => (
          <div className="card" key={item.id}>
            <img src={item.image} alt={item.title} />
            <div className="card-content">
              <h3>{item.title}</h3>
              <p><strong>Month:</strong> {item.month}</p>
              <p><strong>Location:</strong> {item.location}</p>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="selected-district-text">
  Showing the most popular cultural events and foods across  <strong>{selectedDistrict}</strong>
</p>

    </div>
  );
}
