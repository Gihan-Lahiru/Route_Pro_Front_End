import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

// Replace with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';

const MapComponent = ({ origin, destination, setRouteDetails, setNearbyPlaces, findAttractions = false }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [placesService, setPlacesService] = useState(null);

  // Debug logging when component mounts
  useEffect(() => {
    console.log('🔧 GoogleMapComponent mounted');
    console.log('📋 Props received:', { 
      origin, 
      destination, 
      findAttractions, 
      hasSetRouteDetails: !!setRouteDetails,
      hasSetNearbyPlaces: !!setNearbyPlaces 
    });
    console.log('🔑 API Key available:', !!GOOGLE_MAPS_API_KEY);
    console.log('🔑 API Key (first 10 chars):', GOOGLE_MAPS_API_KEY?.substring(0, 10));
    console.log('🔑 Full API Key for debugging:', GOOGLE_MAPS_API_KEY);
    
    // Check if Google Maps API is loaded
    if (window.google && window.google.maps) {
      console.log('✅ Google Maps API is loaded');
      console.log('🔧 Google Maps version:', window.google.maps.version);
      if (window.google.maps.places) {
        console.log('✅ Places API is available');
      } else {
        console.log('❌ Places API not available - this is the problem!');
      }
    } else {
      console.log('❌ Google Maps API not loaded yet');
    }

    // Add a global test function for manual testing
    window.testGooglePlaces = () => {
      console.log('🧪 Manual Places API test triggered');
      console.log('🧪 PlacesService available:', !!placesService);
      console.log('🧪 Google Maps loaded:', !!window.google?.maps);
      console.log('🧪 Places API loaded:', !!window.google?.maps?.places);
      
      if (!window.google?.maps?.places) {
        console.error('❌ Google Maps Places API not loaded!');
        return;
      }
      
      if (!placesService) {
        console.error('❌ Places service not initialized!');
        console.log('🔧 Attempting to create places service...');
        
        if (map) {
          const testPlacesService = new window.google.maps.places.PlacesService(map);
          console.log('🔧 Test places service created:', !!testPlacesService);
          
          const request = {
            location: new window.google.maps.LatLng(6.9271, 79.8612), // Colombo
            radius: 5000,
            type: ['tourist_attraction']
          };
          
          console.log('🧪 Making test request with new service...');
          testPlacesService.nearbySearch(request, (results, status) => {
            console.log('🧪 Test service results:', { status, count: results?.length });
            if (status === 'OK' && results) {
              console.log('🧪 Sample places:', results.slice(0, 3).map(p => p.name));
              const testPlaces = results.slice(0, 5).map(place => ({
                name: place.name,
                vicinity: place.vicinity,
                rating: place.rating,
                types: place.types,
                place_id: place.place_id,
                geometry: {
                  location: {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                  },
                }
              }));
              console.log('🧪 Calling setNearbyPlaces with test data:', testPlaces);
              setNearbyPlaces(testPlaces);
            } else {
              console.error('🧪 Test service failed:', status);
            }
          });
        } else {
          console.error('❌ Map not available for places service!');
        }
        return;
      }
      
      const request = {
        location: new window.google.maps.LatLng(6.9271, 79.8612), // Colombo
        radius: 5000,
        type: ['tourist_attraction']
      };
      
      console.log('🧪 Making test request...');
      placesService.nearbySearch(request, (results, status) => {
        console.log('🧪 Manual test results:', { status, resultsCount: results?.length });
        if (status === 'OK' && results) {
          console.log('🧪 Sample places:', results.slice(0, 3).map(p => p.name));
          const testPlaces = results.slice(0, 5).map(place => ({
            name: place.name,
            vicinity: place.vicinity,
            rating: place.rating,
            types: place.types,
            place_id: place.place_id,
            geometry: {
              location: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              },
            }
          }));
          console.log('🧪 Calling setNearbyPlaces with test data:', testPlaces);
          setNearbyPlaces(testPlaces);
        } else {
          console.error('🧪 Places search failed with status:', status);
          if (status === 'REQUEST_DENIED') {
            console.error('🧪 API key issue - Places API access denied');
          } else if (status === 'OVER_QUERY_LIMIT') {
            console.error('🧪 API quota exceeded');
          } else if (status === 'INVALID_REQUEST') {
            console.error('🧪 Invalid request parameters');
          }
        }
      });
    };
  }, [origin, destination, findAttractions, placesService]);

  // Initialize map
  const initializeMap = useCallback(() => {
    if (!mapRef.current || map) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat: 7.8731, lng: 80.7718 }, // Sri Lanka center
      zoom: 8,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
    });

    const directionsServiceInstance = new window.google.maps.DirectionsService();
    const directionsRendererInstance = new window.google.maps.DirectionsRenderer({
      draggable: true,
      panel: null, // We'll handle directions display ourselves
    });
    
    directionsRendererInstance.setMap(mapInstance);
    
    const placesServiceInstance = new window.google.maps.places.PlacesService(mapInstance);

    setMap(mapInstance);
    setDirectionsService(directionsServiceInstance);
    setDirectionsRenderer(directionsRendererInstance);
    setPlacesService(placesServiceInstance);

    // Listen for route changes when user drags the route
    directionsRendererInstance.addListener('directions_changed', () => {
      const directions = directionsRendererInstance.getDirections();
      updateRouteDetails(directions);
    });
  }, [map]);

  // Geocoding function
  const geocodeLocation = (location) => {
    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { address: `${location}, Sri Lanka` },
        (results, status) => {
          if (status === 'OK' && results[0]) {
            resolve({
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
              formatted_address: results[0].formatted_address,
            });
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        }
      );
    });
  };

  // Calculate and display route
  const calculateRoute = async () => {
    if (!directionsService || !origin || !destination) return;

    console.log('🚀 Calculating route from', origin, 'to', destination, 'with attractions:', findAttractions);

    try {
      // Geocode origin and destination
      const [originCoords, destinationCoords] = await Promise.all([
        geocodeLocation(origin),
        geocodeLocation(destination),
      ]);

      // Calculate route
      const request = {
        origin: new window.google.maps.LatLng(originCoords.lat, originCoords.lng),
        destination: new window.google.maps.LatLng(destinationCoords.lat, destinationCoords.lng),
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      };

      directionsService.route(request, (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
          updateRouteDetails(result);
          
          // Find nearby places along the route only if requested
          console.log('🔄 Route calculated. Find attractions enabled:', findAttractions);
          if (findAttractions) {
            console.log('🎯 Starting attraction search...');
            findNearbyPlaces(result.routes[0]);
          } else {
            console.log('🚫 Attractions disabled, clearing places');
            setNearbyPlaces([]); // Clear previous attractions
          }
        } else {
          console.error('Directions request failed:', status);
          setRouteDetails({
            distance: '',
            duration: '',
            bounds: null,
          });
        }
      });
    } catch (error) {
      console.error('Error calculating route:', error);
      setRouteDetails({
        distance: '',
        duration: '',
        bounds: null,
      });
    }
  };

  // Update route details
  const updateRouteDetails = (directionsResult) => {
    if (!directionsResult || !directionsResult.routes[0]) return;

    const route = directionsResult.routes[0];
    const leg = route.legs[0];

    setRouteDetails({
      distance: leg.distance.text,
      duration: leg.duration.text,
      bounds: route.bounds,
      steps: leg.steps.map(step => ({
        instruction: step.instructions.replace(/<[^>]*>/g, ''), // Remove HTML tags
        distance: step.distance.text,
        duration: step.duration.text,
      })),
    });
  };

  // Find nearby places along the route
  const findNearbyPlaces = (route) => {
    console.log('🔍 Starting to find nearby places...', { placesService: !!placesService, route: !!route });
    
    if (!placesService || !route) {
      console.error('❌ Missing placesService or route:', { placesService: !!placesService, route: !!route });
      return;
    }

    const places = [];
    const processedPlaces = new Set(); // To avoid duplicates

    // Get waypoints along the route
    const path = route.overview_path;
    console.log('🗺️ Route path length:', path?.length);
    
    if (!path || path.length === 0) {
      console.error('❌ No route path found');
      return;
    }

    const step = Math.max(1, Math.floor(path.length / 10)); // Sample 10 points along route
    console.log('📍 Searching at', Math.ceil(path.length / step), 'points along route');

    let placesFound = 0;
    let searchesCompleted = 0;
    const maxPlaces = 20;
    const totalSearches = Math.ceil(path.length / step);

    for (let i = 0; i < path.length && placesFound < maxPlaces; i += step) {
      const point = path[i];
      
      const request = {
        location: point,
        radius: 5000, // 5km radius
        type: ['tourist_attraction', 'museum', 'park', 'point_of_interest'],
      };

      console.log('🔍 Searching at point', i, ':', point.lat(), point.lng());

      placesService.nearbySearch(request, (results, status) => {
        searchesCompleted++;
        console.log(`📊 Search ${searchesCompleted}/${totalSearches} completed. Status:`, status);
        
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          console.log('✅ Found', results.length, 'places at this location');
          
          results.slice(0, 5).forEach(place => { // Limit to 5 places per search
            const placeId = place.place_id;
            console.log('🔍 Checking place:', place.name, 'Rating:', place.rating, 'Already processed:', processedPlaces.has(placeId));
            
            // Relaxed criteria: accept places with any rating or no rating, and avoid duplicates
            if (!processedPlaces.has(placeId)) {
              processedPlaces.add(placeId);
              places.push({
                name: place.name,
                vicinity: place.vicinity,
                rating: place.rating || 4.0, // Default rating if none exists
                types: place.types,
                place_id: place.place_id,
                geometry: {
                  location: {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                  },
                },
                photos: place.photos ? place.photos.slice(0, 1).map(photo => ({
                  getUrl: () => photo.getUrl({ maxWidth: 400, maxHeight: 300 })
                })) : [],
              });
              placesFound++;
              console.log('➕ Added place:', place.name, 'Rating:', place.rating || 'No rating');
            } else {
              console.log('🚫 Skipped place (duplicate):', place.name);
            }
          });
        } else {
          console.warn('⚠️ Places search failed:', status);
        }

        // Always update after each search completes
        if (searchesCompleted >= totalSearches) {
          console.log('🎯 All searches completed! Updating nearby places with', places.length, 'places');
          console.log('📋 Final places list:', places.map(p => p.name));
          console.log('🔧 About to call setNearbyPlaces with:', places);
          console.log('🔧 setNearbyPlaces function exists:', !!setNearbyPlaces);
          setNearbyPlaces([...places.slice(0, 15)]); // Create new array to trigger re-render
          console.log('✅ setNearbyPlaces called successfully');
        } else if (places.length >= 10) {
          console.log('🎯 Found enough places! Updating nearby places with', places.length, 'places');
          console.log('📋 Current places list:', places.map(p => p.name));
          console.log('🔧 About to call setNearbyPlaces with:', places);
          console.log('🔧 setNearbyPlaces function exists:', !!setNearbyPlaces);
          setNearbyPlaces([...places.slice(0, 15)]); // Create new array to trigger re-render
          console.log('✅ setNearbyPlaces called successfully');
        }
      });
    }

    // Fallback: if no places found after a delay, set empty array
    setTimeout(() => {
      console.log('⏰ Timeout check: searchesCompleted:', searchesCompleted, 'totalSearches:', totalSearches, 'places found:', places.length);
      if (searchesCompleted >= totalSearches && places.length === 0) {
        console.log('⏰ No places found after all searches completed');
        setNearbyPlaces([]);
      } else if (places.length > 0 && searchesCompleted >= totalSearches) {
        console.log('⏰ Final update: Setting places after timeout');
        setNearbyPlaces([...places.slice(0, 15)]);
      }
    }, 8000); // 8 second timeout for all searches to complete
  };

  // Effect to calculate route when origin/destination changes
  useEffect(() => {
    if (map && origin && destination) {
      calculateRoute();
    }
  }, [map, origin, destination]);

  // Effect to initialize map when component mounts
  useEffect(() => {
    if (window.google && window.google.maps) {
      initializeMap();
    }
  }, [initializeMap]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '550px', 
        borderRadius: '10px',
        border: '1px solid #ddd',
      }} 
    />
  );
};

