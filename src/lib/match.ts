import type { Relationship } from "./people";
import type { Listing } from "./types";

/** What matching needs to know about the person a gift is for. */
export type Profile = {
  relationship: Relationship;
  interests: string[];
  style: string[];
  budget?: number;
  /** Listing occasion tag for the occasion being shopped for, e.g. "birthday". */
  occasionTag?: string;
};

// Listing recipient tags that fit each relationship.
const recipientTags: Record<Relationship, string[]> = {
  mom: ["mom", "her", "family"],
  dad: ["dad", "him", "family"],
  partner: ["partner", "couple"],
  friend: ["friend"],
  coworker: ["coworker", "friend"],
  sibling: ["sibling", "friend", "family"],
};

// "Something new": interests next to the ones a buyer named, so picks can go
// beyond the literal words. Hand-written for the seed listings; a real version
// would learn this from what similar buyers bought.
export const adjacentInterests: Record<string, string[]> = {
  pickleball: ["golf", "sports"],
  golf: ["pickleball", "sports", "outdoors"],
  sports: ["golf", "outdoors"],
  coffee: ["tea", "food", "art"],
  tea: ["coffee", "ceramics"],
  ceramics: ["art", "home", "crafts"],
  art: ["crafts", "design", "home"],
  crafts: ["art", "home"],
  design: ["art", "jewelry"],
  jewelry: ["design", "art"],
  home: ["art", "crafts", "candles"],
  candles: ["home"],
  humor: ["office"],
  office: ["humor", "coffee"],
  travel: ["art", "outdoors", "food"],
  food: ["coffee", "travel"],
  fishing: ["outdoors", "ceramics"],
  outdoors: ["fishing", "golf", "travel"],
};

const overlap = (a: string[], b: string[]) => a.filter((x) => b.includes(x)).length;

const withinBudget = (l: Listing, p: Profile) => p.budget === undefined || l.price <= p.budget;

// A listing tagged only "him/dad" shouldn't be pitched for Mom (e.g. the trout
// tile shares "ceramics" with her), and the reverse.
const forHer = ["her", "mom"];
const forHim = ["him", "dad"];
function clashes(l: Listing, r: Relationship) {
  const other = r === "mom" ? forHim : r === "dad" ? forHer : null;
  return other !== null && l.tags.recipient.every((t) => other.includes(t));
}

const eligible = (l: Listing, p: Profile) => withinBudget(l, p) && !clashes(l, p.relationship);

export function fitsRecipient(l: Listing, r: Relationship) {
  return overlap(l.tags.recipient, recipientTags[r]) > 0;
}

/** Interests count most, then style; recipient and occasion break ties. */
export function score(l: Listing, p: Profile) {
  return (
    overlap(l.tags.interests, p.interests) * 3 +
    overlap(l.tags.style, p.style) * 2 +
    (fitsRecipient(l, p.relationship) ? 1 : 0) +
    (p.occasionTag && l.tags.occasion.includes(p.occasionTag) ? 1 : 0)
  );
}

const byScore = (p: Profile) => (a: Listing, b: Listing) => score(b, p) - score(a, p) || b.reviewCount - a.reviewCount;

/** Picks that match at least one interest the buyer named. */
export function safePicks(listings: Listing[], p: Profile, n = 5): Listing[] {
  return listings
    .filter((l) => eligible(l, p) && overlap(l.tags.interests, p.interests) > 0)
    .sort(byScore(p))
    .slice(0, n);
}

/** Interests the person might like but the buyer never named. */
export function nearbyInterests(interests: string[]): string[] {
  const near = new Set(interests.flatMap((i) => adjacentInterests[i] ?? []));
  return [...near].filter((i) => !interests.includes(i));
}

/** Picks from nearby interests only: never one that matches a named interest. */
export function somethingNew(listings: Listing[], p: Profile, n = 5): Listing[] {
  const near = nearbyInterests(p.interests);
  const nearScore = (l: Listing) => overlap(l.tags.interests, near) * 2 + score(l, p);
  return listings
    .filter(
      (l) =>
        eligible(l, p) &&
        overlap(l.tags.interests, p.interests) === 0 &&
        overlap(l.tags.interests, near) > 0,
    )
    .sort((a, b) => nearScore(b) - nearScore(a) || b.reviewCount - a.reviewCount)
    .slice(0, n);
}

/**
 * Cold start: what buyers shopping for this kind of person choose, before we
 * know their interests. Review count stands in for "popular with similar buyers".
 */
export function popularFor(
  listings: Listing[],
  r: Relationship,
  opts: { occasionTag?: string; budget?: number } = {},
  n = 10,
): Listing[] {
  const hitsOccasion = (l: Listing) => (opts.occasionTag && l.tags.occasion.includes(opts.occasionTag) ? 1 : 0);
  return listings
    .filter((l) => fitsRecipient(l, r) && (opts.budget === undefined || l.price <= opts.budget))
    .sort((a, b) => hitsOccasion(b) - hitsOccasion(a) || b.reviewCount - a.reviewCount)
    .slice(0, n);
}
