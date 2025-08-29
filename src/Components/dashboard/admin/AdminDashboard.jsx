
import React, { useState } from "react";
import Sidebar from "./Slidebar";
import Dashboard from "./Dashboard";
import TripManagement from "./TripManagement";
import UserManagement from "./UserManagement";
import Notifications from "./Notification";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  // Possible values: "dashboard", "trips", "users", "notifications"
  const [currentPage, setCurrentPage] = useState("dashboard");

  // Render the main content based on currentPage
  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "trips":
        return <TripManagement />;
      case "users":
        return <UserManagement />;
      case "notifications":
        return <Notifications />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-dashboard-layout">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="admin-dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;