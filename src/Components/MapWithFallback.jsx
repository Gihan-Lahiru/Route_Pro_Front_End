import React from 'react';
import MapComponent from '../pages/Route/MapComponent'; // Fallback to OpenStreetMap

const MapWithFallback = (props) => {
  const [useGoogleMaps, setUseGoogleMaps] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    // Check if Google Maps API key is available
    if (!process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 
        process.env.REACT_APP_GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
      setUseGoogleMaps(false);
      setError('Google Maps API key not configured. Using OpenStreetMap fallback.');
    }
  }, []);

  if (!useGoogleMaps) {
    return (
      <div>
        {error && (
          <div style={{
            padding: '10px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '4px',
            marginBottom: '10px',
            color: '#856404'
          }}>
            ⚠️ {error}
          </div>
        )}
        <MapComponent {...props} />
      </div>
    );
  }

  const GoogleMapComponent = React.lazy(() => import('./GoogleMapComponent'));

  return (
    <React.Suspense fallback={
      <div style={{ 
        width: '100%', 
        height: '550px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: '10px',
        border: '1px solid #ddd',
      }}>
        Loading maps...
      </div>
    }>
      <GoogleMapComponent 
        {...props} 
        onError={() => {
          setUseGoogleMaps(false);
          setError('Failed to load Google Maps. Switching to OpenStreetMap.');
        }}
      />
    </React.Suspense>
  );
};

export default MapWithFallback;