import type { Relationship } from "@/lib/people";

/**
 * The demo buyer's past Etsy orders. Etsy already has these for any signed-in
 * buyer; an order shipped to someone else just before a holiday is likely a gift,
 * so it can start a saved person (concept 1d).
 */
export type PastOrder = {
  listingId: string;
  ordered: string; // ISO date
  shipTo: string;
  /** Etsy's guess, from the ship-to name and the holiday it arrived before. */
  guess: { relationship: Relationship; name: string; occasion: string };
};

export const pastOrders: PastOrder[] = [
  {
    listingId: "1619780681", // two-name handwriting necklace
    ordered: "2026-05-01",
    shipTo: "Linda T., Columbus OH",
    guess: { relationship: "mom", name: "Mom", occasion: "Mother's Day" },
  },
];
