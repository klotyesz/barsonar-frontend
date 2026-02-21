import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { addInterest } from "../api/auth";
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
        setTimeout(() => {
          setSaved(false);
          setSelected(null);
          setErr("");
          onHide();
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
        <div className="settings-interests-grid">
          {INTERESTS.map((interest) => (
            <div
              key={interest}
              className={`interest-chip ${selected === interest ? "selected" : ""}`}
              onClick={() => setSelected(interest)}
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
