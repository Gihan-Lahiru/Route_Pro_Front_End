import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MapComponent from "./MapComponent";
import "./RoutePlanner.css";

const RoutePlanner = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [routeDetails, setRouteDetails] = useState({ distance: null, duration: null });
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const navigate = useNavigate();

  const calculateEstimatedPrice = () => {
    const baseRate = 0.2;
    const distanceInKm = routeDetails.distance ? parseFloat(routeDetails.distance) / 1000 : 0;
    return (baseRate * distanceInKm).toFixed(2);
  };

  const estimatedPrice = calculateEstimatedPrice();

  const handleConfirm = async () => {
    if (!from || !to || !vehicle) {
      alert("Please fill in all fields.");
      return;
    }

    // Ask MapComponent to get the route (indirectly)
    alert("Wait a moment... Route and attractions will load on the map. Click the button again to confirm save.");

    // First click: triggers MapComponent to populate routeDetails & nearbyPlaces
    // Second click: triggers save logic once routeDetails are available

    if (routeDetails.distance && routeDetails.duration && nearbyPlaces.length > 0) {
      try {
        // 1. Save route
        const routeRes = await axios.post("http://localhost/Routepro/save_route.php", {
          start_location: from,
          end_location: to,
          distance_km: routeDetails.distance,
          estimated_time: routeDetails.duration,
        });

        if (routeRes.data.success) {
          const travelerId = 1; // Use actual logged-in user's ID if available

          // 2. Save each attraction
          for (let place of nearbyPlaces) {
            await axios.post("http://localhost/Routepro/save_attractions.php", {
              traveler_id: travelerId,
              name: place.name,
              address: place.vicinity || "",
              lat: place.geometry?.location?.lat(),
              lng: place.geometry?.location?.lng(),
            });
          }

          alert("Route and attractions saved successfully!");
        } else {
          console.error(routeRes.data.error);
          alert("Failed to save route.");
        }
      } catch (error) {
        console.error("Error saving data:", error);
        alert("An error occurred while saving.");
      }
    }
  };

  return (
    <div className="route-planner">
      {/* Sidebar Input */}
      <div className="sidebar">
        <div className="card combined-input">
          <h3>Plan Your Route</h3>
          <label>From</label>
          <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Enter starting point" />
          <label>To</label>
          <input type="text" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Enter destination" />
          <label>Select Vehicle</label>
          <div className="vehicle-options">
            {["Bike", "Car", "Mini Car", "Tuk Tuk", "Van"].map((v) => (
              <button key={v} className={`vehicle ${vehicle === v ? "active" : ""}`} onClick={() => setVehicle(v)}>
                {v}
              </button>
            ))}
          </div>
          <button className="confirm-button" onClick={handleConfirm}>Find The Best Route</button>
        </div>

        <div className="card">
          <h3>Route Information</h3>
          <p><strong>Distance:</strong> {routeDetails.distance || "N/A"}</p>
          <p><strong>Duration:</strong> {routeDetails.duration || "N/A"}</p>
          <p><strong>Price:</strong> ${estimatedPrice}</p>
        </div>

        <div className="card">
          <h3>Need Assistance?</h3>
          <p>Book a professional driver and local guide for your journey.</p>
          <button className="book-button" onClick={() => navigate("/bookdriver")}>Book Driver & Guide</button>
        </div>
      </div>

      {/* Map and Attraction Section */}
      <div className="main-content">
        <div className="map-placeholder">
          <MapComponent
            origin={from}
            destination={to}
            setRouteDetails={setRouteDetails}
            setNearbyPlaces={setNearbyPlaces}
          />
        </div>

        <div className="nearby-attractions">
          <h3>Nearby Attractions</h3>
          <div className="attraction-list">
            {nearbyPlaces.length > 0 ? (
              nearbyPlaces.map((place, idx) => (
                <div className="attraction-card" key={idx}>
                  {place.photos ? (
                    <img src={place.photos[0].getUrl()} alt={place.name} className="attraction-image" />
                  ) : <div className="no-photo">No image</div>}
                  <h4>{place.name}</h4>
                  <p>{place.types?.[0]}</p>
                  <span className="rating">⭐ {place.rating || "N/A"}</span>
                </div>
              ))
            ) : <p>No attractions found along this route.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutePlanner;
