import { ui } from "@/lib/ui";

export default function WalkPanel({
  coordText,
  locating,
  onLocate,
}: {
  coordText: string;
  locating: boolean;
  onLocate: () => void;
}) {
  return (
    <section className={ui.card}>
      <p className="text-sm text-sand/70">
        Use your live location to discover what roamed the ground beneath your
        feet.
      </p>
      <button onClick={onLocate} disabled={locating} className={`mt-3 ${ui.accentButton}`}>
        {locating ? "Finding you…" : "Use my location"}
      </button>
      <p className={ui.coordText}>{coordText}</p>
    </section>
  );
}
