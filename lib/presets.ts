export type Preset = {
  name: string;
  emoji: string;
  lat: number;
  lon: number;
  label: string;
};

// Famous fossil sites around the world for quick exploration in Global mode.
export const FAMOUS_SITES: Preset[] = [
  {
    name: "Hell Creek",
    emoji: "🦖",
    lat: 47.06,
    lon: -106.9,
    label: "Hell Creek Formation, Montana, USA",
  },
  {
    name: "Gobi Desert",
    emoji: "🏜️",
    lat: 43.5,
    lon: 103.5,
    label: "Gobi Desert, Mongolia",
  },
  {
    name: "Morrison",
    emoji: "🦕",
    lat: 39.2,
    lon: -108.7,
    label: "Morrison Formation, Colorado, USA",
  },
  {
    name: "Patagonia",
    emoji: "🦴",
    lat: -43.0,
    lon: -69.0,
    label: "Patagonia, Argentina",
  },
  {
    name: "La Brea",
    emoji: "🛢️",
    lat: 34.063,
    lon: -118.356,
    label: "La Brea Tar Pits, Los Angeles, USA",
  },
  {
    name: "Solnhofen",
    emoji: "🪶",
    lat: 48.9,
    lon: 11.0,
    label: "Solnhofen Limestone, Bavaria, Germany",
  },
  {
    name: "Zigong",
    emoji: "🐉",
    lat: 29.35,
    lon: 104.78,
    label: "Zigong, Sichuan, China",
  },
  {
    name: "Isle of Wight",
    emoji: "🏝️",
    lat: 50.65,
    lon: -1.55,
    label: "Isle of Wight, England",
  },
  {
    name: "Karoo",
    emoji: "🦎",
    lat: -32.0,
    lon: 24.0,
    label: "Karoo Basin, South Africa",
  },
  {
    name: "Dinosaur Cove",
    emoji: "🦘",
    lat: -38.75,
    lon: 143.4,
    label: "Dinosaur Cove, Victoria, Australia",
  },
];

// "Lucky Dino" pool — same sites plus a few wilder spots for variety.
const LUCKY_POOL: Preset[] = [
  ...FAMOUS_SITES,
  {
    name: "Antarctica",
    emoji: "🧊",
    lat: -75.0,
    lon: -0.0,
    label: "Transantarctic Mountains, Antarctica",
  },
  {
    name: "Sahara",
    emoji: "🐊",
    lat: 26.0,
    lon: 8.0,
    label: "Kem Kem Beds, Sahara, Morocco",
  },
  {
    name: "Liaoning",
    emoji: "🪶",
    lat: 41.6,
    lon: 120.7,
    label: "Liaoning Province, China",
  },
];

export function luckyDino(): Preset {
  return LUCKY_POOL[Math.floor(Math.random() * LUCKY_POOL.length)];
}
