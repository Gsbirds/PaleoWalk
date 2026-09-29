// Centralized configuration & tunables.

export const config = {
  openai: {
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.8,
  },
  images: {
    perCreature: 6,
    thumbWidth: 1600,
    revalidateSeconds: 60 * 60 * 24,
    userAgent: "PaleoWalk/1.0 (paleo walking companion demo)",
  },
  geo: {
    geolocationTimeoutMs: 10_000,
  },
  wikipedia: {
    summaryUrl: "https://en.wikipedia.org/api/rest_v1/page/summary/",
    actionUrl: "https://en.wikipedia.org/w/api.php",
  },
  nominatim: {
    searchUrl: "https://nominatim.openstreetmap.org/search",
  },
} as const;

export const wikiPageUrl = (title: string) =>
  `https://en.wikipedia.org/wiki/${encodeURIComponent(title.trim())}`;
