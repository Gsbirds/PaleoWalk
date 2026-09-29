import CreatureCard from "./CreatureCard";
import ImageGallery from "./ImageGallery";
import type { CreatureImage, PaleoReport } from "@/lib/types";

export default function ReportView({
  report,
  heroImages,
}: {
  report: PaleoReport;
  heroImages: CreatureImage[];
}) {
  return (
    <section className="mt-6">
      {report.demoMode && (
        <p className="mb-3 rounded-lg border-l-4 border-amber bg-surface-2 px-3 py-2 text-xs text-amber">
          Demo mode — add an OPENAI_API_KEY to get real, location-specific
          results.
        </p>
      )}

      <div className="animate-fade-up overflow-hidden rounded-xl border border-line bg-surface shadow-[0_10px_30px_-14px_rgba(0,0,0,0.7)]">
        {heroImages.length > 0 && (
          <ImageGallery
            images={heroImages}
            heightClass="h-64 sm:h-96"
            rounded="rounded-none"
          />
        )}
        <div className="p-5">
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
            {report.ancientEnvironment}
          </p>
        </div>
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
  );
}
