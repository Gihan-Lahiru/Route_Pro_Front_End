import React, { useState, useEffect } from 'react';
import OpenStreetMap from './OpenStreetMap';
import './OpenStreetMap.css';

const LocationMap = ({ 
  userLocation = null,
  showUserLocation = true,
  tripRoutes = [],
  height = '300px',
  zoom = 10,
  className = 'map-medium'
}) => {
  const [currentLocation, setCurrentLocation] = useState(userLocation);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    // Update markers when props change
    const newMarkers = [];

    // Add trip route markers
    tripRoutes.forEach((trip, index) => {
      if (trip.startLocation) {
        newMarkers.push({
          lat: trip.startLocation.lat,
          lng: trip.startLocation.lng,
          title: `Trip ${index + 1} - Start`,
          description: trip.startLocation.name || 'Trip starting point',
          address: trip.startLocation.address || ''
        });
      }

      if (trip.endLocation) {
        newMarkers.push({
          lat: trip.endLocation.lat,
          lng: trip.endLocation.lng,
          title: `Trip ${index + 1} - End`,
          description: trip.endLocation.name || 'Trip destination',
          address: trip.endLocation.address || ''
        });
      }

      // Add waypoints if any
      if (trip.waypoints) {
        trip.waypoints.forEach((waypoint, wpIndex) => {
          newMarkers.push({
            lat: waypoint.lat,
            lng: waypoint.lng,
            title: `Waypoint ${wpIndex + 1}`,
            description: waypoint.name || 'Trip waypoint',
            address: waypoint.address || ''
          });
        });
      }
    });

    setMarkers(newMarkers);
  }, [tripRoutes]);

  const handleLocationFound = (location) => {
    setCurrentLocation(location);
  };

  // Determine map center
  const getMapCenter = () => {
    if (currentLocation) {
      return currentLocation;
    }
    if (markers.length > 0) {
      // Center on first marker
      return [markers[0].lat, markers[0].lng];
    }
    // Default to Sri Lanka center
    return [7.8731, 80.7718];
  };

  return (
    <div className="location-map-container">
      <OpenStreetMap
        center={getMapCenter()}
        zoom={zoom}
        height={height}
        markers={markers}
        enableGeolocation={showUserLocation}
        onLocationFound={handleLocationFound}
        className={className}
      />
      
      {currentLocation && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '8px 12px',
          borderRadius: '5px',
          fontSize: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          📍 Your Location: {currentLocation[0].toFixed(4)}, {currentLocation[1].toFixed(4)}
        </div>
      )}
    </div>
  );
};

export default LocationMap;