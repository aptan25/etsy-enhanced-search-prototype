import { listings } from "@/data/listings";
import type { Listing } from "./types";

// The only way pages read listing data. When edit mode moves the data to
// Supabase, only this file changes.

export function getListings(): Listing[] {
  return listings;
}

export function getListing(id: string): Listing | undefined {
  return listings.find((l) => l.id === id);
}
