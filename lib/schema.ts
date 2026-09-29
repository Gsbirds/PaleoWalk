// JSON schema for the LLM's structured output. Keeping it isolated makes the
// prompt module easier to read and the schema easier to evolve.

const creatureProperties = {
  name: { type: "string" },
  commonName: { type: "string" },
  period: { type: "string" },
  yearsAgo: { type: "string" },
  type: { type: "string" },
  sizeMeters: { type: ["number", "null"] },
  diet: { type: "string" },
  emoji: { type: "string" },
  funFact: { type: "string" },
  wikiTitle: { type: "string" },
} as const;

export const PALEO_RESPONSE_SCHEMA = {
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
        properties: creatureProperties,
        required: Object.keys(creatureProperties),
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
