import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { listings } from "./listings";

// Guards hand edits to listings.ts.
describe("seed listings", () => {
  it("have unique ids", () => {
    const ids = listings.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("point at photos that exist in public/", () => {
    const missing = listings
      .flatMap((l) => l.images)
      .filter((p) => !existsSync(join(process.cwd(), "public", p)));
    expect(missing).toEqual([]);
  });

  it("have a price, at least one photo and every tag group filled", () => {
    const bad = listings.filter(
      (l) =>
        !(l.price > 0) ||
        l.images.length === 0 ||
        Object.values(l.tags).some((t) => t.length === 0),
    );
    expect(bad.map((l) => l.id)).toEqual([]);
  });
});
