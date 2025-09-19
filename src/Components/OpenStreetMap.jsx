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

const OpenStreetMap = ({
  center = [7.8731, 80.7718], // Default to Sri Lanka center
  zoom = 8,
  height = '400px',
  width = '100%',
  markers = [],
  onMapClick = null,
  showCircle = false,
  circleCenter = null,
  circleRadius = 1000,
  enableGeolocation = false,
  onLocationFound = null,
  className = ''
}) => {
  const [currentCenter, setCurrentCenter] = useState(center);
  const [userLocation, setUserLocation] = useState(null);

  // Get user's current location
  useEffect(() => {
    if (enableGeolocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = [latitude, longitude];
          setUserLocation(location);
          setCurrentCenter(location);
          if (onLocationFound) {
            onLocationFound(location);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [enableGeolocation, onLocationFound]);

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
    <div className={`openstreet-map-container ${className}`} style={{ height, width }}>
      <MapContainer
        center={currentCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <ChangeView center={currentCenter} zoom={zoom} />
        
        {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
        
        {/* User's current location marker */}
        {userLocation && (
          <Marker position={userLocation} icon={userLocationIcon}>
            <Popup>
              <div>
                <strong>Your Location</strong>
                <br />
                Lat: {userLocation[0].toFixed(6)}
                <br />
                Lng: {userLocation[1].toFixed(6)}
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Custom markers */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={[marker.lat, marker.lng]}
            icon={marker.icon || undefined}
          >
            <Popup>
              <div>
                {marker.title && <strong>{marker.title}</strong>}
                {marker.description && (
                  <>
                    <br />
                    {marker.description}
                  </>
                )}
                {marker.address && (
                  <>
                    <br />
                    <em>{marker.address}</em>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Circle overlay */}
        {showCircle && circleCenter && (
          <Circle
            center={circleCenter}
            radius={circleRadius}
            pathOptions={{
              color: 'blue',
              fillColor: 'lightblue',
              fillOpacity: 0.2,
              weight: 2
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default OpenStreetMap;