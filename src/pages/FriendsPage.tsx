import { useState, useEffect, useRef } from "react";
import { Container, Nav, Button } from "react-bootstrap";
import { IconUsers, IconUserPlus, IconCheck, IconX, IconDice5 } from "@tabler/icons-react";
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

  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedForPay, setSelectedForPay] = useState<Set<number>>(new Set());
  const [paySpinning, setPaySpinning] = useState(false);
  const [payDisplayName, setPayDisplayName] = useState<string | null>(null);
  const [payResult, setPayResult] = useState<FriendItem | null>(null);
  const spinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openPayModal = () => {
    setSelectedForPay(new Set(friends.map((f) => f.id)));
    setPayResult(null);
    setPayDisplayName(null);
    setPaySpinning(false);
    setShowPayModal(true);
  };

  const closePayModal = () => {
    if (spinTimerRef.current) clearTimeout(spinTimerRef.current);
    setShowPayModal(false);
  };

  const togglePayFriend = (id: number) => {
    setSelectedForPay((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const startSpin = () => {
    const pool = friends.filter((f) => selectedForPay.has(f.id));
    if (pool.length < 2) return;

    const winner = pool[Math.floor(Math.random() * pool.length)];
    setPayResult(null);
    setPaySpinning(true);

    let tick = 0;
    const totalTicks = 28;

    const step = () => {
      tick++;
      const shown = pool[Math.floor(Math.random() * pool.length)];
      setPayDisplayName(shown.userName);

      if (tick < totalTicks) {
        const delay = 60 + Math.pow(tick / totalTicks, 2.4) * 700;
        spinTimerRef.current = setTimeout(step, delay);
      } else {
        setPayDisplayName(winner.userName);
        setPayResult(winner);
        setPaySpinning(false);
      }
    };

    step();
  };

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
      setPending(
        Array.isArray(pendingRes)
          ? pendingRes.map((p: any) => ({
              id: Number(p.id),
              userID: Number(
                p.userID ?? p.userId ?? p.senderID ?? p.senderId ?? p.id,
              ),
              userName: p.userName ?? p.username ?? "",
            }))
          : [],
      );
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
              <div className="friends-tabs-row">
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

                {friends.length >= 2 && (
                  <button className="pay-trigger-btn" onClick={openPayModal}>
                    <IconDice5 size={18} />
                    Ki fizet?
                  </button>
                )}
              </div>

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

      {showPayModal && (
        <div className="pay-overlay" onClick={closePayModal}>
          <div className="pay-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pay-modal-header">
              <span className="pay-modal-title">
                <IconDice5 size={20} />
                Ki fizet?
              </span>
              <button className="pay-modal-close" onClick={closePayModal}>
                <IconX size={18} />
              </button>
            </div>

            <p className="pay-modal-hint">Válaszd ki a résztvevőket:</p>

            <div className="pay-friends-list">
              {friends.map((f) => {
                const checked = selectedForPay.has(f.id);
                return (
                  <button
                    key={f.id}
                    className={`pay-friend-row${checked ? " pay-friend-row--checked" : ""}`}
                    onClick={() => togglePayFriend(f.id)}
                    disabled={paySpinning}
                  >
                    <span className={`pay-friend-check${checked ? " pay-friend-check--on" : ""}`}>
                      {checked && <IconCheck size={12} stroke={3} />}
                    </span>
                    <span className="pay-friend-name">{f.userName}</span>
                  </button>
                );
              })}
            </div>

            <div className="pay-stage">
              {payDisplayName ? (
                <span className={`pay-stage-name${payResult ? " pay-stage-name--winner" : " pay-stage-name--spin"}`}>
                  {payDisplayName}
                </span>
              ) : (
                <span className="pay-stage-placeholder">?</span>
              )}
              {payResult && (
                <span className="pay-stage-label">🍺 Ő fizet!</span>
              )}
            </div>

            <button
              className="pay-spin-btn"
              onClick={startSpin}
              disabled={paySpinning || selectedForPay.size < 2}
            >
              {paySpinning ? (
                "Sorsolás..."
              ) : payResult ? (
                <>
                  <IconDice5 size={18} /> Újra
                </>
              ) : (
                <>
                  <IconDice5 size={18} /> Sorsolás!
                </>
              )}
            </button>

            {selectedForPay.size < 2 && !paySpinning && (
              <p className="pay-warn">Legalább 2 személyt válassz ki.</p>
            )}
          </div>
        </div>
      )}

      <ChatWidget />
      <Footer />
    </div>
  );
}
