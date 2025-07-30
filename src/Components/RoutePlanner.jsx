import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MapComponent from "./MapComponent";
import axios from "axios";
import "./RoutePlanner.css";

import PlacesSelector from "./PlacesSelector";

const RoutePlanner = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [routeDetails, setRouteDetails] = useState({ distance: null, duration: null });
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const navigate = useNavigate();
  const [findAttractions, setFindAttractions] = useState(false);
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  // ✅ Your older pricing logic:
  const basePricePerKM = 100;
  const vehicleMultiplier = {
    Bike: 0.6,
    Car: 1.3,
    "Mini Car": 1.1,  // Added since you have "Mini Car" now
    Tuk: 0.8,         // Added since you have "Tuk" now
    Van: 1.8,
  };

  let distanceValue = 300;
  if (routeDetails.distance) {
    distanceValue = parseFloat(routeDetails.distance) / 1; // meters to km
  }

  const estimatedPrice =
    distanceValue && vehicle
      ? (distanceValue * basePricePerKM * (vehicleMultiplier[vehicle] || 1)).toFixed(2)
      : "N/A";

  const handleConfirm = async () => {
    if (!from || !to || !vehicle || !routeDetails.distance || !routeDetails.duration) {
      alert("Please fill in all fields and ensure the route is loaded on map.");
      return;
    }

    try {
      const routeResponse = await axios.post("http://localhost/Routepro/save_route.php", {
        start_location: from,
        end_location: to,
        distance_km: (parseFloat(routeDetails.distance) / 1000).toFixed(2),
        estimated_time: routeDetails.duration,
      });

      const route_id = routeResponse.data.route_id;
      const traveler_id = 1;

      for (const place of nearbyPlaces) {
        await axios.post("http://localhost/Routepro/save_attractions.php", {
          traveler_id,
          name: place.name,
          address: place.vicinity || "",
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }

      alert("Route and attractions saved successfully.");
    } catch (error) {
      console.error("Saving failed", error);
      alert("Error saving route and attractions");
    }
  };

  return (
    <div className="route-planner">
      <div className="sidebar">
        <div className="card combined-input">
          <h2 className="highlight-m1">Plan Your Route</h2>

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

          <label>Select Vehicle</label>
          <div className="vehicle-options">
            {["Bike", "Tuk-Tuk", "Mini Car", "Car", "Van"].map((v) => (
              <button
                key={v}
                className={`vehicle ${vehicle === v ? "active" : ""}`}
                onClick={() => setVehicle(v)}
              >
                {v}
              </button>
            ))}
          </div>

          <button className="confirm-button" onClick={handleConfirm}>
            Find The Best Route
          </button>
        </div>
        {/* <div>
          <button
            className="attractions-button"
            onClick={() => setFindAttractions((prev) => !prev)}
          >
            Find Nearby Attractions
          </button>
        </div> */}

        <div className="card">
          <h3>Route Information</h3>
          <p><strong>Distance:</strong> {routeDetails.distance ? `${(distanceValue).toFixed(2)} km` : "N/A"}</p>
          <p><strong>Duration:</strong> {routeDetails.duration || "N/A"}</p>
          <p><strong>Price:</strong> Rs.{estimatedPrice}</p>
        </div>

        <div className="card">
          <h3>Need Assistance?</h3>
          <p>Book a professional driver and local guide for your journey.</p>
          <button className="book-button" onClick={() => navigate("/bookdriver")}>
            Book Driver & Guide
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="map-placeholder">
          <MapComponent
            origin={from}
            destination={to}
            setRouteDetails={setRouteDetails}
            setNearbyPlaces={setNearbyPlaces}
            findAttractions={findAttractions}
          />
        </div>
        <PlacesSelector
          nearbyPlaces={nearbyPlaces}
          setNearbyPlaces={setNearbyPlaces}
        />
      </div>
    </div>
  );
};

export default RoutePlanner;
