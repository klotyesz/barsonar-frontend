import { useEffect, useRef, useState, useCallback } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

declare global {
  interface Window {
    google: any;
  }
}

const BarsMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSearchButton, setShowSearchButton] = useState(false);
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

            const baseContent = `<div style="font-size:14px;font-weight:600;color:#f0f0f0">${
              place.name ?? "Bar"
            }</div>`;
            const buttonHtml = `<br><button onclick="window.location.href='/bar/${place.place_id}'" style="background:#f5a623;color:#1a1a2e;border:none;padding:6px 14px;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;margin-top:8px;width:100%">Információ</button>`;

            infoWindow.setContent(
              `<div style="background:#1a1a2e;padding:10px 12px;border-radius:8px;min-width:160px">${baseContent}${walkingHtml}${buttonHtml}</div>`,
            );
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
                    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destLat},${destLng}&travelmode=walking`;

                    walkingHtml = `<a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" style="font-size:12px;color:#f5a623;text-decoration:none;display:inline-block;margin-top:6px;cursor:pointer">${duration} séta</a>`;
                  } else {
                    walkingHtml = `<div style="font-size:12px;color:#888;margin-top:6px">Sétatávolság nem elérhető</div>`;
                  }
                  infoWindow.setContent(
                    `<div style="background:#1a1a2e;padding:10px 12px;border-radius:8px;min-width:160px">${baseContent}${walkingHtml}${buttonHtml}</div>`,
                  );
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

  return (
    <div className="container-fluid mt-3" style={{ position: "relative" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            height: "70vh",
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
      {showSearchButton && (
        <button
          onClick={handleSearchThisArea}
          disabled={searching}
          style={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
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
      <div style={{ height: "70vh", width: "100%" }} ref={mapRef} />
    </div>
  );
};

export default BarsMap;
