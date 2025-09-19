import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to change map view
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

// Component to handle map clicks
function MapClickHandler({ onMapClick }) {
  const map = useMap();
  
  useEffect(() => {
    if (onMapClick) {
      map.on('click', onMapClick);
      return () => {
        map.off('click', onMapClick);
      };
    }
  }, [map, onMapClick]);
  
  return null;
}

const MapComponentb = ({
  location = '',
  budget = 5000,
  setAttractions = () => {}
}) => {
  const [currentCenter, setCurrentCenter] = useState([7.8731, 80.7718]);
  const [attractions, setLocalAttractions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Geocode location to get coordinates
  const geocodeLocation = async (locationName) => {
    if (!locationName) return null;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}, Sri Lanka&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Map budget to specific radius values
  const getBudgetRadius = (budget) => {
    if (budget <= 5000) return 5000;   // 5km radius for budget <= 5000
    if (budget <= 10000) return 10000; // 10km radius for budget <= 10000
    return 15000;                      // 15km radius for budget > 10000
  };

  // Find attractions within budget
  const findAttractionsWithinBudget = async (lat, lng, maxBudget) => {
    setLoading(true);
    try {
      const searchRadius = getBudgetRadius(maxBudget);
      
      const overpassQuery = `
        [out:json][timeout:25];
        (
          way["tourism"~"^(attraction|museum|gallery|viewpoint|zoo|aquarium|theme_park)$"](around:${searchRadius},${lat},${lng});
          node["tourism"~"^(attraction|museum|gallery|viewpoint|zoo|aquarium|theme_park)$"](around:${searchRadius},${lat},${lng});
          way["leisure"~"^(park|nature_reserve|beach_resort)$"](around:${searchRadius},${lat},${lng});
          node["leisure"~"^(park|nature_reserve|beach_resort)$"](around:${searchRadius},${lat},${lng});
          way["historic"~"^(monument|castle|archaeological_site|ruins)$"](around:${searchRadius},${lat},${lng});
          node["historic"~"^(monument|castle|archaeological_site|ruins)$"](around:${searchRadius},${lat},${lng});
        );
        out center meta;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: overpassQuery
      });

      const data = await response.json();
      
      if (data && data.elements) {
        const processedAttractions = data.elements
          .filter(element => element.tags && element.tags.name)
          .map(element => {
            let estimatedCost = 500;
            
            if (element.tags.tourism === 'museum' || element.tags.tourism === 'gallery') {
              estimatedCost = 800;
            } else if (element.tags.tourism === 'zoo' || element.tags.tourism === 'aquarium') {
              estimatedCost = 1500;
            } else if (element.tags.tourism === 'theme_park') {
              estimatedCost = 2000;
            } else if (element.tags.historic) {
              estimatedCost = 600;
            }

            const attractionLat = element.lat || (element.center ? element.center.lat : null);
            const attractionLng = element.lon || (element.center ? element.center.lon : null);

            return {
              id: element.id,
              name: element.tags.name,
              type: element.tags.tourism || element.tags.leisure || element.tags.historic || 'attraction',
              cost: estimatedCost,
              description: element.tags.description || `${element.tags.tourism || 'Attraction'} in Sri Lanka`,
              lat: attractionLat,
              lng: attractionLng,
              website: element.tags.website,
              opening_hours: element.tags.opening_hours
            };
          })
          .filter(attraction => 
            attraction.lat && 
            attraction.lng && 
            attraction.cost <= maxBudget
          )
          .slice(0, 20);

        setLocalAttractions(processedAttractions);
        setAttractions(processedAttractions);
      }
    } catch (error) {
      console.error('Error fetching attractions:', error);
      setLocalAttractions([]);
      setAttractions([]);
    } finally {
      setLoading(false);
    }
  };

  // Effect for location changes
  useEffect(() => {
    if (location) {
      geocodeLocation(location).then(coords => {
        if (coords) {
          setCurrentCenter([coords.lat, coords.lng]);
          findAttractionsWithinBudget(coords.lat, coords.lng, budget);
        }
      });
    }
  }, [location]);

  // Effect for budget changes
  useEffect(() => {
    if (location && currentCenter[0] !== 7.8731) {
      findAttractionsWithinBudget(currentCenter[0], currentCenter[1], budget);
    }
  }, [budget]);

  // Custom marker icon for user location
  const userLocationIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="map-container">
      {loading && (
        <div className="map-loading">
          <div className="loading-spinner"></div>
          <p>Finding attractions within your budget...</p>
        </div>
      )}
      
      <MapContainer
        center={currentCenter}
        zoom={location ? 10 : 7}
        style={{ height: '500px', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <ChangeView center={currentCenter} zoom={location ? 10 : 7} />
        
        {/* Location marker */}
        {location && currentCenter[0] !== 7.8731 && (
          <>
            <Marker position={currentCenter}>
              <Popup>
                <div>
                  <strong>{location}</strong>
                  <br />
                  Starting Location
                </div>
              </Popup>
            </Marker>
            
            {/* Budget radius circle */}
            <Circle
              center={currentCenter}
              radius={getBudgetRadius(budget)}
              pathOptions={{
                color: 'blue',
                fillColor: 'lightblue',
                fillOpacity: 0.1,
                weight: 2
              }}
            />
          </>
        )}
        
        {/* Attraction markers */}
        {attractions.map((attraction) => (
          <Marker
            key={attraction.id}
            position={[attraction.lat, attraction.lng]}
            icon={L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })}
          >
            <Popup>
              <div className="attraction-popup">
                <h4>{attraction.name}</h4>
                <p><strong>Type:</strong> {attraction.type}</p>
                <p><strong>Estimated Cost:</strong> LKR {attraction.cost}</p>
                {attraction.opening_hours && (
                  <p><strong>Hours:</strong> {attraction.opening_hours}</p>
                )}
                {attraction.website && (
                  <p>
                    <a href={attraction.website} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <div className="map-info">
        <p>
          <strong>Budget:</strong> LKR {budget.toLocaleString()} | 
          <strong> Attractions Found:</strong> {attractions.length} | 
          <strong> Search Radius:</strong> {getBudgetRadius(budget) / 1000} km
        </p>
      </div>
    </div>
  );
};

export default MapComponentb;