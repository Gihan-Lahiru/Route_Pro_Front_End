import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const containerStyle = {
  width: "100%",
  height: "550px",
  borderRadius: "10px",
};

const center = [7.8731, 80.7718]; // Sri Lanka center [lat, lng]

const MapComponent = ({ origin, destination, setRouteDetails, setNearbyPlaces }) => {
  const [routeCoords, setRouteCoords] = useState([]);
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(7);

  // Geocoding function using Nominatim
  const geocodeLocation = async (location) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}, Sri Lanka`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          display_name: data[0].display_name
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Calculate distance between two points
  const calculateDistance = (coord1, coord2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLon = (coord2.lng - coord1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  // Estimate travel time
  const estimateTime = (distanceKm) => {
    const avgSpeedKmh = 50; // Average speed 50 km/h for Sri Lankan roads
    const hours = distanceKm / avgSpeedKmh;
    const totalMinutes = Math.round(hours * 60);
    
    if (totalMinutes < 60) {
      return `${totalMinutes} mins`;
    } else {
      const hrs = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      return mins > 0 ? `${hrs} hrs ${mins} mins` : `${hrs} hrs`;
    }
  };

  // Find nearby attractions using Overpass API
  const findNearbyAttractions = async (lat, lng) => {
    try {
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["tourism"~"attraction|museum|viewpoint"](around:15000,${lat},${lng});
          node["historic"~"monument|memorial"](around:15000,${lat},${lng});
        );
        out geom;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery
      });

      const data = await response.json();
      
      const places = data.elements.map(element => ({
        name: element.tags.name || 'Unnamed Attraction',
        vicinity: element.tags.tourism || element.tags.historic || 'attraction',
        geometry: {
          location: {
            lat: () => element.lat,
            lng: () => element.lon
          }
        },
        place_id: element.id
      })).slice(0, 10);

      return places;
    } catch (error) {
      console.error('Error finding attractions:', error);
      return [];
    }
  };

  useEffect(() => {
    const updateRoute = async () => {
      if (origin && destination) {
        // Geocode origin and destination
        const originResult = await geocodeLocation(origin);
        const destinationResult = await geocodeLocation(destination);
        
        if (originResult && destinationResult) {
          setOriginCoords(originResult);
          setDestinationCoords(destinationResult);
          
          // Calculate distance and time
          const distance = calculateDistance(originResult, destinationResult);
          const duration = estimateTime(distance);
          
          // Create route line (straight line for simplicity)
          const routeLine = [
            [originResult.lat, originResult.lng],
            [destinationResult.lat, destinationResult.lng]
          ];
          setRouteCoords(routeLine);
          
          // Update route details (convert km to meters for compatibility)
          setRouteDetails({
            distance: `${distance.toFixed(1)} km`,
            duration: duration,
            bounds: null
          });
          
          // Center map between origin and destination
          const centerLat = (originResult.lat + destinationResult.lat) / 2;
          const centerLng = (originResult.lng + destinationResult.lng) / 2;
          setMapCenter([centerLat, centerLng]);
          setMapZoom(10);
          
          // Find nearby attractions
          const attractions = await findNearbyAttractions(centerLat, centerLng);
          setNearbyPlaces(attractions);
        } else {
          console.error("Could not geocode one or both locations");
          setRouteDetails({ distance: "", duration: "", bounds: null });
          setNearbyPlaces([]);
        }
      }
    };

    updateRoute();
  }, [origin, destination, setRouteDetails, setNearbyPlaces]);

  return (
    <div style={containerStyle}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Origin marker */}
        {originCoords && (
          <Marker position={[originCoords.lat, originCoords.lng]}>
            <Popup>
              <div>
                <strong>Starting Point</strong><br />
                {origin}
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Destination marker */}
        {destinationCoords && (
          <Marker position={[destinationCoords.lat, destinationCoords.lng]}>
            <Popup>
              <div>
                <strong>Destination</strong><br />
                {destination}
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Route line */}
        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            color="blue"
            weight={4}
            opacity={0.7}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;