import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GoogleMapComponent from "../../Components/GoogleMapComponent";
import OpenStreetMapRoutePlanner from "../../Components/OpenStreetMapRoutePlanner";
import GoogleMapsDebugger from "../../Components/GoogleMapsDebugger";
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
  
  // Debug logging for nearbyPlaces changes
  useEffect(() => {
    console.log('🏛️ EnhancedRoutePlanner: nearbyPlaces updated:', nearbyPlaces);
    console.log('📊 nearbyPlaces count:', nearbyPlaces?.length);
    
    // Add global test function for manual testing
    window.testSetPlaces = () => {
      console.log('🧪 Manual test: Setting test places');
      const testPlaces = [
        { 
          name: 'Test Attraction 1', 
          vicinity: 'Test Location 1', 
          rating: 4.5, 
          place_id: 'test1',
          types: ['tourist_attraction']
        },
        { 
          name: 'Test Attraction 2', 
          vicinity: 'Test Location 2', 
          rating: 4.2, 
          place_id: 'test2',
          types: ['museum']
        }
      ];
      setNearbyPlaces(testPlaces);
    };
  }, [nearbyPlaces]);
  const [mapProvider, setMapProvider] = useState("auto"); // "auto", "google", or "openstreet"
  const [actualMapProvider, setActualMapProvider] = useState("google"); // tracks what's actually being used
  const [mapError, setMapError] = useState(null);
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
    // Handle Google Maps distance format (e.g., "123 km" or "1,234 m")
    const distanceStr = routeDetails.distance.toString();
    if (distanceStr.includes('km')) {
      distanceValue = parseFloat(distanceStr.replace(/[^\d.]/g, ''));
    } else if (distanceStr.includes('m')) {
      distanceValue = parseFloat(distanceStr.replace(/[^\d.]/g, '')) / 1000; // Convert meters to km
    } else {
      // Fallback for OpenStreetMap or numeric values
      distanceValue = parseFloat(distanceStr) / 1000 || 300; // meters to km
    }
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
    console.log('🎯 Attractions found:', attractions?.length || 0);
    // Convert OpenStreetMap attractions to format compatible with existing code
    const formattedPlaces = attractions.map(attraction => ({
      name: attraction.name,
      vicinity: attraction.description,
      lat: attraction.lat,
      lng: attraction.lng,
      place_id: attraction.id || `osm_${attraction.lat}_${attraction.lng}`,
      rating: 4.0, // Default rating for OSM places
      types: [attraction.type || 'point_of_interest']
    }));
    setNearbyPlaces(formattedPlaces);
  };

  // Smart map provider selection
  const getEffectiveMapProvider = () => {
    if (mapProvider === "openstreet") return "openstreet";
    if (mapProvider === "google") return "google";
    
    // Auto mode - check Google Maps availability
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
      setMapError("Google Maps API key not configured. Using OpenStreetMap.");
      setActualMapProvider("openstreet");
      return "openstreet";
    }
    
    setActualMapProvider("google");
    return "google";
  };

  const handleMapProviderChange = (provider) => {
    setMapProvider(provider);
    setMapError(null);
    setNearbyPlaces([]); // Clear existing places when switching providers
  };

  return (
    <div className="route-planner">
      <div className="sidebar">
        <div className="card combined-input">
          <h2 className="highlight-m1">Plan Your Route</h2>

          {/* Map Provider Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label>Map Provider</label>
            <div className="map-provider-options" style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
              <button
                className={`provider-btn ${mapProvider === "auto" ? "active" : ""}`}
                onClick={() => handleMapProviderChange("auto")}
                style={{
                  padding: '8px 16px',
                  border: mapProvider === "auto" ? '2px solid #007bff' : '1px solid #ccc',
                  borderRadius: '5px',
                  backgroundColor: mapProvider === "auto" ? '#e3f2fd' : 'white',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                🚀 Auto
              </button>
              <button
                className={`provider-btn ${mapProvider === "google" ? "active" : ""}`}
                onClick={() => handleMapProviderChange("google")}
                style={{
                  padding: '8px 16px',
                  border: mapProvider === "google" ? '2px solid #007bff' : '1px solid #ccc',
                  borderRadius: '5px',
                  backgroundColor: mapProvider === "google" ? '#e3f2fd' : 'white',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                🗺️ Google Maps
              </button>
              <button
                className={`provider-btn ${mapProvider === "openstreet" ? "active" : ""}`}
                onClick={() => handleMapProviderChange("openstreet")}
                style={{
                  padding: '8px 16px',
                  border: mapProvider === "openstreet" ? '2px solid #007bff' : '1px solid #ccc',
                  borderRadius: '5px',
                  backgroundColor: mapProvider === "openstreet" ? '#e3f2fd' : 'white',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                🌍 OpenStreetMap
              </button>
            </div>
            
            {mapError && (
              <div style={{
                padding: '8px',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#856404',
                marginTop: '8px'
              }}>
                ⚠️ {mapError}
              </div>
            )}
            
            <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
              Currently using: <strong>{actualMapProvider === "google" ? "🗺️ Google Maps" : "🌍 OpenStreetMap"}</strong>
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
          {console.log('🗺️ Map provider decision:', getEffectiveMapProvider())}
          {console.log('🗺️ From/To values:', { from, to })}
          {getEffectiveMapProvider() === "google" ? (
            <>
              {console.log('🗺️ Rendering GoogleMapComponent')}
              <GoogleMapComponent
                origin={from}
                destination={to}
                setRouteDetails={setRouteDetails}
                setNearbyPlaces={setNearbyPlaces}
                findAttractions={findAttractions}
              />
            </>
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
      
      {/* Debug panel for Google Maps API */}
      <GoogleMapsDebugger />
    </div>
  );
};

export default EnhancedRoutePlanner;