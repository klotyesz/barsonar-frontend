import { Container, Row, Col } from "react-bootstrap";
import {
  IconMapPin,
  IconStar,
  IconSparkles,
  IconUsers,
  IconArrowRight,
  IconRadar,
  IconEye,
  IconHeart,
  IconMessageCircle,
  IconUserStar,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import ChatWidget from "../components/ChatWidget";
import { Footer } from "../components/Footer";
import Menu from "../components/Menu";
import "../style/home.css";

const features = [
  {
    icon: <IconMapPin size={26} stroke={1.6} />,
    title: "Interaktív térkép",
    text: "Fedezd fel a közeledben lévő bárokat valós idejű térképen, nyitvatartással és útvonaltervezéssel.",
  },
  {
    icon: <IconStar size={26} stroke={1.6} />,
    title: "Értékelések és vélemények",
    text: "Olvasd más látogatók benyomásait, és oszd meg saját élményedet fotókkal és hozzászólásokkal.",
  },
  {
    icon: <IconSparkles size={26} stroke={1.6} />,
    title: "AI ajánlórendszer",
    text: "A BarSonar AI chatbot segít megtalálni a tökéletes bárt illetve a tökéletes italt - mondd el mit szeretsz, ő megtalálja.",
  },
  {
    icon: <IconUserStar stroke={1.6} size={26} />,
    title: "Testre szabott ajánlások",
    text: "Korod alapján javaslunk bárokat a kommentek alapján, hogy a legjobb élményt kapd.",
  },
  {
    icon: <IconUsers size={26} stroke={1.6} />,
    title: "Közösség",
    text: "Kövesd barátaidat, és döntsétek el ki fizeti a kört!",
  },
  {
    icon: <IconMessageCircle size={26} stroke={1.6} />,
    title: "Hozzászólások",
    text: "Kommentelhetsz, fotókat tölthetsz fel, és leírhatod véleményedet.",
  },
];

const steps = [
  {
    n: "01",
    title: "Keress egy bárt",
    text: "Használd a térképes nézetet vagy használd az algoritmust, amely segít megtalálni a tökéletes bárt.",
  },
  {
    n: "02",
    title: "Nézd meg a részleteket",
    text: "Nyitvatartás, árak, értékelések, fotók - minden egy helyen, azonnal.",
  },
  {
    n: "03",
    title: "Kérdezd meg az AI-t",
    text: "Nem tudsz választani? A chatbot segít megtalálni a tökéletes helyet és italt.",
  },
  {
    n: "04",
    title: "Menj és élvezd!",
    text: "Értékeld az estét, oszd meg véleményed, és segíts másoknak is megtalálni a legjobb helyeket.",
  },
];

const popularBars = [
  {
    name: "Ruin Bar Klassz",
    location: "Budapest, VII. ker.",
    rating: "4.7",
    icon: "🍺",
  },
  {
    name: "Komlókert",
    location: "Budapest, VI. ker.",
    rating: "4.5",
    icon: "🍻",
  },
  {
    name: "Night Owl Lounge",
    location: "Budapest, VIII. ker.",
    rating: "4.8",
    icon: "🦉",
  },
];

export function Home() {
  return (
    <>
      <div className="page-layout">
        <Menu />

        <section className="page-hero">
          <div className="page-hero-overlay" />

          <Container>
            <div className="page-hero-content">
              <div className="page-hero-eyebrow">
                <IconRadar size={14} stroke={2} />
                Fedezd fel a tökéletes bárt
              </div>

              <h1 className="page-hero-title">
                Minden este a
                <br />
                <span className="highlight">tökéletes bár</span>
                <br />
                megtalálásával kezdődik.
              </h1>

              <p className="page-hero-subtitle">
                A BarSonar összehoz téged, a legjobb bárokkal és a mesterséges
                intelligenciával - hogy soha többé ne pazarolj időt keresgéléssel.
              </p>

              <div className="page-hero-ctas">
                <Link to="/bars" className="page-btn-primary">
                  Bárok felfedezése
                  <IconArrowRight size={17} stroke={2.5} />
                </Link>
                <Link to="/about" className="page-btn-ghost">
                  Tudj meg többet
                </Link>
              </div>

              <div className="page-hero-stats">
                <div className="page-hero-stat">
                  <span className="page-hero-stat-num">100+</span>
                  <span>bár az adatbázisban</span>
                </div>
                <div className="page-hero-stat-divider" />
                <div className="page-hero-stat">
                  <span className="page-hero-stat-num">500+</span>
                  <span>felhasználói értékelés</span>
                </div>
                <div className="page-hero-stat-divider" />
                <div className="page-hero-stat">
                  <IconSparkles
                    size={15}
                    stroke={1.8}
                    style={{ color: "var(--page-accent)" }}
                  />
                  <span>AI chatbot támogatás</span>
                </div>
              </div>
            </div>
          </Container>

          
        </section>

        <section className="page-features-section">
          <Container>
            <Row className="mb-5">
              <Col lg={6}>
                <p className="page-section-label">Funkciók</p>
                <hr className="page-divider" />
                <h2 className="page-section-title">
                  Minden, amire szükséged van
                  <br />
                  egy <span>jó este</span> előtte.
                </h2>
              </Col>
              <Col lg={6} className="d-flex align-items-end">
                <p className="page-section-subtitle">
                  A BarSonar nem csak egy listázóapp - egy teljes közösségi
                  platform, amely segít megtalálni, értékelni és megosztani a
                  legjobb bárokat.
                </p>
              </Col>
            </Row>

            <Row className="g-4">
              {features.map((f) => (
                <Col key={f.title} md={6} lg={4}>
                  <div className="page-feature-card">
                    <div className="page-feature-icon">{f.icon}</div>
                    <h3 className="page-feature-title">{f.title}</h3>
                    <p className="page-feature-text">{f.text}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        <section className="page-steps-section">
          <Container>
            <Row className="align-items-center g-5">
              <Col lg={5}>
                <p className="page-section-label">Hogyan működik</p>
                <hr className="page-divider" />
                <h2 className="page-section-title">
                  Négy lépés a <span>tökéletes</span> estéhez.
                </h2>
                <p className="page-section-subtitle mt-3">
                  Egyszerűen, gyorsan, kényelmesen - a BarSonar úgy lett
                  tervezve, hogy a legjobb döntés többé ne okozzon gondot.
                </p>
                <Link
                  to="/bars"
                  className="page-btn-primary mt-4 d-inline-flex"
                >
                  Próbáld ki most
                  <IconArrowRight size={17} stroke={2.5} />
                </Link>
              </Col>

              <Col lg={7}>
                  {steps.map((s) => (
                    <>
                    <div key={s.n} className="page-step">
                      <div className="page-step-num">{s.n}</div>
                      <div>
                        <p className="page-step-title">{s.title}</p>
                        <p className="page-step-text">{s.text}</p>
                      </div>
                    </div>
                    <br />
                    </>
                  ))}
              </Col>
            </Row>
          </Container>
        </section>

        <section className="page-ai-section">
          <Container>
            <Row className="align-items-center g-5">
              <Col lg={6}>
                <div className="page-ai-card">
                  <div className="page-ai-badge">
                    <IconSparkles size={13} stroke={2} />
                    Mesterséges intelligencia
                  </div>
                  <h2 className="page-ai-title">
                    Kérd meg a <span>BarSonar AI-t</span>,<br />ő már tudja a
                    választ.
                  </h2>
                  <p className="page-ai-text">
                    Nem tudsz választani, hova menj? Mondd el a chatbotnak,
                    milyen hangulatra vágysz, mennyit szeretnél költeni, és
                    milyen típusú bárt keresel, és másodpercek alatt kapsz
                    személyre szabott ajánlásokat.
                  </p>
                  <Link to="/about" className="page-btn-primary d-inline-flex">
                    Többet a chatbotról
                    <IconArrowRight size={17} stroke={2.5} />
                  </Link>
                </div>
              </Col>

              <Col lg={6}>
                <div className="page-chat-preview">
                  <div>
                    <p className="page-chat-label page-chat-label--user">Te</p>
                    <div className="page-chat-bubble page-chat-bubble--user">
                      Hangulatos bárt keresek, nem túl drágán, Pest közepén, ma estére.
                    </div>
                  </div>
                  <div>
                    <p className="page-chat-label page-chat-label--ai">
                      BarSonar AI
                    </p>
                    <div className="page-chat-bubble page-chat-bubble--ai">
                      Szia! Nézzük csak... a belvárosi Komlókert pont illik -
                      most nyitva van, középáron vannak az italok, és hangulatos
                      régi belső udvara van. Nézd meg a részleteket!
                    </div>
                  </div>
                  <div>
                    <p className="page-chat-label page-chat-label--user">Te</p>
                    <div className="page-chat-bubble page-chat-bubble--user">
                      Tökéletes! Van ott craftsör?
                    </div>
                  </div>
                  <div>
                    <p className="page-chat-label page-chat-label--ai">
                      BarSonar AI
                    </p>
                    <div className="page-chat-bubble page-chat-bubble--ai">
                      Igen, több helyi kisfőzde söre közül is választhatsz! A Hegedűs
                      Pale Ale különösen népszerű az értékelések alapján.
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="page-bars-section">
          <Container>
            <Row className="align-items-end mb-4">
              <Col>
                <p className="page-section-label">Népszerű bárok</p>
                <hr className="page-divider" />
                <h2 className="page-section-title">
                  Legjobban <span>értékelt</span> helyek.
                </h2>
              </Col>
              <Col xs="auto">
                <Link to="/popular" className="page-btn-ghost">
                  Összes megjelenítése
                  <IconArrowRight size={16} stroke={2} />
                </Link>
              </Col>
            </Row>

            <Row className="g-4">
              {popularBars.map((bar) => (
                <Col key={bar.name} md={4}>
                  <Link to="/popular" className="page-bar-card">
                    <div className="page-bar-card-thumb">
                      <span style={{ fontSize: "2.4rem" }}>{bar.icon}</span>
                    </div>
                    <div className="page-bar-card-body">
                      <p className="page-bar-card-name">{bar.name}</p>
                      <p className="page-bar-card-meta">
                        <IconMapPin size={12} stroke={2} />
                        {bar.location}
                      </p>
                      <span className="page-bar-card-rating">
                        <IconStar size={13} stroke={2} />
                        {bar.rating}
                      </span>
                    </div>
                  </Link>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        <section className="page-cta-section">
          <Container>
            <div className="page-cta-inner">
              <div className="page-cta-icon">
                <IconEye size={28} stroke={1.6} />
              </div>
              <h2 className="page-cta-title">
                Készen állsz a következő <span>estédre</span>?
              </h2>
              <p className="page-cta-text">
                Több száz bár, értékelésekkel, AI támogatással - minden,
                ami kell egy emlékezetes estéhez.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/bars" className="page-btn-primary">
                  Bárok felfedezése
                  <IconArrowRight size={17} stroke={2.5} />
                </Link>
                <Link to="/about" className="page-btn-ghost">
                  <IconHeart size={16} stroke={1.8} />
                  Tudj meg többet
                </Link>
              </div>
            </div>
          </Container>
        </section>

        <ChatWidget />
        <Footer />
      </div>
    </>
  );
}
