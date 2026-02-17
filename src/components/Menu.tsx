import { Container, Nav, Navbar, Button, Image } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import AuthModal from "./AuthModal";
import { useAuth } from "../context/AuthContext";
import { ProfileWidget } from "./ProfileWidget";

function Menu() {
  const [showAuth, setShowAuth] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="sticky-top">
        <Container fluid className="px-4">
          {/* Logo */}
          <Navbar.Brand
            as={NavLink}
            to="/"
            className="d-flex align-items-center gap-2"
          >
            <Image src="/logo.png" height={36} />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />

          <Navbar.Collapse id="main-navbar">
            {/* Center */}
            <Nav className="navbar-center gap-4">
              <Nav.Link as={NavLink} to="/about">
                About
              </Nav.Link>
              <Nav.Link as={NavLink} to="/bars">
                Bars
              </Nav.Link>
              <Nav.Link as={NavLink} to="/popular">
                Popular Places
              </Nav.Link>
            </Nav>

            {/* Login/Logout button */}
            <Nav className="ms-auto">
              {isAuthenticated ? (
                <ProfileWidget />
              ) : (
                <Button
                  variant="outline-warning"
                  className="px-4 btn-orange"
                  onClick={() => setShowAuth(true)}
                >
                  Bejelentkezés
                </Button>
              )
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <AuthModal show={showAuth} onHide={() => setShowAuth(false)} />
    </>
  );
}

export default Menu;
