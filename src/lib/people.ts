import type { Occasion } from "./occasions";

export type Relationship = "mom" | "dad" | "partner" | "friend" | "coworker" | "sibling";

export const relationships: { id: Relationship; label: string }[] = [
  { id: "mom", label: "Mom" },
  { id: "dad", label: "Dad" },
  { id: "partner", label: "Partner" },
  { id: "friend", label: "Friend" },
  { id: "coworker", label: "Coworker" },
  { id: "sibling", label: "Sibling" },
];

export const relationshipLabel = (r: Relationship) => relationships.find((x) => x.id === r)?.label ?? r;

export type GiftRecord = {
  listingId: string;
  occasion: string;
  year: number;
  outcome?: "loved" | "okay" | "missed";
};

/** Someone the buyer shops for. Everything Etsy "remembers" is visible and editable here. */
export type Person = {
  id: string;
  name: string;
  relationship: Relationship;
  occasions: Occasion[];
  /** Same vocabulary as listing tags (interests and style). */
  interests: string[];
  style: string[];
  budget?: number;
  history: GiftRecord[];
  /** Which workflow created this person, shown on the profile for the demo. */
  source: "demo" | "quiz" | "relationship" | "chat" | "checkout";
};

/** Common holidays suggested by relationship, so one save covers the year. */
export const suggestedOccasions: Record<Relationship, Occasion[]> = {
  mom: [
    { label: "Mother's Day", month: 5, day: 0, nth: 2, weekday: 0, tag: "mothers-day" },
    { label: "Christmas", month: 12, day: 25, tag: "holiday" },
  ],
  dad: [
    { label: "Father's Day", month: 6, day: 0, nth: 3, weekday: 0, tag: "fathers-day" },
    { label: "Christmas", month: 12, day: 25, tag: "holiday" },
  ],
  partner: [
    { label: "Valentine's Day", month: 2, day: 14, tag: "valentines" },
    { label: "Christmas", month: 12, day: 25, tag: "holiday" },
  ],
  friend: [{ label: "Christmas", month: 12, day: 25, tag: "holiday" }],
  coworker: [{ label: "Holiday gift exchange", month: 12, day: 18, tag: "holiday" }],
  sibling: [{ label: "Christmas", month: 12, day: 25, tag: "holiday" }],
};

// Demo people every viewer starts with. Dates are fixed so the demo reads the
// same each time (e.g. Mom's birthday is ~12 days after Nov 10).
export const demoPeople: Person[] = [
  {
    id: "mom",
    name: "Mom",
    relationship: "mom",
    occasions: [
      { label: "Birthday", month: 11, day: 22, tag: "birthday" },
      { label: "Christmas", month: 12, day: 25, tag: "holiday" },
      { label: "Mother's Day", month: 5, day: 0, nth: 2, weekday: 0, tag: "mothers-day" },
    ],
    interests: ["coffee", "ceramics"],
    style: ["sentimental", "artisan"],
    history: [{ listingId: "1619780681", occasion: "Mother's Day", year: 2026 }],
    source: "demo",
  },
  {
    id: "maya",
    name: "Maya",
    relationship: "coworker",
    occasions: [
      { label: "Holiday gift exchange", month: 12, day: 18, tag: "holiday" },
      { label: "Baby shower", month: 1, day: 23 },
      { label: "Birthday", month: 3, day: 3, tag: "birthday" },
    ],
    interests: ["pickleball", "coffee"],
    style: ["playful"],
    budget: 40,
    history: [],
    source: "demo",
  },
  {
    id: "dad",
    name: "Dad",
    relationship: "dad",
    occasions: [
      { label: "Birthday", month: 4, day: 2, tag: "birthday" },
      { label: "Father's Day", month: 6, day: 0, nth: 3, weekday: 0, tag: "fathers-day" },
    ],
    interests: ["fishing", "outdoors"],
    style: ["rustic"],
    history: [],
    source: "demo",
  },
];

/** A readable, collision-resistant ID for a newly saved person. */
export function newPersonId(name: string) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 20) || "person";
  return `${slug}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Accepts only data shaped like Person[]; anything else returns null. */
export function parsePeople(raw: string): Person[] | null {
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return null;
    const ok = data.every(
      (p) =>
        p &&
        typeof p === "object" &&
        typeof p.id === "string" &&
        typeof p.name === "string" &&
        typeof p.relationship === "string" &&
        Array.isArray(p.occasions) &&
        Array.isArray(p.interests) &&
        Array.isArray(p.style) &&
        Array.isArray(p.history),
    );
    return ok ? (data as Person[]) : null;
  } catch {
    return null;
  }
}
