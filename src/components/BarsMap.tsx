import { useEffect, useRef, useState } from "react";

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

        navigator.geolocation.getCurrentPosition(
          (pos) =>
            resolve({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            }),
          () => resolve(null),
          { enableHighAccuracy: true, timeout: 8000 },
        );
      });

    const initMap = async () => {
      try {
        await loadScript();
        if (cancelled || !mapRef.current || mapInstanceRef.current) return;

        const center = (await getLocation()) ?? { lat: 47.4979, lng: 19.0402 };

        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 14,
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

        const service = new window.google.maps.places.PlacesService(map);

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

        const [bars, pubs] = await Promise.all([
          runSearch({ location: center, radius: 5000, type: "bar" }),
          runSearch({ location: center, radius: 5000, keyword: "pub" }),
        ]);

        const unique = new Map<string, any>();
        [...bars, ...pubs].forEach((place) => {
          if (!place.place_id) return;
          const location = place.geometry?.location;
          if (!location) return;
          const key = place.place_id;
          if (!unique.has(key)) unique.set(key, place);
        });

        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        const bounds = new window.google.maps.LatLngBounds();
        const infoWindow = new window.google.maps.InfoWindow();

        unique.forEach((place) => {
          const location = place.geometry?.location;
          if (!location) return;
          const isOpen = place.opening_hours?.isOpen;
          const marker = new window.google.maps.Marker({
            map,
            position: location,
            title: place.name || "",
            icon: {
              url: !isOpen
                ? "barsonar_pin_open.png"
                : "barsonar_pin_closed.png",
              scaledSize: new window.google.maps.Size(40, 60),
            },
          });

          marker.addListener("click", () => {
            infoWindow.setContent(
              `<div style="font-size:14px;font-weight:600;color:black">${
                place.name ?? "Bar"
              }</div>
              <button onclick="window.location.href='/bar/${
                place.place_id
              }'" class="btn btn-warning btn-sm mt-2">Információ</button>`,
            );
            infoWindow.open({ anchor: marker, map });
          });

          markersRef.current.push(marker);
          bounds.extend(location);
        });

        if (!bounds.isEmpty()) {
          map.fitBounds(bounds);
        }
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
  }, []);

  if (error) {
    return (
      <div className="container-fluid mt-3">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-3">
      <div style={{ height: "70vh", width: "100%" }} ref={mapRef} />
    </div>
  );
};

export default BarsMap;
