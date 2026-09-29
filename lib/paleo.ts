import OpenAI from "openai";
import { config } from "./config";
import { DEMO_REPORT, type RawCreature, type RawReport } from "./demo";
import { fetchCreatureImages } from "./images";
import { buildUserPrompt, SYSTEM_PROMPT } from "./prompt";
import { PALEO_RESPONSE_SCHEMA } from "./schema";
import type { Creature, PaleoReport, PaleoRequest } from "./types";
import { stripMarkdown } from "./utils";

export function hasApiKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

/** Attach a Wikipedia image gallery to each creature and clean its text. */
async function enrichWithImages(creatures: RawCreature[]): Promise<Creature[]> {
  return Promise.all(
    creatures.map(async (c) => ({
      ...c,
      funFact: stripMarkdown(c.funFact),
      images: await fetchCreatureImages([c.wikiTitle, c.name, c.commonName]),
    }))
  );
}

/** Turn a raw (image-less) report into a finished, enriched PaleoReport. */
async function assembleReport(
  raw: RawReport,
  { placeLabel, demoMode }: { placeLabel?: string; demoMode: boolean }
): Promise<PaleoReport> {
  const creatures = await enrichWithImages(raw.creatures);
  const heroImage = creatures.find((c) => c.images.length)?.images[0] ?? null;

  return {
    placeLabel: placeLabel || raw.placeLabel,
    ancientEnvironment: stripMarkdown(raw.ancientEnvironment),
    headline: stripMarkdown(raw.headline),
    story: stripMarkdown(raw.story),
    heroImage,
    creatures,
    demoMode,
  };
}

/** Call the LLM for a raw, image-less report. */
async function requestRawReport(req: PaleoRequest): Promise<RawReport> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await client.chat.completions.create({
    model: config.openai.model,
    temperature: config.openai.temperature,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(req) },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "paleo_report",
        strict: true,
        schema: PALEO_RESPONSE_SCHEMA,
      },
    },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty response from model");
  return JSON.parse(raw) as RawReport;
}

export async function generatePaleoReport(
  req: PaleoRequest
): Promise<PaleoReport> {
  // Without a key, serve the demo report — still enriched with real images.
  if (!hasApiKey()) {
    return assembleReport(DEMO_REPORT, {
      placeLabel: req.placeLabel,
      demoMode: true,
    });
  }

  const raw = await requestRawReport(req);
  return assembleReport(raw, { placeLabel: req.placeLabel, demoMode: false });
}
