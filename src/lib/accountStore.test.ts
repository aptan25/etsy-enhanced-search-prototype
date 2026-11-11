import { describe, expect, it } from "vitest";
import { accountFromEmail } from "./accountStore";

describe("accountFromEmail", () => {
  it("takes the first name from the email", () => {
    expect(accountFromEmail("jess@example.com")).toEqual({ name: "Jess", email: "jess@example.com" });
    expect(accountFromEmail("  jess.tan@example.com ")).toEqual({ name: "Jess", email: "jess.tan@example.com" });
  });

  it("rejects something that isn't an email", () => {
    expect(() => accountFromEmail("jess")).toThrow("Enter an email address");
    expect(() => accountFromEmail("")).toThrow();
  });
});
