import { Container, Nav, Navbar, Button, Image } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import AuthModal from "./AuthModal";
import { useAuth } from "../context/AuthContext";
import { ProfileWidget } from "./ProfileWidget";
import { useTheme } from "../context/ThemeContext";
import { IconMoon, IconSun } from "@tabler/icons-react";
import "../style/navbar.css";

function Menu() {
  const [showAuth, setShowAuth] = useState(false);
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <Navbar
        expand="lg"
        className="sticky-top"
      >
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
                Rólunk
              </Nav.Link>
              <Nav.Link as={NavLink} to="/bars">
                Térkép
              </Nav.Link>
              <Nav.Link as={NavLink} to="/recommendations">
                Ajánlott bárok
              </Nav.Link>
            </Nav>

            {/* Right side: theme toggle + auth */}
            <Nav className="ms-auto align-items-center gap-3">
              <button
                onClick={toggleTheme}
                className="theme-toggle"
                aria-label="Toggle theme"
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                <span className="theme-toggle-track">
                  <span className="theme-toggle-thumb" />
                </span>
                <span className="theme-toggle-icon">
                  {theme === "dark" ? <IconMoon size={16} /> : <IconSun size={16} />}
                </span>
              </button>

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
