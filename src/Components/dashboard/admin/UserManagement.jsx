import React, { useState, useEffect, useCallback } from "react";
import "./UserManagement.css";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("travelers");
  const [users, setUsers] = useState({
    travelers: [],
    drivers: [],
    guides: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [lowRatingNotifications, setLowRatingNotifications] = useState([]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [activeTab, debouncedSearchTerm]);

  // Function to check for low ratings and create notifications
  const checkLowRatings = (userData) => {
    const notifications = [];
    const lowRatingThreshold = 2.5;

    // Check drivers for low ratings
    userData.drivers?.forEach(driver => {
      const hasReviews = driver.review_count > 0;
      const hasLowRating = driver.rating !== null && driver.rating !== undefined && driver.rating < lowRatingThreshold;
      
      if (hasReviews && hasLowRating) {
        notifications.push({
          id: `driver-${driver.id}`,
          type: 'driver',
          userId: driver.id,
          userName: driver.name,
          rating: driver.rating,
          message: `Driver "${driver.name}" has a low rating of ${parseFloat(driver.rating).toFixed(1)}⭐`
        });
      }
    });

    // Check guides for low ratings
    userData.guides?.forEach(guide => {
      const hasReviews = guide.review_count > 0;
      const hasLowRating = guide.rating !== null && guide.rating !== undefined && guide.rating < lowRatingThreshold;
      
      if (hasReviews && hasLowRating) {
        notifications.push({
          id: `guide-${guide.id}`,
          type: 'guide',
          userId: guide.id,
          userName: guide.name,
          rating: guide.rating,
          message: `Guide "${guide.name}" has a low rating of ${parseFloat(guide.rating).toFixed(1)}⭐`
        });
      }
    });

    setLowRatingNotifications(notifications);
    
    // Send notifications to admin notification system
    if (notifications.length > 0) {
      sendLowRatingNotifications(notifications);
    }
  };

  // Function to send low rating notifications to admin notification system
  const sendLowRatingNotifications = async (notifications) => {
    try {
      for (const notification of notifications) {
        const response = await fetch('http://localhost/RoutePro-backend(02)/public/api/admin/create-notification.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          cache: 'no-cache',
          body: JSON.stringify({
            type: 'low_rating',
            title: `Low Rating Alert - ${notification.type === 'driver' ? 'Driver' : 'Guide'}`,
            message: notification.message,
            user_id: notification.userId,
            priority: 'high'
          })
        });

        if (!response.ok) {
          console.error('Failed to send notification for:', notification.userName);
        } else {
          const result = await response.json();
          console.log('Notification sent successfully for:', notification.userName);
        }
      }
    } catch (error) {
      console.error('Error sending low rating notifications:', error);
    }
  };

  const fetchUsers = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the admin/users.php endpoint which works correctly
      const url = `http://localhost/RoutePro-backend(02)/public/admin/users.php?search=${encodeURIComponent(debouncedSearchTerm)}`;
      
      console.log('Attempting to fetch from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        cache: 'no-cache'
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      
      if (data.success) {
        // The endpoint now returns categorized user types
        const grouped = {
          travelers: data.travelers || [],
          drivers: data.drivers || [],
          guides: data.guides || []
        };
        setUsers(grouped);
        
        // Check for low ratings and create notifications
        checkLowRatings(grouped);
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Detailed error info:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        cause: err.cause
      });
      
      // Retry logic for network errors
      if (retryCount < 2 && (err.name === 'TypeError' || err.message.includes('fetch'))) {
        console.log(`Retrying connection (attempt ${retryCount + 1})...`);
        setTimeout(() => fetchUsers(retryCount + 1), 1000);
        return;
      }
      
      // More detailed error messages based on error type
      let errorMessage = 'Failed to connect to server.';
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = 'Network error: Unable to connect to backend. Please check if the backend server is running on localhost.';
      } else if (err.message.includes('CORS')) {
        errorMessage = 'CORS error: Cross-origin request blocked. Please check backend CORS configuration.';
      } else if (err.message.includes('HTTP error')) {
        errorMessage = `Server error: ${err.message}. Please check backend logs.`;
      } else {
        errorMessage = `Connection failed: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetUserStatus = async (userId) => {
    const confirmed = window.confirm('Are you sure you want to reset this user\'s rating? This will set their rating to 0.');
    
    if (confirmed) {
      try {
        const response = await fetch('http://localhost/RoutePro-backend(02)/public/admin/users/reset-rating.php', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          cache: 'no-cache',
          body: JSON.stringify({
            userId: userId,
            rating: 0
          })
        });

        const data = await response.json();
        
        if (data.success) {
          // Refresh the data
          fetchUsers();
          alert('User rating reset successfully. Rating set to 0.');
        } else {
          alert('Failed to reset user rating: ' + data.message);
        }
      } catch (err) {
        console.error('Error resetting user rating:', err);
        alert('Failed to reset user rating');
      }
    }
  };

  const handleCheckUser = async (userId, userType) => {
    const confirmed = window.confirm(`Are you sure you want to check this ${userType}? This will mark them for review and create a notification.`);
    
    if (confirmed) {
      try {
        // Create a notification for checking the user
        const notification = {
          type: `${userType}_check_required`,
          message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} requires review and check due to performance issues`,
          user_id: userId,
          priority: 'high'
        };

        const response = await fetch('http://localhost/RoutePro-backend(02)/public/api/admin/create-notification.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          cache: 'no-cache',
          body: JSON.stringify(notification)
        });

        if (response.ok) {
          alert(`Check action initiated for ${userType}. A high-priority notification has been created for admin review.`);
        } else {
          alert('Failed to initiate check action');
        }
      } catch (err) {
        console.error('Error initiating check action:', err);
        alert('Failed to initiate check action');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const renderTravelersTable = () => (
    <div className="table-container">
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Rating</th>
            <th>Join Date</th>
          </tr>
        </thead>
        <tbody>
          {users.travelers?.length > 0 ? (
            users.travelers.map((traveler) => (
              <tr key={traveler.id}>
                <td>{traveler.id}</td>
                <td>{traveler.name}</td>
                <td>{traveler.email}</td>
                <td>{traveler.phone || 'N/A'}</td>
                <td>
                  {traveler.rating !== null && traveler.rating !== undefined ? (
                    <span className={`rating ${traveler.rating < 2.5 ? 'low' : ''}`}>
                      ⭐ {parseFloat(traveler.rating).toFixed(1)}
                    </span>
                  ) : (
                    <span className="rating unrated">No ratings yet</span>
                  )}
                </td>
                <td>{formatDate(traveler.created_at)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">
                No travelers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderDriversTable = () => (
    <div className="table-container">
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Vehicle</th>
            <th>Experience</th>
            <th>Rating</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.drivers?.length > 0 ? (
            users.drivers.map((driver) => {
              // Only highlight if user has reviews AND low rating (excluding 0 which is reset state)
              const hasReviews = driver.review_count > 0;
              const hasLowRating = driver.rating !== null && driver.rating !== undefined && driver.rating > 0 && driver.rating < 2.5;
              const isLowRated = hasReviews && hasLowRating;
              
              return (
                <tr key={driver.id} className={isLowRated ? 'low-rated-user' : ''}>
                  <td>{driver.id}</td>
                  <td>
                    {isLowRated && <span className="low-rating-alert">⚠️ </span>}
                    {driver.name}
                  </td>
                  <td>{driver.email}</td>
                  <td>{driver.phone || 'N/A'}</td>
                  <td>{driver.vehicle_type || 'N/A'}</td>
                  <td>{driver.experience || 0} years</td>
                  <td>
                    {driver.rating !== null && driver.rating !== undefined ? (
                      driver.rating > 0 ? (
                        <span className={`rating ${driver.rating > 0 && driver.rating < 2.5 ? 'low' : ''}`}>
                          ⭐ {parseFloat(driver.rating).toFixed(1)} ({driver.review_count || 0} reviews)
                        </span>
                      ) : (
                        <span className="rating reset">⭐ 0.0 (Reset by admin)</span>
                      )
                    ) : (
                      <span className="rating unrated">No ratings yet</span>
                    )}
                  </td>
                <td>
                  <span className={`status-badge ${driver.status?.toLowerCase() === 'nonavailable' ? 'unavailable' : driver.status?.toLowerCase() || 'unknown'}`}>
                    {driver.status === 'nonavailable' ? 'Unavailable' : 
                     driver.status === 'available' ? 'Available' : 
                     driver.status || 'Unknown'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="reset-rating-btn"
                      onClick={() => resetUserStatus(driver.id)}
                    >
                      Reset Rating
                    </button>
                    <button 
                      className="fix-user-btn"
                      onClick={() => handleCheckUser(driver.id, 'driver')}
                    >
                      Check
                    </button>
                  </div>
                </td>
              </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="9" className="no-data">
                No drivers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderGuidesTable = () => (
    <div className="table-container">
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Languages</th>
            <th>Experience</th>
            <th>Rating</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.guides?.length > 0 ? (
            users.guides.map((guide) => {
              // Only highlight if user has reviews AND low rating (excluding 0 which is reset state)
              const hasReviews = guide.review_count > 0;
              const hasLowRating = guide.rating !== null && guide.rating !== undefined && guide.rating > 0 && guide.rating < 2.5;
              const isLowRated = hasReviews && hasLowRating;
              
              return (
                <tr key={guide.id} className={isLowRated ? 'low-rated-user' : ''}>
                  <td>{guide.id}</td>
                  <td>
                    {isLowRated && <span className="low-rating-alert">⚠️ </span>}
                    {guide.name}
                  </td>
                  <td>{guide.email}</td>
                  <td>{guide.phone || 'N/A'}</td>
                  <td>{guide.languages || 'N/A'}</td>
                  <td>{guide.experience || 0} years</td>
                  <td>
                    {guide.rating !== null && guide.rating !== undefined ? (
                      guide.rating > 0 ? (
                        <span className={`rating ${guide.rating > 0 && guide.rating < 2.5 ? 'low' : ''}`}>
                          ⭐ {parseFloat(guide.rating).toFixed(1)} ({guide.review_count || 0} reviews)
                        </span>
                      ) : (
                        <span className="rating reset">⭐ 0.0 (Reset by admin)</span>
                      )
                    ) : (
                      <span className="rating unrated">No ratings yet</span>
                    )}
                  </td>
                <td>
                  <span className={`status-badge ${guide.status?.toLowerCase() === 'nonavailable' ? 'unavailable' : guide.status?.toLowerCase() || 'unknown'}`}>
                    {guide.status === 'nonavailable' ? 'Unavailable' : 
                     guide.status === 'available' ? 'Available' : 
                     guide.status || 'Unknown'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="reset-rating-btn"
                      onClick={() => resetUserStatus(guide.id)}
                    >
                      Reset Rating
                    </button>
                    <button 
                      className="fix-user-btn"
                      onClick={() => handleCheckUser(guide.id, 'guide')}
                    >
                      Check
                    </button>
                  </div>
                </td>
              </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="9" className="no-data">
                No guides found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="user-management">
      <div className="page-header">
        <h2>User Management</h2>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>🔍</button>
        </div>
      </div>

      <div className="user-tabs">
        <button
          className={`tab ${activeTab === "travelers" ? "active" : ""}`}
          onClick={() => setActiveTab("travelers")}
        >
          👥 Travelers ({users.travelers?.length || 0})
        </button>
        <button 
          className={`tab ${activeTab === "drivers" ? "active" : ""}`} 
          onClick={() => setActiveTab("drivers")}
        >
          🚗 Drivers ({users.drivers?.length || 0})
        </button>
        <button 
          className={`tab ${activeTab === "guides" ? "active" : ""}`} 
          onClick={() => setActiveTab("guides")}
        >
          🗺️ Guides ({users.guides?.length || 0})
        </button>
      </div>

      <div className="tab-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <h3>Error loading users</h3>
            <p>{error}</p>
            <button onClick={fetchUsers} className="retry-btn">
              Retry
            </button>
          </div>
        ) : (
          <>
            {activeTab === "travelers" && renderTravelersTable()}
            {activeTab === "drivers" && renderDriversTable()}
            {activeTab === "guides" && renderGuidesTable()}
          </>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
