import { config } from "./config";

export type LatLon = { lat: number; lon: number };
export type GeoResult = LatLon & { label?: string };

/** Promise wrapper around the browser Geolocation API. */
export function getCurrentPosition(): Promise<LatLon> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("unavailable"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) =>
        reject(
          new Error(err.code === err.PERMISSION_DENIED ? "denied" : "failed")
        ),
      { enableHighAccuracy: true, timeout: config.geo.geolocationTimeoutMs }
    );
  });
}

/** Geocode a free-text place via OpenStreetMap Nominatim (no key needed). */
export async function geocodePlace(query: string): Promise<GeoResult | null> {
  const url = `${config.nominatim.searchUrl}?format=json&limit=1&q=${encodeURIComponent(
    query
  )}`;
  const res = await fetch(url, { headers: { "Accept-Language": "en" } });
  const data = (await res.json()) as Array<{
    lat: string;
    lon: string;
    display_name: string;
  }>;
  const hit = data[0];
  if (!hit) return null;
  return { lat: Number(hit.lat), lon: Number(hit.lon), label: hit.display_name };
}

export function formatCoords(point: LatLon | null): string {
  return point
    ? `${point.lat.toFixed(3)}, ${point.lon.toFixed(3)}`
    : "no spot selected";
}
