"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "@/lib/accountStore";
import { clearPeople } from "@/lib/peopleStore";
import { setTourStep } from "@/lib/tourStore";
import { steps } from "./steps";

/** Starts the guided demo straight away: signed out, no saved people. */
export function StartJourney() {
  const router = useRouter();
  useEffect(() => {
    clearPeople();
    signOut();
    setTourStep(0);
    router.replace(steps[0].href([], null));
  }, [router]);
  return <p>Starting the demo…</p>;
}
