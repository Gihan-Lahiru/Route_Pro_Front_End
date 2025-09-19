import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './PaymentModal.css';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51S8d8Y0jsSFGFhTzvrD8TJMxQ6Vv2xhDMOdhsXVaSXRWgf6rtldDhoDKESTvWCF0S6Pskl7JY9Pe9DhskMACmCac00m3wF2IyJ');

// Payment form component
const PaymentForm = ({ trip, onSuccess, onCancel, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [cardError, setCardError] = useState('');

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('http://localhost/RoutePro-backend(02)/public/api/payments/stripe-payment.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_payment_intent',
          trip_id: trip.trip_id || trip.id,
          amount: trip.amount
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setClientSecret(data.client_secret);
        setPaymentIntentId(data.payment_intent_id);
      } else {
        onError(data.message || 'Failed to initialize payment');
      }
    } catch (error) {
      onError('Failed to connect to payment server');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);
    setCardError('');

    const cardElement = elements.getElement(CardElement);

    // Confirm the payment with Stripe
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: trip.traveler?.name || 'Guest',
          email: trip.traveler?.email || ''
        }
      }
    });

    if (error) {
      setCardError(error.message);
      setProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Confirm payment on backend and update trip status
      try {
        const confirmResponse = await fetch('http://localhost/RoutePro-backend(02)/public/api/payments/stripe-payment.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'confirm_payment',
            payment_intent_id: paymentIntentId,
            trip_id: trip.trip_id || trip.id
          })
        });

        const confirmData = await confirmResponse.json();
        
        if (confirmData.success) {
          onSuccess({
            paymentId: paymentIntent.id,
            message: 'Payment successful! Trip has been confirmed.'
          });
          
          // Navigate to dashboard after successful payment
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000); // Wait 2 seconds to show success message
        } else {
          onError(confirmData.message || 'Payment processed but failed to update trip');
        }
      } catch (error) {
        onError('Payment successful but failed to confirm booking');
      }
    }

    setProcessing(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding: '12px',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="payment-form">
      <div className="payment-header">
        <h3>💳 Complete Payment</h3>
        <p>Secure payment for your trip booking</p>
      </div>

      <div className="trip-summary">
        <div className="trip-details">
          <h4>Trip Details</h4>
          <div className="detail-row">
            <span>Route:</span>
            <span>{trip.route?.from || 'Unknown'} → {trip.route?.to || 'Unknown'}</span>
          </div>
          <div className="detail-row">
            <span>Date:</span>
            <span>{trip.date || 'Not specified'}</span>
          </div>
          <div className="detail-row">
            <span>Duration:</span>
            <span>{trip.duration || 'Not specified'}</span>
          </div>
          <div className="detail-row total">
            <span>Total Amount:</span>
            <span className="amount">Rs. {(trip.amount || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card-form">
        <div className="card-element-container">
          <label htmlFor="card-element">
            Card Information
          </label>
          <div className="card-element-wrapper">
            <CardElement
              id="card-element"
              options={cardElementOptions}
              onChange={(event) => {
                setCardError(event.error ? event.error.message : '');
              }}
            />
          </div>
          {cardError && <div className="card-error">{cardError}</div>}
        </div>

        <div className="payment-actions">
          <button
            type="button"
            onClick={onCancel}
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
                💳 Pay Rs. {(trip.amount || 0).toLocaleString()}
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
  );
};

// Main PaymentModal component
const PaymentModal = ({ trip, isOpen, onClose, onSuccess, onError }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="payment-modal-overlay" onClick={handleBackdropClick}>
      <div className="payment-modal">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        <Elements stripe={stripePromise}>
          <PaymentForm
            trip={trip}
            onSuccess={onSuccess}
            onCancel={onClose}
            onError={onError}
          />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentModal;