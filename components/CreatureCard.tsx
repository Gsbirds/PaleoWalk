import type { Creature } from "@/lib/types";

const dietColor: Record<string, string> = {
  Carnivore: "bg-clay/20 text-clay",
  Herbivore: "bg-fern/20 text-fern",
  Omnivore: "bg-amber/20 text-amber",
  Piscivore: "bg-clay/20 text-clay",
};

export default function CreatureCard({
  creature,
  index,
}: {
  creature: Creature;
  index: number;
}) {
  const diet = dietColor[creature.diet] ?? "bg-sand/10 text-sand";

  return (
    <article
      className="animate-fade-up rounded-2xl border border-sand/10 bg-bark/50 p-4 shadow-lg backdrop-blur"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className="text-4xl leading-none" aria-hidden>
          {creature.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold text-sand">
            {creature.commonName}
          </h3>
          <p className="truncate text-sm italic text-fern">{creature.name}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className={`rounded-full px-2 py-0.5 ${diet}`}>
          {creature.diet}
        </span>
        <span className="rounded-full bg-sand/10 px-2 py-0.5 text-sand/80">
          {creature.type}
        </span>
        {creature.sizeMeters ? (
          <span className="rounded-full bg-sand/10 px-2 py-0.5 text-sand/80">
            ~{creature.sizeMeters} m long
          </span>
        ) : null}
      </div>

      <div className="mt-3 text-sm text-sand/70">
        <span className="text-sand/90">{creature.period}</span>
        <span className="text-sand/40"> · {creature.yearsAgo}</span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-sand/80">
        {creature.funFact}
      </p>
    </article>
  );
}
