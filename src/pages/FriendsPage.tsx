import { useState, useEffect } from "react";
import { Container, Nav, Button } from "react-bootstrap";
import { IconUsers, IconUserPlus, IconCheck, IconX } from "@tabler/icons-react";
import ChatWidget from "../components/ChatWidget";
import { Footer } from "../components/Footer";
import Menu from "../components/Menu";
import { useAuth } from "../context/AuthContext";
import { getFriends, getPendingFriendRequests, dealWithFriendRequest } from "../api/user";
import "../style/friends.css";

interface FriendItem {
  id: number;
  userName: string;
}

interface PendingItem {
  id: number;
  userID: number;
  userName: string;
}

export function Friends() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"friends" | "pending">("friends");
  const [friends, setFriends] = useState<FriendItem[]>([]);
  const [pending, setPending] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [actioning, setActioning] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, activeTab]);

  const loadData = async () => {
    setLoading(true);
    setErr("");
    try {
      const [friendsRes, pendingRes] = await Promise.all([
        getFriends().catch(() => []),
        getPendingFriendRequests().catch(() => []),
      ]);
      setFriends(Array.isArray(friendsRes) ? friendsRes : []);
      setPending(Array.isArray(pendingRes) ? pendingRes : []);
    } catch {
      setErr("Hiba történt a betöltéskor");
      setFriends([]);
      setPending([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (userID: number) => {
    setActioning(userID);
    setErr("");
    try {
      const res = await dealWithFriendRequest(userID, true);
      if (res?.statusCode >= 400 || res?.error) {
        setErr(res?.message || "Sikertelen elfogadás");
      } else {
        await loadData();
      }
    } catch {
      setErr("Hiba történt");
    } finally {
      setActioning(null);
    }
  };

  const handleReject = async (userID: number) => {
    setActioning(userID);
    setErr("");
    try {
      const res = await dealWithFriendRequest(userID, false);
      if (res?.statusCode >= 400 || res?.error) {
        setErr(res?.message || "Sikertelen elutasítás");
      } else {
        await loadData();
      }
    } catch {
      setErr("Hiba történt");
    } finally {
      setActioning(null);
    }
  };

  return (
    <div className="page-layout">
      <Menu />

      <section className="friends-hero">
        <div className="friends-hero-overlay" />
        <Container>
          <div className="friends-hero-content">
            <p className="page-hero-eyebrow">
              <IconUsers size={14} stroke={2} />
              Barátok
            </p>
            <h1 className="friends-hero-title">
              Barátaid és <span>barátkérelmek</span>
            </h1>
            <p className="friends-hero-subtitle">
              Kezeld barátaidat és a függőben lévő barátkérelmeket.
            </p>
          </div>
        </Container>
      </section>

      <section className="friends-body">
        <Container>
          {!isAuthenticated ? (
            <p className="friends-message">
              Jelentkezz be a barátok megtekintéséhez.
            </p>
          ) : (
            <>
              <Nav variant="tabs" className="friends-tabs">
                <Nav.Item>
                  <Nav.Link
                    active={activeTab === "friends"}
                    onClick={() => setActiveTab("friends")}
                    className="friends-tab"
                  >
                    <IconUsers size={18} stroke={2} />
                    Barátok
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    active={activeTab === "pending"}
                    onClick={() => setActiveTab("pending")}
                    className="friends-tab"
                  >
                    <IconUserPlus size={18} stroke={2} />
                    Függőben
                    {pending.length > 0 && (
                      <span className="friends-badge">{pending.length}</span>
                    )}
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              {err && <p className="friends-err">{err}</p>}

              {loading ? (
                <p className="friends-message">Betöltés...</p>
              ) : activeTab === "friends" ? (
                <div className="friends-list">
                  <br />
                  {friends.length > 0 ? (
                    friends.map((f) => (
                      
                      <div key={f.id} className="friends-card">
                        <div className="friends-card-body">
                          <span className="friends-name">{f.userName}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="friends-message">
                      Még nincsenek barátaid.
                    </p>
                  )}
                </div>
              ) : (
                <div className="friends-list">
                  <br />
                  {pending.length > 0 ? (
                    pending.map((p) => (
                      <div key={p.id} className="friends-card friends-card-pending">
                        <div className="friends-card-body">
                          <span className="friends-name">{p.userName}</span>
                          <div className="friends-actions">
                            <Button
                              size="sm"
                              className="friends-btn-accept"
                              onClick={() => handleAccept(p.userID)}
                              disabled={actioning === p.userID}
                            >
                              <IconCheck size={16} stroke={2} />
                              Elfogadás
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="friends-btn-reject"
                              onClick={() => handleReject(p.userID)}
                              disabled={actioning === p.userID}
                            >
                              <IconX size={16} stroke={2} />
                              Elutasítás
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="friends-message">
                      Nincsenek függőben lévő barátkérelmek.
                    </p>
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
