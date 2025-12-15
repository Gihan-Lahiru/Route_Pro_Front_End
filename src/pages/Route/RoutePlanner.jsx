import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleMapComponent from "../../Components/GoogleMapComponent";
import axios from "axios";
import "./RoutePlanner.css";
import TripDateSelector from "./TripDateSelector";
import { sessionUtils } from "../../utils/api-client";
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
  const [showDateSelector, setShowDateSelector] = useState(false);

  // Updated pricing logic - Cars should be more expensive than Tuk-Tuks
  const pricePerKM = {
    Bike: 10,
    "Tuk-Tuk": 15,      // Lower price for Tuk-Tuk
    Car: 25,            // Higher price for Car
    Van: 30,            // Highest price for Van
  };

  let distanceValue = 300;
  if (routeDetails.distance) {
    // Handle Google Maps distance format (e.g., "123 km" or "1,234 m")
    const distanceStr = routeDetails.distance.toString();
    if (distanceStr.includes('km')) {
      distanceValue = parseFloat(distanceStr.replace(/[^\d.]/g, ''));
    } else if (distanceStr.includes('m')) {
      distanceValue = parseFloat(distanceStr.replace(/[^\d.]/g, '')) / 1000; // Convert meters to km
    } else {
      // Fallback: assume it's already in km
      distanceValue = parseFloat(distanceStr) || 300;
    }
    
    // Clear bike selection if distance exceeds 150km
    if (distanceValue > 150 && vehicle === "Bike") {
      setVehicle("");
    }
  }

  // Use new price logic
  const estimatedPrice =
    distanceValue && vehicle
      ? (distanceValue * (pricePerKM[vehicle] || 0)).toFixed(2)
      : "N/A";

  const handleBookDriverGuide = async () => {
    if (!from || !to || !vehicle || !routeDetails.distance || !routeDetails.duration) {
      alert("Please fill in all fields and ensure the route is loaded on map.");
      return;
    }
    const currentUser = sessionUtils.getCurrentUser();
    if (!currentUser) {
      if (window.confirm("You must log in first to book drivers and guides. Would you like to go to the login page?")) {
        navigate("/user-login");
      }
      return;
    }
    if (currentUser.role === 'driver' || currentUser.role === 'guide') {
      alert("Drivers and guides cannot book other drivers or guides. This feature is only available for travelers.");
      return;
    }
    if (currentUser.role !== 'traveller') {
      alert("Only travelers can book drivers and guides.");
      return;
    }

    // Prepare route data for DB
    const routeData = {
      start_location: from,
      end_location: to,
      distance_km: parseFloat((parseFloat(routeDetails.distance) / 1000).toFixed(2)), // meters to km as float
      estimated_time: Math.round(parseFloat(routeDetails.duration) / 60), // minutes as number
      cost: parseFloat(estimatedPrice)
    };

    try {
      // Send route data to backend
      const response = await axios.post("http://localhost/RoutePro-backend(02)/public/api/routes/routes.php", routeData);
      
      // Capture the route_id returned from backend
      if (response.data.success && response.data.route_id) {
        // Add the route_id to routeData before storing
        const routeDataWithId = {
          ...routeData,
          route_id: response.data.route_id,
          id: response.data.route_id  // Also store as 'id' for compatibility
        };
        
        console.log('🎯 Route created successfully with ID:', response.data.route_id);
        console.log('💾 Storing complete route data:', routeDataWithId);
        
        // Store complete route data with route_id in localStorage
        localStorage.setItem('routeData', JSON.stringify(routeDataWithId));
        
        // Also store route_id separately for easy access
        localStorage.setItem('route_id', response.data.route_id.toString());
        localStorage.setItem('routeId', response.data.route_id.toString());
        
        navigate("/bookdriver");
      } else {
        throw new Error('Route creation failed or no route_id returned');
      }
    } catch (error) {
      alert("Error saving route to database.");
      console.error(error);
    }
  };

  const prepareRouteData = () => {
    return {
      start_location: from,
      end_location: to,
      distance_km: parseFloat(routeDetails.distance) / 1000, // Convert meters to km
      estimated_time: Math.round(parseFloat(routeDetails.duration) / 60), // Convert seconds to minutes
      cost: parseFloat(estimatedPrice)
    };
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
      const routeResponse = await axios.post("http://localhost/RoutePro-backend(02)/public/api/routes/routes.php", {
        start_location: from,
        end_location: to,
        distance_km: parseFloat((parseFloat(routeDetails.distance) / 1000).toFixed(2)),
        estimated_time: Math.round(parseFloat(routeDetails.duration) / 60),
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
            {["Bike", "Tuk-Tuk", "Car", "Van"]
              .filter((v) => {
                // Hide Bike option if distance is more than 150km
                if (v === "Bike" && distanceValue > 150) {
                  return false;
                }
                return true;
              })
              .map((v) => (
              <button
                key={v}
                className={`vehicle ${vehicle === v ? "active" : ""}`}
                onClick={() => setVehicle(v)}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Nearby Attractions Toggle */}
          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={findAttractions}
                onChange={(e) => setFindAttractions(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              🏛️ Find nearby attractions along the route
            </label>
          </div>
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
          <GoogleMapComponent
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
      {showDateSelector && (
        <TripDateSelector
          onClose={handleDateCancel}
          onConfirm={handleDateConfirm}
        />
      )}
    </div>
  );
};

export default RoutePlanner;
