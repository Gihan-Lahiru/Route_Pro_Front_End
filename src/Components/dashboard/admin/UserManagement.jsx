import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    fetchUsers();
  }, [activeTab, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `http://localhost/RoutePro-backend(02)/public/admin-dashboard-api.php/admin-dashboard/users?type=${activeTab}&search=${encodeURIComponent(searchTerm)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const updateRating = async (userId, newRating) => {
    try {
      const response = await fetch('http://localhost/RoutePro-backend(02)/public/admin-dashboard-api.php/admin-dashboard/update-rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: userId,
          rating: newRating
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh the data
        fetchUsers();
      } else {
        alert('Failed to update rating: ' + data.message);
      }
    } catch (err) {
      console.error('Error updating rating:', err);
      alert('Failed to update rating');
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
            <th>Total Spent</th>
            <th>Total Trips</th>
            <th>Join Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.travelers?.length > 0 ? (
            users.travelers.map((traveler) => (
              <tr key={traveler.id}>
                <td>{traveler.id}</td>
                <td>{traveler.name}</td>
                <td>{traveler.email}</td>
                <td>{traveler.phone}</td>
                <td>{formatCurrency(traveler.totalSpent)}</td>
                <td>{traveler.totalTrips}</td>
                <td>{formatDate(traveler.joinDate)}</td>
                <td>
                  <span className={`status-badge ${traveler.status}`}>
                    {traveler.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-data">
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
            <th>License</th>
            <th>Vehicle</th>
            <th>Rating</th>
            <th>Earnings</th>
            <th>Trips</th>
            <th>Status</th>
            <th>Experience</th>
            <th>Location</th>
            <th>Join Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.drivers?.length > 0 ? (
            users.drivers.map((driver) => (
              <tr key={driver.id}>
                <td>{driver.id}</td>
                <td>{driver.name}</td>
                <td>{driver.email}</td>
                <td>{driver.phone}</td>
                <td>{driver.license}</td>
                <td>{driver.vehicle}</td>
                <td>
                  <span className={`rating ${driver.rating < 2.5 ? 'low' : ''}`}>
                    ⭐ {driver.rating.toFixed(1)}
                  </span>
                </td>
                <td>{formatCurrency(driver.earnings)}</td>
                <td>{driver.totalTrips}</td>
                <td>
                  <span className={`status-badge ${driver.status.toLowerCase()}`}>
                    {driver.status}
                  </span>
                </td>
                <td>{driver.experience} years</td>
                <td>{driver.location}</td>
                <td>{formatDate(driver.joinDate)}</td>
                <td>
                  {driver.rating < 2.5 && (
                    <button 
                      className="reset-rating-btn"
                      onClick={() => updateRating(driver.id.replace('D', ''), 0)}
                    >
                      Reset Rating
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="14" className="no-data">
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
            <th>License</th>
            <th>Languages</th>
            <th>Rating</th>
            <th>Earnings</th>
            <th>Trips</th>
            <th>Status</th>
            <th>Experience</th>
            <th>Location</th>
            <th>Join Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.guides?.length > 0 ? (
            users.guides.map((guide) => (
              <tr key={guide.id}>
                <td>{guide.id}</td>
                <td>{guide.name}</td>
                <td>{guide.email}</td>
                <td>{guide.phone}</td>
                <td>{guide.license}</td>
                <td>{guide.languages}</td>
                <td>
                  <span className={`rating ${guide.rating < 2.5 ? 'low' : ''}`}>
                    ⭐ {guide.rating.toFixed(1)}
                  </span>
                </td>
                <td>{formatCurrency(guide.earnings)}</td>
                <td>{guide.totalTrips}</td>
                <td>
                  <span className={`status-badge ${guide.status.toLowerCase()}`}>
                    {guide.status}
                  </span>
                </td>
                <td>{guide.experience} years</td>
                <td>{guide.location}</td>
                <td>{formatDate(guide.joinDate)}</td>
                <td>
                  {guide.rating < 2.5 && (
                    <button 
                      className="reset-rating-btn"
                      onClick={() => updateRating(guide.id.replace('G', ''), 0)}
                    >
                      Reset Rating
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="14" className="no-data">
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
          <input type="text" placeholder="Search users..." />
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