// Google Maps wrapper component
const GoogleMapComponent = (props) => {
  console.log('🚀 GoogleMapComponent rendering...');
  console.log('🔑 API Key available:', !!GOOGLE_MAPS_API_KEY);
  console.log('🔑 API Key (first 10 chars):', GOOGLE_MAPS_API_KEY?.substring(0, 10));
  console.log('🔑 Full API Key for debugging:', GOOGLE_MAPS_API_KEY);
  
  // Create a simple test function immediately
  window.simpleTest = () => {
    console.log('🧪 Simple test function called!');
    console.log('🔧 Window.google exists:', !!window.google);
    console.log('🔧 Window.google.maps exists:', !!window.google?.maps);
    console.log('🔧 Window.google.maps.places exists:', !!window.google?.maps?.places);
    return 'Test function is working!';
  };
  
  console.log('✅ Created window.simpleTest function');
  
  const renderMap = (status) => {
    switch (status) {
      case Status.LOADING:
        return <div style={{ 
          width: '100%', 
          height: '550px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '10px',
          border: '1px solid #ddd',
        }}>
          <div>Loading Google Maps...</div>
        </div>;
      case Status.FAILURE:
        return <div style={{ 
          width: '100%', 
          height: '550px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#ffebee',
          borderRadius: '10px',
          border: '1px solid #ddd',
          color: '#c62828',
        }}>
          <div>Error loading Google Maps</div>
        </div>;
      case Status.SUCCESS:
        return <MapComponent {...props} />;
      default:
        return null;
    }
  };

  return (
    <Wrapper 
      apiKey={GOOGLE_MAPS_API_KEY} 
      render={renderMap}
      libraries={['places', 'geometry']}
      onError={(error) => {
        console.error('🚨 Google Maps API Error:', error);
      }}
      onLoad={() => {
        console.log('🎉 Google Maps API loaded successfully');
        console.log('🔧 Places API available:', !!window.google?.maps?.places);
        console.log('🔧 Full Google object:', window.google);
        
        // Add enhanced debugging function once API is loaded
        window.testGoogleAPILoaded = () => {
          console.log('🧪 Testing API after load...');
          console.log('🔧 Google Maps version:', window.google?.maps?.version);
          console.log('🔧 Places library:', window.google?.maps?.places);
          console.log('🔧 Available services:', Object.keys(window.google?.maps?.places || {}));
        };
      }}
    />
  );
};

export default GoogleMapComponent;