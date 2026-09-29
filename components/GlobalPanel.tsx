"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { FAMOUS_SITES, luckyDino, type Preset } from "@/lib/presets";
import type { LatLon } from "@/lib/geo";
import { cx, ui } from "@/lib/ui";

const GlobeMap = dynamic(() => import("./GlobeMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sand/50">
      Loading map…
    </div>
  ),
});

function SiteChips({
  activeLabel,
  onSelect,
}: {
  activeLabel: string;
  onSelect: (p: Preset) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {FAMOUS_SITES.map((p) => (
        <button
          key={p.name}
          onClick={() => onSelect(p)}
          className={cx(
            "shrink-0 rounded-md border px-3 py-1.5 text-xs font-semibold transition active:scale-95",
            activeLabel === p.label
              ? "border-amber bg-amber text-parchment-ink"
              : "border-line bg-surface-2 text-sand/80 hover:border-fern hover:text-sand"
          )}
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}

export default function GlobalPanel({
  point,
  placeLabel,
  coordText,
  onPick,
  onSelectPreset,
  onSearch,
}: {
  point: LatLon | null;
  placeLabel: string;
  coordText: string;
  onPick: (p: LatLon) => void;
  onSelectPreset: (p: Preset) => void;
  onSearch: (query: string) => void;
}) {
  const [search, setSearch] = useState("");

  return (
    <section className={ui.card}>
      <p className="text-sm text-sand/70">
        Tap anywhere on the globe, or search a place.
      </p>

      <div className="mt-3 flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch(search)}
          placeholder="e.g. Gobi Desert, Patagonia…"
          className={ui.input}
        />
        <button onClick={() => onSearch(search)} className={ui.subtleButton}>
          Search
        </button>
      </div>

      <div className="mt-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-sand/40">
            Famous sites
          </span>
          <button
            onClick={() => onSelectPreset(luckyDino())}
            className="rounded-md border border-amber/50 bg-surface-2 px-3 py-1 text-xs font-semibold text-amber transition hover:bg-surface-3 active:scale-95"
          >
Lucky Dino
          </button>
        </div>
        <SiteChips activeLabel={placeLabel} onSelect={onSelectPreset} />
      </div>

      <div className="mt-3 h-64 overflow-hidden rounded-lg border border-line">
        <GlobeMap point={point} onPick={onPick} />
      </div>
      <p className={ui.coordText}>{coordText}</p>
    </section>
  );
}
