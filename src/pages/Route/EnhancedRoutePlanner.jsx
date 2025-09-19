import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MapComponent from "./MapComponent";
import OpenStreetMapRoutePlanner from "../../Components/OpenStreetMapRoutePlanner";
import axios from "axios";
import "./RoutePlanner.css";
import TripDateSelector from "./TripDateSelector";
import PlacesSelector from "./PlacesSelector";
import { sessionUtils } from "../../utils/api-client";

const EnhancedRoutePlanner = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [routeDetails, setRouteDetails] = useState({ distance: null, duration: null });
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [mapProvider, setMapProvider] = useState("google"); // "google" or "openstreet"
  const navigate = useNavigate();
  const [findAttractions, setFindAttractions] = useState(false);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [showDateSelector, setShowDateSelector] = useState(false);

  // Pricing logic - Cars should be more expensive than Tuk-Tuks
  const basePricePerKM = 100;
  const vehicleMultiplier = {
    Bike: 0.6,
    "Tuk-Tuk": 0.8,      // Lower multiplier for Tuk-Tuk
    "Mini Car": 1.1,
    Car: 1.5,            // Higher multiplier for Car
    Van: 1.8,
  };

  let distanceValue = 300;
  if (routeDetails.distance) {
    distanceValue = parseFloat(routeDetails.distance) / 1000; // meters to km
  }

  const estimatedPrice =
    distanceValue && vehicle
      ? (distanceValue * basePricePerKM * (vehicleMultiplier[vehicle] || 1)).toFixed(2)
      : "N/A";

  const handleBookDriverGuide = () => {
    // Check if user is logged in
    if (!sessionUtils.isLoggedIn()) {
      alert("You must log in first to book driver & guide services.");
      return;
    }

    // Get current user
    const currentUser = sessionUtils.getCurrentUser();
    
    // Check user role - drivers and guides cannot book services
    if (currentUser && (currentUser.role === "driver" || currentUser.role === "guide")) {
      alert("Access denied. Drivers and guides cannot book other services.");
      return;
    }

    // Allow travellers to proceed
    setShowDateSelector(true);
  };

  const handleDateConfirm = (dates) => {
    setShowDateSelector(false);
    localStorage.setItem('tripDates', JSON.stringify(dates));
    navigate("/bookdriver");
  };

  const handleDateCancel = () => {
    setShowDateSelector(false);
  };

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
          lat: place.geometry ? place.geometry.location.lat() : place.lat,
          lng: place.geometry ? place.geometry.location.lng() : place.lng,
        });
      }

      alert("Route and attractions saved successfully.");
    } catch (error) {
      console.error("Saving failed", error);
      alert("Error saving route and attractions");
    }
  };

  const handleAttractionsFound = (attractions) => {
    // Convert OpenStreetMap attractions to format compatible with existing code
    const formattedPlaces = attractions.map(attraction => ({
      name: attraction.name,
      vicinity: attraction.description,
      lat: attraction.lat,
      lng: attraction.lng,
      place_id: attraction.id
    }));
    setNearbyPlaces(formattedPlaces);
  };

  return (
    <div className="route-planner">
      <div className="sidebar">
        <div className="card combined-input">
          <h2 className="highlight-m1">Plan Your Route</h2>

          {/* Map Provider Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label>Map Provider</label>
            <div className="map-provider-options" style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button
                className={`provider-btn ${mapProvider === "google" ? "active" : ""}`}
                onClick={() => setMapProvider("google")}
                style={{
                  padding: '8px 16px',
                  border: mapProvider === "google" ? '2px solid #007bff' : '1px solid #ccc',
                  borderRadius: '5px',
                  backgroundColor: mapProvider === "google" ? '#e3f2fd' : 'white',
                  cursor: 'pointer'
                }}
              >
                Google Maps
              </button>
              <button
                className={`provider-btn ${mapProvider === "openstreet" ? "active" : ""}`}
                onClick={() => setMapProvider("openstreet")}
                style={{
                  padding: '8px 16px',
                  border: mapProvider === "openstreet" ? '2px solid #007bff' : '1px solid #ccc',
                  borderRadius: '5px',
                  backgroundColor: mapProvider === "openstreet" ? '#e3f2fd' : 'white',
                  cursor: 'pointer'
                }}
              >
                OpenStreetMap
              </button>
            </div>
          </div>

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

          {/* Attractions Toggle */}
          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={findAttractions}
                onChange={(e) => setFindAttractions(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Find nearby attractions
            </label>
          </div>

          <button className="confirm-button" onClick={handleConfirm}>
            Find The Best Route
          </button>
        </div>

        <div className="card route-info-card">
          <h3>Route Information</h3>
          <div className="route-info-grid">
            <div className="route-info-item">
              <div className="route-info-label">
                <span className="route-info-icon"></span>Distance
              </div>
              <div className="route-info-value">
                {routeDetails.distance ? `${(distanceValue).toFixed(1)} km` : "N/A"}
              </div>
            </div>
            
            <div className="route-info-item">
              <div className="route-info-label">
                <span className="route-info-icon"></span>Duration
              </div>
              <div className="route-info-value">
                {routeDetails.duration || "N/A"}
              </div>
            </div>
            
            <div className="route-info-item">
              <div className="route-info-label">
                <span className="route-info-icon"></span>Estimated Price
              </div>
              <div className="route-info-value">
                Rs. {estimatedPrice}
              </div>
            </div>
          </div>
          
          {mapProvider === "openstreet" && (
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              <em>Note: OpenStreetMap uses straight-line distance calculation. 
              Actual route distance may vary.</em>
            </div>
          )}
        </div>

        <div className="card">
          <h3>Need Assistance?</h3>
          <p>Book a professional driver and local guide for your journey.</p>
          <button className="book-button" onClick={handleBookDriverGuide}>
            Book Driver & Guide
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="map-placeholder">
          {mapProvider === "google" ? (
            <MapComponent
              origin={from}
              destination={to}
              setRouteDetails={setRouteDetails}
              setNearbyPlaces={setNearbyPlaces}
              findAttractions={findAttractions}
            />
          ) : (
            <OpenStreetMapRoutePlanner
              origin={from}
              destination={to}
              setRouteDetails={setRouteDetails}
              findAttractions={findAttractions}
              onAttractionsFound={handleAttractionsFound}
            />
          )}
        </div>
        
        {nearbyPlaces.length > 0 && (
          <PlacesSelector
            nearbyPlaces={nearbyPlaces}
            setNearbyPlaces={setNearbyPlaces}
          />
        )}
      </div>
      
      {showDateSelector && (
        <TripDateSelector
          onClose={handleDateCancel}
          onConfirm={handleDateConfirm}
        />
      )}
    </div>
  );
};

export default EnhancedRoutePlanner;