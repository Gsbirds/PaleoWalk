"use client";

import { useState } from "react";
import GlobalPanel from "@/components/GlobalPanel";
import ModeToggle, { type Mode } from "@/components/ModeToggle";
import ReportView from "@/components/ReportView";
import WalkPanel from "@/components/WalkPanel";
import { usePaleoReport } from "@/hooks/usePaleoReport";
import { ui } from "@/lib/ui";

export default function Home() {
  const [mode, setMode] = useState<Mode>("walk");
  const paleo = usePaleoReport();

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col px-4 pb-28 pt-6">
      <header className="mb-5 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-bone">
          PaleoWalk
        </h1>
        <p className="field-label mt-2 text-amber/70">
          field guide to deep time
        </p>
        <p className="mt-1 text-sm text-sand/60">
          What walked here before you did.
        </p>
      </header>

      <ModeToggle mode={mode} onChange={setMode} />

      {mode === "walk" ? (
        <WalkPanel
          coordText={paleo.coordText}
          locating={paleo.locating}
          onLocate={paleo.useMyLocation}
        />
      ) : (
        <GlobalPanel
          point={paleo.point}
          placeLabel={paleo.placeLabel}
          coordText={paleo.coordText}
          onPick={(p) => paleo.pickPoint(p)}
          onSelectPreset={paleo.selectPreset}
          onSearch={paleo.searchPlace}
        />
      )}

      <button
        onClick={paleo.runReport}
        disabled={paleo.loading || !paleo.point}
        className={`mt-4 ${ui.primaryButton}`}
      >
        {paleo.loading ? "Digging through time…" : "Reveal what walked here"}
      </button>

      {paleo.error && (
        <p className="mt-3 rounded-lg border-l-4 border-clay bg-surface-2 px-4 py-3 text-sm text-clay">
          {paleo.error}
        </p>
      )}

      {paleo.report && (
        <ReportView report={paleo.report} heroImages={paleo.heroImages} />
      )}

      <footer className="mt-auto pt-8 text-center text-xs text-sand/30">
        <p>Powered by an LLM · Map © OpenStreetMap contributors</p>
        <p className="mt-1">© Gabrielle Burgard 2026</p>
      </footer>
    </main>
  );
}
