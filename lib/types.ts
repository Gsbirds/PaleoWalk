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
};

export type PaleoReport = {
  placeLabel: string;
  ancientEnvironment: string;
  headline: string;
  story: string;
  creatures: Creature[];
  demoMode: boolean;
};

export type PaleoRequest = {
  lat: number;
  lon: number;
  placeLabel?: string;
};
