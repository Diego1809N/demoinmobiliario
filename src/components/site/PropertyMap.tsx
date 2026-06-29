import { useEffect, useRef } from "react";

declare global {
  interface Window { google?: any; initSJMap?: () => void; }
}

let loaderPromise: Promise<void> | null = null;
export function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();
  if (loaderPromise) return loaderPromise;
  loaderPromise = new Promise((resolve, reject) => {
    const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
    const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;
    if (!key) return reject(new Error("Maps key missing"));
    window.initSJMap = () => resolve();
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=initSJMap${channel ? `&channel=${channel}` : ""}`;
    s.onerror = () => reject(new Error("Maps load failed"));
    document.head.appendChild(s);
  });
  return loaderPromise;
}

export function PropertyMap({ lat, lng, title }: { lat: number; lng: number; title?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps().then(() => {
      if (cancelled || !ref.current || !window.google) return;
      const map = new window.google.maps.Map(ref.current, {
        center: { lat, lng },
        zoom: 15,
        disableDefaultUI: true,
        zoomControl: true,
      });
      new window.google.maps.Marker({ position: { lat, lng }, map, title });
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [lat, lng, title]);
  return <div ref={ref} className="h-72 w-full rounded-xl border bg-muted" />;
}
