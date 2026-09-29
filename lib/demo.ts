import type { Creature } from "./types";

// Creatures without images; the report layer enriches them with real photos
// so the gallery feature is visible even without an API key.
export type RawCreature = Omit<Creature, "images">;

export type RawReport = {
  placeLabel: string;
  ancientEnvironment: string;
  headline: string;
  story: string;
  creatures: RawCreature[];
};

export const DEMO_REPORT: RawReport = {
  placeLabel: "your location",
  ancientEnvironment:
    "A warm, humid coastal floodplain threaded with rivers and fern prairies.",
  headline: "Giants of the Late Cretaceous walked here",
  story:
    "You stand on soft, damp ground where broad rivers once wandered to a shallow sea. Ferns brush your legs; the air is thick and warm. Somewhere beyond the tree line, a Triceratops crashes through the undergrowth, and the ground trembles with the slow, deliberate steps of something far larger, watching from the shade.",
  creatures: [
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
      wikiTitle: "Tyrannosaurus",
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
      wikiTitle: "Triceratops",
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
      wikiTitle: "Ankylosaurus",
    },
  ],
};
