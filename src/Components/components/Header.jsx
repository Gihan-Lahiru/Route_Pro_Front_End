import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Button } from "react-bootstrap";
import "./Header.css";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  return (
    <div>
    <Navbar collapseOnSelect expand="lg" fixed="top" className="header-navbar">
      <Container>
        <img src="new logo.png" alt="Logo" className="routeprologo" />

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            <img src="home.png" alt="Home" className="topnav-logo" />
            <Nav.Link href="#home">Home</Nav.Link>

            <img src="navigation.png" alt="Route" className="topnav-logo" />
            <Nav.Link eventKey={2} href="#Route">
              Route
            </Nav.Link>

            <img src="budget.png" alt="Budget" className="topnav-logo" />
            <Nav.Link href="#budget">Budget</Nav.Link>

            <img src="culture.png" alt="Culture" className="topnav-logo" />
            <Nav.Link href="#culture">Culture</Nav.Link>
          </Nav>

          <Nav className="topnav-right">
            <Button className="topnav-button" variant="outline-success">
              Login
            </Button>
            <Button className="topnav-button" variant="outline-success">
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
