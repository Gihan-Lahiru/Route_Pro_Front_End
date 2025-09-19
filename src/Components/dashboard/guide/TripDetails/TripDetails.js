import React, { useState, useEffect } from "react";
import { sessionUtils, apiMethods } from "../../../../utils/api-client";
import "./TripDetails.css";

const TripDetails = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGuideTrips();
  }, []);

  const fetchGuideTrips = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the current user's guide ID
      const currentUser = sessionUtils.getCurrentUser();
      if (!currentUser || !currentUser.userId) {
        setError("User not logged in");
        return;
      }

      console.log(
        "🧭 Starting guide trips fetch for user:",
        currentUser.userId
      );
      console.log("🧭 Full user object:", currentUser);

      // First, get the guide ID from the user ID
      const guideUrl = `${apiMethods.getBackendUrl()}/api/guides/guide.php?user_id=${
        currentUser.userId
      }`;
      console.log("🧭 Guide API URL:", guideUrl);

      const guideResponse = await fetch(guideUrl);
      const guideData = await guideResponse.json();

      console.log("🧭 Guide API response:", guideData);

      if (!guideData.success || !guideData.guide) {
        console.error("🧭 Guide profile not found:", guideData);
        setError("Guide profile not found");
        return;
      }

      const guideId = guideData.guide.id;
      console.log("🧭 Using guide ID:", guideId);

      // Now fetch trips using the guide ID
      const tripsUrl = `${apiMethods.getBackendUrl()}/api/trips/trips.php?guide_id=${guideId}`;
      console.log("🧭 Trips API URL:", tripsUrl);

      const response = await fetch(tripsUrl);
      const data = await response.json();

      console.log("🧭 Trips API response:", data);

      if (data.success) {
        // Show ALL trips (don't filter by date) - guides should see their full history
        console.log("🧭 Total trips found:", data.trips.length);
        setTrips(data.trips || []);
      } else {
        console.error("🧭 Failed to fetch trips:", data);
        setError(data.message || "Failed to fetch trips");
      }
    } catch (err) {
      console.error("🧭 Error fetching guide trips:", err);
      setError("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatEstimatedTime = (hours) => {
    if (!hours || hours === "0") return "TBD";
    const hoursNum = parseFloat(hours);
    if (hoursNum < 1) {
      return `${Math.round(hoursNum * 60)} mins`;
    } else {
      return `${hoursNum} hrs`;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "completed";
      case "in_progress":
        return "in-progress";
      case "cancelled":
        return "cancelled";
      case "not_started":
      default:
        return "active";
    }
  };

  const handleStartTrip = async (tripId) => {
    try {
      const confirmStart = window.confirm(
        "Are you sure you want to start this trip?"
      );
      if (!confirmStart) return;

      const response = await fetch(
        `${apiMethods.getBackendUrl()}/api/trips/update-status.php`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trip_id: tripId,
            status: "in_progress",
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("Trip started successfully!");
        fetchGuideTrips(); // Refresh trips list
      } else {
        alert(`Failed to start trip: ${result.message}`);
      }
    } catch (error) {
      console.error("Error starting trip:", error);
      alert("Failed to start trip. Please try again.");
    }
  };

  const handleCompleteTrip = async (tripId) => {
    try {
      const confirmComplete = window.confirm(
        "Are you sure you want to mark this trip as completed?"
      );
      if (!confirmComplete) return;

      const response = await fetch(
        `${apiMethods.getBackendUrl()}/api/trips/update-status.php`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trip_id: tripId,
            status: "completed",
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("Trip completed successfully!");
        fetchGuideTrips(); // Refresh trips list
      } else {
        alert(`Failed to complete trip: ${result.message}`);
      }
    } catch (error) {
      console.error("Error completing trip:", error);
      alert("Failed to complete trip. Please try again.");
    }
  };

  const handleViewRoute = (trip) => {
    // TODO: Implement view route functionality
    alert(`Viewing route from ${trip.start_location} to ${trip.end_location}`);
  };

  const handleContact = (trip) => {
    // TODO: Implement contact functionality
    const contactInfo = trip.traveler_phone
      ? `phone: ${trip.traveler_phone}`
      : `email: ${trip.traveler_email}`;
    alert(`Contacting ${trip.traveler_name} via ${contactInfo}`);
  };

  if (loading) {
    return (
      <div className="trip-details">
        <div className="trip-details-header">
          <h2>Assigned Tours</h2>
        </div>
        <div className="loading">Loading trips...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trip-details">
        <div className="trip-details-header">
          <h2>Assigned Tours</h2>
        </div>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="trip-details">
      <div className="trip-details-header">
        <h2>Assigned Tours</h2>
        <span className="trip-count">{trips.length}</span>
      </div>

      {trips.length === 0 ? (
        <div className="no-trips">
          <p>No tours assigned.</p>
          <p>Check back later for new bookings!</p>
        </div>
      ) : (
        <div className="trip-grid">
          {trips.map((trip) => (
            <div key={trip.trip_id} className="trip-card">
              <div className="trip-card-header">
                <span
                  className={`status-badge ${getStatusBadgeClass(
                    trip.trip_status
                  )}`}
                >
                  {trip.trip_status
                    ?.replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase()) || "Active"}
                </span>
                <span className="trip-id">#{trip.trip_id}</span>
              </div>

              <div className="trip-info">
                <h4 className="destination">
                  {trip.start_location && trip.end_location
                    ? `${trip.start_location} → ${trip.end_location}`
                    : `Trip #${trip.trip_id} - Custom Route`}
                </h4>
                <p>
                  <strong>Traveler:</strong> {trip.traveler_name}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {trip.traveler_email || "Not provided"}
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {trip.traveler_phone || "Not provided"}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(trip.date)}
                </p>
                <p>
                  <strong>Start Time:</strong> {formatTime(trip.start_time)}
                </p>
                <p>
                  <strong>Distance:</strong> {trip.distance_km} km
                </p>
                <p>
                  <strong>Estimated Time:</strong>{" "}
                  {formatEstimatedTime(trip.estimated_time)}
                </p>
                <p>
                  <strong>Fee:</strong> Rs. {trip.route_cost}
                </p>
                {trip.special_requests && (
                  <div className="special-requests">
                    <p>
                      <strong>Special Requests:</strong>
                    </p>
                    <div className="special-requests-content">
                      {trip.special_requests}
                    </div>
                  </div>
                )}
              </div>

              <div className="trip-actions">
                {trip.trip_status === "cancelled" ? (
                  <div className="cancelled-notice">
                    <p>
                      <em>This trip was cancelled by the traveler</em>
                    </p>
                  </div>
                ) : trip.trip_status === "completed" ? (
                  <div className="completed-notice">
                    <p>
                      <em>✅ Trip completed</em>
                    </p>
                    <button onClick={() => handleViewRoute(trip)}>
                      View Route
                    </button>
                  </div>
                ) : (
                  <>
                    {trip.trip_status === "not_started" && (
                      <button
                        onClick={() => handleStartTrip(trip.trip_id)}
                        className="start-trip-btn"
                      >
                        🗺️ Start Guide Tour
                      </button>
                    )}
                    {trip.trip_status === "in_progress" && (
                      <button
                        onClick={() => handleCompleteTrip(trip.trip_id)}
                        className="complete-trip-btn"
                      >
                        ✅ Complete Tour
                      </button>
                    )}
                    <button onClick={() => handleViewRoute(trip)}>
                      View Route
                    </button>
                    <button onClick={() => handleContact(trip)}>Contact</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripDetails;
