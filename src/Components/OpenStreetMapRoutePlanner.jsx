import React, { useState, useEffect } from 'react';
import OpenStreetMap from './OpenStreetMap';
import './OpenStreetMap.css';

const OpenStreetMapRoutePlanner = ({
  origin,
  destination,
  setRouteDetails,
  findAttractions = false,
  onAttractionsFound = null
}) => {
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [mapCenter, setMapCenter] = useState([7.8731, 80.7718]); // Sri Lanka center
  const [loading, setLoading] = useState(false);

  // Geocoding function to convert place names to coordinates
  const geocodeLocation = async (location) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
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

  // Calculate route distance (simplified - straight line distance)
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

  // Estimate travel time based on distance (rough estimate)
  const estimateTime = (distanceKm) => {
    const avgSpeedKmh = 60; // Average speed 60 km/h
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

  // Find nearby attractions using Overpass API (OpenStreetMap data)
  const findNearbyAttractions = async (lat, lng, radiusKm = 10) => {
    try {
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["tourism"~"attraction|museum|viewpoint|zoo|theme_park"](around:${radiusKm * 1000},${lat},${lng});
          node["historic"~"monument|memorial|castle|ruins"](around:${radiusKm * 1000},${lat},${lng});
          node["leisure"~"park"](around:${radiusKm * 1000},${lat},${lng});
        );
        out geom;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery
      });

      const data = await response.json();
      
      const attractions = data.elements.map(element => ({
        id: element.id,
        name: element.tags.name || 'Unnamed Attraction',
        type: element.tags.tourism || element.tags.historic || element.tags.leisure || 'attraction',
        lat: element.lat,
        lng: element.lon,
        description: element.tags.description || `${element.tags.tourism || element.tags.historic || 'Attraction'} in the area`
      })).slice(0, 10); // Limit to 10 attractions

      return attractions;
    } catch (error) {
      console.error('Error finding attractions:', error);
      return [];
    }
  };

  // Update route when origin or destination changes
  useEffect(() => {
    const updateRoute = async () => {
      if (origin && destination) {
        setLoading(true);
        
        // Geocode origin and destination
        const originResult = await geocodeLocation(origin);
        const destinationResult = await geocodeLocation(destination);
        
        if (originResult && destinationResult) {
          setOriginCoords(originResult);
          setDestinationCoords(destinationResult);
          
          // Calculate distance and time
          const distance = calculateDistance(originResult, destinationResult);
          const duration = estimateTime(distance);
          
          // Update route details
          setRouteDetails({
            distance: distance * 1000, // Convert to meters for compatibility
            duration: duration
          });
          
          // Create markers
          const newMarkers = [
            {
              lat: originResult.lat,
              lng: originResult.lng,
              title: "Starting Point",
              description: origin,
              address: originResult.display_name
            },
            {
              lat: destinationResult.lat,
              lng: destinationResult.lng,
              title: "Destination",
              description: destination,
              address: destinationResult.display_name
            }
          ];
          
          // Find attractions if requested
          if (findAttractions) {
            const midLat = (originResult.lat + destinationResult.lat) / 2;
            const midLng = (originResult.lng + destinationResult.lng) / 2;
            
            const foundAttractions = await findNearbyAttractions(midLat, midLng, 15);
            setAttractions(foundAttractions);
            
            // Add attraction markers
            const attractionMarkers = foundAttractions.map(attraction => ({
              lat: attraction.lat,
              lng: attraction.lng,
              title: attraction.name,
              description: attraction.description,
              address: `${attraction.type} - ${attraction.name}`
            }));
            
            newMarkers.push(...attractionMarkers);
            
            if (onAttractionsFound) {
              onAttractionsFound(foundAttractions);
            }
          }
          
          setMarkers(newMarkers);
          
          // Center map between origin and destination
          const centerLat = (originResult.lat + destinationResult.lat) / 2;
          const centerLng = (originResult.lng + destinationResult.lng) / 2;
          setMapCenter([centerLat, centerLng]);
        }
        
        setLoading(false);
      }
    };

    updateRoute();
  }, [origin, destination, findAttractions]);

  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    
    // Add a custom marker at clicked location
    const newMarker = {
      lat,
      lng,
      title: "Custom Location",
      description: `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      address: "Custom marked location"
    };
    
    setMarkers(prev => [...prev, newMarker]);
  };

  if (loading) {
    return (
      <div className="map-loading">
        <div className="map-loading-spinner"></div>
        <p style={{ marginTop: '10px' }}>Loading route...</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <OpenStreetMap
        center={mapCenter}
        zoom={originCoords && destinationCoords ? 10 : 8}
        height="500px"
        markers={markers}
        onMapClick={handleMapClick}
        enableGeolocation={true}
        className="map-large"
      />
      
      {attractions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'white',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          maxHeight: '200px',
          overflowY: 'auto',
          minWidth: '200px',
          zIndex: 1000
        }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Nearby Attractions</h4>
          {attractions.slice(0, 5).map(attraction => (
            <div key={attraction.id} style={{ marginBottom: '8px', fontSize: '12px' }}>
              <strong>{attraction.name}</strong>
              <br />
              <span style={{ color: '#666' }}>{attraction.type}</span>
            </div>
          ))}
          {attractions.length > 5 && (
            <div style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
              +{attractions.length - 5} more attractions
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OpenStreetMapRoutePlanner;