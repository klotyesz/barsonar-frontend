import { Modal, Button, Form, Nav, Image } from "react-bootstrap";
import { useEffect, useState } from "react";
import { login as apiLogin, signup } from "../api/auth";
import { useAuth } from "../context/AuthContext";

interface AuthModalProps {
  show: boolean;
  onHide: () => void;
}

function AuthModal({ show, onHide }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [pass, setPass] = useState<string>("")
  const [age, setAge] = useState<number>(0)
  const [err, setErr] = useState<string>("")
  const [succesfullCreate, setSuccessfullCreate] = useState<boolean>(false)
  const { login } = useAuth()

  const empty = () => {
    setUsername("")
    setEmail("")
    setPass("")
    setAge(0)
    setErr("")
  }

  useEffect(() => {
    empty()

    if(mode === "signup" || show == false) {
      setSuccessfullCreate(false)
    }
  }, [mode, show])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr("")

    try {
      if (mode === "login") {
        const res = await apiLogin(email, pass)

        if (res && res.success) {

          login(res.userId)
          empty()
          onHide()
          setSuccessfullCreate(false)
        } else if (res && res.message) {
          setErr(res.message);
        } else {
          setErr("Bejelentkezés sikertelen");
        }
      }
      else {
        const res = await signup(username, email, pass, age)

        if (res && res.success) {
          empty()
        } else {
          setErr(res)
        }

        setMode("login")
        setSuccessfullCreate(true)
      }      
    } catch (error: any) {
      setErr(error)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered contentClassName="auth-modal">
      <Modal.Body className="p-4">
        {/* Logo */}
        <div className="text-center mb-4">
          <Image src="/logo.png" height={48} className="mb-2" />
          {
            succesfullCreate == true ?
              <h5 className="fw-bold text-orange mb-0" style={{ color: "#007bff" }}>
                Jelentkezz be frissen létrehozott fiókodba!
              </h5>
              :
              <h5 className="fw-bold text-orange mb-0">BarSonar</h5>
          }
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
              <Form.Control
                required
                type="text"
                placeholder="Your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="••••••••"
              minLength={8}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </Form.Group>

          {mode === "signup" && (
            <Form.Group className="mb-3">
              <Form.Label>Kor</Form.Label>
              <Form.Label>Add meg a korod hogy nekedvaló helyeket ajánlhassunk</Form.Label>
              <Form.Control
                type="number"
                placeholder="18"
                value={age > 0 ? age : 18}
                onChange={(e) => setAge(Number(e.target.value))}
              />
            </Form.Group>
          )}

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
