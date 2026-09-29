import { cx } from "@/lib/ui";

export type Mode = "walk" | "global";

const MODES: { id: Mode; label: string }[] = [
  { id: "walk", label: "Walk mode" },
  { id: "global", label: "Global mode" },
];

export default function ModeToggle({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (mode: Mode) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Location mode"
      className="mb-5 grid grid-cols-2 gap-1.5 rounded-xl border border-line bg-surface p-1.5"
    >
      {MODES.map(({ id, label }) => (
        <button
          key={id}
          role="tab"
          aria-selected={mode === id}
          onClick={() => onChange(id)}
          className={cx(
            "rounded-lg px-3 py-2.5 text-sm font-semibold transition",
            mode === id
              ? "bg-amber text-parchment-ink shadow-[0_2px_0_0_rgba(0,0,0,0.25)]"
              : "bg-surface-2 text-sand/70 hover:text-sand hover:bg-surface-3"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
