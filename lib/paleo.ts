import OpenAI from "openai";
import type { PaleoReport, PaleoRequest, Creature } from "./types";

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const SYSTEM_PROMPT = `You are a paleontology field guide for a walking companion app called PaleoWalk.
Given a latitude/longitude, describe the prehistoric creatures — dinosaurs and other extinct animals —
that most likely lived at or near that location across deep time, grounded in the real geology and
fossil record of that region.

Rules:
- Ground everything in the actual paleontological record of that area. If the region is famous for
  certain fossils (e.g. Hell Creek, Morrison Formation, La Brea, Gobi Desert, Solnhofen), reflect that.
- Prefer creatures genuinely associated with the region over generic famous dinosaurs.
- Mix dinosaurs with other extinct animals where appropriate (marine reptiles, mammals, megafauna,
  early life) depending on what the region is actually known for.
- Keep it vivid but accurate. Never invent fake species names.
- The "story" is a short, second-person, immersive paragraph (about 60-90 words) a walker reads while
  strolling, painting the ancient scene where they stand.
- Return 3 to 5 creatures.
- "emoji" should be a single relevant emoji.
- "sizeMeters" is approximate length in meters as a number, or null if unknown.`;

// JSON schema for structured output — keeps the UI reliable.
const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    placeLabel: { type: "string" },
    ancientEnvironment: { type: "string" },
    headline: { type: "string" },
    story: { type: "string" },
    creatures: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          commonName: { type: "string" },
          period: { type: "string" },
          yearsAgo: { type: "string" },
          type: { type: "string" },
          sizeMeters: { type: ["number", "null"] },
          diet: { type: "string" },
          emoji: { type: "string" },
          funFact: { type: "string" },
        },
        required: [
          "name",
          "commonName",
          "period",
          "yearsAgo",
          "type",
          "sizeMeters",
          "diet",
          "emoji",
          "funFact",
        ],
      },
    },
  },
  required: [
    "placeLabel",
    "ancientEnvironment",
    "headline",
    "story",
    "creatures",
  ],
} as const;

export function hasApiKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function generatePaleoReport(
  req: PaleoRequest
): Promise<PaleoReport> {
  if (!hasApiKey()) {
    return demoReport(req);
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const userPrompt = `Location: latitude ${req.lat}, longitude ${req.lon}.${
    req.placeLabel ? ` This is near: ${req.placeLabel}.` : ""
  }
Describe the prehistoric creatures that walked, swam, or flew here, and paint the ancient scene.`;

  const completion = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.8,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "paleo_report",
        strict: true,
        schema: RESPONSE_SCHEMA,
      },
    },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("Empty response from model");
  }

  const parsed = JSON.parse(raw) as Omit<PaleoReport, "demoMode">;
  return {
    ...parsed,
    placeLabel: req.placeLabel || parsed.placeLabel,
    demoMode: false,
  };
}

// Fallback so the app is fully usable with no API key.
function demoReport(req: PaleoRequest): PaleoReport {
  const creatures: Creature[] = [
    {
      name: "Tyrannosaurus rex",
      commonName: "T. rex",
      period: "Late Cretaceous",
      yearsAgo: "68–66 million years ago",
      type: "Theropod dinosaur",
      sizeMeters: 12,
      diet: "Carnivore",
      emoji: "🦖",
      funFact:
        "Its bite could exert over 12,000 pounds of force — enough to crush a car.",
    },
    {
      name: "Triceratops horridus",
      commonName: "Triceratops",
      period: "Late Cretaceous",
      yearsAgo: "68–66 million years ago",
      type: "Ceratopsian dinosaur",
      sizeMeters: 9,
      diet: "Herbivore",
      emoji: "🦕",
      funFact:
        "Its huge frill and three horns may have been used for display as much as defense.",
    },
    {
      name: "Ankylosaurus magniventris",
      commonName: "Ankylosaurus",
      period: "Late Cretaceous",
      yearsAgo: "68–66 million years ago",
      type: "Armored dinosaur",
      sizeMeters: 8,
      diet: "Herbivore",
      emoji: "🦎",
      funFact:
        "It swung a bony tail club heavy enough to break the bones of an attacker.",
    },
  ];

  return {
    placeLabel: req.placeLabel || "your location",
    ancientEnvironment:
      "A warm, humid coastal floodplain threaded with rivers and fern prairies.",
    headline: "Giants of the Late Cretaceous walked here",
    story:
      "You stand on soft, damp ground where broad rivers once wandered to a shallow sea. Ferns brush your legs; the air is thick and warm. Somewhere beyond the tree line, a Triceratops crashes through the undergrowth, and the ground trembles with the slow, deliberate steps of something far larger, watching from the shade.",
    creatures,
    demoMode: true,
  };
}
