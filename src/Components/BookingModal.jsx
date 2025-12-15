import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./BookingModal.css";
import { sessionUtils, apiMethods } from "../utils/api-client";

export default function BookingModal({
  isOpen,
  onClose,
  driver,
  guide,
  reviews,
  rating,
  routeCost = 0,
  routeDetails,
  packageMode = false,
  packageStep = '',
  onDriverConfirmed,
  onGuideConfirmed,
  driverBookingDetails,
  guideBookingDetails,
  onPackageComplete
}) {
  const navigate = useNavigate();
  
  // State for fetched reviews
  const [fetchedReviews, setFetchedReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  
  // Determine which person to show based on package step
  let person;
  if (packageMode) {
    if (packageStep === 'confirm-driver') {
      person = driver;
      console.log('🚗 Package Mode: Showing driver details', driver?.name);
    } else if (packageStep === 'confirm-guide') {
      person = guide;
      console.log('🗺️ Package Mode: Showing guide details', guide?.name);
    } else if (packageStep === 'final-confirm') {
      person = null; // Final confirmation shows both
      console.log('📋 Package Mode: Final confirmation - showing both');
    } else {
      person = driver || guide;
      console.log('🔄 Package Mode: Default selection', person?.name);
    }
  } else {
    // Regular booking mode - show whichever is selected
    person = driver || guide;
    console.log('👤 Regular Mode: Showing', person?.name, 'Type:', driver ? 'driver' : 'guide');
  }
  
  // Determine modal title based on package mode and step
  let modalTitle = "Book";
  if (packageMode) {
    if (packageStep === 'confirm-driver') {
      modalTitle = "Step 1: Confirm Your Driver";
    } else if (packageStep === 'confirm-guide') {
      modalTitle = "Step 2: Confirm Your Guide";
    } else if (packageStep === 'final-confirm') {
      modalTitle = "Final Step: Confirm Package Booking";
    }
  } else {
    modalTitle = driver ? "Book Your Driver" : guide ? "Book Your Guide" : "Book";
  }

  const [driverCost, setDriverCost] = useState(routeCost);
  const [guideCost, setGuideCost] = useState(routeCost);
  const [packageCost, setPackageCost] = useState(routeCost);
  const [systemFee, setSystemFee] = useState(0);
  const [totalPayable, setTotalPayable] = useState(0);
  const [bookingData, setBookingData] = useState({
    trip_date: "",
    start_time: "",
    special_requests: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const currentUser = sessionUtils.getCurrentUser();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Add class to body to prevent scrolling
      document.body.classList.add('driver-booking-modal-open');
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.top = `-${scrollY}px`;
    } else {
      // Remove class and restore scroll position
      document.body.classList.remove('driver-booking-modal-open');
      const scrollY = document.body.style.top;
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup function to ensure body scroll is restored
    return () => {
      document.body.classList.remove('driver-booking-modal-open');
      document.body.style.top = '';
    };
  }, [isOpen]);

  // Debug logging
  useEffect(() => {
    console.log('🔍 BookingModal props debug:', {
      routeCost: routeCost,
      routeCostType: typeof routeCost,
      routeDetails: routeDetails,
      driver: driver,
      guide: guide,
      driverCost: driverCost,
      guideCost: guideCost,
      packageCost: packageCost,
      systemFee: systemFee,
      totalPayable: totalPayable
    });
    
    // Detailed guide object inspection
    if (guide) {
      console.log('🗺️ Guide object detailed inspection:', {
        'guide object': guide,
        'Object.keys(guide)': Object.keys(guide),
        'guide.id': guide.id,
        'guide.user_id': guide.user_id,
        'typeof guide.id': typeof guide.id,
        'typeof guide.user_id': typeof guide.user_id,
        'guide has user_id': guide.hasOwnProperty('user_id'),
        'guide.user_id value': guide.user_id
      });
    }
    
    if (driver) {
      console.log('🚗 Driver object detailed inspection:', {
        'driver object': driver,
        'Object.keys(driver)': Object.keys(driver),
        'driver.id': driver.id,
        'driver.user_id': driver.user_id,
        'typeof driver.id': typeof driver.id,
        'typeof driver.user_id': typeof driver.user_id
      });
    }
  }, [driver, guide, routeCost, routeDetails, driverCost, guideCost, packageCost, systemFee, totalPayable]);

  // Fetch reviews when person changes
  useEffect(() => {
    const fetchReviews = async () => {
      if (!person || !person.user_id) {
        setFetchedReviews([]);
        return;
      }

      setReviewsLoading(true);
      try {
        const role = driver && !guide ? 'driver' : 'guide';
        const response = await fetch(
          `${apiMethods.getBackendUrl()}/mock-get-reviews.php?user_id=${person.user_id}&role=${role}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setFetchedReviews(data.reviews || []);
            console.log('✅ Reviews fetched successfully:', data.reviews?.length, 'reviews');
          } else {
            console.log('⚠️ Reviews API returned error:', data.message);
            setFetchedReviews([]);
          }
        } else {
          console.log('⚠️ Reviews API request failed:', response.status);
          setFetchedReviews([]);
        }
      } catch (error) {
        console.error('❌ Error fetching reviews:', error);
        setFetchedReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [person?.user_id, driver, guide, apiMethods]);

  useEffect(() => {
    console.log('💰 Cost calculation starting with routeCost:', routeCost);
    let baseCost = routeCost || 0;
    
    // If routeCost is still 0, try to get it from routeDetails or localStorage
    if (baseCost === 0) {
      console.log('⚠️ routeCost is 0, checking alternative sources...');
      
      // Try routeDetails prop
      if (routeDetails && routeDetails.route_cost) {
        baseCost = parseFloat(routeDetails.route_cost);
        console.log('📝 Got cost from routeDetails:', baseCost);
      }
      
      // Try routeDetails cost field
      if (baseCost === 0 && routeDetails && routeDetails.cost) {
        baseCost = parseFloat(routeDetails.cost);
        console.log('📝 Got cost from routeDetails.cost:', baseCost);
      }
      
      // Try localStorage as fallback
      if (baseCost === 0) {
        const routeData = JSON.parse(localStorage.getItem('routeData') || '{}');
        if (routeData.route_cost) {
          baseCost = parseFloat(routeData.route_cost);
          console.log('💾 Got cost from localStorage routeData.route_cost:', baseCost);
        } else if (routeData.cost) {
          baseCost = parseFloat(routeData.cost);
          console.log('💾 Got cost from localStorage routeData.cost:', baseCost);
        }
      }
    }
    
    console.log('💵 Final baseCost for calculations:', baseCost);
    
    const calculatedDriverCost = Math.round(baseCost * 1.2);
    const calculatedGuideCost = Math.round(baseCost + 3000);
    const calculatedPackageCost = Math.round((calculatedDriverCost + calculatedGuideCost) * 0.9);
    
    // Calculate system fee (10% of route cost)
    const calculatedSystemFee = Math.round(baseCost * 0.10 * 100) / 100; // 10% with 2 decimal places
    
    // Calculate total payable amount (service cost + system fee)
    let serviceCost = 0;
    if (driver && guide) {
      serviceCost = calculatedPackageCost;
    } else if (driver) {
      serviceCost = calculatedDriverCost;
    } else if (guide) {
      serviceCost = calculatedGuideCost;
    }
    
    const calculatedTotalPayable = serviceCost + calculatedSystemFee;
    
    console.log('📊 Calculated costs:', {
      baseCost,
      driverCost: calculatedDriverCost,
      guideCost: calculatedGuideCost,
      packageCost: calculatedPackageCost,
      systemFee: calculatedSystemFee,
      serviceCost: serviceCost,
      totalPayable: calculatedTotalPayable,
      breakdown: {
        serviceType: driver && guide ? 'package' : driver ? 'driver' : guide ? 'guide' : 'none',
        calculation: `${serviceCost} + ${calculatedSystemFee} = ${calculatedTotalPayable}`
      }
    });
    
    setDriverCost(calculatedDriverCost);
    setGuideCost(calculatedGuideCost);
    setPackageCost(calculatedPackageCost);
    setSystemFee(calculatedSystemFee);
    setTotalPayable(calculatedTotalPayable);
  }, [routeCost, routeDetails, driver, guide]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const prepareForPayment = async () => {
    console.log('💳 prepareForPayment function called!');
    console.log('⚠️ IMPORTANT: This function will NOT save trip to database yet!');
    console.log('💡 Trip will only be saved AFTER successful Stripe payment!');
    
    // Debug flag to bypass payment (for testing)
    const BYPASS_PAYMENT_FOR_TESTING = false; // Set to true to skip payment
    
    if (BYPASS_PAYMENT_FOR_TESTING) {
      console.log('🚨 DEBUG MODE: Bypassing payment, saving trip directly');
      bookTrip(); // Call the direct booking function
      return;
    }
    
    try {
      // Get current user using sessionUtils (consistent with header)
      const currentUser = sessionUtils.getCurrentUser();
      const routeData = JSON.parse(localStorage.getItem('routeData') || '{}');
      
      // Validate user is logged in
      if (!currentUser?.userId) {
        setError('User not logged in. Please log in first.');
        return;
      }

      // Try to get route_id from multiple sources
      let routeId = null;
      
      if (routeData?.route_id) {
        routeId = routeData.route_id;
      } else if (routeData?.id) {
        routeId = routeData.id;
      } else if (routeDetails?.route_id) {
        routeId = routeDetails.route_id;
      } else if (routeDetails?.id) {
        routeId = routeDetails.id;
      } else {
        const storedRouteId = localStorage.getItem('routeId') || localStorage.getItem('route_id');
        if (storedRouteId) {
          routeId = storedRouteId;
        } else {
          routeId = 1; // Default fallback
        }
      }

      // For package mode, use collected booking details instead of form data
      const actualDate = packageMode && packageStep === 'final-confirm' 
        ? (driverBookingDetails?.trip_date || guideBookingDetails?.trip_date)
        : bookingData.trip_date;
      const actualTime = packageMode && packageStep === 'final-confirm'
        ? (driverBookingDetails?.start_time || guideBookingDetails?.start_time)
        : bookingData.start_time;

      // Validate required fields
      if (!actualDate || !actualTime) {
        if (packageMode && packageStep === 'final-confirm') {
          // Use fallbacks for package booking
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const fallbackDate = tomorrow.toISOString().split('T')[0];
          const fallbackTime = '09:00';
          
          console.log('⚠️ Using fallback date/time for package booking');
        } else {
          setError('Please select a valid date and start time.');
          return;
        }
      }

      // Prepare IDs
      let finalDriverId = null;
      let finalGuideId = null;
      
      if (driver) {
        finalDriverId = driver.driver_table_id || driver.id || driver.user_id || null;
      }
      
      if (guide) {
        finalGuideId = guide.guide_table_id || guide.id || guide.user_id || null;
      }

      // Validate at least one service provider
      if (!finalDriverId && !finalGuideId) {
        setError('Please select a driver or guide.');
        return;
      }

      // Extract route location data
      const startLocation = routeData?.start_location || routeData?.startLocation || routeData?.from || 'Start Location';
      const endLocation = routeData?.end_location || routeData?.endLocation || routeData?.to || 'End Location';

      // Prepare trip data for payment (NOT saving to database yet)
      const tripDataForPayment = {
        traveler_id: currentUser?.userId,
        route_id: routeId,
        driver_id: finalDriverId,
        guide_id: finalGuideId,
        date: actualDate,
        start_time: actualTime,
        trip_status: 'confirmed',
        route_cost: routeCost || 0,
        driver_cost: driver ? driverCost : 0,
        guide_cost: guide ? guideCost : 0,
        total_cost: totalPayable,
        system_fee: systemFee,
        special_requests: packageMode && packageStep === 'final-confirm'
          ? `Driver requests: ${driverBookingDetails?.special_requests || 'None'} | Guide requests: ${guideBookingDetails?.special_requests || 'None'}`
          : (bookingData.special_requests || null),
        start_location: startLocation,
        end_location: endLocation,
        driver_name: driver?.name || driver?.firstName + ' ' + driver?.lastName || (driver ? 'Selected Driver' : null),
        guide_name: guide?.name || guide?.firstName + ' ' + guide?.lastName || (guide ? 'Selected Guide' : null),
        booking_time: new Date().toISOString(),
        package_mode: packageMode || false,
        // Additional data for payment page
        amount: totalPayable, // This is what will be charged
        route: {
          from: startLocation,
          to: endLocation
        },
        traveler: {
          name: currentUser?.name || currentUser?.firstName + ' ' + currentUser?.lastName,
          email: currentUser?.email
        }
      };

      console.log('💾 Storing trip data for payment processing (NOT saving to database yet):', tripDataForPayment);
      console.log('🔄 Next step: Payment page will handle Stripe payment and THEN save to database');
      
      // Store in localStorage for payment page (NOT in database yet)
      localStorage.setItem('pendingTripPayment', JSON.stringify(tripDataForPayment));
      
      // Show message and redirect to payment
      alert('Trip details prepared! Redirecting to secure payment...\n\n💳 You will complete your booking after payment confirmation.');
      
      setTimeout(() => {
        onClose(); // Close booking modal
        if (packageMode && onPackageComplete) {
          onPackageComplete(); // Reset package booking state
        }
        // Navigate to payment page with trip data
        navigate('/payment', { state: { tripData: tripDataForPayment } });
      }, 1000);

    } catch (err) {
      console.error('💥 Error preparing payment:', err);
      setError(`Error preparing payment: ${err.message}`);
    }
  };

  // ✅ DIRECT TRIP BOOKING: Only use this for special cases (testing, admin, etc.)
  // For normal user flow, use prepareForPayment() which redirects to secure payment
  const bookTrip = async () => {
    console.log('🚀 bookTrip function called for immediate confirmation!');
    console.log('⚠️ WARNING: This bypasses payment and directly confirms the trip!');
    console.log('📊 bookTrip initial state:', { loading, packageMode, packageStep });
    
    setLoading(true);
    try {
      // Get current user using sessionUtils (consistent with header)
      const currentUser = sessionUtils.getCurrentUser();
      const routeData = JSON.parse(localStorage.getItem('routeData') || '{}');
      
      // Validate user is logged in
      if (!currentUser?.userId) {
        setError('User not logged in. Please log in first.');
        setLoading(false);
        return;
      }

      // Try to get route_id from multiple sources
      let routeId = null;
      
      if (routeData?.route_id) {
        routeId = routeData.route_id;
      } else if (routeData?.id) {
        routeId = routeData.id;
      } else if (routeDetails?.route_id) {
        routeId = routeDetails.route_id;
      } else if (routeDetails?.id) {
        routeId = routeDetails.id;
      } else {
        const storedRouteId = localStorage.getItem('routeId') || localStorage.getItem('route_id');
        if (storedRouteId) {
          routeId = storedRouteId;
        } else {
          routeId = 1; // Default fallback
        }
      }

      // For package mode, use collected booking details instead of form data
      const actualDate = packageMode && packageStep === 'final-confirm' 
        ? (driverBookingDetails?.trip_date || guideBookingDetails?.trip_date)
        : bookingData.trip_date;
      const actualTime = packageMode && packageStep === 'final-confirm'
        ? (driverBookingDetails?.start_time || guideBookingDetails?.start_time)
        : bookingData.start_time;

      // Validate required fields
      if (!actualDate || !actualTime) {
        if (packageMode && packageStep === 'final-confirm') {
          // Use fallbacks for package booking
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const fallbackDate = tomorrow.toISOString().split('T')[0];
          const fallbackTime = '09:00';
          
          console.log('⚠️ Using fallback date/time for package booking');
        } else {
          setError('Please select a valid date and start time.');
          setLoading(false);
          return;
        }
      }

      // Prepare IDs
      let finalDriverId = null;
      let finalGuideId = null;
      
      if (driver) {
        finalDriverId = driver.driver_table_id || driver.id || driver.user_id || null;
      }
      
      if (guide) {
        finalGuideId = guide.guide_table_id || guide.id || guide.user_id || null;
      }

      // Validate at least one service provider
      if (!finalDriverId && !finalGuideId) {
        setError('Please select a driver or guide.');
        setLoading(false);
        return;
      }

      // Extract route location data
      const startLocation = routeData?.start_location || routeData?.startLocation || routeData?.from || 'Start Location';
      const endLocation = routeData?.end_location || routeData?.endLocation || routeData?.to || 'End Location';

      // Prepare trip data for immediate database save
      const tripPayload = {
        traveler_id: currentUser?.userId,
        route_id: routeId,
        driver_id: finalDriverId,
        guide_id: finalGuideId,
        date: actualDate,
        start_time: actualTime,
        trip_status: 'confirmed',
        route_cost: routeCost || 0,
        driver_cost: driver ? driverCost : 0,
        guide_cost: guide ? guideCost : 0,
        total_cost: totalPayable,
        system_fee: systemFee,
        special_requests: packageMode && packageStep === 'final-confirm'
          ? `Driver requests: ${driverBookingDetails?.special_requests || 'None'} | Guide requests: ${guideBookingDetails?.special_requests || 'None'}`
          : (bookingData.special_requests || null),
        start_location: startLocation,
        end_location: endLocation
      };
      
      console.log('🚀 Sending trip payload for immediate confirmation:', tripPayload);
      
      const bookingUrl = `${apiMethods.getBackendUrl()}/api/trips/trips.php`;
      console.log('🔗 Booking API URL:', bookingUrl);
      
      const response = await fetch(bookingUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripPayload)
      });
      
      console.log('📡 Response status:', response.status);
      
      const responseText = await response.text();
      console.log('📄 Raw response text:', responseText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
      }
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}...`);
      }
      
      console.log('📥 API Response:', result);
      
      setLoading(false);
      if (result.success) {
        setBookingConfirmed(true);
        
        // Store trip details
        const tripDetails = {
          trip_id: result.trip_id,
          date: actualDate,
          start_time: actualTime,
          driver_name: driver?.name || driver?.firstName + ' ' + driver?.lastName || (driver ? 'Selected Driver' : null),
          guide_name: guide?.name || guide?.firstName + ' ' + guide?.lastName || (guide ? 'Selected Guide' : null),
          total_cost: totalPayable,
          trip_status: 'confirmed',
          start_location: startLocation,
          end_location: endLocation,
          booking_time: new Date().toISOString()
        };
        
        console.log('💾 Storing trip details:', tripDetails);
        localStorage.setItem('latestTrip', JSON.stringify(tripDetails));
        
        // Show success message
        alert(`✅ Trip confirmed successfully! Your trip will start in "confirmed" status and automatically complete after 5 minutes for testing.`);
        
        // Close modal and redirect
        setTimeout(() => {
          onClose();
          if (packageMode && onPackageComplete) {
            onPackageComplete();
          }
          // Navigate to traveller dashboard to see the trip
          navigate('/traveller-dashboard');
        }, 1500);
      } else {
        console.error('❌ Booking failed:', result);
        setError(result.message || result.error || 'Failed to book trip');
      }
    } catch (err) {
      setLoading(false);
      console.error('💥 Booking error details:', err);
      setError(`Error booking trip: ${err.message}`);
    }
  };

  // Original bookTrip function commented out to prevent database saving before payment
  /*
  const bookTripOriginal = async () => {
    console.log('🚀 bookTrip function called!');
    console.log('📊 bookTrip initial state:', { loading, packageMode, packageStep });
    
    setLoading(true);
    try {
      // Get current user using sessionUtils (consistent with header)
      const currentUser = sessionUtils.getCurrentUser();
      const routeData = JSON.parse(localStorage.getItem('routeData') || '{}');
      
      // Enhanced route data debugging
      console.log('📊 Debug - Booking data check:', {
        currentUser,
        currentUserFromSessionUtils: currentUser,
        routeData,
        routeDataKeys: Object.keys(routeData),
        routeDetails,
        routeDetailsKeys: routeDetails ? Object.keys(routeDetails) : 'null',
        bookingData,
        driver,
        guide,
        allLocalStorageKeys: Object.keys(localStorage)
      });
      
      // Log all localStorage items that might contain route info
      console.log('🔍 All localStorage route-related items:');
      Object.keys(localStorage).forEach(key => {
        if (key.toLowerCase().includes('route') || key.toLowerCase().includes('trip')) {
          console.log(`  ${key}:`, localStorage.getItem(key));
        }
      });
      
      // Try to get route_id from multiple sources
      let routeId = null;
      
      // Try routeData.route_id first
      if (routeData?.route_id) {
        routeId = routeData.route_id;
        console.log('✅ Got route_id from routeData.route_id:', routeId);
      }
      // Try routeData.id as alternative
      else if (routeData?.id) {
        routeId = routeData.id;
        console.log('✅ Got route_id from routeData.id:', routeId);
      }
      // Try routeDetails prop
      else if (routeDetails?.route_id) {
        routeId = routeDetails.route_id;
        console.log('✅ Got route_id from routeDetails.route_id:', routeId);
      }
      else if (routeDetails?.id) {
        routeId = routeDetails.id;
        console.log('✅ Got route_id from routeDetails.id:', routeId);
      }
      // Try localStorage with different keys
      else {
        const storedRouteId = localStorage.getItem('routeId') || localStorage.getItem('route_id');
        if (storedRouteId) {
          routeId = storedRouteId;
          console.log('✅ Got route_id from localStorage direct:', routeId);
        }
      }
      
      // If still no route_id, try to generate one or use a default
      if (!routeId) {
        console.log('⚠️ No route_id found, attempting to generate or use fallback...');
        
        // Try to find any route-related data that might help
        const startLocation = routeData?.start_location || routeData?.startLocation || routeData?.from;
        const endLocation = routeData?.end_location || routeData?.endLocation || routeData?.to;
        
        if (startLocation && endLocation) {
          // Generate a temporary route_id based on route data
          routeId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          console.log('🔧 Generated temporary route_id:', routeId);
          
          // Store it for future use
          localStorage.setItem('temp_route_id', routeId);
        } else {
          // Use a generic fallback
          routeId = 1; // Default route_id for testing
          console.log('🔧 Using fallback route_id:', routeId);
        }
      }
      
      console.log('🔍 Final route_id resolved:', routeId);
      
      // For package mode, we use the collected booking details instead of form data
      const actualDate = packageMode && packageStep === 'final-confirm' 
        ? (driverBookingDetails?.trip_date || guideBookingDetails?.trip_date)
        : bookingData.trip_date;
      const actualTime = packageMode && packageStep === 'final-confirm'
        ? (driverBookingDetails?.start_time || guideBookingDetails?.start_time)
        : bookingData.start_time;
      
      console.log('📅 Date/Time validation check:', {
        packageMode,
        packageStep,
        'bookingData.trip_date': bookingData.trip_date,
        'bookingData.start_time': bookingData.start_time,
        'driverBookingDetails': driverBookingDetails,
        'guideBookingDetails': guideBookingDetails,
        actualDate,
        actualTime
      });
        
      // Validate required fields - more flexible for package mode
      if (packageMode && packageStep === 'final-confirm') {
        // For package final confirmation, check if we have ANY valid date/time from either driver or guide booking
        if (!actualDate || !actualTime) {
          // If no date/time from booking details, try to use current form data
          if (!bookingData.trip_date || !bookingData.start_time) {
            // As a last resort, use tomorrow's date and 9:00 AM as defaults for package booking
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const fallbackDate = tomorrow.toISOString().split('T')[0];
            const fallbackTime = '09:00';
            
            console.log('⚠️ Using fallback date/time for package booking:', {
              fallbackDate,
              fallbackTime,
              reason: 'No date/time found in booking details or form data'
            });
            
            // Update the actual values to use fallbacks
            actualDate = fallbackDate;
            actualTime = fallbackTime;
          } else {
            // Fallback to form data if booking details are missing
            console.log('⚠️ Using form data as fallback for package booking');
            actualDate = bookingData.trip_date;
            actualTime = bookingData.start_time;
          }
        }
      } else {
        // For regular bookings, require form data
        if (!bookingData.trip_date || !bookingData.start_time) {
          setError('Please select a valid date and start time.');
          setLoading(false);
          return;
        }
      }
      
      // Add explicit logging for what IDs will be sent and fix ID resolution
      // For drivers: if it has 'id' field, use it (driver table ID), otherwise use user_id
      // For guides: if it has 'id' field, use it (guide table ID), otherwise use user_id
      let finalDriverId = null;
      let finalGuideId = null;
      
      if (driver) {
        // Use driver_table_id (drivers.id) for backend validation, fallback to user_id if needed
        finalDriverId = driver.driver_table_id || driver.id || driver.user_id || null;
        console.log('🚗 Driver ID resolution:', {
          'driver.driver_table_id': driver.driver_table_id,
          'driver.id': driver.id,
          'driver.user_id': driver.user_id,
          'finalDriverId': finalDriverId,
          'full driver object': driver
        });
        
        // Warn if driver_table_id is missing
        if (!driver.driver_table_id) {
          console.warn('⚠️ Driver object missing driver_table_id field. This may cause booking to fail with "Selected driver does not exist" error.');
        }
      }
      
      if (guide) {
        // Use guide_table_id (guides.id) for backend validation, fallback to user_id if needed
        finalGuideId = guide.guide_table_id || guide.id || guide.user_id || null;
        console.log('🗺️ Guide ID resolution:', {
          'guide.guide_table_id': guide.guide_table_id,
          'guide.id': guide.id,
          'guide.user_id': guide.user_id,
          'finalGuideId': finalGuideId,
          'full guide object': guide
        });
        
        // Warn if guide_table_id is missing
        if (!guide.guide_table_id) {
          console.warn('⚠️ Guide object missing guide_table_id field. This may cause booking to fail with "Selected guide does not exist" error.');
        }
      }
      
      console.log('🚀 Final IDs that will be sent:', {
        finalDriverId,
        finalGuideId,
        'Will send driver_id': finalDriverId,
        'Will send guide_id': finalGuideId
      });
      
      // Validation logic based on booking mode
      if (packageMode && packageStep === 'final-confirm') {
        // For package final confirmation, both driver and guide should be present
        if (!finalDriverId || !finalGuideId) {
          console.log('❌ Package validation failed - both driver and guide required:', {
            finalDriverId,
            finalGuideId
          });
          setError('Package booking requires both driver and guide to be selected.');
          setLoading(false);
          return;
        }
      } else {
        // For individual bookings, at least one should be present
        if (!finalDriverId && !finalGuideId) {
          console.log('❌ Validation failed - no driver or guide found:', {
            driver: driver,
            guide: guide,
            finalDriverId,
            finalGuideId
          });
          setError('Please select a driver or guide.');
          setLoading(false);
          return;
        }
      }
      if (!currentUser?.userId) {
        setError('User not logged in. Please log in first.');
        setLoading(false);
        return;
      }
      
      // Continue with booking even if route_id is generated/fallback
      // The backend should handle this gracefully
      
      // Extract route location data for storage
      const startLocation = routeData?.start_location || routeData?.startLocation || routeData?.from || 'Start Location';
      const endLocation = routeData?.end_location || routeData?.endLocation || routeData?.to || 'End Location';
      
      const tripPayload = {
        traveler_id: currentUser?.userId || null,
        route_id: routeId,
        driver_id: finalDriverId,
        guide_id: finalGuideId,
        date: actualDate, // Use the validated actualDate
        start_time: actualTime, // Use the validated actualTime
        trip_status: 'confirmed',
        route_cost: routeCost || 0,
        driver_cost: driver ? driverCost : 0,
        guide_cost: guide ? guideCost : 0,
        total_cost: totalPayable,
        system_fee: systemFee,
        special_requests: packageMode && packageStep === 'final-confirm'
          ? `Driver requests: ${driverBookingDetails?.special_requests || 'None'} | Guide requests: ${guideBookingDetails?.special_requests || 'None'}`
          : (bookingData.special_requests || null),
        start_location: startLocation,
        end_location: endLocation
      };
      
      console.log('🚀 Sending trip payload:', tripPayload);
      
      // Additional validation before sending
      if (!tripPayload.traveler_id) {
        console.error('❌ Missing traveler_id in payload');
        setError('User ID is missing. Please refresh and try again.');
        setLoading(false);
        return;
      }
      
      if (!tripPayload.driver_id && !tripPayload.guide_id) {
        console.error('❌ Both driver_id and guide_id are null in payload');
        setError('Please select a driver or guide.');
        setLoading(false);
        return;
      }
      
      const bookingUrl = `${apiMethods.getBackendUrl()}/api/trips/trips.php`;
      console.log('🔗 Booking API URL:', bookingUrl);
      
      const response = await fetch(bookingUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripPayload)
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);
      
      // Get the raw response text first
      const responseText = await response.text();
      console.log('📄 Raw response text:', responseText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
      }
      
      // Try to parse as JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        console.error('📄 Response that failed to parse:', responseText);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}...`);
      }
      
      console.log('📥 API Response:', result);
      
      setLoading(false);
      if (result.success) {
        setBookingConfirmed(true);
        
        // Store comprehensive trip details for payment
        const tripDetails = {
          trip_id: result.trip_id,
          date: actualDate, // Use the validated actualDate
          start_time: actualTime, // Use the validated actualTime
          driver_name: driver?.name || driver?.firstName + ' ' + driver?.lastName || (driver ? 'Selected Driver' : null),
          guide_name: guide?.name || guide?.firstName + ' ' + guide?.lastName || (guide ? 'Selected Guide' : null),
          total_cost: totalPayable,
          route_cost: routeCost || 0,
          driver_cost: driver ? driverCost : 0,
          guide_cost: guide ? guideCost : 0,
          system_fee: systemFee,
          trip_status: 'confirmed',
          start_location: routeData?.start_location || routeData?.startLocation || routeData?.from || 'Start Location',
          end_location: routeData?.end_location || routeData?.endLocation || routeData?.to || 'End Location',
          special_requests: packageMode && packageStep === 'final-confirm'
            ? `Driver requests: ${driverBookingDetails?.special_requests || 'None'} | Guide requests: ${guideBookingDetails?.special_requests || 'None'}`
            : (bookingData.special_requests || null),
          booking_time: new Date().toISOString(),
          package_mode: packageMode || false
        };
        
        console.log('💾 Storing trip details for payment:', tripDetails);
        localStorage.setItem('latestTrip', JSON.stringify(tripDetails));
        
        // Show payment confirmation message
        alert('Trip booked successfully! Redirecting to payment...');
        
        // Navigate to payment page or open payment modal after a short delay
        setTimeout(() => {
          onClose(); // Close booking modal
          if (packageMode && onPackageComplete) {
            onPackageComplete(); // Reset package booking state
          }
          // Navigate to a payment page or trigger payment modal
          navigate('/payment', { state: { tripDetails } });
        }, 1500);
      } else {
        console.error('❌ Booking failed:', result);
        setError(result.message || result.error || 'Failed to book trip');
      }
    } catch (err) {
      setLoading(false);
      console.error('💥 Booking error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      setError(`Error booking trip: ${err.message}`);
    }
  */

  // ❌ DEPRECATED: This function also saves directly to database - USE prepareForPayment() instead
  const handleConfirmBooking = async () => {
    console.error('❌ handleConfirmBooking() called but this function is DEPRECATED!');
    console.error('⚠️ Use prepareForPayment() instead to ensure payment happens BEFORE database save');
    alert('Error: Invalid booking flow. Please refresh and try again.');
    return;
  };

  // Original handleConfirmBooking function - also deprecated
  /*
  const handleConfirmBookingOriginal = async () => {
    // Get current user using sessionUtils (consistent with other parts)
    const currentUser = sessionUtils.getCurrentUser();
    const routeData = JSON.parse(localStorage.getItem('routeData') || '{}');
    
    // Try to get route_id from multiple sources (same logic as bookTrip)
    let routeId = null;
    if (routeData?.route_id) {
      routeId = routeData.route_id;
    } else if (routeData?.id) {
      routeId = routeData.id;
    } else if (routeDetails?.route_id) {
      routeId = routeDetails.route_id;
    } else if (routeDetails?.id) {
      routeId = routeDetails.id;
    } else {
      const storedRouteId = localStorage.getItem('routeId') || localStorage.getItem('route_id');
      if (storedRouteId) {
        routeId = storedRouteId;
      }
    }
    
    // Collect trip data
    const tripData = {
      traveler_id: currentUser?.userId || null, // Use userId from sessionUtils
      route_id: routeId,
      driver_id: driver ? (driver.driver_table_id || driver.id || driver.user_id || null) : null,
      guide_id: guide ? (guide.guide_table_id || guide.id || guide.user_id || null) : null,
      date: bookingData.trip_date,
      start_time: bookingData.start_time,
      trip_status: "confirmed",
      route_cost: routeCost || 0,
      driver_cost: driver ? driverCost : 0,
      guide_cost: guide ? guideCost : 0,
      total_cost: totalPayable,
      system_fee: systemFee,
      special_requests: bookingData.special_requests || null
    };

    try {
      const bookingUrl = `${apiMethods.getBackendUrl()}/api/trips/trips.php`;
      console.log('🔗 Booking URL (handleConfirmBooking):', bookingUrl);
      const response = await axios.post(
        bookingUrl,
        tripData
      );
      if (response.data.success) {
        setBookingConfirmed(true);
        
        // Store comprehensive trip details for payment
        const routeData = JSON.parse(localStorage.getItem('routeData') || '{}');
        const tripDetails = {
          trip_id: response.data.trip_id,
          date: bookingData.trip_date,
          start_time: bookingData.start_time,
          driver_name: driver?.name || driver?.firstName + ' ' + driver?.lastName || (driver ? 'Selected Driver' : null),
          guide_name: guide?.name || guide?.firstName + ' ' + guide?.lastName || (guide ? 'Selected Guide' : null),
          total_cost: totalPayable,
          route_cost: routeCost || 0,
          driver_cost: driver ? driverCost : 0,
          guide_cost: guide ? guideCost : 0,
          system_fee: systemFee,
          trip_status: 'confirmed',
          start_location: routeData?.start_location || routeData?.startLocation || routeData?.from || 'Start Location',
          end_location: routeData?.end_location || routeData?.endLocation || routeData?.to || 'End Location',
          special_requests: bookingData.special_requests || null,
          booking_time: new Date().toISOString(),
          package_mode: packageMode || false
        };
        
        console.log('💾 Storing trip details for payment (handleConfirmBooking):', tripDetails);
        localStorage.setItem('latestTrip', JSON.stringify(tripDetails));
        
        // Show payment confirmation message
        alert("Trip booked successfully! Redirecting to payment...");
        
        // Navigate to payment page after a short delay
        setTimeout(() => {
          onClose(); // Close modal
          if (packageMode && onPackageComplete) {
            onPackageComplete(); // Reset package booking state
          }
          navigate('/payment', { state: { tripDetails } });
        }, 1500);
      } else {
        alert("Failed to book trip: " + response.data.message);
      }
    } catch (error) {
      alert("Error booking trip.");
      console.error(error);
    }
  */

  if (!isOpen) return null;

  return (
    <div className="driver-booking-modal-overlay">
      <div className="driver-booking-modal">
        <div className="driver-booking-modal-header" style={{display: "flex", alignItems: "center", justifyContent: "center", position: "relative"}}>
          <h2 style={{margin: "0", textAlign: "center"}}>{modalTitle}</h2>
          <button className="driver-booking-close-btn" onClick={onClose} style={{position: "absolute", right: "0"}}>×</button>
        </div>
        <div className="driver-booking-modal-content">
          <div className="driver-booking-modal-left">
            <div className="driver-booking-profile-card">
              {/* Service Provider Profile */}
              {packageMode && packageStep === 'final-confirm' ? (
                // Show both driver and guide in final confirmation
                <div>
                  <h3>Package Summary</h3>
                  {driverBookingDetails && (
                    <div style={{ 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px', 
                      padding: '15px', 
                      marginBottom: '15px',
                      backgroundColor: '#f9fafb'
                    }}>
                      <h4>🚗 Driver: {driver?.name}</h4>
                      <p>📅 Date: {driverBookingDetails.trip_date}</p>
                      <p>⏰ Time: {driverBookingDetails.start_time}</p>
                      {driverBookingDetails.special_requests && (
                        <p>📝 Requests: {driverBookingDetails.special_requests}</p>
                      )}
                    </div>
                  )}
                  {guideBookingDetails && (
                    <div style={{ 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px', 
                      padding: '15px', 
                      marginBottom: '15px',
                      backgroundColor: '#f9fafb'
                    }}>
                      <h4>🗺️ Guide: {guide?.name}</h4>
                      <p>📅 Date: {guideBookingDetails.trip_date}</p>
                      <p>⏰ Time: {guideBookingDetails.start_time}</p>
                      {guideBookingDetails.special_requests && (
                        <p>📝 Requests: {guideBookingDetails.special_requests}</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                // Show single service provider profile
                <>
                  <div className="driver-booking-avatar">
                    {person?.photo_url
                      ? <img src={person.photo_url} alt={person.name} />
                      : <div className="driver-booking-avatar-initials">{person?.name?.split(" ").map(n=>n[0]).join("")}</div>
                    }
                  </div>
                  <div className="driver-booking-profile-details">
                    <h3>{person?.name}</h3>
                    <div className="driver-booking-meta">
                      <span>📍 {person?.location}</span>
                      <span>• {person?.experience} years of experience</span>
                    </div>
                    <div className="driver-booking-rating-row">
                      <span className="driver-booking-stars">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={`star ${i < (rating || 0) ? "filled" : ""}`}>★</span>
                        ))}
                      </span>
                      <span className="driver-booking-rating-value">
                        {rating ? rating.toFixed(1) : "0.0"}
                        {((reviews?.length > 0) || (person?.totalReviews > 0)) && (
                          <span className="driver-booking-review-count">
                            ({person?.totalReviews || reviews?.length || 0} reviews)
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="driver-booking-desc">
                      {person?.description || "Professional driver/guide with excellent knowledge of Sri Lankan roads and safety protocols."}
                    </div>
                    {(guide && !packageMode) || (packageMode && packageStep === 'confirm-guide') ? (
                      <div className="driver-booking-languages">
                        <span className="driver-booking-section-label">Languages</span>
                        <div>
                          {Array.isArray(person?.languages)
                            ? person.languages.map((lang, idx) => (
                                <span key={idx} className="driver-booking-lang-pill">{lang}</span>
                              ))
                            : person.languages
                              ? <span className="driver-booking-lang-pill">{person.languages}</span>
                              : null
                          }
                        </div>
                      </div>
                    ) : null}
                    <div className="driver-booking-specialties">
                      <div>
                        {(() => {
                          // Define default specialties based on role
                          const defaultDriverSpecialties = ["Safe Driving", "Local Routes", "Tourist Areas", "Professional Service", "Clean Vehicle"];
                          const defaultGuideSpecialties = ["Cultural Sites", "Historical Knowledge", "Local Stories", "Photography", "Traditional Culture"];
                          
                          const isDriver = packageMode && packageStep === 'confirm-driver' || (driver && !guide);
                          const defaultSpecialties = isDriver ? defaultDriverSpecialties : defaultGuideSpecialties;
                          
                          const specialties = person?.specialties || defaultSpecialties;
                          
                          return Array.isArray(specialties)
                            ? specialties.map((spec, idx) => (
                                <span key={idx} className="driver-booking-spec-pill">{spec}</span>
                              ))
                            : <span className="driver-booking-spec-pill">{specialties}</span>;
                        })()}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="reviews-section">
              <h4>Recent Reviews</h4>
              {(() => {
                // Use fetched reviews first, then reviews prop, then person's reviewsList
                const reviewsToShow = fetchedReviews.length > 0 ? fetchedReviews : (reviews || person?.reviewsList || []);
                
                // Debug logging
                console.log('🔍 Review Debug:', {
                  fetchedReviews: fetchedReviews,
                  fetchedReviewsCount: fetchedReviews.length,
                  reviews,
                  personReviewsList: person?.reviewsList,
                  reviewsToShow,
                  totalReviews: person?.totalReviews,
                  personName: person?.name,
                  reviewsLoading
                });
                
                if (reviewsLoading) {
                  return <div className="no-reviews">Loading reviews...</div>;
                }
                
                if (reviewsToShow.length === 0) {
                  return (
                    <div className="no-reviews">
                      {person?.totalReviews > 0 
                        ? `This ${
                            packageMode && packageStep === 'confirm-driver' ? 'driver' :
                            packageMode && packageStep === 'confirm-guide' ? 'guide' :
                            driver && !guide ? 'driver' : 'guide'
                          } has ${person.totalReviews} reviews. Recent reviews will load here.`
                        : "No reviews yet."
                      }
                    </div>
                  );
                }
                
                return reviewsToShow.slice(0, 3).map((review, idx) => (
                  <div key={idx} className="review-card">
                    <div className="review-rating">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={`star ${i < (review.rating || 0) ? "filled" : ""}`}>★</span>
                      ))}
                    </div>
                    <div className="review-author">
                      <strong>{review.user_name}</strong> <span>{review.date}</span>
                    </div>
                    <div className="review-text">{review.text}</div>
                  </div>
                ));
              })()}
            </div>
          </div>
          <div className="modal-right">
            {!bookingConfirmed ? (
              <div className="booking-form">
                {/* Hide trip details form for final confirmation since details are already collected */}
                {packageMode && packageStep === 'final-confirm' ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <h3>Ready to Complete Your Package Booking!</h3>
                    <p>Both your driver and guide details have been confirmed.</p>
                    <button 
                      className="proceed-btn" 
                      onClick={() => {
                        console.log('🎯 Complete Package Booking button clicked!');
                        console.log('📊 Current state:', { loading, bookingConfirmed, packageMode, packageStep });
                        console.log('📊 Driver and Guide data:', { driver, guide });
                        console.log('📊 Booking details data:', { 
                          driverBookingDetails, 
                          guideBookingDetails,
                          bookingData
                        });
                        
                        // For package final confirmation, redirect to payment
                        if (packageMode && packageStep === 'final-confirm') {
                          console.log('🚀 Package final confirmation - redirecting to payment');
                          prepareForPayment(); // This will redirect to payment page
                        } else {
                          // Regular booking flow - redirect to payment
                          prepareForPayment();
                        }
                      }}
                      disabled={loading}
                      style={{ marginTop: '20px' }}
                    >
                      {loading ? "Processing..." : "💳 Proceed to Payment"}
                    </button>
                  </div>
                ) : (
                  // Show normal form for individual confirmations
                  <>
                    <div
                      style={{
                        background: "#f3f4f6",
                        borderRadius: "8px",
                    padding: "12px 16px",
                    marginBottom: "16px",
                    fontWeight: "600",
                    color: "#222",
                    fontSize: "1.05rem",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
                  }}
                >
                  <div>
                    {driver && (
                      <div style={{ marginBottom: "8px" }}>
                        <span>
                          Driver Cost: <span style={{ color: "#4a90e2" }}>Rs. {driverCost}</span>
                        </span>
                      </div>
                    )}
                    {guide && (
                      <div style={{ marginBottom: "8px" }}>
                        <span>
                          Guide Cost: <span style={{ color: "#059669" }}>Rs. {guideCost}</span>
                        </span>
                      </div>
                    )}
                    {driver && guide && (
                      <div className="driver-booking-package-deal">
                        <div className="driver-booking-package-badge">
                          💡 Pro Tip
                        </div>
                        <div className="driver-booking-package-content">
                          <div className="driver-booking-package-description">
                            <span className="driver-booking-package-title">Book Both & Save!</span>
                            <span className="driver-booking-package-subtitle">Get both a driver and guide together for the complete Sri Lankan experience. Save 10% when you book as a package!</span>
                          </div>
                          <span className="driver-booking-package-price">Rs. {packageCost}</span>
                        </div>
                      </div>
                    )}
                    <div style={{ marginBottom: "8px", fontSize: "0.95rem", color: "#666" }}>
                      <span>
                        System Fee (10%): <span style={{ color: "#e11d48" }}>Rs. {systemFee.toFixed(2)}</span>
                      </span>
                    </div>
                    <div style={{ 
                      marginTop: "12px", 
                      paddingTop: "8px", 
                      borderTop: "2px solid #e5e7eb",
                      fontSize: "1.1rem",
                      fontWeight: "700"
                    }}>
                      <span>
                        Total to Pay: <span style={{ color: "#dc2626" }}>Rs. {totalPayable.toFixed(2)}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <h3>Trip Details</h3>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    console.log('📝 Form submission started - preparing for payment flow');
                    
                    if (!bookingData.trip_date) {
                      setError('Please select a trip date');
                      return;
                    }
                    if (!bookingData.start_time) {
                      setError('Please select a start time');
                      return;
                    }
                    const selectedDate = new Date(bookingData.trip_date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (selectedDate < today) {
                      setError('Trip date cannot be in the past');
                      return;
                    }
                    setError('');
                    
                    // Handle different booking modes
                    if (packageMode && packageStep === 'confirm-driver') {
                      console.log('📝 Driver confirmation step - collecting booking details only');
                      // Confirm driver booking details (this doesn't save to DB)
                      onDriverConfirmed(bookingData);
                    } else if (packageMode && packageStep === 'confirm-guide') {
                      console.log('📝 Guide confirmation step - collecting booking details only');
                      // Confirm guide booking details (this doesn't save to DB)
                      onGuideConfirmed(bookingData);
                    } else if (packageMode && packageStep === 'final-confirm') {
                      console.log('📝 Package final step - redirecting to payment');
                      // Package final step - redirect to payment
                      prepareForPayment();
                    } else {
                      console.log('📝 Regular booking - redirecting to payment');
                      // Regular booking - redirect to payment
                      prepareForPayment();
                    }
                  }}
                >
                  <div className="form-group">
                    <label htmlFor="trip_date">Trip Date *</label>
                    <input
                      type="date"
                      id="trip_date"
                      name="trip_date"
                      value={bookingData.trip_date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="start_time">Start Time *</label>
                    <input
                      type="time"
                      id="start_time"
                      name="start_time"
                      value={bookingData.start_time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="special_requests">Special Requests</label>
                    <textarea
                      id="special_requests"
                      name="special_requests"
                      value={bookingData.special_requests}
                      onChange={handleInputChange}
                      placeholder="Any special requirements or requests..."
                      rows="3"
                    />
                  </div>

                  {error && <div className="error-message">{error}</div>}

                  <button className="proceed-btn" type="submit" disabled={loading}>
                    {loading ? "Processing..." : 
                      packageMode && packageStep === 'confirm-driver' ? "Confirm Driver & Continue" :
                      packageMode && packageStep === 'confirm-guide' ? "Confirm Guide & Continue" :
                      packageMode && packageStep === 'final-confirm' ? "Proceed to Payment" :
                      "💳 Proceed to Payment"
                    }
                  </button>
                  
                  <div style={{ 
                    marginTop: '15px', 
                    textAlign: 'center',
                    padding: '10px',
                    backgroundColor: '#f0f8ff',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#666',
                    border: '1px solid #b3d9ff'
                  }}>
                    <p style={{ margin: '0 0 8px 0' }}>
                      🔒 <strong>Secure Payment Required</strong>
                    </p>
                    <p style={{ margin: '0' }}>
                      Trip will be confirmed after successful payment
                    </p>
                  </div>
                </form>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}