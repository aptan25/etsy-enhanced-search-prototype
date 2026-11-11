"use client";

import { useTourStep } from "@/lib/tourStore";
import { steps } from "./steps";

/**
 * Today's date, or the date the current demo step skips to (its `asOf`), so a
 * reminder shown "3 weeks before Mother's Day" also says "in 3 weeks".
 * Returns a function: call it only in the browser, never during the prerender.
 */
export function useDemoToday(): () => Date {
  const step = useTourStep();
  const asOf = step === null ? undefined : steps[step]?.asOf;
  return () => (asOf ? asOf(new Date()) : new Date());
}
