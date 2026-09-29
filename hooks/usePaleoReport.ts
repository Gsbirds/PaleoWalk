"use client";

import { useCallback, useMemo, useState } from "react";
import {
  formatCoords,
  geocodePlace,
  getCurrentPosition,
  type LatLon,
} from "@/lib/geo";
import type { Preset } from "@/lib/presets";
import { dedupeBy } from "@/lib/utils";
import type { CreatureImage, PaleoReport } from "@/lib/types";

const GEO_ERRORS: Record<string, string> = {
  unavailable: "Geolocation isn't available on this device.",
  denied:
    "Location permission denied. You can switch to Global mode and tap the map instead.",
  failed: "Couldn't get your location. Try Global mode.",
};

export function usePaleoReport() {
  const [point, setPoint] = useState<LatLon | null>(null);
  const [placeLabel, setPlaceLabel] = useState("");
  const [report, setReport] = useState<PaleoReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const coordText = useMemo(() => formatCoords(point), [point]);

  // A flippable scene gallery built from each creature's lead image.
  const heroImages = useMemo<CreatureImage[]>(() => {
    if (!report) return [];
    const leads = report.creatures
      .map((c) => c.images[0])
      .filter((img): img is CreatureImage => Boolean(img));
    return dedupeBy(leads, (img) => img.url);
  }, [report]);

  const pickPoint = useCallback((next: LatLon, label = "") => {
    setError(null);
    setPoint(next);
    setPlaceLabel(label);
  }, []);

  const selectPreset = useCallback(
    (p: Preset) => pickPoint({ lat: p.lat, lon: p.lon }, p.label),
    [pickPoint]
  );

  const useMyLocation = useCallback(async () => {
    setError(null);
    setLocating(true);
    try {
      pickPoint(await getCurrentPosition());
    } catch (e) {
      const key = e instanceof Error ? e.message : "failed";
      setError(GEO_ERRORS[key] ?? GEO_ERRORS.failed);
    } finally {
      setLocating(false);
    }
  }, [pickPoint]);

  const searchPlace = useCallback(async (query: string) => {
    const q = query.trim();
    if (!q) return;
    setError(null);
    setLoading(true);
    try {
      const hit = await geocodePlace(q);
      if (!hit) {
        setError(`Couldn't find "${q}". Try tapping the map instead.`);
        return;
      }
      setPoint({ lat: hit.lat, lon: hit.lon });
      setPlaceLabel(hit.label ?? "");
    } catch {
      setError("Search failed. Try tapping the map instead.");
    } finally {
      setLoading(false);
    }
  }, []);

  const runReport = useCallback(async () => {
    if (!point) {
      setError("Pick a spot first.");
      return;
    }
    setError(null);
    setLoading(true);
    setReport(null);
    try {
      const res = await fetch("/api/paleo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...point, placeLabel: placeLabel || undefined }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Request failed");
      }
      setReport((await res.json()) as PaleoReport);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [point, placeLabel]);

  return {
    // state
    point,
    placeLabel,
    report,
    heroImages,
    loading,
    locating,
    error,
    coordText,
    // actions
    pickPoint,
    selectPreset,
    useMyLocation,
    searchPlace,
    runReport,
  };
}
