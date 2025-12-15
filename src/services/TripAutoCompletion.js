/**
 * Trip Auto-Completion Service
 * Automatically completes trips after 5 minutes and triggers notifications
 */

import { apiMethods } from "../utils/api-client";

class TripAutoCompletionService {
  constructor() {
    this.activeTimers = new Map(); // Store active timers for each trip
    this.completionDelay = 5 * 60 * 1000; // 5 minutes in milliseconds
    this.isRunning = false;
    this.checkInterval = null;
  }

  /**
   * Start the auto-completion service
   */
  start() {
    if (this.isRunning) {
      console.log("⏸️ Auto-completion service is already running");
      return;
    }

    this.isRunning = true;
    console.log("▶️ Starting trip auto-completion service...");

    // Check for existing confirmed trips
    this.checkExistingTrips();

    // Set up periodic checks for new confirmed trips
    this.checkInterval = setInterval(() => {
      this.checkExistingTrips();
    }, 30000); // Check every 30 seconds

    console.log("✅ Trip auto-completion service started");
  }

  /**
   * Stop the auto-completion service
   */
  stop() {
    if (!this.isRunning) {
      console.log("⏸️ Auto-completion service is not running");
      return;
    }

    this.isRunning = false;

    // Clear all active timers
    this.activeTimers.forEach((timer, tripId) => {
      clearTimeout(timer);
      console.log(`⏹️ Cancelled auto-completion for trip #${tripId}`);
    });
    this.activeTimers.clear();

    // Clear the check interval
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    console.log("🛑 Trip auto-completion service stopped");
  }

  /**
   * Schedule completion for a specific trip
   */
  scheduleCompletion(tripId, createdAt = null) {
    // Don't schedule if already scheduled
    if (this.activeTimers.has(tripId)) {
      console.log(`⏰ Trip #${tripId} already scheduled for auto-completion`);
      return;
    }

    let delay = this.completionDelay;

    // If createdAt is provided, calculate remaining time from booking time
    if (createdAt) {
      const bookingTime = new Date(createdAt);
      const now = new Date();
      const elapsed = now - bookingTime;
      delay = Math.max(0, this.completionDelay - elapsed);
    }

    console.log(
      `⏰ Scheduling trip #${tripId} for auto-completion in ${Math.round(
        delay / 1000
      )} seconds (based on booking time: ${createdAt})`
    );

    // Show initial notification
    this.showCountdownNotification(tripId, delay);

    const timer = setTimeout(() => {
      this.completeTrip(tripId);
    }, delay);

    this.activeTimers.set(tripId, timer);
  }

  /**
   * Check for existing confirmed trips and schedule them
   */
  async checkExistingTrips() {
    try {
      console.log("🔍 Checking for confirmed trips...");

      const response = await fetch(
        "http://localhost/RoutePro-backend(02)/public/api/trips/get-confirmed-trips.php",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.trips && data.trips.length > 0) {
        console.log(`📋 Found ${data.trips.length} confirmed trips`);

        data.trips.forEach((trip) => {
          // Only schedule if not already scheduled and not already completed
          if (!this.activeTimers.has(trip.trip_id) && !trip.auto_completed) {
            this.scheduleCompletion(trip.trip_id, trip.created_at);
          }
        });
      } else {
        console.log("📋 No confirmed trips found");
      }
    } catch (error) {
      console.error("❌ Error checking confirmed trips:", error);
    }
  }

  /**
   * Complete a trip and update its status
   */
  async completeTrip(tripId) {
    try {
      console.log(`🏁 Auto-completing trip #${tripId}...`);

      const response = await fetch(
        "http://localhost/RoutePro-backend(02)/public/api/trips/enhanced-update-status.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trip_id: tripId,
            status: "completed",
            auto_completed: true,
            completed_at: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        console.log(`✅ Trip #${tripId} auto-completed successfully`);

        // Remove from active timers
        this.activeTimers.delete(tripId);

        // Show completion notification
        this.showCompletionNotification(tripId);

        // Trigger rating modal
        this.triggerRatingModal(tripId);

        // Create completion notification in database
        await this.createCompletionNotification(tripId);
      } else {
        console.error(
          `❌ Failed to auto-complete trip #${tripId}:`,
          data.message
        );
      }
    } catch (error) {
      console.error(`❌ Error auto-completing trip #${tripId}:`, error);
    }
  }

