# 🦴 PaleoWalk

A walking & exploring companion that tells you which **dinosaurs and extinct animals** lived where you are standing — or anywhere on Earth. Point it at your location on a hike, or tap a spot on the globe, and an LLM paints the ancient scene and introduces the creatures that roamed there.

Built for the Applause AI Enablement Engineer take-home challenge.

## Features

- **🥾 Walk mode** — uses your live GPS location to reveal what walked the ground beneath your feet.
- **🌍 Global mode** — tap anywhere on an interactive world map, search a place by name, pick from one-tap **famous fossil sites** (Hell Creek, Gobi, Morrison, La Brea, Solnhofen…), or hit **🎲 Lucky Dino** to land somewhere random.
- **LLM-powered** — a single server-side call to the OpenAI API returns structured, region-grounded paleontology (creatures, era, environment, and a short immersive story).
- **Real fossil images** — each creature gets a large, swipeable gallery of photos and paleoart pulled live from Wikipedia, with attribution links back to the source. No API key needed for images.
- **Mobile-first** — designed to be used one-handed on a phone on the trail.
- **Runs with no key** — falls back to a demo report so you can see the whole app before wiring in a key.

## Tech

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- OpenAI API (structured JSON output)
- Leaflet / react-leaflet for the map (no API key needed)
- OpenStreetMap Nominatim for place search (no API key needed)

No database — the app is fully stateless.

## Run it locally

Requires Node 18+.

```bash
npm install
cp .env.example .env.local   # then paste your key into .env.local
npm run dev
```

Open http://localhost:3000.

### The one API key

Get an OpenAI key at https://platform.openai.com/api-keys and put it in `.env.local`:

```
OPENAI_API_KEY=sk-...
```

**Without a key the app still runs** in demo mode with sample data, so you can explore the UI immediately. The real, location-specific magic needs the key.

> Keys live in `.env.local`, which is gitignored. Nothing secret is committed.

## How it works

1. You pick a spot — live GPS (Walk mode) or a tap/search on the map (Global mode).
2. The browser sends `{ lat, lon, placeLabel }` to `POST /api/paleo`.
3. The server route calls the LLM with a paleontology field-guide system prompt and a strict JSON schema.
4. The response renders as an immersive story plus creature cards.

The API key never leaves the server.

## Trade-offs & scope

- The model reasons about regional paleontology from its training rather than querying a live fossil database (e.g. the Paleobiology Database). It's vivid and usually accurate for well-known formations, but it is not authoritative. Wiring in the PBDB API would be the top next step.
- No auth, no persistence — not needed for the core experience.
- Not optimized for production hardening (rate limiting, caching) given the one-day scope.

## Deploy

Push to GitHub. To go live later, connect the repo to Vercel and set `OPENAI_API_KEY` as an environment variable in the Vercel dashboard.
