import { useEffect, useRef } from "react";
import { loadGoogleMaps } from "@/components/site/PropertyMap";

interface Props {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
}

// Default center: Salta, Argentina
const DEFAULT_CENTER = { lat: -24.7821, lng: -65.4232 };

export function LocationPicker({ lat, lng, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then(() => {
        if (cancelled || !ref.current || !window.google) return;
        const start = lat != null && lng != null ? { lat, lng } : DEFAULT_CENTER;
        const map = new window.google.maps.Map(ref.current, {
          center: start,
          zoom: lat != null && lng != null ? 16 : 13,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        });
        mapRef.current = map;
        if (lat != null && lng != null) {
          markerRef.current = new window.google.maps.Marker({ position: start, map, draggable: true });
          attachDrag();
        }
        map.addListener("click", (e: any) => {
          const p = { lat: e.latLng.lat(), lng: e.latLng.lng() };
          placeMarker(p);
          onChange(p.lat, p.lng);
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync marker when external lat/lng changes (e.g. on edit-load)
  useEffect(() => {
    if (!mapRef.current || !window.google) return;
    if (lat == null || lng == null) return;
    const p = { lat, lng };
    placeMarker(p);
    mapRef.current.panTo(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  function placeMarker(p: { lat: number; lng: number }) {
    if (!mapRef.current || !window.google) return;
    if (markerRef.current) {
      markerRef.current.setPosition(p);
    } else {
      markerRef.current = new window.google.maps.Marker({ position: p, map: mapRef.current, draggable: true });
      attachDrag();
    }
  }

  function attachDrag() {
    if (!markerRef.current) return;
    markerRef.current.addListener("dragend", (e: any) => {
      onChange(e.latLng.lat(), e.latLng.lng());
    });
  }

  return (
    <div className="space-y-2">
      <div ref={ref} className="h-72 w-full rounded-xl border bg-muted" />
      <p className="text-xs text-muted-foreground">
        Hacé clic en el mapa para marcar la ubicación. Podés arrastrar el marcador para ajustarla.
      </p>
    </div>
  );
}