  /**
   * Create completion notification in database
   */
  async createCompletionNotification(tripId) {
    try {
      // This would integrate with your notification system
      console.log(`📬 Creating completion notification for trip #${tripId}`);

      // You can implement this to integrate with your existing notification system
      // For now, we'll just log it
    } catch (error) {
      console.error(
        `❌ Error creating notification for trip #${tripId}:`,
        error
      );
    }
  }

  /**
   * Show countdown notification
   */
  showCountdownNotification(tripId, remainingTime) {
    const minutes = Math.ceil(remainingTime / (1000 * 60));

    // Create a non-blocking notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`Trip #${tripId} Auto-Completion`, {
        body: `Your trip will be automatically completed in ${minutes} minute(s)`,
        icon: "/images/navigation.png",
        tag: `trip-${tripId}-countdown`,
        requireInteraction: false,
        silent: true,
      });
    }

    // Also log to console
    console.log(
      `⏰ Trip #${tripId} will auto-complete in ${minutes} minute(s)`
    );

    // Schedule update notifications every minute
    if (remainingTime > 60000) {
      // More than 1 minute remaining
      setTimeout(() => {
        const newRemainingTime = remainingTime - 60000;
        if (newRemainingTime > 0 && this.activeTimers.has(tripId)) {
          this.showCountdownNotification(tripId, newRemainingTime);
        }
      }, 60000);
    }
  }

  /**
   * Show completion notification
   */
  showCompletionNotification(tripId) {
    // Create a notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`Trip #${tripId} Completed!`, {
        body: "Your trip has been automatically completed. Please rate your experience.",
        icon: "/images/navigation.png",
        tag: `trip-${tripId}-completed`,
        requireInteraction: true,
      });
    }

    // Also show browser alert as fallback
    console.log(`🎉 Trip #${tripId} has been automatically completed!`);

    // You could also dispatch a custom event here for UI updates
    window.dispatchEvent(
      new CustomEvent("tripAutoCompleted", {
        detail: { tripId },
      })
    );
  }

  /**
   * Cancel auto-completion for a trip
   */
  cancelCompletion(tripId) {
    if (this.activeTimers.has(tripId)) {
      clearTimeout(this.activeTimers.get(tripId));
      this.activeTimers.delete(tripId);
      console.log(`⏹️ Cancelled auto-completion for trip #${tripId}`);
    }
  }

  /**
   * Trigger rating modal for completed trip
   */
  triggerRatingModal(tripId) {
    // Prevent duplicate rating modal triggers
    if (this.ratingModalTriggered?.has?.(tripId)) {
      console.log(
        `⚠️ Rating modal already triggered for trip #${tripId}, skipping`
      );
      return;
    }

    // Track that rating modal was triggered for this trip
    if (!this.ratingModalTriggered) {
      this.ratingModalTriggered = new Set();
    }
    this.ratingModalTriggered.add(tripId);

    // Dispatch custom event that the UpcomingTrips component can listen to
    console.log(`🎯 Triggering rating modal for trip #${tripId}`);
    window.dispatchEvent(
      new CustomEvent("showRatingModal", {
        detail: { tripId },
      })
    );
  }

  /**
   * Clear rating modal tracking for a trip (called when rating is submitted)
   */
  clearRatingModalTracking(tripId) {
    if (this.ratingModalTriggered?.has?.(tripId)) {
      this.ratingModalTriggered.delete(tripId);
      console.log(`✅ Cleared rating modal tracking for trip #${tripId}`);
    }
  }

  /**
   * Get remaining time for a trip's auto-completion
   */
  getRemainingTime(tripId) {
    // This would require storing completion times, simplified for now
    return this.activeTimers.has(tripId) ? "Scheduled" : "Not scheduled";
  }

  /**
   * Test method for quick auto-completion (10 seconds for testing)
   */
  testAutoCompletion(tripId) {
    console.log(`🧪 Testing auto-completion for trip #${tripId} (10 seconds)`);

    setTimeout(() => {
      this.completeTrip(tripId);
    }, 10000); // 10 seconds for testing
  }
}

// Create singleton instance
const tripAutoCompletionService = new TripAutoCompletionService();

export default tripAutoCompletionService;
