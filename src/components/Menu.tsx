import { Container, Nav, Navbar, Button, Image } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import AuthModal from "./AuthModal";
import { useAuth } from "../context/AuthContext";
import { logout as apiLogout } from "../api/auth";
import { ProfileWidget } from "./ProfileWidget";

function Menu() {
  const [showAuth, setShowAuth] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await apiLogout();
    logout();
  };

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
            <Image src="/logo.svg" height={36} />
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
                // <Button
                //   variant="outline-warning"
                //   className="px-4 btn-orange"
                //   onClick={handleLogout}
                // >
                //   Logout
                // </Button>
                <ProfileWidget/>
              ) : (
                <Button
                  variant="outline-warning"
                  className="px-4 btn-orange"
                  onClick={() => setShowAuth(true)}
                >
                  Login
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <AuthModal show={showAuth} onHide={() => setShowAuth(false)} />
    </>
  );
}

export default Menu;
