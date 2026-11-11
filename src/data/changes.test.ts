import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parts } from "./architecture";
import { changes, isChangeId } from "./changes";
import { changeFromHash } from "@/lib/viewStore";

const routeExists = (href: string) => {
  const path = href.split(/[?#]/)[0];
  return existsSync(join(__dirname, "..", "app", path, "page.tsx"));
};

describe("changes registry", () => {
  it("points every change at a prototype page that exists", () => {
    const missing = Object.entries(changes).filter(([, c]) => !routeExists(c.page));
    expect(missing.map(([id]) => id)).toEqual([]);
  });

  it("uses every architecture part at least once", () => {
    const used = new Set(Object.values(changes).flatMap((c) => c.parts));
    expect(parts.filter((p) => !used.has(p.id)).map((p) => p.id)).toEqual([]);
  });

  it("opens a panel only for a known change in the hash", () => {
    expect(changeFromHash("#change-2c-who")).toBe("2c-who");
    expect(changeFromHash("#change-nope")).toBeNull();
    expect(changeFromHash("#add")).toBeNull();
    expect(isChangeId("toString")).toBe(false);
  });
});
