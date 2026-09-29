export type CreatureImage = {
  url: string;
  sourcePage: string; // link back to the source article (attribution)
  source: string; // e.g. "Wikipedia"
  caption?: string; // optional description of the image
};

export type Creature = {
  name: string;
  commonName: string;
  period: string;
  yearsAgo: string;
  type: string;
  sizeMeters: number | null;
  diet: string;
  emoji: string;
  funFact: string;
  wikiTitle: string; // best Wikipedia article title for image lookup
  images: CreatureImage[]; // populated server-side, may be empty
};

export type PaleoReport = {
  placeLabel: string;
  ancientEnvironment: string;
  headline: string;
  story: string;
  heroImage: CreatureImage | null; // one good illustration for the scene
  creatures: Creature[];
  demoMode: boolean;
};

export type PaleoRequest = {
  lat: number;
  lon: number;
  placeLabel?: string;
};
