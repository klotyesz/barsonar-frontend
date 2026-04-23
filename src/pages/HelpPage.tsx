import { Container, Row, Col } from "react-bootstrap";
import {
  IconMapPin,
  IconStar,
  IconSparkles,
  IconUsers,
  IconArrowRight,
  IconArrowLeft,
  IconMessageCircle,
  IconUserStar,
  IconHome,
  IconInfoCircle,
  IconLogin,
  IconSettings,
  IconHelp,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import ChatWidget from "../components/ChatWidget";
import { Footer } from "../components/Footer";
import Menu from "../components/Menu";
import "../style/home.css";
import "../style/help.css";

const navItems = [
  {
    icon: <IconHome size={26} stroke={1.6} />,
    title: "Főoldal",
    text: "A BarSonar logóra vagy a Főoldal linkre kattintva bármikor visszatérhetsz a kezdőoldalra.",
  },
  {
    icon: <IconMapPin size={26} stroke={1.6} />,
    title: "Térkép",
    text: "A Térkép gombra kattintva megnyílik az interaktív térkép, ahol böngészheted a közeledben lévő bárokat.",
  },
  {
    icon: <IconUserStar size={26} stroke={1.6} />,
    title: "Ajánlott bárok",
    text: "Az Ajánlott bárok gombra kattintva személyre szabott ajánlásokat kapsz a profilod és korod alapján.",
  },
  {
    icon: <IconInfoCircle size={26} stroke={1.6} />,
    title: "Rólunk",
    text: "A Rólunk oldalon megismerheted a BarSonar projektet, a csapatot és a felhasznált technológiákat.",
  },
  {
    icon: <IconLogin size={26} stroke={1.6} />,
    title: "Bejelentkezés",
    text: "A Bejelentkezés gombra kattintva megnyílik a bejelentkezési ablak, ahol regisztrálhatsz vagy bejelentkezhetsz meglévő fiókodba.",
  },
  {
    icon: <IconSettings size={26} stroke={1.6} />,
    title: "Profil és beállítások",
    text: "Bejelentkezés után a profilodra kattintva elérheted a beállításaidat, a barátaidat és az értékeléseidet.",
  },
];

const features = [
  {
    icon: <IconSparkles size={26} stroke={1.6} />,
    title: "AI chatbot gomb",
    text: "A képernyő jobb alsó sarkában lévő gombra kattintva megnyílik az AI chatbot, ahol személyre szabott bár-ajánlásokat kérhetsz.",
  },
  {
    icon: <IconMapPin size={26} stroke={1.6} />,
    title: "Térkép interakció",
    text: "A térképen lévő jelölőkre kattintva felugró ablak jelenik meg a bár alapadataival. A Részletek gombbal megnyílik a teljes oldal.",
  },
  {
    icon: <IconStar size={26} stroke={1.6} />,
    title: "Értékelés gomb",
    text: "A bár részletoldalán az Értékelés gombra kattintva csillagokkal értékelheted a helyet, amelyet más felhasználók is látnak.",
  },
  {
    icon: <IconMessageCircle size={26} stroke={1.6} />,
    title: "Hozzászólás gomb",
    text: "A Hozzászólás gombbal kommentelhetsz a bár oldalán, megoszthatsz élményeket és fotókat a közösséggel.",
  },
  {
    icon: <IconUsers size={26} stroke={1.6} />,
    title: "Barátok oldal",
    text: "A barátok oldalon követheted ismerőseidet, és kisorsolhatjátok ki fizeti a kört.",
  },
  {
    icon: <IconSettings size={26} stroke={1.6} />,
    title: "Beállítások",
    text: "A beállítások oldalon módosíthatod a profiladataidat, és más személyes preferenciákat.",
  },
];

const steps = [
  {
    n: "01",
    title: "Hozz létre fiókot",
    text: "Kattints a Bejelentkezés gombra a navigációban, regisztrálj, és máris elérheted az összes funkciót.",
  },
  {
    n: "02",
    title: "Fedezd fel a térképet",
    text: "Nyisd meg a Térkép oldalt, és böngészd a közeledben lévő bárokat. Kattints bármelyik jelölőre a részletekért.",
  },
  {
    n: "03",
    title: "Kérd az AI segítségét",
    text: "Ha nem tudsz dönteni, nyisd meg a chatbotot a jobb alsó sarokban, és írd le, milyen estét képzelsz el.",
  },
  {
    n: "04",
    title: "Nézd meg az ajánlásokat",
    text: "Az Ajánlott bárok oldalon algoritmikusan válogatott listát találsz, amely a korod és ízlésed alapján készül.",
  },
  {
    n: "05",
    title: "Értékelj és kommentelj",
    text: "A látogatott bár oldalán csillagozd meg a helyet, írj hozzászólást, és segíts másoknak is dönteni.",
  },
];

export function HelpPage() {
  return (
    <>
      <div className="page-layout">
        <Menu />

        <section className="help-hero">
          <div className="help-hero-glow" />
          <Container>
            <div className="help-hero-content">
              <div className="page-hero-eyebrow">
                <IconHelp size={14} stroke={2} />
                Felhasználói kézikönyv
              </div>
              <h1 className="help-hero-title">
                Itt mindent megtalálsz a
                <br />
                <span>BarSonar</span> használatáról.
              </h1>
              <p className="help-hero-subtitle">
                Ez az oldal segít megérteni az összes gombot és funkciót -
                lépésről lépésre, egyszerűen.
              </p>
              <div className="page-hero-ctas">
                <a
                  href="#navigation"
                  className="d-inline-flex align-items-center gap-1 page-btn-primary"
                >
                  Funkciók áttekintése
                  <IconArrowRight size={17} stroke={2.5} />
                </a>
                <Link to="/" className="page-btn-ghost">
                  <IconArrowLeft size={16} stroke={2} />
                  Vissza a főoldalra
                </Link>
              </div>
            </div>
          </Container>
        </section>

        <section className="page-features-section" id="navigation">
          <Container>
            <Row className="mb-5">
              <Col lg={6}>
                <p className="page-section-label">Navigáció</p>
                <hr className="page-divider" />
                <h2 className="page-section-title">
                  A navigációs sáv
                  <br />
                  <span>gombjainak</span> magyarázata.
                </h2>
              </Col>
              <Col lg={6} className="d-flex align-items-end">
                <p className="page-section-subtitle">
                  A képernyő tetején lévő navigációs sávban megtalálod az összes
                  fontos oldalt és funkciót. Az alábbiakban mindegyiket
                  részletesen bemutatjuk.
                </p>
              </Col>
            </Row>

            <Row className="g-4">
              {navItems.map((item) => (
                <Col key={item.title} md={6} lg={4}>
                  <div className="page-feature-card">
                    <div className="page-feature-icon">{item.icon}</div>
                    <h3 className="page-feature-title">{item.title}</h3>
                    <p className="page-feature-text">{item.text}</p>
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
                <p className="page-section-label">Hogyan kezdj el</p>
                <hr className="page-divider" />
                <h2 className="page-section-title">
                  Néhány lépés a <span>teljes</span>
                  <br />
                  BarSonar-élményhez.
                </h2>
                <p className="page-section-subtitle mt-3">
                  Kövesd a lépéseket hogy a neked legmegfelelőbb bárt találd
                  meg.
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
                  <div key={s.n} className="page-step">
                    <div className="page-step-num">{s.n}</div>
                    <div>
                      <p className="page-step-title">{s.title}</p>
                      <p className="page-step-text">{s.text}</p>
                      <br />
                    </div>
                  </div>
                ))}
              </Col>
            </Row>
          </Container>
        </section>

        <section className="page-ai-section">
          <Container>
            <Row className="mb-5">
              <Col lg={6}>
                <p className="page-section-label">Funkciók</p>
                <hr className="page-divider" />
                <h2 className="page-section-title">
                  A fő <span>gombok</span> és
                  <br />
                  funkciók részletesen.
                </h2>
              </Col>
              <Col lg={6} className="d-flex align-items-end">
                <p className="page-section-subtitle">
                  A BarSonar tele van hasznos funkciókkal. Ismerkedj meg a
                  legfontosabb gombokkal és azok szerepével.
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

        <section className="page-cta-section">
          <Container>
            <div className="page-cta-inner">
              <div className="page-cta-icon">
                <IconHelp size={28} stroke={1.6} />
              </div>
              <h2 className="page-cta-title">
                Készen állsz a <span>felfedezésre</span>?
              </h2>
              <p className="page-cta-text">
                Most, hogy ismered a legtöbb funkciót, ideje kipróbálni a
                BarSonar-t.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/bars" className="page-btn-primary">
                  Bárok felfedezése
                  <IconArrowRight size={17} stroke={2.5} />
                </Link>
                <Link to="/recommendations" className="page-btn-ghost">
                  <IconSparkles size={16} stroke={1.8} />
                  Ajánlott bárok
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
