"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import CreatureCard from "@/components/CreatureCard";
import type { PaleoReport } from "@/lib/types";

// Leaflet must load client-side only.
const GlobeMap = dynamic(() => import("@/components/GlobeMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sand/50">
      Loading map…
    </div>
  ),
});

type Mode = "walk" | "global";
type LatLon = { lat: number; lon: number };

export default function Home() {
  const [mode, setMode] = useState<Mode>("walk");
  const [point, setPoint] = useState<LatLon | null>(null);
  const [placeLabel, setPlaceLabel] = useState("");
  const [search, setSearch] = useState("");
  const [report, setReport] = useState<PaleoReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  const coordText = useMemo(
    () =>
      point
        ? `${point.lat.toFixed(3)}, ${point.lon.toFixed(3)}`
        : "no spot selected",
    [point]
  );

  const useMyLocation = useCallback(() => {
    setError(null);
    if (!("geolocation" in navigator)) {
      setError("Geolocation isn't available on this device.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPoint({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setPlaceLabel("");
        setLocating(false);
      },
      (err) => {
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied. You can switch to Global mode and tap the map instead."
            : "Couldn't get your location. Try Global mode."
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Free geocoding via OpenStreetMap Nominatim — no API key needed.
  const geocodeSearch = useCallback(async () => {
    const q = search.trim();
    if (!q) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          q
        )}`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = (await res.json()) as Array<{
        lat: string;
        lon: string;
        display_name: string;
      }>;
      if (!data.length) {
        setError(`Couldn't find "${q}". Try tapping the map instead.`);
        return;
      }
      setPoint({ lat: Number(data[0].lat), lon: Number(data[0].lon) });
      setPlaceLabel(data[0].display_name);
    } catch {
      setError("Search failed. Try tapping the map instead.");
    } finally {
      setLoading(false);
    }
  }, [search]);

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
      const data = (await res.json()) as PaleoReport;
      setReport(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [point, placeLabel]);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col px-4 pb-28 pt-6">
      {/* Header */}
      <header className="mb-5 text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight text-sand">
          🦴 PaleoWalk
        </h1>
        <p className="mt-1 text-sm text-sand/60">
          What walked here — millions of years before you did.
        </p>
      </header>

      {/* Mode toggle */}
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-2xl border border-sand/10 bg-bark/50 p-1">
        <button
          onClick={() => setMode("walk")}
          className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
            mode === "walk"
              ? "bg-fern text-bark shadow"
              : "text-sand/70 hover:text-sand"
          }`}
        >
          🥾 Walk mode
        </button>
        <button
          onClick={() => setMode("global")}
          className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
            mode === "global"
              ? "bg-fern text-bark shadow"
              : "text-sand/70 hover:text-sand"
          }`}
        >
          🌍 Global mode
        </button>
      </div>

      {/* Controls */}
      {mode === "walk" ? (
        <section className="rounded-2xl border border-sand/10 bg-bark/40 p-4">
          <p className="text-sm text-sand/70">
            Use your live location to discover what roamed the ground beneath
            your feet.
          </p>
          <button
            onClick={useMyLocation}
            disabled={locating}
            className="mt-3 w-full rounded-xl bg-amber px-4 py-3 font-semibold text-bark transition active:scale-[0.99] disabled:opacity-60"
          >
            {locating ? "Finding you…" : "📡 Use my location"}
          </button>
          <p className="mt-2 text-center text-xs text-sand/50">{coordText}</p>
        </section>
      ) : (
        <section className="rounded-2xl border border-sand/10 bg-bark/40 p-4">
          <p className="text-sm text-sand/70">
            Tap anywhere on the globe, or search a place.
          </p>
          <div className="mt-3 flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && geocodeSearch()}
              placeholder="e.g. Gobi Desert, Patagonia…"
              className="min-w-0 flex-1 rounded-xl border border-sand/10 bg-bark/60 px-3 py-2.5 text-sm text-sand placeholder:text-sand/40 focus:border-fern focus:outline-none"
            />
            <button
              onClick={geocodeSearch}
              className="rounded-xl bg-sand/10 px-4 py-2.5 text-sm font-semibold text-sand transition hover:bg-sand/20"
            >
              Search
            </button>
          </div>
          <div className="mt-3 h-64 overflow-hidden rounded-xl border border-sand/10">
            <GlobeMap
              point={point}
              onPick={(p) => {
                setPoint(p);
                setPlaceLabel("");
              }}
            />
          </div>
          <p className="mt-2 text-center text-xs text-sand/50">{coordText}</p>
        </section>
      )}

      {/* Go button */}
      <button
        onClick={runReport}
        disabled={loading || !point}
        className="mt-4 w-full rounded-xl bg-fern px-4 py-3.5 text-base font-bold text-bark transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Digging through time…" : "🔍 Reveal what walked here"}
      </button>

      {error && (
        <p className="mt-3 rounded-xl bg-clay/20 px-4 py-3 text-sm text-clay">
          {error}
        </p>
      )}

      {/* Report */}
      {report && (
        <section className="mt-6">
          {report.demoMode && (
            <p className="mb-3 rounded-xl border border-amber/30 bg-amber/10 px-3 py-2 text-xs text-amber">
              Demo mode — add an OPENAI_API_KEY to get real, location-specific
              results.
            </p>
          )}
          <div className="animate-fade-up rounded-2xl border border-sand/10 bg-bark/50 p-5">
            <p className="text-xs uppercase tracking-widest text-fern">
              {report.placeLabel}
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-sand">
              {report.headline}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-sand/80">
              {report.story}
            </p>
            <p className="mt-3 text-xs text-sand/50">
              🌎 {report.ancientEnvironment}
            </p>
          </div>

          <h3 className="mb-3 mt-6 font-display text-lg font-semibold text-sand/90">
            Who you might have met
          </h3>
          <div className="grid gap-3">
            {report.creatures.map((c, i) => (
              <CreatureCard key={`${c.name}-${i}`} creature={c} index={i} />
            ))}
          </div>
        </section>
      )}

      <footer className="mt-auto pt-8 text-center text-xs text-sand/30">
        Powered by an LLM · Map © OpenStreetMap contributors
      </footer>
    </main>
  );
}
