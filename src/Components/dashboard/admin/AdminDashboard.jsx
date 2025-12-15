
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Slidebar";
import Dashboard from "./Dashboard";
import TripManagement from "./TripManagement";
import UserManagement from "./UserManagement";
import Notifications from "./Notification";
import useAuthGuard from "../../../hooks/useAuthGuard";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  // Possible values: "dashboard", "trips", "users", "notifications"
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Protect admin dashboard with authentication guard
  const { isAuthenticated, isLoading } = useAuthGuard('admin');

  const handleLogout = () => {
    // Clear ALL stored authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('email');
    localStorage.removeItem('userRole');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('name');
    localStorage.removeItem('userRating');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('sessionStartTime');
    
    // Set flag to indicate user just logged out
    localStorage.setItem('justLoggedOut', 'true');
    
    // Clear session storage
    sessionStorage.clear();
    
    // Navigate to login page
    navigate('/user-login', { replace: true });
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.sidebar') && !event.target.closest('.mobile-menu-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Additional session validation for admin
  useEffect(() => {
    const validateAdminSession = () => {
      const role = localStorage.getItem('role') || localStorage.getItem('userRole');
      const userId = localStorage.getItem('userId');
      const sessionTime = localStorage.getItem('sessionStartTime');
      
      // Check if all required data exists
      if (!role || !userId || !sessionTime) {
        console.log('Missing admin session data, logging out');
        handleLogout();
        return;
      }
      
      // Verify admin role
      if (role !== 'admin') {
        console.log('Invalid role for admin dashboard:', role);
        handleLogout();
        return;
      }
      
      // Check session expiry
      const sessionAge = Date.now() - parseInt(sessionTime);
      const sessionLimit = 24 * 60 * 60 * 1000; // 24 hours
      
      if (sessionAge > sessionLimit) {
        console.log('Admin session expired, logging out');
        handleLogout();
        return;
      }
    };

    // Validate session every 5 minutes
    const interval = setInterval(validateAdminSession, 5 * 60 * 1000);
    
    // Initial validation
    if (isAuthenticated) {
      validateAdminSession();
    }
    
    return () => clearInterval(interval);
  }, [isAuthenticated, handleLogout]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="admin-dashboard-layout">
        <div className="admin-dashboard-content">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, useAuthGuard will handle redirect
  if (!isAuthenticated) {
    return null;
  }

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
      {/* Mobile menu toggle button */}
      <button 
        className="mobile-menu-toggle" 
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar overlay for mobile */}
      {isMobileMenuOpen && <div className="sidebar-overlay show" onClick={() => setIsMobileMenuOpen(false)} />}
      
      {/* Sidebar with mobile state */}
      <div className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={handlePageChange} 
          onLogout={handleLogout}
        />
      </div>

      {/* Main content area */}
      <div className={`admin-dashboard-content ${isMobileMenuOpen ? 'mobile-content' : ''}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;