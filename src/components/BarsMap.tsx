import { useEffect, useRef, useState, useCallback } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import ReactDOMServer from "react-dom/server";
import CustomInfoWindow from "./CustomInfoWindow";

declare global {
  interface Window {
    google: any;
  }
}

type BarsMapProps = {
  onFullScreenChange?: (fullScreen: boolean) => void;
};

const BarsMap = ({ onFullScreenChange }: BarsMapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSearchButton, setShowSearchButton] = useState(false);
  const [mapFullScreen, setMapFullScreen] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [searching, setSearching] = useState(false);
  const userLocationRef = useRef<{ lat: number; lng: number } | null>(null);
  const infoWindowRef = useRef<any>(null);
  const distanceServiceRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);
  const moveListenerRef = useRef<any>(null);

  const searchBars = useCallback(
    (map: any, searchCenter: { lat: number; lng: number }) => {
      if (!placesServiceRef.current) return;

      setSearching(true);
      setShowSearchButton(false);

      const service = placesServiceRef.current;
      const distanceService = distanceServiceRef.current;
      const infoWindow =
        infoWindowRef.current ?? new window.google.maps.InfoWindow();
      infoWindowRef.current = infoWindow;
      (window as any).closeMapInfoWindow = () => infoWindow.close();

      const runSearch = (request: any) =>
        new Promise<any[]>((resolve) => {
          service.nearbySearch(
            request,
            (results: any[] | null, status: any) => {
              if (
                status === window.google.maps.places.PlacesServiceStatus.OK &&
                results
              ) {
                resolve(results);
              } else {
                resolve([]);
              }
            },
          );
        });

      Promise.all([
        runSearch({ location: searchCenter, radius: 1000, type: "bar" }),
        runSearch({ location: searchCenter, radius: 1000, keyword: "pub" }),
      ]).then(([bars, pubs]) => {
        const unique = new Map<string, any>();
        [...bars, ...pubs].forEach((place) => {
          if (!place.place_id) return;
          const location = place.geometry?.location;
          if (!location) return;
          if (!unique.has(place.place_id)) unique.set(place.place_id, place);
        });

        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];

        unique.forEach((place) => {
          const location = place.geometry?.location;
          if (!location) return;
          const isOpen = place.opening_hours?.isOpen;
          let pinPath = "";
          if (isOpen === undefined) {
            pinPath = "barsonar_pin_unknown.png";
          } else {
            pinPath = "barsonar_pin_closed.png";
          }
          const marker = new window.google.maps.Marker({
            map,
            position: location,
            title: place.name || "",
            icon: {
              url: pinPath,
              scaledSize: new window.google.maps.Size(40, 60),
            },
          });

          marker.addListener("click", () => {
            const destLat =
              typeof location.lat === "function"
                ? location.lat()
                : location.lat;
            const destLng =
              typeof location.lng === "function"
                ? location.lng()
                : location.lng;

            let walkingHtml = `<div style="font-size:12px;color:#aaa;margin-top:6px">Számítás...</div>`;

            const content = ReactDOMServer.renderToString(
              <CustomInfoWindow
                title={place.name ?? "Bar"}
                description={place.vicinity ?? ""}
                buttonText="Információ"
                buttonLink={`/bar/${place.place_id}`}
                walkingInfo={walkingHtml}
              />,
            );
            infoWindow.setContent(content);
            infoWindow.open({ anchor: marker, map });

            if (userLocationRef.current) {
              const origin = userLocationRef.current;
              distanceService.getDistanceMatrix(
                {
                  origins: [
                    new window.google.maps.LatLng(origin.lat, origin.lng),
                  ],
                  destinations: [
                    new window.google.maps.LatLng(destLat, destLng),
                  ],
                  travelMode: window.google.maps.TravelMode.WALKING,
                },
                (response: any, status: any) => {
                  if (
                    status === "OK" &&
                    response?.rows?.[0]?.elements?.[0]?.status === "OK"
                  ) {
                    const duration = response.rows[0].elements[0].duration.text;
                    const mapsUrl = `https://www.google.com/maps/dir/?api=1\u0026origin=${origin.lat},${origin.lng}\u0026destination=${destLat},${destLng}\u0026travelmode=walking`;

                    walkingHtml = `\u003ca href=\"${mapsUrl}\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"font-size:12px;color:#f5a623;text-decoration:none;display:inline-block;margin-top:6px;cursor:pointer\"\u003e${duration} séta\u003c/a\u003e`;
                  } else {
                    walkingHtml = `\u003cdiv style=\"font-size:12px;color:#888;margin-top:6px\"\u003eSétatávolság nem elérhető\u003c/div\u003e`;
                  }
                  // Re-render the custom info window with updated walkingInfo
                  const updatedContent = ReactDOMServer.renderToString(
                    <CustomInfoWindow
                      title={place.name ?? "Bar"}
                      description={place.vicinity ?? ""}
                      buttonText="Információ"
                      buttonLink={`/bar/${place.place_id}`}
                      walkingInfo={walkingHtml}
                    />,
                  );
                  infoWindow.setContent(updatedContent);
                },
              );
            }
          });

          markersRef.current.push(marker);
        });

        setSearching(false);
      });
    },
    [],
  );

  useEffect(() => {
    const check = () =>
      setIsMobileOrTablet(
        window.matchMedia("(max-width: 1024px)").matches ||
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent,
          ) ||
          "ontouchstart" in window,
      );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    onFullScreenChange?.(mapFullScreen);
  }, [mapFullScreen, onFullScreenChange]);

  useEffect(() => {
    if (!mapFullScreen) return;
    document.body.style.overflow = "hidden";
    const map = mapInstanceRef.current;
    const t = setTimeout(() => {
      if (map) window.google?.maps?.event?.trigger(map, "resize");
    }, 100);
    return () => {
      document.body.style.overflow = "";
      clearTimeout(t);
    };
  }, [mapFullScreen]);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError("Missing Google Maps API key");
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
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.dataset.googleMaps = "true";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Google Maps failed to load"));
        document.head.appendChild(script);
      });

    const getLocation = () =>
      new Promise<{ lat: number; lng: number } | null>((resolve) => {
        if (!navigator.geolocation) {
          resolve(null);
          return;
        }

        const tryPosition = (highAccuracy: boolean, timeout: number) =>
          new Promise<{ lat: number; lng: number } | null>((res) => {
            navigator.geolocation.getCurrentPosition(
              (pos) =>
                res({
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                }),
              () => res(null),
              {
                enableHighAccuracy: highAccuracy,
                timeout,
                maximumAge: 0,
              },
            );
          });

        tryPosition(true, 15000).then((pos) => {
          if (pos) {
            resolve(pos);
          } else {
            tryPosition(false, 10000).then(resolve);
          }
        });
      });

    const initMap = async () => {
      try {
        await loadScript();
        if (cancelled || !mapRef.current || mapInstanceRef.current) return;

        const center = (await getLocation()) ?? { lat: 47.4979, lng: 19.0402 };
        userLocationRef.current = center;

        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 15,
          mapTypeControl: false,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            {
              elementType: "labels.text.stroke",
              stylers: [{ color: "#242f3e" }],
            },
            {
              elementType: "labels.text.fill",
              stylers: [{ color: "#746855" }],
            },
            {
              featureType: "administrative.locality",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "poi",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi.park",
              elementType: "geometry",
              stylers: [{ color: "#263c3f" }],
            },
            {
              featureType: "poi.park",
              elementType: "labels.text.fill",
              stylers: [{ color: "#6b9a76" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#38414e" }],
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ color: "#212a37" }],
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9ca5b3" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry",
              stylers: [{ color: "#746855" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [{ color: "#1f2835" }],
            },
            {
              featureType: "road.highway",
              elementType: "labels.text.fill",
              stylers: [{ color: "#f3d19c" }],
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ color: "#2f3948" }],
            },
            {
              featureType: "transit.station",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#17263c" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [{ color: "#515c6d" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#17263c" }],
            },
          ],
        });

        mapInstanceRef.current = map;

        new window.google.maps.Marker({
          map,
          position: center,
          title: "Itt vagy",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          },
          zIndex: 999,
        });

        placesServiceRef.current = new window.google.maps.places.PlacesService(
          map,
        );
        distanceServiceRef.current =
          new window.google.maps.DistanceMatrixService();

        searchBars(map, center);

        map.addListener("click", () => {
          infoWindowRef.current?.close();
        });

        let moveTimeout: ReturnType<typeof setTimeout>;
        moveListenerRef.current = map.addListener("idle", () => {
          clearTimeout(moveTimeout);
          moveTimeout = setTimeout(() => {
            const mapCenter = map.getCenter();
            if (!mapCenter) return;
            const newLat = mapCenter.lat();
            const newLng = mapCenter.lng();
            const origLat = userLocationRef.current?.lat ?? center.lat;
            const origLng = userLocationRef.current?.lng ?? center.lng;

            const dist = Math.sqrt(
              Math.pow(newLat - origLat, 2) + Math.pow(newLng - origLng, 2),
            );
            if (dist > 0.003) {
              setShowSearchButton(true);
            }
          }, 400);
        });

        setLoading(false);
      } catch {
        if (!cancelled) {
          setError("Google Maps failed to load");
        }
      }
    };

    initMap();

    return () => {
      cancelled = true;
    };
  }, [searchBars]);

  const handleSearchThisArea = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const c = map.getCenter();
    if (!c) return;
    searchBars(map, { lat: c.lat(), lng: c.lng() });
  };

  if (error) {
    return (
      <div className="container-fluid mt-3">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  const mapHeight = isMobileOrTablet && !mapFullScreen ? 220 : "70vh";
  const mapContainerStyle: React.CSSProperties = mapFullScreen
    ? {
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        width: "100%",
        height: "100%",
        background: "#1a1a2e",
      }
    : {
        position: "relative",
        height: mapHeight,
        width: "100%",
        cursor: isMobileOrTablet ? "pointer" : undefined,
      };

  return (
    <div className="container-fluid mt-3" style={{ position: "relative" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            height: mapHeight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <DotLottieReact
            src="https://lottie.host/319696c3-9516-4298-b5a4-1d2d0b5ef404/D0BEk7DoAV.lottie"
            loop
            autoplay
          />
        </div>
      )}
      <div
        style={mapContainerStyle}
        onClick={
          isMobileOrTablet && !mapFullScreen && !loading
            ? () => setMapFullScreen(true)
            : undefined
        }
        role={isMobileOrTablet && !mapFullScreen ? "button" : undefined}
        tabIndex={isMobileOrTablet && !mapFullScreen ? 0 : undefined}
        onKeyDown={
          isMobileOrTablet && !mapFullScreen
            ? (e) => e.key === "Enter" && setMapFullScreen(true)
            : undefined
        }
      >
        {showSearchButton && !(isMobileOrTablet && !mapFullScreen) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSearchThisArea();
            }}
            disabled={searching}
            style={{
              position: "absolute",
              top: 16,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10001,
              background: "#f5a623",
              color: "#1a1a2e",
              border: "none",
              padding: "10px 20px",
              borderRadius: "24px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
              transition: "opacity 0.2s",
              opacity: searching ? 0.6 : 1,
            }}
          >
            {searching ? "Keresés..." : "Keresés ezen a területen"}
          </button>
        )}
        {mapFullScreen && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMapFullScreen(false);
            }}
            aria-label="Bezárás"
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 10001,
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(26,26,46,0.9)",
              border: "none",
              color: "#fff",
              fontSize: 24,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
            }}
          >
            ×
          </button>
        )}
        <div
          style={{
            height: "100%",
            width: "100%",
            pointerEvents: isMobileOrTablet && !mapFullScreen ? "none" : "auto",
          }}
          ref={mapRef}
        />
        {isMobileOrTablet && !mapFullScreen && !loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.4)",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                textAlign: "center",
                padding: "0 20px",
              }}
            >
              Érintsd a térképet a teljes képernyős nézethez
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarsMap;
