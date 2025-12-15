// Trip Duration Tracking Utility
import { apiMethods } from "./api-client";

export const tripDurationTracker = {
  // Update trip status with timestamp tracking
  updateTripStatus: async (tripId, newStatus, userType = "driver") => {
    try {
      const updateData = {
        trip_id: tripId,
        status: newStatus,
        timestamp: new Date().toISOString(),
        updated_by: userType,
      };

      // Add specific timestamp based on status
      switch (newStatus) {
        case "in_progress":
          updateData.started_at = new Date().toISOString();
          console.log(`🚗 Trip ${tripId} STARTED at ${updateData.started_at}`);
          break;
        case "completed":
          updateData.completed_at = new Date().toISOString();
          console.log(
            `✅ Trip ${tripId} COMPLETED at ${updateData.completed_at}`
          );
          break;
      }

      const response = await fetch(
        `${apiMethods.getBackendUrl()}/api/trips/update-status-with-duration.php`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Log trip duration if completed
        if (newStatus === "completed" && result.trip_duration) {
          console.log(
            `⏱️ Trip ${tripId} Duration: ${result.trip_duration} minutes`
          );

          // Check if trip took around 5 minutes
          const duration = result.trip_duration;
          if (duration <= 5) {
            console.log(
              `🎯 Quick Trip: Completed in ${duration} minutes (≤5 min)`
            );
          } else if (duration <= 10) {
            console.log(
              `⚡ Fast Trip: Completed in ${duration} minutes (5-10 min)`
            );
          } else {
            console.log(`🐌 Long Trip: Took ${duration} minutes (>10 min)`);
          }
        }

        return result;
      } else {
        throw new Error(result.message || "Failed to update trip status");
      }
    } catch (error) {
      console.error("Error updating trip status with duration:", error);
      throw error;
    }
  },

  // Get trip duration statistics
  getTripDurations: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(
        `${apiMethods.getBackendUrl()}/api/trips/trip-durations.php?${queryParams}`
      );

      const data = await response.json();

      if (data.success) {
        return data.durations;
      } else {
        throw new Error(data.message || "Failed to fetch trip durations");
      }
    } catch (error) {
      console.error("Error fetching trip durations:", error);
      throw error;
    }
  },

  // Format duration for display
  formatDuration: (minutes) => {
    if (!minutes) return "N/A";

    if (minutes < 60) {
      return `${minutes} min${minutes !== 1 ? "s" : ""}`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
  },

  // Check if trip duration is within expected range
  isDurationNormal: (minutes, expectedMinutes = 5) => {
    if (!minutes) return null;

    const tolerance = expectedMinutes * 0.5; // 50% tolerance
    const minDuration = expectedMinutes - tolerance;
    const maxDuration = expectedMinutes + tolerance;

    return {
      isNormal: minutes >= minDuration && minutes <= maxDuration,
      isQuick: minutes < minDuration,
      isSlow: minutes > maxDuration,
      difference: minutes - expectedMinutes,
    };
  },
};

export default tripDurationTracker;
