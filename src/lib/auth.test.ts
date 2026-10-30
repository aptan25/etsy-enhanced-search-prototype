import { describe, expect, it } from "vitest";
import { isAuthorized } from "./auth";

const basic = (s: string) => "Basic " + Buffer.from(s).toString("base64");

function check(header: string | null, expected: boolean) {
  expect(isAuthorized(header, "s3cret")).toBe(expected);
}

describe("isAuthorized", () => {
  it("accepts the right password with any username", () => {
    check(basic("team:s3cret"), true);
    check(basic(":s3cret"), true);
  });

  it("rejects missing, malformed or wrong credentials", () => {
    check(null, false);
    check("", false);
    check("Bearer s3cret", false);
    check(basic("team:wrong"), false);
    check(basic("team:s3cret-longer"), false);
    check(basic("no-colon"), false);
    check("Basic !!!not-base64!!!", false);
  });

  it("keeps colons that are part of the password", () => {
    expect(isAuthorized(basic("team:a:b"), "a:b")).toBe(true);
  });
});
