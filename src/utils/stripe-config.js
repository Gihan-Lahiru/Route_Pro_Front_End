// Stripe configuration with error handling
import { loadStripe } from "@stripe/stripe-js";

// Your Stripe publishable key
const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51S8d8Y0jsSFGFhTzvrD8TJMxQ6Vv2xhDMOdhsXVaSXRWgf6rtldDhoDKESTvWCF0S6Pskl7JY9Pe9DhskMACmCac00m3wF2IyJ";

// Development mode flag - set to true to disable Stripe in development
const DISABLE_STRIPE_IN_DEV =
  process.env.NODE_ENV === "development" &&
  process.env.REACT_APP_DISABLE_STRIPE === "true";

let stripePromise = null;

// Initialize Stripe with error handling
export const initializeStripe = async () => {
  if (DISABLE_STRIPE_IN_DEV) {
    console.warn("⚠️ Stripe is disabled in development mode");
    return null;
  }

  if (!stripePromise) {
    try {
      console.log("🔄 Initializing Stripe...");
      stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

      // Test if Stripe loaded successfully
      const stripe = await stripePromise;
      if (stripe) {
        console.log("✅ Stripe initialized successfully");
      } else {
        console.error("❌ Failed to load Stripe");
        throw new Error("Stripe failed to load");
      }
    } catch (error) {
      console.error("❌ Stripe initialization error:", error);
      stripePromise = null;
      throw error;
    }
  }

  return stripePromise;
};

// Get the stripe promise (for use with Elements provider)
export const getStripePromise = () => {
  if (DISABLE_STRIPE_IN_DEV) {
    return Promise.resolve(null);
  }

  if (!stripePromise) {
    return initializeStripe();
  }

  return stripePromise;
};

// Check if Stripe is available
export const isStripeAvailable = () => {
  return !DISABLE_STRIPE_IN_DEV && !!stripePromise;
};

export default getStripePromise;
