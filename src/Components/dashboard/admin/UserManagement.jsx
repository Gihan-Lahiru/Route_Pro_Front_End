"use client"

import { useState } from "react"
import "./UserManagement.css"

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("travelers")
  const [users, setUsers] = useState({
    travelers: [
      {
        id: "T001",
        name: "John Doe",
        email: "john@example.com",
        phone: "+94 77 123 4567",
        age: 32,
        nationality: "American",
        status: "active",
        totalSpent: 75000,
        totalTrips: 5,
        joinDate: "2023-08-15",
      },
      {
        id: "T002",
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+94 77 234 5678",
        age: 28,
        nationality: "British",
        status: "active",
        totalSpent: 45000,
        totalTrips: 3,
        joinDate: "2023-11-20",
      },
    ],
    drivers: [
      {
        id: "D001",
        name: "Kasun Silva",
        email: "kasun@example.com",
        phone: "+94 77 987 6543",
        age: 35,
        license: "B1234567",
        vehicle: "SUV",
        rating: 4.8,
        totalTrips: 145,
        earnings: 350000,
        status: "Available",
        joinDate: "2022-03-10",
      },
      {
        id: "D002",
        name: "Sunil Fernando",
        email: "sunil@example.com",
        phone: "+94 77 876 5432",
        age: 42,
        license: "B7654321",
        vehicle: "Van",
        rating: 2.1,
        totalTrips: 67,
        earnings: 145000,
        status: "Busy",
        joinDate: "2023-01-15",
      },
    ],
    guides: [
      {
        id: "G001",
        name: "Nimal Perera",
        email: "nimal@example.com",
        phone: "+94 77 456 7890",
        age: 38,
        license: "G1234567",
        languages: "English, Sinhala, Tamil",
        rating: 4.6,
        totalTrips: 89,
        earnings: 180000,
        status: "Available",
        joinDate: "2022-07-20",
      },
    ],
  })

  const resetRating = (userType, userId) => {
    setUsers((prev) => ({
      ...prev,
      [userType]: prev[userType].map((user) => (user.id === userId ? { ...user, rating: 0 } : user)),
    }))
  }

  const renderTravelers = () => (
    <div className="user-list">
      {users.travelers.map((traveler) => (
        <div key={traveler.id} className="user-card">
          <div className="user-header">
            <div className="user-info">
              <h3>{traveler.name}</h3>
              <span className="user-id">{traveler.id}</span>
              <span className={`status-badge ${traveler.status}`}>{traveler.status}</span>
            </div>
            <div className="user-stats">
              <div className="earnings">Rs. {traveler.totalSpent.toLocaleString()}</div>
              <div className="trips">{traveler.totalTrips} trips</div>
            </div>
          </div>
          <div className="user-details">
            <div className="contact-section">
              <h4>Contact Information</h4>
              <p>Email: {traveler.email}</p>
              <p>Phone: {traveler.phone}</p>
              <p>Age: {traveler.age}</p>
              <p>Nationality: {traveler.nationality}</p>
            </div>
            <div className="account-section">
              <h4>Account Details</h4>
              <p>Join Date: {traveler.joinDate}</p>
              <p>Total Trips: {traveler.totalTrips}</p>
              <p>Total Spent: Rs. {traveler.totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderDriversOrGuides = (userType) => (
    <div className="user-list">
      {users[userType].map((user) => (
        <div key={user.id} className="user-card">
          <div className="user-header">
            <div className="user-info">
              <h3>{user.name}</h3>
              <span className="user-id">{user.id}</span>
              <div className="rating">
                ⭐ {user.rating}
                {user.rating < 3 && <span className="warning">⚠️</span>}
              </div>
            </div>
            <div className="user-stats">
              <div className={`status-badge ${user.status.toLowerCase()}`}>{user.status}</div>
              <div className="earnings">Rs. {user.earnings.toLocaleString()}</div>
              <div className="trips">{user.totalTrips} trips</div>
            </div>
          </div>
          <div className="user-details">
            <div className="contact-section">
              <h4>Contact & Details</h4>
              <p>Email: {user.email}</p>
              <p>Phone: {user.phone}</p>
              <p>Age: {user.age}</p>
              <p>License: {user.license}</p>
              {user.vehicle && <p>Vehicle: {user.vehicle}</p>}
              {user.languages && <p>Languages: {user.languages}</p>}
            </div>
            <div className="performance-section">
              <h4>Performance</h4>
              <p>Rating: {user.rating}/5.0</p>
              <p>Total Trips: {user.totalTrips}</p>
              <p>Earnings: Rs. {user.earnings.toLocaleString()}</p>
              <p>Join Date: {user.joinDate}</p>
              {user.rating < 3 && (
                <button className="reset-rating-btn" onClick={() => resetRating(userType, user.id)}>
                  Reset Rating to 0
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="user-management">
      <div className="page-header">
        <h2>User Management</h2>
        <div className="search-bar">
          <input type="text" placeholder="Search users..." />
          <button>🔍</button>
        </div>
      </div>

      <div className="user-tabs">
        <button
          className={`tab ${activeTab === "travelers" ? "active" : ""}`}
          onClick={() => setActiveTab("travelers")}
        >
          👥 Travelers
        </button>
        <button className={`tab ${activeTab === "drivers" ? "active" : ""}`} onClick={() => setActiveTab("drivers")}>
          🚗 Drivers
        </button>
        <button className={`tab ${activeTab === "guides" ? "active" : ""}`} onClick={() => setActiveTab("guides")}>
          🗺️ Guides
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "travelers" && renderTravelers()}
        {activeTab === "drivers" && renderDriversOrGuides("drivers")}
        {activeTab === "guides" && renderDriversOrGuides("guides")}
      </div>
    </div>
  )
}

export default UserManagement
