import React, { useState, useEffect } from "react";
import "./RoutePlanner.css";
import MapComponent from "./MapComponent";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RoutePlanner = () => {
  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [routeDetails, setRouteDetails] = useState({
    distance: "",
    duration: "",
    bounds: null,
  });
  const [nearbyPlaces, setNearbyPlaces] = useState([]);

  // Vehicle price calculation
  const basePricePerKM = 5;
  const vehicleMultiplier = {
    Bike: 0.8,
    Car: 1.2,
    Bus: 2.0,
    "Mini Van": 1.5,
    Van: 1.8,
  };

  let distanceValue = 0;
  if (routeDetails.distance) {
    const match = routeDetails.distance.match(/[\d.]+/);
    if (match) {
      distanceValue = parseFloat(match[0]);
    }
  }

  const estimatedPrice =
    distanceValue && vehicle
      ? (distanceValue * basePricePerKM * (vehicleMultiplier[vehicle] || 1)).toFixed(2)
      : "N/A";

  // 👉 Fetch route info from backend
  useEffect(() => {
    if (from && to) {
      axios
        .get(`http://localhost/RoutePro/get_route_info.php?from=${from}&to=${to}`)
        .then((res) => {
          if (res.data.status === "success") {
            setRouteDetails({
              ...routeDetails,
              distance: res.data.data.distance,
              duration: res.data.data.duration,
            });
          } else {
            setRouteDetails({ ...routeDetails, distance: "", duration: "" });
          }
        })
        .catch((err) => {
          console.error("Failed to fetch route info", err);
        });
    }
  }, [from, to]);

  return (
    <div className="route-planner">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="card">
          <h3>Select Destinations</h3>
          <label>From</label>
          <input
            type="text"
            placeholder="Enter starting point"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <label>To</label>
          <input
            type="text"
            placeholder="Enter destination"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <div className="card">
          <h3>Select Vehicle</h3>
          <div className="vehicle-options">
            {["Bike", "Car", "Bus", "Mini Van", "Van"].map((v) => (
              <button
                key={v}
                className={`vehicle ${vehicle === v ? "active" : ""}`}
                onClick={() => setVehicle(v)}
              >
                {v}
              </button>
            ))}
          </div>
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
          <button
            className="book-button"
            onClick={() => navigate("/bookdriver")}
          >
            Book Driver & Guide
          </button>
        </div>
      </div>

      {/* Main Content */}
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
                    <img
                      src={place.photos[0].getUrl()}
                      alt={place.name}
                      className="attraction-image"
                    />
                  ) : (
                    <div className="no-photo">No image</div>
                  )}
                  <h4>{place.name}</h4>
                  <p>{place.types?.[0]}</p>
                  <span className="rating">
                    ⭐ {place.rating ? place.rating : "N/A"}
                  </span>
                </div>
              ))
            ) : (
              <p>No attractions found along this route.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutePlanner;
