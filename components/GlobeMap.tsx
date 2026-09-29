"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import type { LatLon } from "@/lib/geo";

// Fix Leaflet's default marker icons (they break under bundlers otherwise).
const markerIcon = L.divIcon({
  className: "",
  html: `<div style="font-size:28px;line-height:28px;transform:translate(-50%,-100%)">📍</div>`,
  iconSize: [28, 28],
  iconAnchor: [0, 0],
});

function ClickHandler({ onPick }: { onPick: (p: LatLon) => void }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lon: e.latlng.lng });
    },
  });
  return null;
}

function Recenter({ point }: { point: LatLon | null }) {
  const map = useMap();
  useEffect(() => {
    if (point) {
      map.flyTo([point.lat, point.lon], Math.max(map.getZoom(), 4), {
        duration: 0.8,
      });
    }
  }, [point, map]);
  return null;
}

function InvalidateOnMount() {
  const map = useMap();
  useEffect(() => {
    const fix = () => map.invalidateSize();
    // Run after the container has been laid out.
    const t = setTimeout(fix, 0);
    requestAnimationFrame(fix);
    window.addEventListener("resize", fix);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", fix);
    };
  }, [map]);
  return null;
}

export default function GlobeMap({
  point,
  onPick,
}: {
  point: LatLon | null;
  onPick: (p: LatLon) => void;
}) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      worldCopyJump
      style={{ height: "100%", width: "100%" }}
      className="h-full w-full"
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        subdomains={["a", "b", "c"]}
        maxZoom={19}
      />
      <InvalidateOnMount />
      <ClickHandler onPick={onPick} />
      <Recenter point={point} />
      {point && <Marker position={[point.lat, point.lon]} icon={markerIcon} />}
    </MapContainer>
  );
}
