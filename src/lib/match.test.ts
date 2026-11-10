import { describe, expect, it } from "vitest";
import { listings } from "@/data/listings";
import { demoPeople } from "./people";
import { nearbyInterests, popularFor, safePicks, somethingNew, type Profile } from "./match";

const byId = (id: string) => demoPeople.find((p) => p.id === id)!;

describe("match", () => {
  it("safe picks always hit a named interest and respect the budget", () => {
    for (const p of demoPeople) {
      const picks = safePicks(listings, p);
      expect(picks.length, p.name).toBeGreaterThan(0);
      for (const l of picks) {
        expect(l.tags.interests.some((i) => p.interests.includes(i)), l.title).toBe(true);
        if (p.budget) expect(l.price).toBeLessThanOrEqual(p.budget);
      }
    }
  });

  it("'something new' never repeats a named interest, and never overlaps safe picks", () => {
    for (const p of demoPeople) {
      const fresh = somethingNew(listings, p);
      expect(fresh.length, p.name).toBeGreaterThan(0);
      const safeIds = safePicks(listings, p, 100).map((l) => l.id);
      for (const l of fresh) {
        expect(l.tags.interests.some((i) => p.interests.includes(i)), l.title).toBe(false);
        expect(safeIds).not.toContain(l.id);
      }
    }
  });

  it("goes from pickleball to golf for Maya", () => {
    expect(nearbyInterests(["pickleball", "coffee"])).toContain("golf");
    // 4310655951: "30th Birthday Golf Hat, Thir-Tee Still On Par"
    expect(somethingNew(listings, byId("maya")).map((l) => l.id)).toContain("4310655951");
  });

  it("ranks style matches above plain interest matches", () => {
    const mom: Profile = byId("mom");
    // Both are coffee + ceramics mugs; the handwritten one is also sentimental + artisan.
    const ids = safePicks(listings, mom, 100).map((l) => l.id);
    expect(ids.indexOf("4408524877")).toBeLessThan(ids.indexOf("4600813893"));
  });

  it("cold start: popular-for-a-coworker fits coworkers and the budget, occasion first", () => {
    const picks = popularFor(listings, "coworker", { occasionTag: "holiday", budget: 40 });
    expect(picks.length).toBeGreaterThan(0);
    for (const l of picks) {
      expect(l.tags.recipient.some((r) => r === "coworker" || r === "friend")).toBe(true);
      expect(l.price).toBeLessThanOrEqual(40);
    }
    expect(picks[0].tags.occasion).toContain("holiday");
  });

  it("an empty profile gets no safe picks (the page falls back to popular picks)", () => {
    expect(safePicks(listings, { relationship: "friend", interests: [], style: [] })).toEqual([]);
  });
});
