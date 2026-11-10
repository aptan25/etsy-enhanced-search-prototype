import { describe, expect, it } from "vitest";
import { parseTaste, parseWho, type ParsedWho } from "./intent";

function check(text: string, expected: ParsedWho) {
  expect(parseWho(text), text).toEqual(expected);
}

describe("parseWho", () => {
  it("pulls relationship, name, occasion and date from one sentence", () => {
    check("My coworker Maya, gift exchange Dec 18", {
      relationship: "coworker",
      name: "Maya",
      occasion: { label: "Holiday gift exchange", tag: "holiday", month: 12, day: 18 },
    });
  });

  it("fills dates for fixed holidays and leaves others undated", () => {
    check("christmas present for my dad", {
      relationship: "dad",
      occasion: { label: "Christmas", tag: "holiday", month: 12, day: 25 },
    });
    check("my sister's birthday", { relationship: "sibling", occasion: { label: "Birthday", tag: "birthday" } });
  });

  it("reads numeric dates and 'named'", () => {
    check("a friend named Jo, birthday 3/14", {
      relationship: "friend",
      name: "Jo",
      occasion: { label: "Birthday", tag: "birthday", month: 3, day: 14 },
    });
  });

  it("does not mistake a month or pronoun for a name", () => {
    check("my mom Dec 2", { relationship: "mom", occasion: { label: "Special day", month: 12, day: 2 } });
    check("my friend She likes tea", { relationship: "friend" });
  });

  it("returns nothing it cannot find", () => {
    check("hmm not sure", {});
    check("birthday on feb 31", { occasion: { label: "Birthday", tag: "birthday" } });
  });
});

describe("parseTaste", () => {
  it("maps everyday words to listing tags", () => {
    expect(parseTaste("She loves pickleball and anything funny")).toEqual({
      interests: ["pickleball", "humor"],
      style: ["funny"],
    });
    expect(parseTaste("into gardening and pottery, rustic stuff")).toEqual({
      interests: ["ceramics", "outdoors", "home"],
      style: ["rustic"],
    });
    expect(parseTaste("no idea")).toEqual({ interests: [], style: [] });
  });
});
