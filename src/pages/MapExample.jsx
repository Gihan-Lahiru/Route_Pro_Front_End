import React, { useState } from 'react';
import OpenStreetMap from '../Components/OpenStreetMap';
import '../Components/OpenStreetMap.css';

const MapExample = () => {
  const [markers, setMarkers] = useState([
    {
      lat: 7.8731,
      lng: 80.7718,
      title: "Sri Lanka Center",
      description: "Geographic center of Sri Lanka",
      address: "Central Province, Sri Lanka"
    },
    {
      lat: 6.9271,
      lng: 79.8612,
      title: "Colombo",
      description: "Commercial capital of Sri Lanka",
      address: "Colombo, Western Province"
    }
  ]);

  const [clickedLocation, setClickedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setClickedLocation({ lat, lng });
    
    // Add marker at clicked location
    const newMarker = {
      lat,
      lng,
      title: "Clicked Location",
      description: `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      address: "Click location"
    };
    
    setMarkers(prev => [...prev, newMarker]);
  };

  const handleLocationFound = (location) => {
    setUserLocation(location);
    console.log('User location found:', location);
  };

  const clearMarkers = () => {
    setMarkers([]);
    setClickedLocation(null);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>OpenStreetMap Integration Examples</h1>
      
      {/* Basic Map */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Basic Map</h2>
        <p>A simple map centered on Sri Lanka with default markers.</p>
        <OpenStreetMap
          center={[7.8731, 80.7718]}
          zoom={8}
          height="400px"
          markers={markers}
          className="map-medium"
        />
      </section>

      {/* Interactive Map */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Interactive Map</h2>
        <p>Click anywhere on the map to add a marker. Enable geolocation to see your current location.</p>
        
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={clearMarkers}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Clear Markers
          </button>
          
          {clickedLocation && (
            <span style={{ color: '#28a745', fontWeight: 'bold' }}>
              Last clicked: {clickedLocation.lat.toFixed(6)}, {clickedLocation.lng.toFixed(6)}
            </span>
          )}
        </div>

        <OpenStreetMap
          center={[7.8731, 80.7718]}
          zoom={8}
          height="400px"
          markers={markers}
          onMapClick={handleMapClick}
          enableGeolocation={true}
          onLocationFound={handleLocationFound}
          className="map-medium"
        />
        
        {userLocation && (
          <div style={{ marginTop: '10px', color: '#007bff' }}>
            Your location: {userLocation[0].toFixed(6)}, {userLocation[1].toFixed(6)}
          </div>
        )}
      </section>

      {/* Map with Circle */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Map with Radius Circle</h2>
        <p>Map showing a radius circle around Colombo (useful for budget/distance constraints).</p>
        <OpenStreetMap
          center={[6.9271, 79.8612]}
          zoom={11}
          height="400px"
          markers={[{
            lat: 6.9271,
            lng: 79.8612,
            title: "Colombo",
            description: "Commercial capital with 5km radius",
            address: "Colombo, Sri Lanka"
          }]}
          showCircle={true}
          circleCenter={[6.9271, 79.8612]}
          circleRadius={5000} // 5km radius
          className="map-medium"
        />
      </section>

      {/* Tourism Spots Map */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Popular Tourism Spots</h2>
        <p>Map showing popular tourist destinations in Sri Lanka.</p>
        <OpenStreetMap
          center={[7.5, 80.5]}
          zoom={7}
          height="500px"
          markers={[
            {
              lat: 8.3114,
              lng: 80.4037,
              title: "Sigiriya",
              description: "Ancient rock fortress and palace",
              address: "Sigiriya, Central Province"
            },
            {
              lat: 7.2906,
              lng: 80.6337,
              title: "Kandy",
              description: "Cultural capital with Temple of Tooth",
              address: "Kandy, Central Province"
            },
            {
              lat: 6.0329,
              lng: 80.2168,
              title: "Galle",
              description: "Historic fort city",
              address: "Galle, Southern Province"
            },
            {
              lat: 8.7642,
              lng: 81.2017,
              title: "Trincomalee",
              description: "Beautiful beaches and natural harbor",
              address: "Trincomalee, Eastern Province"
            },
            {
              lat: 9.6615,
              lng: 80.0255,
              title: "Jaffna",
              description: "Cultural center of Northern Sri Lanka",
              address: "Jaffna, Northern Province"
            }
          ]}
          className="map-large"
        />
      </section>

      <section>
        <h2>Usage Instructions</h2>
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
          <h3>How to use the OpenStreetMap component:</h3>
          <pre style={{ backgroundColor: '#e9ecef', padding: '15px', borderRadius: '5px', overflow: 'auto' }}>
{`import OpenStreetMap from '../Components/OpenStreetMap';
import '../Components/OpenStreetMap.css';

<OpenStreetMap
  center={[7.8731, 80.7718]}  // [latitude, longitude]
  zoom={8}                     // Zoom level (1-18)
  height="400px"               // Map height
  width="100%"                 // Map width
  markers={markersArray}       // Array of marker objects
  onMapClick={handleClick}     // Function to handle map clicks
  enableGeolocation={true}     // Enable user location
  onLocationFound={handleLoc}  // Callback when location found
  showCircle={true}            // Show radius circle
  circleCenter={[lat, lng]}    // Circle center coordinates
  circleRadius={5000}          // Circle radius in meters
  className="map-medium"       // CSS class for styling
/>`}
          </pre>
          
          <h3>Marker object structure:</h3>
          <pre style={{ backgroundColor: '#e9ecef', padding: '15px', borderRadius: '5px', overflow: 'auto' }}>
{`{
  lat: 7.8731,                    // Required: latitude
  lng: 80.7718,                   // Required: longitude
  title: "Location Name",         // Optional: marker title
  description: "Description",     // Optional: marker description
  address: "Full Address",        // Optional: address
  icon: customIcon               // Optional: custom Leaflet icon
}`}
          </pre>
        </div>
      </section>
    </div>
  );
};

export default MapExample;