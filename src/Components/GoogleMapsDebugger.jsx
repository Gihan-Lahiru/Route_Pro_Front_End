import React, { useEffect, useState } from 'react';

const GoogleMapsDebugger = () => {
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const checkGoogleMapsAPI = () => {
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      
      const info = {
        timestamp: new Date().toISOString(),
        apiKeyExists: !!apiKey,
        apiKeyLength: apiKey?.length || 0,
        apiKeyPrefix: apiKey?.substring(0, 10) || 'N/A',
        windowGoogleExists: !!window.google,
        mapsAPILoaded: !!(window.google && window.google.maps),
        placesAPILoaded: !!(window.google && window.google.maps && window.google.maps.places),
        placesServiceAvailable: !!(window.google && window.google.maps && window.google.maps.places && window.google.maps.places.PlacesService),
        geocoderAvailable: !!(window.google && window.google.maps && window.google.maps.Geocoder),
        directionsServiceAvailable: !!(window.google && window.google.maps && window.google.maps.DirectionsService),
      };

      if (window.google && window.google.maps) {
        info.mapsVersion = window.google.maps.version;
        
        // Test Places API
        if (window.google.maps.places) {
          try {
            // Create a test service
            const testDiv = document.createElement('div');
            const testPlacesService = new window.google.maps.places.PlacesService(testDiv);
            info.placesServiceCreated = !!testPlacesService;
            
            // Test a simple places search for Colombo area
            console.log('🧪 Testing Google Places API with nearby search...');
            testPlacesService.nearbySearch(
              {
                location: new window.google.maps.LatLng(6.9271, 79.8612), // Colombo
                radius: 5000,
                type: ['tourist_attraction']
              },
              (results, status) => {
                console.log('🧪 Places API Test Result:', { status, resultsCount: results?.length });
                info.testSearchStatus = status;
                info.testSearchResults = results?.length || 0;
                info.testSearchTimestamp = new Date().toLocaleTimeString();
                
                if (status === 'OK' && results?.length > 0) {
                  info.sampleAttractions = results.slice(0, 3).map(place => ({
                    name: place.name,
                    rating: place.rating,
                    types: place.types?.slice(0, 2)
                  }));
                }
                
                if (status === 'REQUEST_DENIED') {
                  info.apiKeyIssue = 'Places API access denied - check API key permissions';
                } else if (status === 'OVER_QUERY_LIMIT') {
                  info.apiKeyIssue = 'API quota exceeded - check billing account';
                } else if (status === 'OK') {
                  info.apiKeyIssue = null; // Clear any previous errors
                }
                
                setDebugInfo(prev => ({ ...prev, ...info }));
              }
            );
          } catch (error) {
            console.error('🧪 Places API Test Error:', error);
            info.placesServiceError = error.message;
          }
        }
      }

      setDebugInfo(info);
    };

    // Check immediately and after a delay
    checkGoogleMapsAPI();
    setTimeout(checkGoogleMapsAPI, 2000);
    setTimeout(checkGoogleMapsAPI, 5000);
  }, []);

  const getStatusIcon = (value) => {
    if (value === true) return '✅';
    if (value === false) return '❌';
    return '⚠️';
  };

  const getStatusColor = (value) => {
    if (value === true) return '#4caf50';
    if (value === false) return '#f44336';
    return '#ff9800';
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      width: '400px',
      background: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      fontSize: '12px',
      zIndex: 10000,
      maxHeight: '80vh',
      overflow: 'auto',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>🔧 Google Maps API Debug</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Last Check:</strong> {debugInfo.timestamp}
      </div>

      {/* Test button */}
      <button 
        onClick={() => window.location.reload()} 
        style={{
          background: '#007bff',
          color: 'white',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '11px',
          marginBottom: '10px',
          cursor: 'pointer'
        }}
      >
        🔄 Refresh Debug
      </button>

      <table style={{ width: '100%', fontSize: '11px' }}>
        <tbody>
          <tr>
            <td>API Key Present</td>
            <td style={{ color: getStatusColor(debugInfo.apiKeyExists) }}>
              {getStatusIcon(debugInfo.apiKeyExists)} {debugInfo.apiKeyExists ? 'Yes' : 'No'}
            </td>
          </tr>
          <tr>
            <td>API Key Length</td>
            <td>{debugInfo.apiKeyLength}</td>
          </tr>
          <tr>
            <td>API Key Prefix</td>
            <td style={{ fontFamily: 'monospace' }}>{debugInfo.apiKeyPrefix}</td>
          </tr>
          <tr>
            <td>Google Object</td>
            <td style={{ color: getStatusColor(debugInfo.windowGoogleExists) }}>
              {getStatusIcon(debugInfo.windowGoogleExists)}
            </td>
          </tr>
          <tr>
            <td>Maps API</td>
            <td style={{ color: getStatusColor(debugInfo.mapsAPILoaded) }}>
              {getStatusIcon(debugInfo.mapsAPILoaded)} {debugInfo.mapsVersion}
            </td>
          </tr>
          <tr>
            <td>Places API</td>
            <td style={{ color: getStatusColor(debugInfo.placesAPILoaded) }}>
              {getStatusIcon(debugInfo.placesAPILoaded)}
            </td>
          </tr>
          <tr>
            <td>PlacesService</td>
            <td style={{ color: getStatusColor(debugInfo.placesServiceAvailable) }}>
              {getStatusIcon(debugInfo.placesServiceAvailable)}
            </td>
          </tr>
          <tr>
            <td>PlacesService Created</td>
            <td style={{ color: getStatusColor(debugInfo.placesServiceCreated) }}>
              {getStatusIcon(debugInfo.placesServiceCreated)}
            </td>
          </tr>
          <tr>
            <td>Test Search Status</td>
            <td style={{ 
              color: debugInfo.testSearchStatus === 'OK' ? '#4caf50' : 
                     debugInfo.testSearchStatus === 'REQUEST_DENIED' ? '#f44336' : 
                     debugInfo.testSearchStatus === 'OVER_QUERY_LIMIT' ? '#ff9800' : '#666'
            }}>
              {debugInfo.testSearchStatus || 'Pending...'}
            </td>
          </tr>
          <tr>
            <td>Test Results Count</td>
            <td style={{ color: debugInfo.testSearchResults > 0 ? '#4caf50' : '#666' }}>
              {debugInfo.testSearchResults || 0}
            </td>
          </tr>
          {debugInfo.testSearchTimestamp && (
            <tr>
              <td>Last Test</td>
              <td>{debugInfo.testSearchTimestamp}</td>
            </tr>
          )}
          {debugInfo.sampleAttractions && debugInfo.sampleAttractions.length > 0 && (
            <tr>
              <td>Sample Results</td>
              <td style={{ fontSize: '10px' }}>
                {debugInfo.sampleAttractions.map(attr => attr.name).join(', ')}
              </td>
            </tr>
          )}
          {debugInfo.apiKeyIssue && (
            <tr>
              <td>API Issue</td>
              <td style={{ color: '#f44336', fontSize: '10px' }}>{debugInfo.apiKeyIssue}</td>
            </tr>
          )}
          {debugInfo.placesServiceError && (
            <tr>
              <td>Error</td>
              <td style={{ color: '#f44336', fontSize: '10px' }}>{debugInfo.placesServiceError}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: '10px', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
        <strong>Diagnosis:</strong>
        <br />
        {!debugInfo.apiKeyExists && '❌ No API key found'}
        {!debugInfo.mapsAPILoaded && '❌ Google Maps not loaded'}
        {!debugInfo.placesAPILoaded && '❌ Places API not loaded'}
        {debugInfo.placesAPILoaded && debugInfo.testSearchStatus === 'OK' && debugInfo.testSearchResults > 0 && 
         '✅ Google Maps Places API working perfectly!'}
        {debugInfo.placesAPILoaded && debugInfo.testSearchStatus === 'OK' && debugInfo.testSearchResults === 0 && 
         '⚠️ Places API working but no attractions found in test area'}
        {debugInfo.placesAPILoaded && debugInfo.testSearchStatus === 'REQUEST_DENIED' && 
         '❌ Places API enabled but access denied - check API key restrictions'}
        {debugInfo.placesAPILoaded && debugInfo.testSearchStatus === 'OVER_QUERY_LIMIT' && 
         '❌ API quota exceeded - check billing account'}
        {debugInfo.placesAPILoaded && debugInfo.testSearchStatus && 
         !['OK', 'REQUEST_DENIED', 'OVER_QUERY_LIMIT'].includes(debugInfo.testSearchStatus) && 
         `❌ API Error: ${debugInfo.testSearchStatus}`}
        {debugInfo.placesAPILoaded && !debugInfo.testSearchStatus && 
         '🔄 Testing Places API...'}
      </div>
    </div>
  );
};

export default GoogleMapsDebugger;