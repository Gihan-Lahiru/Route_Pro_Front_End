import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Button } from "react-bootstrap";
import "./Header.css";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; // ✅ added useNavigate

export default function Header() {
  const navigate = useNavigate(); // ✅ initialize the hook

  const handleJoinClick = () => {
    navigate("/register"); // ✅ navigate to your registration route
  };

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" fixed="top" className="header-navbar">
        <Container>
          {/* ✅ Logo links to Home */}
          <Link to="/">
            <img src="new logo.png" alt="Logo" className="routeprologo" />
          </Link>

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              <img src="home.png" alt="Home Icon" className="topnav-logo" />
              <Nav.Link as={Link} to="/">Home</Nav.Link>

              <img src="navigation.png" alt="Route Icon" className="topnav-logo" />
              <Nav.Link as={Link} to="/route">Route</Nav.Link>

              <img src="budget.png" alt="Budget Icon" className="topnav-logo" />
              <Nav.Link as={Link} to="/budget">Budget</Nav.Link>

              <img src="culture.png" alt="Culture Icon" className="topnav-logo" />
              <Nav.Link as={Link} to="/culture">Culture</Nav.Link>
            </Nav>

            <Nav className="topnav-right">
              <Button className="topnav-button" variant="outline-success"
                onClick={() => navigate("/user-login")}
                >Login
              </Button>
             <Button
  className="topnav-button"
  variant="outline-success"
  onClick={() => navigate("/traveler-register")}
>
  Join
</Button>
              <FaUserCircle className="user-icon" />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
