"use client";

import { useRouter } from "next/navigation";
import { clearPeople } from "@/lib/peopleStore";
import { setTourStep } from "@/lib/tourStore";
import { steps } from "./steps";

/** Starts Sam's journey from no saved people. */
export function StartJourney() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        clearPeople();
        setTourStep(0);
        router.push(steps[0].href([]));
      }}
      className="rounded-full bg-neutral-900 px-6 py-3 font-semibold text-white hover:bg-neutral-700"
    >
      Start the demo →
    </button>
  );
}
