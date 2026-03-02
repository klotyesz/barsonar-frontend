import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Badge,
  Card,
  Col,
  Container,
  Form,
  Nav,
  Row,
  Spinner,
  Tab,
} from "react-bootstrap";
import {
  IconBrandGoogle,
  IconCamera,
  IconClock,
  IconMapPin,
  IconMessageCircle,
  IconPhone,
  IconPhoto,
  IconSend,
  IconStar,
  IconStarFilled,
  IconWorld,
} from "@tabler/icons-react";
import Menu from "../components/Menu";
import ChatWidget from "../components/ChatWidget";
import { Footer } from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import "../style/barDetails.css";

declare global {
  interface Window {
    google: any;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PROXY_BASE_URL =
  import.meta.env.VITE_PROXY_TARGET || "http://localhost:3000";

interface PlacePhoto {
  id: number;
  location: string;
  type: string;
  user: { userName: string };
}

interface OurComment {
  id: number;
  commentText: string;
  rating: number;
  userID: number;
  createdAt: string;
}

const StarRating = ({ rating, max = 5 }: { rating: number; max?: number }) => {
  const full = Math.floor(rating);
  const partial = rating - full;
  return (
    <span className="star-rating">
      {Array.from({ length: max }, (_, i) => {
        if (i < full)
          return <IconStarFilled key={i} size={16} className="star-filled" />;
        if (i === full && partial >= 0.5)
          return <IconStar key={i} size={16} className="star-half" />;
        return <IconStar key={i} size={16} className="star-empty" />;
      })}
    </span>
  );
};

const ClickableStars = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => (
  <span className="star-rating clickable-stars">
    {Array.from({ length: 5 }, (_, i) =>
      i < value ? (
        <IconStarFilled
          key={i}
          size={22}
          className="star-filled"
          onClick={() => onChange(i + 1)}
          style={{ cursor: "pointer" }}
        />
      ) : (
        <IconStar
          key={i}
          size={22}
          className="star-empty"
          onClick={() => onChange(i + 1)}
          style={{ cursor: "pointer" }}
        />
      ),
    )}
  </span>
);

export const BarDetailsPage = () => {
  const { barId } = useParams<{ barId: string }>();
  const { isAuthenticated, userId } = useAuth();

  const [bar, setBar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dbPlaceId, setDbPlaceId] = useState<number | null>(null);
  const [ourComments, setOurComments] = useState<OurComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [ourPhotos, setOurPhotos] = useState<PlacePhoto[]>([]);
  const [photoUploadSuccess, setPhotoUploadSuccess] = useState(false);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError("Missing Google Maps API key");
      setLoading(false);
      return;
    }
    let cancelled = false;
    const loadScript = () =>
      new Promise<void>((resolve, reject) => {
        if (window.google?.maps?.places) {
          resolve();
          return;
        }
        const existing = document.querySelector(
          'script[data-google-maps="true"]',
        ) as HTMLScriptElement | null;
        if (existing) {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener(
            "error",
            () => reject(new Error("Google Maps failed to load")),
            { once: true },
          );
          return;
        }
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=hu`;
        script.async = true;
        script.defer = true;
        script.dataset.googleMaps = "true";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Google Maps failed to load"));
        document.head.appendChild(script);
      });

    const fetchBarDetails = async () => {
      try {
        await loadScript();
        if (cancelled) return;
        const map = new window.google.maps.Map(document.createElement("div"));
        const service = new window.google.maps.places.PlacesService(map);
        service.getDetails(
          { placeId: barId, reviews_no_translations: true },
          (place: any, status: any) => {
            if (
              status === window.google.maps.places.PlacesServiceStatus.OK &&
              place
            ) {
              setBar(place);
            } else {
              setError("Bar not found");
            }
            setLoading(false);
          },
        );
      } catch {
        if (!cancelled) {
          setError("Failed to load bar details");
          setLoading(false);
        }
      }
    };
    fetchBarDetails();
    return () => {
      cancelled = true;
    };
  }, [barId]);

  useEffect(() => {
    if (!barId) return;
    setCommentsLoading(true);
    fetch(`${API_BASE_URL}/place/getByGooglePlaceId/${barId}`, {
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((place: { id: number } | null) => {
        if (!place?.id) {
          setCommentsLoading(false);
          return;
        }
        setDbPlaceId(place.id);
        return fetch(`${API_BASE_URL}/comment/findAllByPlace/${place.id}`, {
          credentials: "include",
        })
          .then((r) => (r.ok ? r.json() : []))
          .then((data) => setOurComments(Array.isArray(data) ? data : []))
          .catch(() => setOurComments([]))
          .finally(() => setCommentsLoading(false));
      })
      .catch(() => setCommentsLoading(false));
  }, [barId]);

  useEffect(() => {
    if (!dbPlaceId) return;
    fetch(`${API_BASE_URL}/photo/getAllByPlace/${dbPlaceId}`, {
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setOurPhotos(Array.isArray(data) ? data : []))
      .catch(() => setOurPhotos([]));
  }, [dbPlaceId]);

  const submitComment = async () => {
    if (!commentText.trim() || commentRating === 0 || !userId) return;
    setSubmitting(true);
    try {
      let resolvedPlaceId = dbPlaceId;

      if (!resolvedPlaceId) {
        const placeRes = await fetch(`${API_BASE_URL}/place`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            googleplaceID: barId,
            name: bar.name,
            address: bar.formatted_address ?? "",
          }),
        });
        if (!placeRes.ok) return;
        const newPlace = await placeRes.json();
        resolvedPlaceId = newPlace.id;
        setDbPlaceId(newPlace.id);
      }

      const res = await fetch(`${API_BASE_URL}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          commentText,
          rating: commentRating,
          placeID: resolvedPlaceId,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setOurComments((prev) => [created, ...prev]);
        setCommentText("");
        setCommentRating(0);
      }

      if (selectedPhotos.length > 0 && resolvedPlaceId) {
        const fd = new FormData();
        fd.append("userID", String(userId));
        fd.append("placeID", String(resolvedPlaceId));
        selectedPhotos.forEach((f) => fd.append("file", f));
        const photoRes = await fetch(`${API_BASE_URL}/photo/upload`, {
          method: "POST",
          credentials: "include",
          body: fd,
        });
        if (photoRes.ok) {
          setSelectedPhotos([]);
          if (fileInputRef.current) fileInputRef.current.value = "";
          setPhotoUploadSuccess(true);
          setTimeout(() => setPhotoUploadSuccess(false), 4000);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-layout">
        <Menu />
        <div className="bar-details-loading">
          <Spinner animation="border" variant="warning" />
          <p className="mt-3">Betöltés...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-layout">
        <Menu />
        <Container className="mt-5">
          <div className="alert alert-danger">{error}</div>
        </Container>
        <Footer />
      </div>
    );
  }

  if (!bar) return null;

  const heroPhoto =
    bar.photos && bar.photos.length > 0
      ? bar.photos[0].getUrl({ maxWidth: 1400 })
      : null;

  const googlePhotos: string[] =
    bar.photos && bar.photos.length > 1
      ? bar.photos.slice(1, 9).map((p: any) => p.getUrl({ maxWidth: 600 }))
      : [];

  const isOpen = bar.opening_hours?.isOpen?.();

  const ourAvgRating =
    ourComments.length > 0
      ? ourComments.reduce((s, c) => s + c.rating, 0) / ourComments.length
      : null;

  return (
    <div className="page-layout">
      <Menu />
      <ChatWidget />

      <div
        className="bar-details-hero"
        style={heroPhoto ? { backgroundImage: `url(${heroPhoto})` } : {}}
      >
        <div className="bar-details-hero-overlay">
          <Container>
            <div className="bar-details-hero-content">
              <Badge
                className="bar-status-badge"
                bg={isOpen ? "success" : "danger"}
              >
                {isOpen === undefined
                  ? "Státusz ismeretlen"
                  : isOpen
                    ? "Nyitva"
                    : "Zárva"}
              </Badge>
              <h1 className="bar-details-title">{bar.name}</h1>

              <div className="bar-hero-ratings">
                {bar.rating && (
                  <div className="bar-rating-pill">
                    <IconBrandGoogle size={14} className="me-1" />
                    <StarRating rating={bar.rating} />
                    <span className="bar-rating-num">
                      {bar.rating.toFixed(1)}
                    </span>
                    {bar.user_ratings_total && (
                      <span className="bar-rating-meta">
                        ({bar.user_ratings_total.toLocaleString()})
                      </span>
                    )}
                  </div>
                )}
                {ourAvgRating !== null && (
                  <div className="bar-rating-pill bar-rating-pill--ours">
                    <IconMessageCircle size={14} className="me-1" />
                    <StarRating rating={ourAvgRating} />
                    <span className="bar-rating-num">
                      {ourAvgRating.toFixed(1)}
                    </span>
                    <span className="bar-rating-meta">
                      ({ourComments.length} vélemény)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </div>
      </div>

      <Container className="bar-details-body pb-5">
        <Row className="g-4 mt-0">
          <Col lg={8}>
            <Row className="g-4">
              <Col xs={12}>
                <Card className="bar-details-card">
                  <Card.Body>
                    <h5 className="bar-section-title">
                      <IconMapPin size={18} className="section-icon" /> Cím
                      &amp; Elérhetőség
                    </h5>
                    <hr className="bar-divider" />
                    <Row className="g-3">
                      {bar.formatted_address && (
                        <Col sm={6}>
                          <div className="bar-info-item">
                            <span className="bar-info-label">Cím</span>
                            <span className="bar-info-value">
                              {bar.formatted_address}
                            </span>
                          </div>
                        </Col>
                      )}
                      {bar.formatted_phone_number && (
                        <Col sm={6}>
                          <div className="bar-info-item">
                            <span className="bar-info-label">
                              <IconPhone size={13} className="me-1" /> Telefon
                            </span>
                            <a
                              href={`tel:${bar.formatted_phone_number}`}
                              className="bar-link bar-info-value"
                            >
                              {bar.formatted_phone_number}
                            </a>
                          </div>
                        </Col>
                      )}
                      {bar.website && (
                        <Col sm={6}>
                          <div className="bar-info-item">
                            <span className="bar-info-label">
                              <IconWorld size={13} className="me-1" /> Weboldal
                            </span>
                            <a
                              href={bar.website}
                              target="_blank"
                              rel="noreferrer"
                              className="bar-link bar-info-value"
                            >
                              {new URL(bar.website).hostname}
                            </a>
                          </div>
                        </Col>
                      )}
                      {bar.price_level !== undefined && (
                        <Col sm={6}>
                          <div className="bar-info-item">
                            <span className="bar-info-label">Árkategória</span>
                            <span className="bar-info-value bar-price">
                              {"€".repeat(bar.price_level + 1)}
                              <span className="bar-price-grey">
                                {"€".repeat(4 - bar.price_level - 1)}
                              </span>
                            </span>
                          </div>
                        </Col>
                      )}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              {bar.opening_hours?.weekday_text && (
                <Col xs={12}>
                  <Card className="bar-details-card">
                    <Card.Body>
                      <h5 className="bar-section-title">
                        <IconClock size={18} className="section-icon" />{" "}
                        Nyitvatartás
                      </h5>
                      <hr className="bar-divider" />
                      <ul className="bar-hours-list">
                        {bar.opening_hours.weekday_text.map(
                          (day: string, idx: number) => {
                            const [label, ...rest] = day.split(": ");
                            return (
                              <li key={idx} className="bar-hours-item">
                                <span className="bar-hours-day">{label}</span>
                                <span className="bar-hours-time">
                                  {rest.join(": ")}
                                </span>
                              </li>
                            );
                          },
                        )}
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
              )}

              <Col xs={12}>
                <Card className="bar-details-card">
                  <Card.Body>
                    <Tab.Container defaultActiveKey="google-reviews">
                      <div className="bar-tab-header">
                        <Nav variant="pills" className="bar-tab-nav">
                          <Nav.Item>
                            <Nav.Link
                              eventKey="google-reviews"
                              className="bar-tab-pill"
                            >
                              <IconBrandGoogle size={15} className="me-1" />{" "}
                              Google vélemények
                            </Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link
                              eventKey="our-reviews"
                              className="bar-tab-pill"
                            >
                              <IconMessageCircle size={15} className="me-1" />{" "}
                              BarSonar vélemények
                            </Nav.Link>
                          </Nav.Item>
                        </Nav>
                      </div>
                      <hr className="bar-divider" />
                      <Tab.Content>
                        <Tab.Pane eventKey="google-reviews">
                          {bar.reviews && bar.reviews.length > 0 ? (
                            <Row className="g-3">
                              {bar.reviews
                                .slice(0, 6)
                                .map((review: any, idx: number) => (
                                  <Col sm={6} key={idx}>
                                    <Card className="bar-review-card h-100">
                                      <Card.Body>
                                        <div className="bar-review-header">
                                          <img
                                            src="/default_avatar.png"
                                            alt={review.author_name}
                                            className="bar-review-avatar"
                                          />
                                          <div>
                                            <div className="bar-review-author">
                                              {review.author_name}
                                            </div>
                                            <StarRating
                                              rating={review.rating}
                                            />
                                          </div>
                                        </div>
                                        {review.text && (
                                          <p className="bar-review-text">
                                            {review.text}
                                          </p>
                                        )}
                                        <span className="bar-review-time">
                                          {review.relative_time_description}
                                        </span>
                                      </Card.Body>
                                    </Card>
                                  </Col>
                                ))}
                            </Row>
                          ) : (
                            <p className="bar-empty-state">
                              Nincsenek Google vélemények.
                            </p>
                          )}
                        </Tab.Pane>

                        <Tab.Pane eventKey="our-reviews">
                          {isAuthenticated && (
                            <div className="bar-comment-form mb-4">
                              <div className="bar-comment-form-stars">
                                <span className="bar-info-label me-2">
                                  Értékelésed:
                                </span>
                                <ClickableStars
                                  value={commentRating}
                                  onChange={setCommentRating}
                                />
                              </div>
                              <div className="bar-comment-input-row">
                                <Form.Control
                                  as="textarea"
                                  rows={2}
                                  placeholder="Írj véleményt..."
                                  value={commentText}
                                  onChange={(e) =>
                                    setCommentText(e.target.value)
                                  }
                                  className="bar-comment-textarea"
                                />
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  hidden
                                  onChange={(e) => {
                                    const files = Array.from(
                                      e.target.files ?? [],
                                    ).slice(0, 3);
                                    setSelectedPhotos(files);
                                  }}
                                />
                                <button
                                  type="button"
                                  className="bar-camera-btn"
                                  onClick={() => fileInputRef.current?.click()}
                                  title="Fotó csatolása"
                                >
                                  <IconCamera size={18} />
                                  {selectedPhotos.length > 0 && (
                                    <span className="bar-photo-badge">
                                      {selectedPhotos.length}
                                    </span>
                                  )}
                                </button>
                                <button
                                  className="bar-send-btn"
                                  onClick={submitComment}
                                  disabled={
                                    submitting ||
                                    !commentText.trim() ||
                                    commentRating === 0
                                  }
                                >
                                  {submitting ? (
                                    <Spinner size="sm" animation="border" />
                                  ) : (
                                    <IconSend size={18} />
                                  )}
                                </button>
                              </div>
                              {photoUploadSuccess && (
                                <p className="bar-upload-success">
                                  Fotók feltöltve! Admin jóváhagyás után
                                  megjelennek.
                                </p>
                              )}
                            </div>
                          )}
                          {!isAuthenticated && (
                            <p className="bar-empty-state mb-3">
                              Jelentkezz be vélemény írásához.
                            </p>
                          )}

                          {commentsLoading ? (
                            <div className="text-center py-3">
                              <Spinner
                                animation="border"
                                variant="warning"
                                size="sm"
                              />
                            </div>
                          ) : ourComments.length > 0 ? (
                            <Row className="g-3">
                              {ourComments.map((c) => (
                                <Col sm={6} key={c.id}>
                                  <Card className="bar-review-card h-100">
                                    <Card.Body>
                                      <div className="bar-review-header">
                                        <img
                                          src="/default_avatar.png"
                                          alt={`Felhasználó #${c.userID}`}
                                          className="bar-review-avatar"
                                        />
                                        <div>
                                          <div className="bar-review-author">
                                            Felhasználó #{c.userID}
                                          </div>
                                          <StarRating rating={c.rating} />
                                        </div>
                                      </div>
                                      <p className="bar-review-text">
                                        {c.commentText}
                                      </p>
                                      <span className="bar-review-time">
                                        {new Date(
                                          c.createdAt,
                                        ).toLocaleDateString("hu-HU")}
                                      </span>
                                    </Card.Body>
                                  </Card>
                                </Col>
                              ))}
                            </Row>
                          ) : (
                            <p className="bar-empty-state">
                              Még nincsenek BarSonar vélemények.
                            </p>
                          )}
                        </Tab.Pane>
                      </Tab.Content>
                    </Tab.Container>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>

          <Col lg={4}>
            <Row className="g-4">
              <Col xs={12}>
                <Card className="bar-details-card">
                  <Card.Body>
                    <Tab.Container defaultActiveKey="google-photos">
                      <div className="bar-tab-header">
                        <Nav variant="pills" className="bar-tab-nav">
                          <Nav.Item>
                            <Nav.Link
                              eventKey="google-photos"
                              className="bar-tab-pill"
                            >
                              <IconBrandGoogle size={14} className="me-1" />{" "}
                              Google
                            </Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link
                              eventKey="our-photos"
                              className="bar-tab-pill"
                            >
                              <IconPhoto size={14} className="me-1" /> BarSonar
                            </Nav.Link>
                          </Nav.Item>
                        </Nav>
                      </div>
                      <hr className="bar-divider" />
                      <Tab.Content>
                        <Tab.Pane eventKey="google-photos">
                          {googlePhotos.length > 0 ? (
                            <div className="bar-gallery-grid">
                              {googlePhotos.map((url, idx) => (
                                <div key={idx} className="bar-gallery-item">
                                  <img
                                    src={url}
                                    alt={`${bar.name} ${idx + 2}`}
                                    className="bar-gallery-img"
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="bar-empty-state">
                              Nincsenek Google fotók.
                            </p>
                          )}
                        </Tab.Pane>
                        <Tab.Pane eventKey="our-photos">
                          {ourPhotos.length > 0 ? (
                            <div className="bar-gallery-grid">
                              {ourPhotos.map((photo) => (
                                <div
                                  key={photo.id}
                                  className="bar-gallery-item"
                                >
                                  <img
                                    src={`${PROXY_BASE_URL}/${photo.location}`}
                                    alt={
                                      photo.user?.userName ?? "Feltöltött fotó"
                                    }
                                    className="bar-gallery-img"
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="bar-empty-state">
                              Még nincsenek feltöltött fotók.
                            </p>
                          )}
                        </Tab.Pane>
                      </Tab.Content>
                    </Tab.Container>
                  </Card.Body>
                </Card>
              </Col>

              {bar.geometry?.location && (
                <Col xs={12}>
                  <Card className="bar-details-card overflow-hidden">
                    <iframe
                      title="map"
                      className="bar-map-embed"
                      loading="lazy"
                      allowFullScreen
                      src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=place_id:${barId}`}
                    />
                  </Card>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
};
