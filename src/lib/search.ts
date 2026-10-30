import type { Listing } from "./types";

// Current-state keyword search: every query word must appear in the listing,
// and matches rank by review count (our stand-in for today's ranking, which
// favors high-volume sellers). Enhanced Search replaces this ranking later.

// "gift" is dropped because almost every query on a gift site includes it,
// and most listing text doesn't.
const STOPWORDS = new Set(["a", "an", "and", "the", "for", "of", "with", "to", "my", "gift", "gifts"]);

function words(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    // Crude plural folding so "mugs" matches "mug".
    .map((w) => (w.length > 3 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w));
}

function searchableWords(l: Listing): Set<string> {
  const { occasion, recipient, interests, style } = l.tags;
  return new Set(words([l.title, l.category, l.materials, ...occasion, ...recipient, ...interests, ...style].join(" ")));
}

export function queryWords(query: string): string[] {
  return words(query).filter((w) => !STOPWORDS.has(w));
}

export function search(listings: Listing[], query: string): Listing[] {
  const q = queryWords(query);
  if (q.length === 0) return [];
  return listings
    .filter((l) => {
      const doc = searchableWords(l);
      return q.every((w) => doc.has(w));
    })
    .sort((a, b) => b.reviewCount - a.reviewCount);
}
