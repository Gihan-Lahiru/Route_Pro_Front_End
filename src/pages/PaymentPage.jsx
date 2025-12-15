import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiMethods } from '../utils/api-client';
import { getStripePromise, isStripeAvailable } from '../utils/stripe-config';
import tripAutoCompletionService from '../services/TripAutoCompletion';
import './PaymentPage.css';

// Get Stripe promise with error handling
const stripePromise = getStripePromise();

// Payment form component
const PaymentForm = ({ tripData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [cardError, setCardError] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [stripeError, setStripeError] = useState(false);

  useEffect(() => {
    // Check if Stripe loaded successfully
    const checkStripe = async () => {
      try {
        const stripeInstance = await stripePromise;
        if (!stripeInstance) {
          setStripeError(true);
          setPaymentMessage('❌ Payment system temporarily unavailable. Please try again later.');
        }
      } catch (error) {
        console.error('❌ Stripe loading error:', error);
        setStripeError(true);
        setPaymentMessage('❌ Failed to load payment system. Please check your internet connection.');
      }
    };
    
    checkStripe();

    if (tripData && !stripeError) {
      createPaymentIntent();
    }
  }, [tripData]);

  const createPaymentIntent = async (forceNew = false) => {
    try {
      console.log('💳 Creating payment intent for amount:', tripData.amount || tripData.total_cost);
      
      // Only clear existing client secret if explicitly forcing new creation
      if (forceNew) {
        setClientSecret('');
        setPaymentIntentId('');
      }
      
      // Prepare trip metadata for Stripe
      const tripMetadata = {
        route: `${tripData.route?.from || tripData.start_location} → ${tripData.route?.to || tripData.end_location}`,
        traveler_name: tripData.traveler?.name || tripData.driver_name || 'Guest'
      };
      
      // Only add driver/guide names if they are valid (not undefined or null)
      if (tripData.driver_name && tripData.driver_name !== 'undefined undefined' && tripData.driver_name !== 'null null') {
        tripMetadata.driver_name = tripData.driver_name;
      }
      
      if (tripData.guide_name && tripData.guide_name !== 'undefined undefined' && tripData.guide_name !== 'null null') {
        tripMetadata.guide_name = tripData.guide_name;
      }
      
      const response = await fetch('http://localhost/RoutePro-backend(02)/public/api/payments/stripe-payment.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_payment_intent',
          trip_id: tripData.trip_id || 'pending', // Use pending since trip not saved yet
          amount: tripData.amount || tripData.total_cost,
          trip_metadata: tripMetadata
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setClientSecret(data.client_secret);
        setPaymentIntentId(data.payment_intent_id);
        console.log('✅ Payment intent created successfully with ID:', data.payment_intent_id);
        setPaymentMessage(''); // Clear any error messages
        return true;
      } else {
        setPaymentMessage(`❌ Failed to initialize payment: ${data.message}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Payment intent creation error:', error);
      setPaymentMessage('❌ Failed to connect to payment server');
      return false;
    }
  };

  const saveTrip = async () => {
    try {
      console.log('💾 Saving trip to database after successful payment');
      console.log('📊 Trip data being saved:', tripData);
      
      const bookingUrl = `${apiMethods.getBackendUrl()}/api/trips/trips.php`;
      console.log('🔗 Booking URL:', bookingUrl);
      
      const response = await fetch(bookingUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData)
      });
      
      console.log('📡 Trip save response status:', response.status);
      console.log('📡 Trip save response ok:', response.ok);
      
      const responseText = await response.text();
      console.log('📄 Trip save raw response:', responseText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
      }
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ JSON parse error for trip save:', parseError);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}...`);
      }
      
      console.log('📥 Trip save parsed result:', result);
      
      if (result.success) {
        console.log('✅ Trip saved successfully with ID:', result.trip_id);
        return result.trip_id;
      } else {
        console.error('❌ Trip save failed:', result);
        throw new Error(result.message || result.error || 'Failed to save trip');
      }
    } catch (error) {
      console.error('❌ Error saving trip:', error);
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    console.log('🚀 Payment form submitted!');
    console.log('🔍 Pre-submission checks:', {
      stripe: !!stripe,
      elements: !!elements,
      clientSecret: !!clientSecret,
      processing: processing
    });
    
    if (!stripe || !elements) {
      console.error('❌ Missing required payment components');
      setPaymentMessage('❌ Payment system not ready. Please refresh and try again.');
      return;
    }

    if (!clientSecret) {
      console.error('❌ No client secret available');
      setPaymentMessage('❌ Payment not initialized. Please refresh and try again.');
      return;
    }

    setProcessing(true);
    setCardError('');
    setPaymentMessage('Processing your payment...');

    try {
      // Get card element and validate it's available
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        console.error('❌ Card element not found in elements');
        throw new Error('Card input not available. Please refresh the page.');
      }

      // Check if card element is complete and valid
      console.log('� Checking card element state...');
      
      // Validate card element is ready
      const cardElementComplete = cardElement._complete;
      const cardElementEmpty = cardElement._empty;
      
      console.log('💳 Card element state:', {
        complete: cardElementComplete,
        empty: cardElementEmpty,
        mounted: !!cardElement._element
      });

      if (cardElementEmpty) {
        setCardError('Please enter your card information');
        setPaymentMessage('❌ Please fill in your card details');
        setProcessing(false);
        return;
      }

      if (!cardElementComplete) {
        setCardError('Please complete your card information');
        setPaymentMessage('❌ Please complete all card fields');
        setProcessing(false);
        return;
      }

      console.log('💳 Starting Stripe payment confirmation...');
      setPaymentMessage('Processing your payment...');

      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: tripData.traveler?.name || tripData.driver_name || 'Guest',
            email: tripData.traveler?.email || ''
          }
        }
      });

      console.log('💳 Stripe response received:', {
        error: error,
        paymentIntent: paymentIntent ? {
          id: paymentIntent.id,
          status: paymentIntent.status
        } : null
      });

      if (error) {
        console.error('❌ Stripe payment error:', error);
        
        // Handle specific error types
        if (error.code === 'payment_intent_unexpected_state') {
          setPaymentMessage('❌ Payment session expired. Please try again.');
          setCardError('Please try your payment again with a fresh session.');
        } else if (error.code === 'card_declined') {
          setCardError('Your card was declined. Please try a different card.');
          setPaymentMessage('❌ Payment declined. Please check your card details.');
        } else {
          setCardError(error.message);
          setPaymentMessage(`❌ Payment failed: ${error.message}`);
        }
        setProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('✅ Payment succeeded! Processing trip booking...');
        setPaymentMessage('✅ Payment successful! Saving your trip...');
        
        try {
          let tripId;
          
          // Check if trip is already saved (has trip_id)
          if (tripData.trip_id) {
            console.log('🔄 Trip already exists with ID:', tripData.trip_id);
            console.log('✅ Using existing trip ID, no need to save again');
            tripId = tripData.trip_id;
            setPaymentMessage('✅ Payment successful! Trip confirmed.');
          } else {
            // Save new trip to database
            console.log('💾 Starting trip save to database...');
            tripId = await saveTrip();
            console.log('✅ Trip saved with ID:', tripId);
            setPaymentMessage('✅ Trip saved! Payment completed successfully.');
          }
          
          // Clear pending payment data
          localStorage.removeItem('pendingTripPayment');
          
          // Store successful trip details
          const tripDetails = {
            ...tripData,
            trip_id: tripId,
            payment_id: paymentIntent.id,
            trip_status: 'confirmed'
          };
          localStorage.setItem('latestTrip', JSON.stringify(tripDetails));
          
          // 🤖 Schedule auto-completion after 5 minutes
          console.log('⏰ Scheduling auto-completion for trip:', tripId);
          tripAutoCompletionService.scheduleCompletion(tripId);
          
          setPaymentMessage('✅ Payment successful! Trip has been confirmed.');
          
          // Navigate to dashboard after showing success message
          setTimeout(() => {
            setPaymentMessage('🎉 Redirecting to dashboard...');
            setTimeout(() => {
              navigate('/traveller-dashboard');
            }, 1000);
          }, 2000);
        } catch (postPaymentError) {
          console.error('❌ Error in post-payment processing:', postPaymentError);
          // If trip save fails, show more helpful message
          if (postPaymentError.message.includes('trip')) {
            setPaymentMessage(`❌ Payment successful but trip save failed: ${postPaymentError.message}`);
          } else {
            setPaymentMessage(`❌ Payment successful! Trip booking completed but there was a minor issue: ${postPaymentError.message}`);
            // Still navigate to dashboard after a delay since payment was successful
            setTimeout(() => {
              setPaymentMessage('🎉 Redirecting to dashboard...');
              setTimeout(() => {
                navigate('/traveller-dashboard');
              }, 1000);
            }, 3000);
          }
        }
      } else {
        console.error('❌ Unexpected payment intent status:', paymentIntent?.status);
        setPaymentMessage(`❌ Payment processing failed. Status: ${paymentIntent?.status || 'Unknown'}`);
      }
    } catch (submitError) {
      console.error('❌ Critical error in payment submission:', submitError);
      setPaymentMessage(`❌ Payment submission failed: ${submitError.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: 'Arial, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  console.log('🔍 PaymentForm debug info:', {
    stripe: !!stripe,
    elements: !!elements,
    clientSecret: !!clientSecret,
    tripData: !!tripData,
    processing: processing
  });

  if (!tripData) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <h2>❌ No Trip Details Found</h2>
          <p>Please book a trip first.</p>
          <button onClick={() => navigate('/route')} className="back-button">
            Back to Route Planning
          </button>
        </div>
      </div>
    );
  }

  if (!stripe || !elements) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="payment-header">
            <h2>🔄 Loading Payment Form...</h2>
            <p>Please wait while we initialize the secure payment system</p>
            {stripeError && (
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '8px' }}>
                <h4>⚠️ Payment System Unavailable</h4>
                <p>The payment system is currently unavailable. This might be due to:</p>
                <ul style={{ textAlign: 'left', marginTop: '10px' }}>
                  <li>Network connectivity issues</li>
                  <li>Firewall blocking payment services</li>
                  <li>Temporary service outage</li>
                </ul>
                <div style={{ marginTop: '15px' }}>
                  <button 
                    onClick={() => window.location.reload()} 
                    style={{ 
                      marginRight: '10px', 
                      padding: '8px 16px', 
                      backgroundColor: '#007bff', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer' 
                    }}
                  >
                    🔄 Retry
                  </button>
                  <button 
                    onClick={() => navigate('/traveller-dashboard')} 
                    style={{ 
                      padding: '8px 16px', 
                      backgroundColor: '#6c757d', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer' 
                    }}
                  >
                    📋 Back to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h2 style={{ 
            background: 'linear-gradient(135deg, #ffeb3b, #4caf50)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Complete Your Payment</h2>
          <p style={{ color: 'white' }}>Secure payment for your Sri Lanka trip</p>
        </div>

        {paymentMessage && (
          <div className={`payment-message ${paymentMessage.includes('✅') || paymentMessage.includes('🎉') ? 'success' : 'error'}`}>
            {paymentMessage}
          </div>
        )}

        <div className="trip-summary">
          <h3 style={{ color: 'brown' }}>🎯 Trip Summary</h3>
          <div className="trip-details">
            <div className="detail-row">
              <span>📍 Route:</span>
              <span>{tripData.route?.from || tripData.start_location} → {tripData.route?.to || tripData.end_location}</span>
            </div>
            <div className="detail-row">
              <span>📅 Date:</span>
              <span>{tripData.date}</span>
            </div>
            <div className="detail-row">
              <span>⏰ Time:</span>
              <span>{tripData.start_time}</span>
            </div>
            {tripData.driver_name && (
              <div className="detail-row">
                <span>🚗 Driver:</span>
                <span>{tripData.driver_name}</span>
              </div>
            )}
            {tripData.guide_name && tripData.guide_name !== 'undefined undefined' && tripData.guide_name !== 'null null' && (
              <div className="detail-row">
                <span>🗺️ Guide:</span>
                <span style={{ color: '#000' }}>{tripData.guide_name}</span>
              </div>
            )}
          </div>

          <div className="cost-breakdown">
            <h4 style={{ color: 'brown' }}>💰 Cost Breakdown</h4>
            <div className="detail-row">
              <span>Route Cost:</span>
              <span>Rs. {(tripData.route_cost || 0).toLocaleString()}</span>
            </div>
            {tripData.driver_cost > 0 && (
              <div className="detail-row">
                <span>Driver Cost:</span>
                <span>Rs. {tripData.driver_cost.toLocaleString()}</span>
              </div>
            )}
            {tripData.guide_cost > 0 && (
              <div className="detail-row">
                <span>Guide Cost:</span>
                <span>Rs. {tripData.guide_cost.toLocaleString()}</span>
              </div>
            )}
            <div className="detail-row">
              <span>System Fee:</span>
              <span>Rs. {(tripData.system_fee || 0).toLocaleString()}</span>
            </div>
            <div className="detail-row total">
              <span>Total Amount:</span>
              <span className="amount">Rs. {(tripData.amount || tripData.total_cost).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="card-element-container">
            <label htmlFor="card-element" style={{ color: 'white' }}>
              💳 Card Information
            </label>
            <div className="card-element-wrapper">
              {clientSecret ? (
                <CardElement
                  id="card-element"
                  options={cardElementOptions}
                  onChange={(event) => {
                    console.log('💳 Card element change:', event);
                    if (event.error) {
                      setCardError(event.error.message);
                    } else {
                      setCardError('');
                    }
                  }}
                  onReady={() => {
                    console.log('✅ Card element is ready for input');
                  }}
                  onFocus={() => {
                    console.log('🎯 Card element focused');
                    setCardError(''); // Clear errors when user starts typing
                  }}
                  onBlur={() => {
                    console.log('👋 Card element blurred');
                  }}
                />
              ) : (
                <div style={{ padding: '15px', color: '#666', textAlign: 'center' }}>
                  🔄 Initializing secure payment form...
                </div>
              )}
            </div>
            {cardError && <div className="card-error">{cardError}</div>}
            {!clientSecret && (
              <div style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
                ⏳ Please wait while we set up your payment...
                <button
                  type="button"
                  onClick={() => createPaymentIntent(true)}
                  style={{
                    marginLeft: '10px',
                    padding: '5px 10px',
                    fontSize: '12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          <div className="payment-actions">
            <button
              type="button"
              onClick={() => navigate('/traveller-dashboard')}
              className="cancel-button"
              disabled={processing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="pay-button"
              disabled={!stripe || processing || !clientSecret}
            >
              {processing ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                <>
                                <>
                💳 Pay Rs. {(tripData.amount || tripData.total_cost).toLocaleString()}
              </>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="payment-security">
          <div className="security-badges">
            <span className="badge">🔒 SSL Secured</span>
            <span className="badge">💳 Stripe Protected</span>
            <span className="badge">✅ 256-bit Encryption</span>
          </div>
          <p className="security-note">
            Your payment information is secure and encrypted. We never store your card details.
          </p>
        </div>
      </div>
    </div>
  );
};

// Main PaymentPage component
const PaymentPage = () => {
  const location = useLocation();
  const [tripData, setTripData] = useState(null);

  useEffect(() => {
    // Get trip data from navigation state or localStorage
    let data = location.state?.tripData;
    
    if (!data) {
      // Try to get from localStorage (pendingTripPayment for new flow)
      const pendingTrip = localStorage.getItem('pendingTripPayment');
      if (pendingTrip) {
        data = JSON.parse(pendingTrip);
      } else {
        // Fallback to old flow (latestTrip for already saved trips)
        const latestTrip = localStorage.getItem('latestTrip');
        if (latestTrip) {
          data = JSON.parse(latestTrip);
        }
      }
    }
    
    console.log('💾 Trip data for payment:', data);
    setTripData(data);
  }, [location]);

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm tripData={tripData} />
    </Elements>
  );
};

export default PaymentPage;