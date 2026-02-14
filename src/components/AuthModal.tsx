import { Modal, Button, Form, Nav, Image } from "react-bootstrap";
import { useState } from "react";
import { login as apiLogin } from "../api/auth";
import { useAuth } from "../context/AuthContext";

interface AuthModalProps {
  show: boolean;
  onHide: () => void;
}

function AuthModal({ show, onHide }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [err, setErr] = useState<string>("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    if (!email || !pass) {
      setErr("Email és jelszó kitöltése kötelező");
      return;
    }

    try {
      if (mode === "login") {
        const res = await apiLogin(email, pass);
        console.log(res);

        if (res && res.success) {
          // Log the user ID to console
          console.log("Bejelentkezett user ID:", res.userId);

          login(res.userId); // Update auth context with user ID
          setErr("");
          setEmail("");
          setPass("");
          onHide();
        } else if (res && res.message) {
          setErr(res.message);
        } else {
          setErr("Bejelentkezés sikertelen");
        }
      }
    } catch (error) {
      setErr("Bejelentkezés sikertelen");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered contentClassName="auth-modal">
      <Modal.Body className="p-4">
        {/* Logo */}
        <div className="text-center mb-4">
          <Image src="/logo.svg" height={48} className="mb-2" />
          <h5 className="fw-bold text-orange mb-0">BarSonar</h5>
        </div>

        {/* Tabs */}
        <Nav variant="tabs" className="justify-content-center mb-4 auth-tabs">
          <Nav.Item>
            <Nav.Link
              active={mode === "login"}
              onClick={() => setMode("login")}
            >
              Login
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={mode === "signup"}
              onClick={() => setMode("signup")}
            >
              Sign Up
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {/* Form */}
        <Form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Your name" />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPass(e.target.value)}
            />
          </Form.Group>

          {err ? <Form.Label className="mb-4">{err}</Form.Label> : <></>}

          <Button className="w-100 btn-orange" type="submit">
            {mode === "login" ? "Login" : "Create Account"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AuthModal;
