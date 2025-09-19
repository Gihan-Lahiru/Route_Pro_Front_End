import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PaymentModal from "./PaymentModal";
import "./TripManagement.css";

const TripManagement = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Payment modal state
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');

  // Debounce search term - same pattern as UserManagement
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchTrips();
  }, [statusFilter, debouncedSearchTerm]); // Fetch when status or debounced search changes

  // Fetch suggestions as user types (faster response)
  useEffect(() => {
    if (searchTerm.length > 0) {
      fetchSuggestions(searchTerm);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    const handleFocusLoss = (event) => {
      console.log('🔍 Focus event:', event.type, event.target);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('focusin', handleFocusLoss);
    document.addEventListener('focusout', handleFocusLoss);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('focusin', handleFocusLoss);
      document.removeEventListener('focusout', handleFocusLoss);
    };
  }, []);

  const fetchSuggestions = async (query) => {
    if (query.length === 0) return;
    
    try {
      setLoadingSuggestions(true);
      const response = await fetch(`http://localhost/RoutePro-backend(02)/public/api/trips/suggestions.php?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success) {
        setSuggestions(data.suggestions || []);
        setShowSuggestions(data.suggestions.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build URL parameters - simplified approach like UserManagement
      const params = new URLSearchParams({
        admin: 'true'
      });
      
      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
        params.append('search', debouncedSearchTerm.trim());
      }
      
      console.log('🔍 Fetching trips with params:', params.toString());
      
      const response = await fetch(`http://localhost/RoutePro-backend(02)/public/api/trips/trips.php?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('📋 Trips response:', data);
      
      if (data.success) {
        // Sort trips by trip_id in descending order (newest first)
        const sortedTrips = (data.trips || []).sort((a, b) => b.trip_id - a.trip_id);
        setTrips(sortedTrips);
      } else {
        setError(data.message || 'Failed to fetch trips');
        setTrips([]);
      }
    } catch (err) {
      console.error('❌ Error fetching trips:', err);
      setError('Failed to fetch trips. Please try again.');
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (e) => {
    console.log('Status filter changed to:', e.target.value);
    setStatusFilter(e.target.value);
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    console.log('🔤 Search input changed:', value);
    
    setSearchTerm(value);
    setSelectedSuggestionIndex(-1);
    
    // Ensure input stays focused using ref
    if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
    
    if (value.trim()) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          selectSuggestion(suggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const selectSuggestion = (suggestion) => {
    console.log('✅ Selecting suggestion:', suggestion.id);
    setSearchTerm(suggestion.id);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  const clearSearch = () => {
    console.log('🧹 Clearing search');
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  // Helper function to format status for display
  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Payment handlers
  const handlePayNow = (trip) => {
    setSelectedTrip(trip);
    setShowPaymentModal(true);
    setPaymentMessage('');
  };

  const handlePaymentSuccess = (paymentData) => {
    setShowPaymentModal(false);
    setPaymentMessage(`✅ ${paymentData.message}`);
    
    // Update the trip status in the local state
    setTrips(prevTrips => 
      prevTrips.map(trip => 
        (trip.id === selectedTrip.id || trip.trip_id === selectedTrip.trip_id)
          ? { ...trip, status: 'confirmed' }
          : trip
      )
    );
    
    // Navigate to dashboard after showing success message
    setTimeout(() => {
      setPaymentMessage('🎉 Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    }, 3000);
  };

  const handlePaymentError = (error) => {
    setShowPaymentModal(false);
    setPaymentMessage(`❌ Payment failed: ${error}`);
    
    // Clear message after 5 seconds
    setTimeout(() => setPaymentMessage(''), 5000);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedTrip(null);
  };

  if (loading) {
    return (
      <div className="trip-management">
        <div className="page-header">
          <h2>Trip Management</h2>
        </div>
        <div className="loading-state">
          <p>Loading trips...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trip-management">
        <div className="page-header">
          <h2>Trip Management</h2>
        </div>
        <div className="error-state">
          <p>Error: {error}</p>
          <button onClick={fetchTrips} className="retry-button">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="trip-management">
      <div className="page-header">
        <div className="header-left">
          <h2>Trip Management</h2>
          {trips.length > 0 && (
            <p className="trip-count">
              Showing {trips.length} trip{trips.length !== 1 ? 's' : ''}
              {statusFilter !== 'all' && ` with status "${formatStatus(statusFilter)}"`}
              {debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
            </p>
          )}
        </div>
        <div className="header-controls">
          <div className="search-bar" ref={searchContainerRef}>
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search by trip ID (e.g., TR001, 1) or name..." 
              value={searchTerm}
              onChange={handleSearchInputChange}
              onKeyDown={handleKeyDown}
              onFocus={(e) => {
                console.log('🎯 Input focused');
                if (searchTerm && suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={(e) => {
                console.log('😑 Input blurred, related target:', e.relatedTarget);
                // Only hide suggestions if focus is moving completely outside the search container
                if (!e.relatedTarget || !searchContainerRef.current?.contains(e.relatedTarget)) {
                  setTimeout(() => setShowSuggestions(false), 100);
                }
              }}
              autoComplete="off"
            />
            <button>
              {loadingSuggestions ? '⏳' : '🔍'}
            </button>
            {searchTerm && (
              <button 
                type="button" 
                tabIndex="-1"
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent input from losing focus
                  e.stopPropagation(); // Stop event bubbling
                  clearSearch();
                }}
                className="clear-search-btn"
                title="Clear search"
              >
                ✕
              </button>
            )}
            {searchTerm && searchTerm.toLowerCase() === 'tr' && (
              <div className="search-hint">
                💡 Type a trip number after TR (e.g., TR001, TR15)
              </div>
            )}
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-dropdown" tabIndex="-1">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion.id}
                    className={`suggestion-item ${index === selectedSuggestionIndex ? 'selected' : ''}`}
                    tabIndex="-1"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent input from losing focus
                      e.stopPropagation(); // Stop event bubbling
                      selectSuggestion(suggestion);
                    }}
                    onMouseEnter={() => setSelectedSuggestionIndex(index)}
                  >
                    <div className="suggestion-main">
                      <span className="suggestion-id">{suggestion.display}</span>
                      <span className={`suggestion-status ${suggestion.status}`}>
                        {suggestion.status?.replace('_', ' ')}
                      </span>
                    </div>
                    {suggestion.subtitle && (
                      <div className="suggestion-subtitle">{suggestion.subtitle}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="filter-section">
            <label htmlFor="status-filter" className="filter-label">Filter by Status:</label>
            <select 
              id="status-filter"
              className="status-filter"
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <option value="all">All Status</option>
              <option value="not_started">Not Started</option>
              <option value="confirmed">Confirmed</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {statusFilter !== 'all' && (
              <button 
                type="button" 
                onClick={() => setStatusFilter('all')}
                className="clear-filter-btn"
                title="Show all trips"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>
      </div>

      {paymentMessage && (
        <div className={`payment-message ${paymentMessage.includes('✅') ? 'success' : 'error'}`}>
          {paymentMessage}
        </div>
      )}

      <div className="trip-list">
        {trips.length === 0 ? (
          <div className="no-trips">
            <h3>No trips found</h3>
            <p>
              {statusFilter === 'all' 
                ? (debouncedSearchTerm 
                    ? `No trips match "${debouncedSearchTerm}"` 
                    : 'No trips have been booked yet.')
                : `No trips with status "${formatStatus(statusFilter)}" found.`}
            </p>
            {debouncedSearchTerm && (
              <div className="search-suggestions">
                <p><strong>Search tips:</strong></p>
                <ul>
                  <li>Try searching by trip ID: "1", "15", "TR001"</li>
                  <li>Search by traveler name, driver name, or guide name</li>
                  <li>Search by location: start or destination</li>
                  <li>Make sure your search term is spelled correctly</li>
                </ul>
              </div>
            )}
            {statusFilter !== 'all' && (
              <p className="filter-hint">
                <strong>Current filter:</strong> {formatStatus(statusFilter)} trips only
              </p>
            )}
          </div>
        ) : (
          trips.map((trip) => (
          <div key={trip.id} className="trip-card">
            <div className="trip-header">
              <div className="trip-info">
                <div className="trip-id-section">
                  <span className="trip-id">{trip.id || `TR${trip.trip_id}`}</span>
                  <span className={`trip-status ${trip.status || 'unknown'}`}>
                    {formatStatus(trip.status)}
                  </span>
                </div>
                <div className="trip-route">
                  📍 {trip.route?.from || 'Unknown'} → {trip.route?.to || 'Unknown'}
                </div>
                <div className="trip-date">{trip.date || 'No date'}</div>
              </div>
              <div className="trip-amount">
                <div className="amount">Rs. {(trip.amount || 0).toLocaleString()}</div>
                <div className="duration">{trip.duration || 'Unknown duration'}</div>
              </div>
            </div>

            <div className="trip-participants">
              <div className="participant">
                <h4>👥 Traveler</h4>
                <div className="participant-info">
                  <div className="name">{trip.traveler?.name || 'Unknown'}</div>
                  <div className="contact">{trip.traveler?.email || 'No email'}</div>
                  <div className="contact">{trip.traveler?.phone || 'No phone'}</div>
                </div>
              </div>

              <div className="participant">
                <h4>🚗 Driver</h4>
                <div className="participant-info">
                  {trip.driver ? (
                    <>
                      <div className="name">
                        {trip.driver.name}
                        <span className="rating">⭐ {trip.driver.rating || 0}</span>
                        {(trip.driver.rating || 0) < 3 && <span className="warning">⚠️</span>}
                      </div>
                      <div className="contact">{trip.driver.phone || 'No phone'}</div>
                    </>
                  ) : (
                    <div className="no-driver">No driver assigned</div>
                  )}
                </div>
              </div>

              <div className="participant">
                <h4>🗺️ Guide</h4>
                <div className="participant-info">
                  {trip.guide ? (
                    <>
                      <div className="name">
                        {trip.guide.name}
                        <span className="rating">⭐ {trip.guide.rating || 0}</span>
                      </div>
                      <div className="contact">{trip.guide.phone || 'No phone'}</div>
                    </>
                  ) : (
                    <div className="no-guide">No guide assigned</div>
                  )}
                </div>
              </div>
            </div>

            {trip.attractions && trip.attractions.length > 0 && (
              <div className="attractions">
                <h4>Attractions</h4>
                <div className="attraction-tags">
                  {trip.attractions.map((attraction, index) => (
                    <span key={index} className="attraction-tag">
                      {attraction}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="trip-actions">
              {trip.status === 'not_started' && (
                <button 
                  className="pay-now-button"
                  onClick={() => handlePayNow(trip)}
                >
                  💳 Pay Now - Rs. {(trip.amount || 0).toLocaleString()}
                </button>
              )}
              {trip.status === 'confirmed' && (
                <div className="payment-status confirmed">
                  ✅ Payment Confirmed
                </div>
              )}
              {trip.status === 'completed' && (
                <div className="payment-status completed">
                  🎉 Trip Completed
                </div>
              )}
              {trip.status === 'cancelled' && (
                <div className="payment-status cancelled">
                  ❌ Trip Cancelled
                </div>
              )}
              {trip.status === 'ongoing' && (
                <div className="payment-status ongoing">
                  🚗 Trip In Progress
                </div>
              )}
            </div>
          </div>
          ))
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        trip={selectedTrip}
        isOpen={showPaymentModal}
        onClose={closePaymentModal}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  )
}

export default TripManagement
