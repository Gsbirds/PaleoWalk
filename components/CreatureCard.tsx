import type { Creature } from "@/lib/types";
import ImageGallery from "./ImageGallery";

// Solid chip colors (opaque) keyed by diet.
const dietChip: Record<string, string> = {
  Carnivore: "bg-clay text-bone",
  Herbivore: "bg-moss text-bone",
  Omnivore: "bg-amber text-parchment-ink",
  Piscivore: "bg-clay text-bone",
};

export default function CreatureCard({
  creature,
  index,
}: {
  creature: Creature;
  index: number;
}) {
  const diet = dietChip[creature.diet] ?? "bg-surface-3 text-sand";

  return (
    <article
      className="animate-fade-up overflow-hidden rounded-xl border border-line bg-surface shadow-[0_10px_30px_-14px_rgba(0,0,0,0.7)]"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {creature.images.length ? (
        <ImageGallery
          images={creature.images}
          heightClass="h-64 sm:h-80"
          rounded="rounded-none"
        />
      ) : (
        <div className="flex h-40 items-center justify-center bg-surface-2 text-6xl">
          {creature.emoji}
        </div>
      )}

      <div className="p-4">
        <h3 className="font-display text-xl font-semibold text-bone">
          {creature.commonName}
        </h3>
        <p className="text-sm italic text-fern">{creature.name}</p>

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className={`rounded-md px-2 py-0.5 font-semibold ${diet}`}>
            {creature.diet}
          </span>
          <span className="rounded-md bg-surface-3 px-2 py-0.5 text-sand/85">
            {creature.type}
          </span>
          {creature.sizeMeters ? (
            <span className="rounded-md bg-surface-3 px-2 py-0.5 text-sand/85">
              ~{creature.sizeMeters} m long
            </span>
          ) : null}
        </div>

        <p className="field-label mt-3 text-amber/80">
          {creature.period} · {creature.yearsAgo}
        </p>

        <p className="mt-2 text-sm leading-relaxed text-sand/85">
          {creature.funFact}
        </p>
      </div>
    </article>
  );
}
