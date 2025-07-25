// src/Components/MapComponent.jsx

import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "10px",
};

const center = {
  lat: 6.9271, // Colombo
  lng: 79.8612,
};

const MapComponent = ({ origin, destination, setRouteDetails, setNearbyPlaces }) => {
  const [directions, setDirections] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (origin && destination) {
      setDirections(null);
    }
  }, [origin, destination]);

  const directionsCallback = (result, status) => {
    if (status === "OK") {
      setDirections(result);

      const route = result.routes[0].legs[0];
      const bounds = result.routes[0].bounds;

      setRouteDetails({
        distance: route.distance.text,
        duration: route.duration.text,
        bounds: bounds,
      });

      // Find the mid-point for Nearby Search
      const midLat = (route.start_location.lat() + route.end_location.lat()) / 2;
      const midLng = (route.start_location.lng() + route.end_location.lng()) / 2;

      const service = new window.google.maps.places.PlacesService(mapRef.current);

      const request = {
        location: { lat: midLat, lng: midLng },
        radius: 20000, // 20km radius
        type: ["tourist_attraction"],
      };

      service.nearbySearch(request, (results, placesStatus) => {
        if (placesStatus === window.google.maps.places.PlacesServiceStatus.OK) {
          setNearbyPlaces(results);
        } else {
          console.error("Places request failed: ", placesStatus);
          setNearbyPlaces([]);
        }
      });

    } else {
      console.error("Directions request failed due to: " + status);
      setRouteDetails({
        distance: "",
        duration: "",
        bounds: null,
      });
      setNearbyPlaces([]);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={["places"]}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={7}
        onLoad={(map) => (mapRef.current = map)}
      >
        {origin && destination && (
          <DirectionsService
            options={{
              destination: destination,
              origin: origin,
              travelMode: "DRIVING",
            }}
            callback={directionsCallback}
          />
        )}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
