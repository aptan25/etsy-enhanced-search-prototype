import { describe, expect, it } from "vitest";
import { daysUntil, formatDate, formatDays, nextDate, occasionPhrase, upcoming, type Occasion } from "./occasions";

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

  it("moves Mother's and Father's Day to the right Sunday each year", () => {
    const mothers: Occasion = { label: "Mother's Day", month: 5, day: 0, nth: 2, weekday: 0 };
    const fathers: Occasion = { label: "Father's Day", month: 6, day: 0, nth: 3, weekday: 0 };
    expect(formatDate(mothers, nov10)).toBe("May 9"); // 2027
    expect(formatDate(mothers, new Date(2027, 10, 1))).toBe("May 14"); // 2028
    expect(formatDate(fathers, new Date(2026, 0, 1))).toBe("Jun 21"); // 2026
    expect(formatDate(fathers, nov10)).toBe("Jun 20"); // 2027
    expect(nextDate(mothers, new Date(2027, 4, 9)).getDate()).toBe(9); // on the day itself
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

  it("keeps holiday capitals mid-sentence", () => {
    expect(["Birthday", "Holiday gift exchange", "Christmas", "Mother's Day"].map(occasionPhrase)).toEqual([
      "birthday",
      "holiday gift exchange",
      "Christmas",
      "Mother's Day",
    ]);
  });
});
