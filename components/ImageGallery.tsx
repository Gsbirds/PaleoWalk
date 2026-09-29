"use client";

import { useState } from "react";
import type { CreatureImage } from "@/lib/types";

/**
 * A large, swipeable/flippable image gallery.
 * Keeps a Wikipedia attribution link visible on every image.
 */
export default function ImageGallery({
  images,
  heightClass = "h-72 sm:h-96",
  rounded = "rounded-2xl",
}: {
  images: CreatureImage[];
  heightClass?: string;
  rounded?: string;
}) {
  const [i, setI] = useState(0);
  const [touchX, setTouchX] = useState<number | null>(null);

  if (!images.length) return null;

  const clamp = (n: number) => (n + images.length) % images.length;
  const go = (dir: number) => setI((cur) => clamp(cur + dir));
  const current = images[i];

  return (
    <div className={`relative w-full overflow-hidden bg-bark/70 ${rounded} ${heightClass}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={current.url}
        src={current.url}
        alt={current.caption || "prehistoric creature"}
        className="animate-fade-up h-full w-full object-cover"
        onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX == null) return;
          const dx = e.changedTouches[0].clientX - touchX;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          setTouchX(null);
        }}
      />

      {/* gradient for legibility */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />

      {images.length > 1 && (
        <>
          <button
            aria-label="Previous image"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-lg text-sand backdrop-blur transition hover:bg-black/60 active:scale-95"
          >
            ‹
          </button>
          <button
            aria-label="Next image"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-lg text-sand backdrop-blur transition hover:bg-black/60 active:scale-95"
          >
            ›
          </button>

          {/* dots */}
          <div className="absolute inset-x-0 bottom-9 flex justify-center gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Go to image ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === i ? "w-5 bg-sand" : "w-1.5 bg-sand/40"
                }`}
              />
            ))}
          </div>

          <div className="absolute right-2 top-2 rounded-full bg-black/40 px-2 py-0.5 text-xs text-sand backdrop-blur">
            {i + 1} / {images.length}
          </div>
        </>
      )}

      {/* attribution — always keep the Wikipedia link */}
      <a
        href={current.sourcePage}
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-2 left-3 text-[11px] text-sand/80 underline decoration-sand/30 underline-offset-2 hover:text-sand"
      >
        {current.source}
      </a>
    </div>
  );
}
