import { useState } from "react";
import { Button } from "react-bootstrap";
import "../style/profileWidget.css";
import { logout as apiLogout } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";

export function ProfileWidget() {
  const { isAuthenticated, logout, userId } = useAuth();
  const [open, setOpen] = useState(false);
  const handleLogout = async () => {
    await apiLogout();
    logout();
  };

  return (
    <>
      <Button
        variant="outline-warning"
        className="px-4 btn-orange"
        onClick={() => setOpen(!open)}
      >
        Profile
      </Button>
      <div className={`profile-panel ${open ? "show" : ""}`}>
        <div className="profile-header">
          <div className="avatar-large">
            <img src="/avatar_profile.svg" alt="Avatar" />
          </div>
          <div className="profile-info">
            <span className="profile-name">Felhasználó Név</span>
            <span className="profile-email">email@email.com</span>
          </div>
        </div>

        <div className="profile-divider" />

        <div className="profile-actions">
          <button className="profile-btn">Kedvencek</button>
          <button className="profile-btn" onClick={() => (window.location.href = "/friends")}>Barátok</button>

          <button className="profile-btn logout" onClick={handleLogout}>
            Kijelentkezés
          </button>
        </div>
      </div>
    </>
  );
}
