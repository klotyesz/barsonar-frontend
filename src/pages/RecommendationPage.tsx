import { useState, useEffect } from "react";
import { Container, Nav } from "react-bootstrap";
import { IconStar, IconHeart, IconCalendar, IconMapPin, IconArrowRight } from "@tabler/icons-react";
import { Link } from "react-router";
import ChatWidget from "../components/ChatWidget";
import { Footer } from "../components/Footer";
import Menu from "../components/Menu";
import { useAuth } from "../context/AuthContext";
import { getRecommendationsByInterest, getRecommendationsByAge } from "../api/user";
import "../style/recommendation.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface PlaceItem {
  id: number;
  googleplaceID: string;
  name: string;
  address: string;
}

export function RecommendationPage() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"interest" | "age">("interest");
  const [interestRecs, setInterestRecs] = useState<PlaceItem[]>([]);
  const [ageRecs, setAgeRecs] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, activeTab]);

  const loadData = async () => {
    setLoading(true);
    setErr("");
    try {
      if (activeTab === "interest") {
        const res = await getRecommendationsByInterest();
        if (res?.statusCode >= 400 || res?.error) {
          setErr(res?.message || "Nem sikerült betölteni az ajánlásokat.");
          setInterestRecs([]);
        } else {
          const list: { id: number; name: string }[] = Array.isArray(res) ? res : [];
          const full = await Promise.all(
            list.map(async (item) => {
              try {
                const r = await fetch(`${API_BASE_URL}/place/${item.id}`);
                return await r.json();
              } catch {
                return { ...item, googleplaceID: "", address: "" };
              }
            })
          );
          setInterestRecs(full);
        }
      } else {
        const res = await getRecommendationsByAge();
        if (res?.statusCode >= 400 || res?.error) {
          setErr(res?.message || "Nem sikerült betölteni az ajánlásokat.");
          setAgeRecs([]);
        } else {
          setAgeRecs(Array.isArray(res) ? res : []);
        }
      }
    } catch {
      setErr("Hiba történt a betöltéskor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-layout">
      <Menu />

      <section className="rec-hero">
        <div className="rec-hero-overlay" />
        <Container>
          <div className="rec-hero-content">
            <p className="page-hero-eyebrow">
              <IconStar size={14} stroke={2} />
              Ajánlott Bárok
            </p>
            <h1 className="rec-hero-title">
              Neked <span>ajánlott</span> helyek
            </h1>
            <p className="rec-hero-subtitle">
              Személyre szabott bárajánlások érdeklődési köreid és korod alapján.
            </p>
          </div>
        </Container>
      </section>

      <section className="rec-body">
        <Container>
          {!isAuthenticated ? (
            <p className="rec-message">
              Jelentkezz be az ajánlások megtekintéséhez.
            </p>
          ) : (
            <>
              <Nav variant="tabs" className="rec-tabs">
                <Nav.Item>
                  <Nav.Link
                    active={activeTab === "interest"}
                    onClick={() => setActiveTab("interest")}
                    className="rec-tab"
                  >
                    <IconHeart size={18} stroke={2} />
                    Érdeklődési körök
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    active={activeTab === "age"}
                    onClick={() => setActiveTab("age")}
                    className="rec-tab"
                  >
                    <IconCalendar size={18} stroke={2} />
                    Kor alapján
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              {err && <p className="rec-err">{err}</p>}

              {loading ? (
                <p className="rec-message">Betöltés...</p>
              ) : activeTab === "interest" ? (
                <div className="rec-list">
                  <br />
                  {interestRecs.length > 0 ? (
                    interestRecs.map((bar) => (
                      <div key={bar.id} className="rec-card">
                        <div className="rec-card-body">
                          <div className="rec-card-info">
                            <span className="rec-card-name">{bar.name}</span>
                            {bar.address && (
                              <span className="rec-card-address">
                                <IconMapPin size={14} stroke={2} />
                                {bar.address}
                              </span>
                            )}
                          </div>
                          {bar.googleplaceID && (
                            <Link
                              to={`/bar/${bar.googleplaceID}`}
                              className="rec-btn"
                            >
                              Részletek
                              <IconArrowRight size={16} stroke={2} />
                            </Link>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    !err && (
                      <p className="rec-message">
                        Nincs találat. Adj hozzá érdeklődési köröket a beállításokban.
                      </p>
                    )
                  )}
                </div>
              ) : (
                <div className="rec-list">
                  <br />
                  {ageRecs.length > 0 ? (
                    ageRecs.map((bar) => (
                      <div key={bar.id} className="rec-card">
                        <div className="rec-card-body">
                          <div className="rec-card-info">
                            <span className="rec-card-name">{bar.name}</span>
                            {bar.address && (
                              <span className="rec-card-address">
                                <IconMapPin size={14} stroke={2} />
                                {bar.address}
                              </span>
                            )}
                          </div>
                          <Link
                            to={`/bar/${bar.googleplaceID}`}
                            className="rec-btn"
                          >
                            Részletek
                            <IconArrowRight size={16} stroke={2} />
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    !err && (
                      <p className="rec-message">
                        Nincs elég komment az ajánláshoz. Állítsd be a korodat a beállításokban.
                      </p>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </Container>
      </section>

      <ChatWidget />
      <Footer />
    </div>
  );
}
