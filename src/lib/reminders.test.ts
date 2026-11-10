import { describe, expect, it } from "vitest";
import type { Person } from "./people";
import { giftYear, nextReminder, openOccasions } from "./reminders";

const nov10 = new Date(2026, 10, 10);
const person = (name: string, occasions: Person["occasions"], history: Person["history"] = []): Person => ({
  id: name.toLowerCase(),
  name,
  relationship: "friend",
  occasions,
  interests: [],
  style: [],
  history,
  source: "demo",
});

const maya = person("Maya", [{ label: "Holiday gift exchange", month: 12, day: 18 }]);
const mom = person("Mom", [{ label: "Christmas", month: 12, day: 25 }]);

describe("nextReminder", () => {
  it("picks the soonest occasion across people", () => {
    const r = nextReminder([mom, maya], nov10);
    expect([r?.person.name, r?.occasion.label, r?.days]).toEqual(["Maya", "Holiday gift exchange", 38]);
  });

  it("skips an occasion already bought for this year", () => {
    const bought = { ...maya, history: [{ listingId: "x", occasion: "Holiday gift exchange", year: 2026 }] };
    expect(nextReminder([mom, bought], nov10)?.person.name).toBe("Mom");
  });

  it("still reminds when last year's gift is for the same occasion", () => {
    const lastYear = { ...maya, history: [{ listingId: "x", occasion: "Holiday gift exchange", year: 2025 }] };
    expect(nextReminder([mom, lastYear], nov10)?.person.name).toBe("Maya");
  });

  it("returns nothing when no one has a date", () => {
    expect(nextReminder([person("Jo", [])], nov10)).toBeUndefined();
  });

  it("counts a gift bought after this year's date toward next year, so it isn't reminded again", () => {
    const dec20 = new Date(2026, 11, 20);
    const year = giftYear(maya.occasions, "Holiday gift exchange", dec20);
    expect(year).toBe(2027);
    const bought = { ...maya, history: [{ listingId: "x", occasion: "Holiday gift exchange", year }] };
    expect(nextReminder([bought], dec20)).toBeUndefined();
  });

  it("counts an occasion the person doesn't have toward this year", () => {
    expect(giftYear(maya.occasions, "Just because", nov10)).toBe(2026);
  });

  it("lists only occasions still needing a gift, so 'next up' moves past one already bought for", () => {
    const both = person("Mom", [...mom.occasions, { label: "Mother's Day", month: 5, day: 9 }], [
      { listingId: "x", occasion: "Christmas", year: 2026 },
    ]);
    expect(openOccasions(both, nov10).map((u) => u.occasion.label)).toEqual(["Mother's Day"]);
  });
});
