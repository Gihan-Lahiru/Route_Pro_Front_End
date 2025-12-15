import React, { useState, useEffect } from "react";
import DriversSection from "./DriversSection";
import LocalGuidesSection from "./LocalGuidesSection";
import BookingModal from "../../Components/BookingModal";
import { apiMethods } from "../../utils/api-client";
import "./BookDriver.css";


export default function BookDriver() {
  const [showModal, setShowModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [packageBookingMode, setPackageBookingMode] = useState(false);
  const [packageStep, setPackageStep] = useState('select-driver'); // 'select-driver', 'confirm-driver', 'select-guide', 'confirm-guide', 'final-confirm'
  const [driverBookingDetails, setDriverBookingDetails] = useState(null);
  const [guideBookingDetails, setGuideBookingDetails] = useState(null);

  useEffect(() => {
    // Get route data from localStorage (set from RoutePlanner)
    const storedRouteData = localStorage.getItem('routeData');
    console.log('🔍 BookDriver - Raw stored route data:', storedRouteData);
    if (storedRouteData) {
      try {
        const parsedData = JSON.parse(storedRouteData);
        console.log('📊 BookDriver - Parsed route data:', parsedData);
        console.log('💰 BookDriver - Route cost from data:', {
          route_cost: parsedData.route_cost,
          cost: parsedData.cost,
          type_route_cost: typeof parsedData.route_cost,
          type_cost: typeof parsedData.cost
        });
        setRouteData(parsedData);
      } catch (error) {
        console.error('Error parsing route data:', error);
      }
    } else {
      console.log('⚠️ BookDriver - No route data found in localStorage');
    }
  }, []);

  // Fetch reviews/ratings when driver/guide is selected
  useEffect(() => {
    if (selectedDriver) {
      // Fetch driver reviews/ratings from backend API
      // Use user_id (not driver_table_id) as the API expects user_id
      const driverId = selectedDriver.user_id || selectedDriver.id;
      console.log('🔍 Fetching reviews for driver user_id:', driverId);
      
      apiMethods.authenticatedRequest(`/reviews.php?driver_id=${driverId}`, null, "GET")
        .then(response => {
          console.log('📊 Driver reviews response:', response);
          if (response && response.data) {
            setReviews(response.data.reviews || []);
            setRating(parseFloat(response.data.stats?.average_rating || selectedDriver.rating || 0));
          }
        })
        .catch(error => {
          console.error('❌ Error fetching driver reviews:', error);
          setReviews([]);
          setRating(selectedDriver.rating || 0);
        });
    } else if (selectedGuide) {
      // Fetch guide reviews/ratings from backend API
      // Use user_id (not guide_table_id) as the API expects user_id
      const guideId = selectedGuide.user_id || selectedGuide.id;
      console.log('🔍 Fetching reviews for guide user_id:', guideId);
      
      apiMethods.authenticatedRequest(`/reviews.php?guide_id=${guideId}`, null, "GET")
        .then(response => {
          console.log('📊 Guide reviews response:', response);
          if (response && response.data) {
            setReviews(response.data.reviews || []);
            setRating(parseFloat(response.data.stats?.average_rating || selectedGuide.rating || 0));
          }
        })
        .catch(error => {
          console.error('❌ Error fetching guide reviews:', error);
          setReviews([]);
          setRating(selectedGuide.rating || 0);
        });
    }
  }, [selectedDriver, selectedGuide]);

  const handleDriverSelect = (driver) => {
    if (packageBookingMode && packageStep === 'select-driver') {
      // Package mode - driver selected, show booking modal for driver details
      setSelectedDriver(driver);
      setRating(driver.rating || 0);
      setPackageStep('confirm-driver');
      setShowModal(true);
    } else if (!packageBookingMode) {
      // Regular single booking mode
      setSelectedDriver(driver);
      setSelectedGuide(null);
      setRating(driver.rating || 0);
      setShowModal(true);
    }
  };
  
  const handleGuideSelect = (guide) => {
    if (packageBookingMode && packageStep === 'select-guide') {
      // Package mode - guide selected, show booking modal for guide details
      setSelectedGuide(guide);
      setRating(guide.rating || 0);
      setPackageStep('confirm-guide');
      setShowModal(true);
    } else if (!packageBookingMode) {
      // Regular single booking mode
      setSelectedGuide(guide);
      setSelectedDriver(null);
      setRating(guide.rating || 0);
      setShowModal(true);
    }
  };

  const handleDriverConfirmed = (bookingDetails) => {
    // Save driver booking details and move to guide selection
    setDriverBookingDetails(bookingDetails);
    setPackageStep('select-guide');
    setShowModal(false);
    alert(`Driver ${selectedDriver.name} confirmed! Now select your guide.`);
  };

  const handleGuideConfirmed = (bookingDetails) => {
    // Save guide booking details and move to final confirmation
    setGuideBookingDetails(bookingDetails);
    setPackageStep('final-confirm');
    setShowModal(false);
  };

  const handleFinalPackageBooking = () => {
    // Open modal with both driver and guide for final booking
    setShowModal(true);
  };
  
  const handlePackageBooking = () => {
    setPackageBookingMode(true);
    setPackageStep('select-driver');
    setSelectedDriver(null);
    setSelectedGuide(null);
    setDriverBookingDetails(null);
    setGuideBookingDetails(null);
    alert('Package booking started! First, select your driver below.');
  };
  
  const handleClose = () => {
    setShowModal(false);
    if (!packageBookingMode) {
      setSelectedDriver(null);
      setSelectedGuide(null);
    }
    setReviews([]);
    setRating(null);
  };
  
  const handleCancelPackage = () => {
    setPackageBookingMode(false);
    setPackageStep('select-driver');
    setSelectedDriver(null);
    setSelectedGuide(null);
    setDriverBookingDetails(null);
    setGuideBookingDetails(null);
    setShowModal(false);
  };

  const handlePackageComplete = () => {
    // Reset package booking state
    setPackageBookingMode(false);
    setPackageStep('select-driver');
    setSelectedDriver(null);
    setSelectedGuide(null);
    setDriverBookingDetails(null);
    setGuideBookingDetails(null);
    setShowModal(false);
    // Note: Navigation to traveller-dashboard is handled by BookingModal
  };

  return (
    <div>
      {/* Simple Package Booking Button */}
      <div className="driver-booking-package-promo">
        <h3 className="driver-booking-package-promo-title">🌟 Pro Tip: Book Both & Save!</h3>
        <p className="driver-booking-package-promo-description">Get both a driver and guide together for the complete Sri Lankan experience. Save 10% when you book as a package!</p>
        <button 
          onClick={handlePackageBooking}
          className="driver-booking-package-start-btn"
        >
          📦 Start Package Booking
        </button>
        {packageBookingMode && (
          <button 
            onClick={handleCancelPackage}
            className="driver-booking-package-cancel-btn"
          >
            Cancel Package
          </button>
        )}
        {packageBookingMode && (
          <div className="driver-booking-package-status">
            {packageStep === 'select-driver' && <p className="driver-booking-step-indicator">👆 Step 1: Select a driver below</p>}
            {packageStep === 'confirm-driver' && <p className="driver-booking-step-indicator">📝 Step 1: Fill driver booking details</p>}
            {packageStep === 'select-guide' && <p className="driver-booking-step-indicator">✅ Driver confirmed! 👆 Step 2: Select a guide below</p>}
            {packageStep === 'confirm-guide' && <p className="driver-booking-step-indicator">📝 Step 2: Fill guide booking details</p>}
            {packageStep === 'final-confirm' && (
              <div className="driver-booking-final-step">
                <p className="driver-booking-final-message">✅ Both services ready! Review and confirm your package booking.</p>
                <button 
                  onClick={handleFinalPackageBooking}
                  className="driver-booking-confirm-both-btn"
                >
                  🎯 Confirm Both Bookings
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <DriversSection onDriverSelect={handleDriverSelect} />
      <LocalGuidesSection onGuideSelect={handleGuideSelect} />
      <BookingModal
        isOpen={showModal}
        onClose={handleClose}
        driver={selectedDriver}
        guide={selectedGuide}
        reviews={reviews}
        rating={rating}
        routeCost={routeData?.cost || routeData?.route_cost || 0}
        routeDetails={routeData}
        packageMode={packageBookingMode}
        packageStep={packageStep}
        onDriverConfirmed={handleDriverConfirmed}
        onGuideConfirmed={handleGuideConfirmed}
        driverBookingDetails={driverBookingDetails}
        guideBookingDetails={guideBookingDetails}
        onPackageComplete={handlePackageComplete}
      />

      {!routeData && (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          margin: '20px'
        }}>
          <h3>⚠️ No Route Data Found</h3>
          <p>Please plan your route first before booking drivers or guides.</p>
          <button
            onClick={() => window.location.href = '/route'}
            style={{
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Plan Your Route
          </button>
        </div>
      )}
    </div>
  );
}
