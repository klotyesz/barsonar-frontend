import { Container, Row, Col } from "react-bootstrap";
import {
  IconRadar,
  IconMapPin,
  IconUsers,
  IconStar,
  IconClockHour4,
  IconSparkles,
  IconRocket,
  IconShieldCheck,
  IconArrowRight,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import ChatWidget from "../components/ChatWidget";
import { Footer } from "../components/Footer";
import Menu from "../components/Menu";
import "../style/about.css";

const features = [
  {
    icon: <IconMapPin size={26} stroke={1.6} />,
    title: "Valós idejű térkép",
    text: "Fedezz fel bárokat a közeledben interaktív térképünkön – nyitvatartással, értékelésekkel és részletes leírásokkal.",
  },
  {
    icon: <IconStar size={26} stroke={1.6} />,
    title: "Autentikus értékelések",
    text: "Olvasd mások véleményét, írj saját értékelést, és oszd meg élményeid képekkel.",
  },
  {
    icon: <IconSparkles size={26} stroke={1.6} />,
    title: "AI Asszisztens",
    text: "BarSonar AI chatbotunk személyre szabott bár-ajánlásokat kínál a te preferenciáid alapján.",
  },
  {
    icon: <IconUsers size={26} stroke={1.6} />,
    title: "Közösség",
    text: "Kövesd barátaidat, és döntsétek el ki fizeti a kört!",
  },
  {
    icon: <IconShieldCheck size={26} stroke={1.6} />,
    title: "Megbízható adatok",
    text: "Folyamatosan frissülő bár-adatbázisunk biztosítja, hogy mindig naprakész infókat kapj.",
  },
  {
    icon: <IconClockHour4 size={26} stroke={1.6} />,
    title: "Nyitvatartás",
    text: "Tudd meg egy pillanat alatt, hogy a kiszemelt bár most nyitva van-e, és mikor zár.",
  },
];

const team = [
  {
    initials: "SG",
    name: "Sarkadi Gábor",
    role: "Fejlesztő & Alapító",
    bio: "Frontend fejlesztő, a BarSonar frontendjének megvalósítója.",
  },
  {
    initials: "KA",
    name: "Kobela András",
    role: "Fejlesztő & Alapító",
    bio: "Backend fejlesztő, a BarSonar backendjének tervezője és megvalósítója.",
  },

];

const timeline = [
  {
    year: "2025 Tél",
    heading: "Az ötlet születése",
    desc: "Barátokkal töltött esték után felmerült: miért nincs egy igazán jó magyar bárkereső app?",
  },
  {
    year: "2026 Január",
    heading: "Fejlesztés kezdete",
    desc: "React + Vite frontend, NestJS backend és MySQL adatbázis – a stack összeállt.",
  },
  {
    year: "2026 Február",
    heading: "AI integráció",
    desc: "Bekerült a BarSonar AI chatbot, amely segíti a felhasználókat a megfelelő bárok és italok megtalálásában.",
  },
  {
    year: "2026 Március",
    heading: "Publikus béta",
    desc: "Az app megnyílik a nyilvánosság előtt – és te épp most vagy az első felhasználók között!",
  },
];

const tech = [
  "NestJS",
  "Prisma",
  "MySQL",
  "React",
  "TypeScript",
  "Vite",
  "Bootstrap",
  "React-Bootstrap",
  "Google Maps API",
  "CloudFlare Workers AI",
];

export function About() {
  return (
    <>
      <div className="page-layout">
        <Menu />

        <section className="about-hero">
          <div className="about-hero-overlay" />
          <Container>
            <div className="about-hero-content">
              <div className="page-hero-eyebrow">
                <IconRadar size={14} stroke={2} />
                Rólunk
              </div>
              <h1 className="about-hero-title">
                Találd meg a <span>tökéletes</span> bárodat.
              </h1>
              <p className="about-hero-subtitle">
                A BarSonar egy modern bárfelfedező platform, amely összehozza a
                bárokat, a közösséget és a mesterséges intelligenciát – hogy
                minden este emlékezetes legyen.
              </p>
              <div className="page-hero-stats">
                <div className="page-stat-pill">
                  <IconMapPin size={16} stroke={2} />
                  <span className="page-stat-num">100+</span>
                  bár
                </div>
                <div className="page-stat-pill">
                  <IconStar size={16} stroke={2} />
                  <span className="page-stat-num">500+</span>
                  értékelés
                </div>
                <div className="page-stat-pill">
                  <IconRadar size={16} stroke={2} />
                  <span className="page-stat-num">AI</span>
                  asszisztens
                </div>
              </div>
            </div>
          </Container>
        </section>

        <div className="about-body">
          <Container>
            <Row className="mb-5">
              <Col lg={5} className="mb-4 mb-lg-0">
                <p className="page-section-label">Küldetésünk</p>
                <hr className="page-divider" />
                <div className="about-mission-card">
                  <div className="page-card-icon">
                    <IconRadar size={28} stroke={1.6} />
                  </div>
                  <h2 className="page-card-title">Mi a BarSonar?</h2>
                  <p className="page-card-text">
                    A BarSonar egy közösségi bárfelfedező alkalmazás, amelyet
                    azzal a céllal hoztunk létre, hogy megkönnyítsük a legjobb
                    bárok megtalálását. Legyen szó egy spontán esti sörözésről
                    vagy egy előre tervezett bulizásról. A BarSonar mindig
                    kéznél van!
                  </p>
                  <p className="page-card-text mt-3">
                    Valós felhasználói értékelések, nyitvatartási adatok,
                    interaktív térkép és egy AI-alapú chatbot segítenek abban,
                    hogy ne pazarolj időt a keresgéléssel, hanem inkább élvezhesd
                    az estét.
                  </p>
                </div>
              </Col>

              <Col lg={7}>
                <p className="page-section-label">Történetünk</p>
                <hr className="page-divider" />
                <div className="about-timeline-card">
                  <ul className="about-timeline">
                    {timeline.map((ev) => (
                      <li key={ev.year} className="about-timeline-item">
                        <span className="about-timeline-dot" />
                        <p className="about-timeline-year">{ev.year}</p>
                        <p className="about-timeline-heading">{ev.heading}</p>
                        <p className="about-timeline-desc">{ev.desc}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>

            <Row className="mb-5">
              <Col xs={12} className="mb-3">
                <p className="page-section-label">Funkciók</p>
                <hr className="page-divider" />
                <h2 className="page-section-title mb-3">
                  Minden, amire szükséged van <span>egy jó este</span> előtt.
                </h2>
              </Col>
              {features.map((f) => (
                <Col key={f.title} md={6} lg={4} className="mb-4">
                  <div className="about-feature-card">
                    <div className="page-card-icon">{f.icon}</div>
                    <h3 className="page-card-title">{f.title}</h3>
                    <p className="page-card-text">{f.text}</p>
                  </div>
                </Col>
              ))}
            </Row>

            <Row className="mb-5">
              <Col xs={12} className="mb-3">
                <p className="page-section-label">Technológia</p>
                <hr className="page-divider" />
              </Col>
              <Col xs={12}>
                <div className="about-tech-card">
                  <div style={{ flex: 1 }}>
                    <h3 className="page-card-title mb-2">
                      Modern technológiai verem
                    </h3>
                    <p className="page-card-text">
                      A BarSonar a legfrissebb webfejlesztési eszközökre épül –
                      a gyorsaság, biztonság és skálázhatóság jegyében.
                    </p>
                  </div>
                  <div className="about-tech-list" style={{ flex: 1 }}>
                    {tech.map((t) => (
                      <span key={t} className="about-tech-badge">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="mb-5">
              <Col xs={12} className="mb-3">
                <p className="page-section-label">Csapat</p>
                <hr className="page-divider" />
                <h2 className="page-section-title mb-3">
                  Akik <span>összehozták</span>.
                </h2>
              </Col>
              <Col xs={12}>
                <div className="about-team-grid">
                  {team.map((m) => (
                    <div key={m.name} className="about-team-card">
                      <div className="about-team-avatar">{m.initials}</div>
                      <p className="about-team-name">{m.name}</p>
                      <p className="about-team-role">{m.role}</p>
                      <p className="about-team-bio">{m.bio}</p>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                <div className="about-cta">
                  <div className="page-cta-icon">
                    <IconRocket size={26} stroke={1.6} />
                  </div>
                  <h2 className="about-cta-title">
                    Készen állsz a következő <span>estédre</span>?
                  </h2>
                  <p className="about-cta-text">
                    Böngészd a bárokat, olvasd az értékeléseket, kérdezd az AI
                    chatbotot és találd meg a tökéletes helyet már ma este.
                  </p>
                  <Link to="/bars" className="page-btn-primary">
                    Bárokat felfedezek
                    <IconArrowRight
                      size={16}
                      stroke={2.5}
                      style={{ marginLeft: 4, verticalAlign: "middle" }}
                    />
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <ChatWidget />
        <Footer />
      </div>
    </>
  );
}
