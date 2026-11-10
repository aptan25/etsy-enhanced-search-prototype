"use client";

import { useState } from "react";
import { resetPeople } from "@/lib/peopleStore";

/** Puts the three demo people back, so each demo starts the same. */
export function ResetDemo() {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        resetPeople();
        setDone(true);
      }}
      className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-900"
    >
      {done ? "✓ Demo people restored" : "Reset demo people"}
    </button>
  );
}
