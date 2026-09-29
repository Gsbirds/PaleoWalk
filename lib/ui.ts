/** Small className helper — filters falsy values and joins. */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

// Shared surface / control styles — all opaque, no translucency or blur.
export const ui = {
  // A raised, solid panel with a hairline border and a top "strata" accent.
  card: "rounded-xl border border-line bg-surface p-4 shadow-[0_2px_0_0_var(--color-line),0_10px_30px_-12px_rgba(0,0,0,0.6)]",
  panel: "rounded-xl border border-line bg-surface",
  primaryButton:
    "w-full rounded-lg bg-amber px-4 py-3.5 text-base font-bold text-parchment-ink transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50",
  accentButton:
    "w-full rounded-lg bg-fern px-4 py-3 font-semibold text-parchment-ink transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60",
  subtleButton:
    "rounded-lg border border-line bg-surface-3 px-4 py-2.5 text-sm font-semibold text-sand transition hover:border-fern/60",
  input:
    "min-w-0 flex-1 rounded-lg border border-line bg-surface-3 px-3 py-2.5 text-sm text-sand placeholder:text-sand/40 focus:border-amber focus:outline-none",
  coordText: "mt-2 text-center field-label text-sand/50",
} as const;
