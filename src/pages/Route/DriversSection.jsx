// DriversSection.jsx
import React from "react";
import "./DriversSection.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiMethods } from "../../utils/api-client";

// Pro Tip Banner Component
function ProTipBanner() {
  return (
    <div className="pro-tip-banner">
      <span className="pro-tip-icon" role="img" aria-label="lightbulb">💡</span>
      <span className="pro-tip-title">Pro Tip: Book Both &amp; Save!</span>
      <span className="pro-tip-desc">
        Get both a driver and guide together for the complete Sri Lankan experience.{" "}
        <span className="pro-tip-highlight">Save 10% when you book as a package!</span>
      </span>
    </div>
  );
}

const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`star ${i < rating ? "filled" : ""}`}>
      ★
    </span>
  ));
};

export default function DriversSection({ onDriverSelect }) {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get trip dates from localStorage
  const tripDatesStr = localStorage.getItem('tripDates');
  let tripDates = null;
  if (tripDatesStr) {
    try {
      tripDates = JSON.parse(tripDatesStr);
    } catch (error) {
      console.log('Error parsing trip dates');
    }
  }

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        // Test direct fetch first
        const directUrl = `${apiMethods.getBackendUrl()}/drivers`;
        const directResponse = await fetch(directUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        if (directResponse.ok) {
          await directResponse.json();
        }

        // Now try with the API client
        const response = await apiMethods.authenticatedRequest("/drivers", null, "GET");
        
        console.log('🔍 Full API response:', response);
        console.log('🔍 Response.data:', response.data);
        
        // Handle different response structures
        let driverData = [];
        if (response.data) {
          if (Array.isArray(response.data.drivers)) {
            driverData = response.data.drivers;
          } else if (Array.isArray(response.data.data)) {
            driverData = response.data.data;
          } else if (Array.isArray(response.data)) {
            driverData = response.data;
          }
        } else if (Array.isArray(response)) {
          driverData = response;
        }
        
        console.log('🔍 Processed driver data:', driverData);
        if (driverData.length > 0) {
          console.log('🔍 First driver structure:', driverData[0]);
          console.log('🔍 First driver has driver_table_id?', driverData[0].driver_table_id);
        }
        if (driverData.length === 0) {
          setDrivers([]);
          setError("No drivers available at the moment");
        } else {
          setDrivers(driverData);
        }
      } catch (err) {
        setDrivers([]);
        setError("Failed to load drivers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  // Helper function to check if a driver is available
  const isDriverAvailable = (driver) => {
    return driver.status !== "nonavailable";
  };

  // Filter drivers based on availability only
  const availableDrivers = Array.isArray(drivers) ? drivers.filter(isDriverAvailable) : [];

  if (loading) return <div>Loading drivers...</div>;
  if (error) return <div style={{padding: '20px', color: 'red'}}>{error}</div>;

  // Show message if no drivers available
  if (availableDrivers.length === 0) {
    return (
      <section className="drivers-section">
        <ProTipBanner />
        <h2>MEET YOUR LOCAL DRIVERS</h2>
        <p className="subtitle">
          {Array.isArray(drivers) && drivers.length > 0 
            ? `Found ${drivers.length} drivers, but none are available for the selected dates.`
            : "No drivers found in the database."
          }
        </p>
        <div style={{marginTop: '10px', fontSize: '14px', color: '#666'}}>
          <p>Debug info:</p>
          <p>Total drivers: {Array.isArray(drivers) ? drivers.length : 'Not an array'}</p>
          <p>Trip dates: {tripDates ? `${tripDates.fromDate} to ${tripDates.toDate}` : 'None selected'}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="drivers-section">
      <ProTipBanner />
      <h2>MEET YOUR LOCAL DRIVERS</h2>
      <p className="subtitle">
        Professional, verified drivers ready to make your journey memorable!
        {tripDates && tripDates.fromDate && tripDates.toDate && 
          ` Available for your trip from ${new Date(tripDates.fromDate).toLocaleDateString()} to ${new Date(tripDates.toDate).toLocaleDateString()}.`
        }
      </p>
      <div className="cards">
        {availableDrivers.map((driver) => (
          <article key={driver.id} className="driver-card">
            <div className="image-container">
              <img 
                src={driver.photo_url || driver.image || 'https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=Driver'} 
                alt={driver.name} 
                className="driver-image" 
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=Driver';
                }}
              />
              <span className="price-badge">{driver.status || driver.availability || 'Available'}</span>
              {driver.verified && <span className="badge verified">Verified</span>}
              {driver.recommended && <span className="badge recommended">Recommended</span>}
            </div>
            <div className="card-body">
              <h3>{driver.name}</h3>
              <ul className="driver-info">
                <li>🚗 {driver.vehicle_type || driver.vehicle || 'Vehicle Info'}</li>
                <li>📍 {driver.location || 'Location Info'}</li>
                <li>✅ {driver.license_no || driver.license || 'Licensed'}</li>
              </ul>
              <div className="rating">
                {renderStars(driver.rating || 4)}
                <span className="rating-text">({driver.rating || 4}/5)</span>
              </div>
              <div className="experience">
                <span>Experience: {driver.experience || '5+'} years</span>
              </div>
              <button 
                className="book-now-btn"
                onClick={() => {
                  console.log('🎯 Driver selected, original driver object:', driver);
                  
                  const driverData = {
                    id: driver.id,
                    driver_table_id: driver.driver_table_id, // Include the actual drivers table ID
                    user_id: driver.user_id, // Include user_id for backward compatibility
                    name: driver.name,
                    vehicle_type: driver.vehicle_type || driver.vehicle,
                    location: driver.location,
                    rating: driver.rating || 4,
                    phone: driver.phone,
                    photo_url: driver.photo_url,
                    experience: driver.experience || '5+'
                  };
                  
                  console.log('🎯 Processed driver data being sent to BookingModal:', driverData);
                  console.log('🎯 driver_table_id value:', driverData.driver_table_id);
                  
                  if (onDriverSelect) {
                    onDriverSelect(driverData);
                  } else {
                    localStorage.setItem('selectedDriver', JSON.stringify(driverData));
                    navigate('/booking');
                  }
                }}
              >
                Book Now
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
