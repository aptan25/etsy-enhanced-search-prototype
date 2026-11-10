"use client";

import { useTourStep } from "@/lib/tourStore";

/** "Sign in" normally; the demo buyer's name while the guided demo runs. */
export function Account() {
  return useTourStep() === null ? <span>Sign in</span> : <span className="font-semibold">Hi, Sam</span>;
}
