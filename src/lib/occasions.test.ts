import { describe, expect, it } from "vitest";
import { daysUntil, formatDays, upcoming, type Occasion } from "./occasions";

const nov10 = new Date(2026, 10, 10, 15, 30); // afternoon, to check time of day is ignored
const on = (month: number, day: number): Occasion => ({ label: "x", month, day });

describe("occasions", () => {
  it("counts days to this year's date when it is still ahead", () => {
    expect(daysUntil(on(11, 22), nov10)).toBe(12);
    expect(daysUntil(on(12, 25), nov10)).toBe(45);
  });

  it("counts today as zero, not next year", () => {
    expect(daysUntil(on(11, 10), nov10)).toBe(0);
  });

  it("rolls past dates to next year", () => {
    expect(daysUntil(on(11, 9), nov10)).toBe(364);
    expect(daysUntil(on(1, 23), nov10)).toBe(74);
  });

  it("sorts soonest first", () => {
    const sorted = upcoming([on(5, 10), on(11, 22), on(12, 25)], nov10).map((u) => u.days);
    expect(sorted).toEqual([12, 45, 181]);
  });

  it("phrases day counts the way a reminder would", () => {
    expect([0, 1, 12, 21, 45, 181].map(formatDays)).toEqual([
      "today",
      "tomorrow",
      "in 12 days",
      "in 3 weeks",
      "in 6 weeks",
      "in 6 months",
    ]);
  });
});
