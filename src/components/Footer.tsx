import { Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../style/footer.css";

export function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Row className="g-4">
          <Col lg={4} md={6}>
            <div className="footer-logo-container">
              <Link to="/">
                <img src="/logo.png" alt="BarSonar" className="footer-logo" />
              </Link>
              <p className="footer-tagline">
                Fedezd fel a város legjobb bárait a mesterséges intelligencia és
                a közösség erejével. Találd meg a helyed, minden este.
              </p>
            </div>
          </Col>

          <Col lg={4} md={6} className="ps-lg-5">
            <h4 className="footer-heading">Navigáció</h4>
            <ul className="footer-links">
              <li className="footer-link-item">
                <Link to="/" className="footer-link">
                  Főoldal
                </Link>
              </li>
              <li className="footer-link-item">
                <Link to="/bars" className="footer-link">
                  Térkép
                </Link>
              </li>
              <li className="footer-link-item">
                <Link to="/recommendations" className="footer-link">
                  Ajánlott bárok
                </Link>
              </li>
              <li className="footer-link-item">
                <Link to="/about" className="footer-link">
                  Rólunk
                </Link>
              </li>
            </ul>
          </Col>
        </Row>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} BarSonar. Minden jog fenntartva.
          </p>
        </div>
      </Container>
    </footer>
  );
}
