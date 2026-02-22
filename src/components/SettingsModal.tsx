import { Modal, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { addInterest, getInterests } from "../api/user";
import { useAuth } from "../context/AuthContext";

interface SettingsModalProps {
  show: boolean;
  onHide: () => void;
}

const INTERESTS = [
  "bar",
  "pub",
  "nightclub",
  "dance_club",
  "wine_bar",
  "karaoke",
  "bowling_alley",
];

function SettingsModal({ show, onHide }: SettingsModalProps) {
  const { userId } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string>("");
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    if (show) {
      fetchInterests();
    }
  }, [show]);

  const fetchInterests = async () => {
    const res = await getInterests();
    const interestNames = Array.isArray(res) ? res.map((item: any) => item.interest) : [];
    setInterests(interestNames);
  }

  const handleSave = async () => {
    if (!userId || !selected) return;
    setSaving(true);
    setErr("");
    try {
      const res = await addInterest(selected);
      if (res?.statusCode >= 400 || res?.error) {
        setErr("Ezt az érdeklődési kört már hozzáadtad!");
      } else {
        setSaved(true);
        await fetchInterests();
        setTimeout(() => {
          setSaved(false);
          setSelected(null);
          setErr("");
        }, 1000);
      }
    } catch {
      setErr("Hiba történt, próbáld újra!");
    } finally {
      setSaving(false);
    }
  };

  const handleHide = () => {
    setSaved(false);
    setSelected(null);
    setErr("");
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={handleHide}
      centered
      contentClassName="auth-modal"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold" style={{ color: "white" }}>
          Beállítások
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4 pt-2">
        <p style={{ color: "#aaa", fontSize: "14px" }}>
          Válaszd ki az érdeklődési köröd, hogy személyre szabott ajánlásokat
          kapj.
        </p>

        {interests.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <p style={{ color: "#aaa", fontSize: "12px", marginBottom: "8px" }}>
              Hozzáadott érdeklődési köreid:
            </p>
            <div className="settings-interests-grid">
              {interests.map((interest) => (
                <div
                  key={interest}
                  className="interest-chip selected"
                  style={{ opacity: 0.7 }}
                >
                  ✓ {interest}
                </div>
              ))}
            </div>
          </div>
        )}

        <p style={{ color: "#aaa", fontSize: "12px", marginBottom: "8px" }}>
          További érdeklődési körök:
        </p>
        <div className="settings-interests-grid">
          {INTERESTS.map((interest) => (
            <div
              key={interest}
              className={`interest-chip ${selected === interest ? "selected" : ""} ${
                interests.includes(interest) ? "disabled" : ""
              }`}
              onClick={() =>
                !interests.includes(interest) && setSelected(interest)
              }
              style={{
                opacity: interests.includes(interest) ? 0.5 : 1,
                cursor: interests.includes(interest) ? "not-allowed" : "pointer",
              }}
            >
              {interest}
            </div>
          ))}
        </div>
        {err && (
          <p
            style={{
              color: "#ff5c5c",
              fontSize: "13px",
              marginTop: "10px",
              marginBottom: 0,
            }}
          >
            {err}
          </p>
        )}
        <Button
          className="w-100 btn-orange mt-4"
          onClick={handleSave}
          disabled={saving || selected === null}
        >
          {saved ? "✓ Mentve!" : saving ? "Mentés..." : "Mentés"}
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default SettingsModal;
