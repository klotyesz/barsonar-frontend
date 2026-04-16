import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {
  IconUser,
  IconHeart,
  IconX,
} from "@tabler/icons-react";
import Menu from "../components/Menu";
import ChatWidget from "../components/ChatWidget";
import { Footer } from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { me } from "../api/auth";
import {
  updateUser,
  addInterest,
  getInterests,
  deleteInterest,
} from "../api/user";
import type { User } from "../interfaces/User";
import "../style/settings.css";

const INTERESTS = [
  "bar",
  "pub",
  "nightclub",
  "dance_club",
  "wine_bar",
  "karaoke",
  "bowling_alley",
];

interface InterestItem {
  id: number;
  interest: string;
}



export function SettingsPage() {
  const { userId } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState("");
  const [userNameSaving, setUserNameSaving] = useState(false);
  const [userNameErr, setUserNameErr] = useState("");

  const [interests, setInterests] = useState<InterestItem[]>([]);
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
  const [interestSaving, setInterestSaving] = useState(false);
  const [interestErr, setInterestErr] = useState("");



  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (userId) {
      loadInterests();
    }
  }, [userId]);

  const loadProfile = async () => {
    try {
      const u = await me();
      if (u) {
        setUser(u);
        setUserName(u.userName || "");
      }
    } catch {
      setUser(null);
    }
  };

  const loadInterests = async () => {
    try {
      const res = await getInterests();
      const list = Array.isArray(res) ? res : [];
      setInterests(list);
    } catch {
      setInterests([]);
    }
  };



  const handleSaveUserName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !userName.trim() || userName === user?.userName) return;
    setUserNameSaving(true);
    setUserNameErr("");
    try {
      const res = await updateUser(Number(userId), {
        userName: userName.trim(),
      });
      if (res?.statusCode >= 400 || res?.error) {
        setUserNameErr(res?.message || "Sikertelen mentés");
      } else {
        await loadProfile();
      }
    } catch {
      setUserNameErr("Hiba történt");
    } finally {
      setUserNameSaving(false);
    }
  };

  const handleAddInterest = async () => {
    if (!selectedInterest) return;
    setInterestSaving(true);
    setInterestErr("");
    try {
      const res = await addInterest(selectedInterest);
      if (res?.statusCode >= 400 || res?.error) {
        setInterestErr("Ezt az érdeklődési kört már hozzáadtad!");
      } else {
        await loadInterests();
        setSelectedInterest(null);
      }
    } catch {
      setInterestErr("Hiba történt");
    } finally {
      setInterestSaving(false);
    }
  };

  const handleRemoveInterest = async (id: number) => {
    try {
      await deleteInterest(id);
      await loadInterests();
      setInterestErr("");
    } catch {
      setInterestErr("Hiba történt a törléskor");
    }
  };



  if (!user && userId) {
    return (
      <div className="page-layout">
        <Menu />
        <Container className="py-5">
          <p className="text-muted">Betöltés...</p>
        </Container>
        <Footer />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="page-layout">
        <Menu />
        <Container className="py-5">
          <p className="text-muted">
            Jelentkezz be a beállítások megtekintéséhez.
          </p>
        </Container>
        <Footer />
      </div>
    );
  }

  const interestNames = interests.map((i) => i.interest);


  return (
    <div className="page-layout">
      <Menu />

      <section className="settings-hero">
        <div className="settings-hero-overlay" />
        <Container>
          <div className="settings-hero-content">
            <p className="page-hero-eyebrow">
              <IconUser size={14} stroke={2} />
              Beállítások
            </p>
            <h1 className="settings-hero-title">
              Profilod <span>testreszabása</span>
            </h1>
            <p className="settings-hero-subtitle">
              Módosítsd felhasználóneved, érdeklődési köreid és barátaidat.
            </p>
          </div>
        </Container>
      </section>

      <section className="settings-body">
        <Container>
          <Row className="g-4">
            <Col lg={6}>
              <div className="settings-card">
                <div className="page-card-icon">
                  <IconUser size={28} stroke={1.6} />
                </div>
                <h2 className="page-card-title">Felhasználónév</h2>
                <p className="page-card-text mb-3">
                  Változtasd meg a profilodban megjelenő nevet.
                </p>
                <Form onSubmit={handleSaveUserName}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Felhasználónév"
                      minLength={5}
                      maxLength={35}
                      className="settings-input"
                    />
                  </Form.Group>
                  {userNameErr && (
                    <p className="settings-err mb-2">{userNameErr}</p>
                  )}
                  <Button
                    type="submit"
                    className="page-btn-primary"
                    disabled={
                      userNameSaving || userName.trim() === user?.userName
                    }
                  >
                    {userNameSaving ? "Mentés..." : "Mentés"}
                  </Button>
                </Form>
              </div>
            </Col>

            <Col lg={6}>
              <div className="settings-card">
                <div className="page-card-icon">
                  <IconHeart size={28} stroke={1.6} />
                </div>
                <h2 className="page-card-title">Érdeklődési körök</h2>
                <p className="page-card-text mb-3">
                  Add hozzá vagy távolítsd el az érdeklődési köreid.
                </p>

                {interests.length > 0 && (
                  <div className="mb-3">
                    <p className="settings-label">Hozzáadott:</p>
                    <div className="settings-interests-grid">
                      {interests.map((item) => (
                        <div
                          key={item.id}
                          className="interest-chip interest-chip-remove"
                          onClick={() => handleRemoveInterest(item.id)}
                        >
                          {item.interest}
                          <IconX size={14} stroke={2} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="settings-label">Új hozzáadása:</p>
                <div className="settings-interests-grid">
                  {INTERESTS.map((interest) => (
                    <div
                      key={interest}
                      className={`interest-chip ${
                        selectedInterest === interest ? "selected" : ""
                      } ${interestNames.includes(interest) ? "disabled" : ""}`}
                      onClick={() =>
                        !interestNames.includes(interest) &&
                        setSelectedInterest(interest)
                      }
                      style={{
                        opacity: interestNames.includes(interest) ? 0.5 : 1,
                        cursor: interestNames.includes(interest)
                          ? "not-allowed"
                          : "pointer",
                      }}
                    >
                      {interest}
                    </div>
                  ))}
                </div>
                {interestErr && (
                  <p className="settings-err mt-2">{interestErr}</p>
                )}
                <Button
                  className="page-btn-primary mt-3"
                  onClick={handleAddInterest}
                  disabled={interestSaving || !selectedInterest}
                >
                  {interestSaving ? "Mentés..." : "Hozzáadás"}
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <ChatWidget />
      <Footer />
    </div>
  );
}
