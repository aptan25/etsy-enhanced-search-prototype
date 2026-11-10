"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { clearPeople } from "@/lib/peopleStore";
import { setTourStep } from "@/lib/tourStore";
import { steps } from "./steps";

/** Starts the guided demo straight away, from no saved people. */
export function StartJourney() {
  const router = useRouter();
  useEffect(() => {
    clearPeople();
    setTourStep(0);
    router.replace(steps[0].href([]));
  }, [router]);
  return <p>Starting the demo…</p>;
}
