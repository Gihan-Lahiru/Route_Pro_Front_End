import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";

// ✅ Import your custom CSS
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Clear any invalid localStorage data on component mount
  useEffect(() => {
    const clearInvalidData = () => {
      const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('email');
      const userRole = localStorage.getItem('userRole') || localStorage.getItem('role');
      const userName = localStorage.getItem('userName') || localStorage.getItem('name');
      
      // Only clear if data is incomplete/invalid (not if all fields are present)
      if ((userEmail && !userRole) || (userEmail && !userName) || (!userEmail && (userRole || userName))) {
        console.log('Clearing incomplete localStorage data');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('email');
        localStorage.removeItem('userRole');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('name');
        localStorage.removeItem('userRating');
        localStorage.removeItem('userProfile');
      }
    };
    
    clearInvalidData();
  }, []); // Run once on mount

  // Check if user is logged in - localStorage first, backend validation optional
  useEffect(() => {
    const checkUserLogin = async () => {
      // First check localStorage for immediate response
      const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('email');
      const userRole = localStorage.getItem('userRole') || localStorage.getItem('role');
      const userName = localStorage.getItem('userName') || localStorage.getItem('name');
      
      console.log('Header checking login state:', { userEmail, userRole, userName });
      
      // If we have complete localStorage data, show user as logged in immediately
      if (userEmail && userRole && userName) {
        setIsLoggedIn(true);
        setUserInfo({
          name: userName || 'User',
          photo: null,
          role: userRole
        });
        
        // Then try to get fresh data from backend (but don't fail if it doesn't work)
        try {
          let profileEndpoint = '';
          if (userRole === 'driver') {
            profileEndpoint = `http://localhost/RoutePro-backend(02)/public/driver/profile?email=${encodeURIComponent(userEmail)}`;
          } else if (userRole === 'guide') {
            profileEndpoint = `http://localhost/RoutePro-backend(02)/public/guide/profile?email=${encodeURIComponent(userEmail)}`;
          }
          
          if (profileEndpoint) {
            const response = await fetch(profileEndpoint, {
              credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success && data.data) {
              // Backend validation successful - update with fresh data including photo
              setUserInfo({
                name: data.data.name || userName || 'User',
                photo: data.data.photo || null,
                role: userRole
              });
            }
            // If backend fails, we keep the localStorage data (don't logout)
          }
        } catch (error) {
          console.error('Error fetching profile (keeping localStorage data):', error);
          // Keep the localStorage data even if backend fails
        }
      } else {
        // No localStorage data or incomplete data
        console.log('No complete localStorage data, setting logged out');
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };

    checkUserLogin();
  }, [location.pathname]); // Re-check when route changes
  
  // Listen for storage changes (when logout happens in another tab or component)
  useEffect(() => {
    const handleStorageChange = () => {
      const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('email');
      const userRole = localStorage.getItem('userRole') || localStorage.getItem('role');
      const userName = localStorage.getItem('userName') || localStorage.getItem('name');
      
      console.log('Storage changed, checking login state:', { userEmail, userRole, userName });
      
      if (!(userEmail && userRole && userName)) {
        console.log('Storage cleared, logging out');
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for a custom event we'll dispatch from logout
    window.addEventListener('localStorageCleared', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageCleared', handleStorageChange);
    };
  }, []);

  const handleJoinClick = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleUserProfileClick = () => {
    // Navigate to dashboard based on user role
    if (userInfo?.role === 'driver') {
      navigate('/driver-dashboard');
    } else if (userInfo?.role === 'guide') {
      navigate('/guide-dashboard');
    }
  };

  const handleJoinAs = (role) => {
    if (role === "traveler") navigate("/traveler-register");
    else if (role === "driver") navigate("/driver-registration");
    else if (role === "guider") navigate("/guide-registration");
    setShowModal(false);
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" fixed="top" className="header-navbar">
        <Container>
          <Link to="/homepage">
                         <img src="/images/new logo.png" alt="Logo" className="routeprologo" />
          </Link>

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
                             <img src="/images/home.png" alt="Home Icon" className="topnav-logo" />
              <Nav.Link as={Link} to="/homepage" className="nav-link-underline">Home</Nav.Link>

                                                             <img src="/images/navigation.png" alt="Route Icon" className="topnav-logo" />
              <Nav.Link as={Link} to="/route" className="nav-link-underline">Route</Nav.Link>

                                                             <img src="/images/budget.png" alt="Budget Icon" className="topnav-logo" />
              <Nav.Link as={Link} to="/budget" className="nav-link-underline">Budget</Nav.Link>

                                                             <img src="/images/culture.png" alt="Culture Icon" className="topnav-logo" />
              <Nav.Link as={Link} to="/culture" className="nav-link-underline">Culture</Nav.Link>
            </Nav>

            <Nav className="topnav-right">
              {isLoggedIn ? (
                // Logged in user view - clickable name and photo to go to dashboard
                <div className="user-profile-section" onClick={handleUserProfileClick} style={{cursor: 'pointer'}}>
                  <span className="user-name">{userInfo?.name}</span>
                  <div className="user-avatar-container">
                    {userInfo?.photo ? (
                      <img 
                        src={`http://localhost${userInfo.photo}?t=${Date.now()}`}
                        alt="Profile" 
                        className="user-avatar"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <FaUserCircle 
                      className="user-icon" 
                      style={{ display: userInfo?.photo ? 'none' : 'block' }}
                    />
                  </div>
                </div>
              ) : (
                // Not logged in view (current way)
                <>
                  <Button
                    className="topnav-button custom-login-button"
                    onClick={() => navigate("/user-login")}
                  >
                    Login
                  </Button>

                  <Button
                    className="topnav-button custom-join-button"
                    onClick={handleJoinClick}
                  >
                    Join
                  </Button>

                  <FaUserCircle className="user-icon" />
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Join Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
  <Modal.Header closeButton>
    <Modal.Title>Join as</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="join-options">
      <Button
        className="join-option-button traveler"
        onClick={() => handleJoinAs("traveler")}
      >
        Traveler
      </Button>
      <Button
        className="join-option-button driver"
        onClick={() => handleJoinAs("driver")}
      >
        Driver
      </Button>
      <Button
        className="join-option-button guider"
        onClick={() => handleJoinAs("guider")}
      >
        Guide
      </Button>
    </div>
  </Modal.Body>
</Modal>

    </>
  );
}
