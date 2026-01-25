import { Modal, Button, Form, Nav, Image } from "react-bootstrap";
import { useState } from "react";

interface AuthModalProps {
  show: boolean;
  onHide: () => void;
}

function AuthModal({ show, onHide }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      contentClassName="auth-modal"
    >
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
        <Form>
          {mode === "signup" && (
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Your name" />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="you@example.com" />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="••••••••" />
          </Form.Group>

          <Button className="w-100 btn-orange">
            {mode === "login" ? "Login" : "Create Account"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AuthModal;
