import { timingSafeEqual } from "node:crypto";

// Shared-password gate. The site shows real Etsy seller photos, so it is
// for the team and our Etsy sponsor only. Any username works; only the
// password is checked against SITE_PASSWORD.
export function isAuthorized(
  authHeader: string | null,
  password: string,
): boolean {
  if (!authHeader?.startsWith("Basic ")) return false;

  let decoded: string;
  try {
    decoded = Buffer.from(authHeader.slice(6), "base64").toString("utf8");
  } catch {
    return false;
  }

  const sep = decoded.indexOf(":");
  if (sep === -1) return false;

  const given = Buffer.from(decoded.slice(sep + 1));
  const expected = Buffer.from(password);
  // timingSafeEqual throws on length mismatch, so check length first.
  return given.length === expected.length && timingSafeEqual(given, expected);
}
