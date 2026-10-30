import { describe, expect, it } from "vitest";
import { listings } from "@/data/listings";
import { search } from "./search";

const ids = (query: string) => search(listings, query).map((l) => l.id);

describe("search", () => {
  it("matches title words, case-insensitive", () => {
    expect(ids("PICKLEBALL").length).toBe(5);
  });

  it("requires every query word", () => {
    // Both words appear in pickleball and necklace listings, never together.
    expect(ids("pickleball").length).toBeGreaterThan(0);
    expect(ids("necklace").length).toBeGreaterThan(0);
    expect(ids("pickleball necklace")).toEqual([]);
  });

  it("matches tags, not just titles", () => {
    // Sweary flip chart's title has no "office"; its interest tag does.
    expect(ids("office")).toEqual(["4411823542"]);
  });

  it("folds plurals and ignores filler words like 'gift'", () => {
    expect(ids("mugs")).toEqual(ids("mug"));
    expect(ids("birthday gift for her")).toEqual(ids("birthday her"));
  });

  it("returns nothing for an empty, filler-only or unknown query", () => {
    expect(ids("")).toEqual([]);
    expect(ids("  gift  ")).toEqual([]);
    expect(ids("zzzz")).toEqual([]);
  });

  it("ranks matches by review count, so lookalikes with volume lead", () => {
    const counts = search(listings, "necklace").map((l) => l.reviewCount);
    expect(counts).toEqual([...counts].sort((a, b) => b - a));
  });

  it("covers every homepage category with at least 3 results", () => {
    for (const q of ["birthday gift", "pickleball", "name necklace", "mug", "anniversary", "wall hanging"]) {
      expect(ids(q).length, q).toBeGreaterThanOrEqual(3);
    }
  });
});
