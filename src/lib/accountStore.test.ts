import { describe, expect, it } from "vitest";
import { accountFromEmail, safeNext } from "./accountStore";

describe("accountFromEmail", () => {
  it("takes the first name from the email", () => {
    expect(accountFromEmail("jess@example.com")).toEqual({ name: "Jess", email: "jess@example.com" });
    expect(accountFromEmail("  jess.tan@example.com ")).toEqual({ name: "Jess", email: "jess.tan@example.com" });
  });

  it("prefers the first name the buyer typed", () => {
    expect(accountFromEmail("jt@example.com", " Jess ")).toEqual({ name: "Jess", email: "jt@example.com" });
  });

  it("rejects something that isn't an email", () => {
    expect(() => accountFromEmail("jess")).toThrow("Enter an email address");
    expect(() => accountFromEmail("")).toThrow();
  });
});

describe("safeNext", () => {
  it("keeps a path on this site", () => {
    expect(safeNext("/made-for-them/person?id=mom")).toBe("/made-for-them/person?id=mom");
  });

  it("drops anything that could leave the site", () => {
    for (const bad of ["https://evil.example", "//evil.example", "/\\evil.example", "javascript:alert(1)", "", null]) {
      expect(safeNext(bad)).toBeNull();
    }
  });
});
