import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleJoinClick = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleJoinAs = (role) => {
    if (role === "traveler") navigate("/traveler-register");
    else if (role === "driver") navigate("/driver-registration");
    else if (role === "guider") navigate("/guide-registration");
    setShowModal(false); // close modal after navigation
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" fixed="top" className="header-navbar">
        <Container>
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
              <Button
                className="topnav-button"
                variant="outline-success"
                onClick={() => navigate("/user-login")}
              >
                Login
              </Button>

              <Button
                className="topnav-button"
                variant="outline-success"
                onClick={handleJoinClick}
              >
                Join
              </Button>

              <FaUserCircle className="user-icon" />
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
              variant="dark"
              className="w-100 my-2"
              onClick={() => handleJoinAs("traveler")}
            >
              Traveler
            </Button>
            <Button
              variant="dark"
              className="w-100 my-2"
              onClick={() => handleJoinAs("driver")}
            >
              Driver
            </Button>
            <Button
              variant="dark"
              className="w-100 my-2"
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
