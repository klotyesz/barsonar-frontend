import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "../style/profileWidget.css";
import { logout as apiLogout, me } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router";
import type { User } from "../interfaces/User";
import SettingsModal from "./SettingsModal";

export function ProfileWidget() {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User>();
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = async () => {
    await apiLogout();
    logout();
  };

  const getProfile = async () => {
    setUser(await me());
  };

  useEffect(() => {
    getProfile();
  }, []);

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
            <span className="profile-name">{user?.userName}</span>
            <span className="profile-email">{user?.email}</span>
          </div>
        </div>

        <div className="profile-divider" />

        <div className="profile-actions">
          <button className="profile-btn">Kedvencek</button>
          <Link
            to="/friends"
            className="profile-btn"
            style={{ textDecorationLine: "none" }}
          >
            Barátok
          </Link>
          <button
            className="profile-btn"
            onClick={() => {
              setOpen(false);
              setShowSettings(true);
            }}
          >
            Beállítások
          </button>

          <button className="profile-btn logout" onClick={handleLogout}>
            Kijelentkezés
          </button>
        </div>
      </div>
      <SettingsModal
        show={showSettings}
        onHide={() => setShowSettings(false)}
      />
    </>
  );
}
