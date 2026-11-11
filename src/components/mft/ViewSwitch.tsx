"use client";

import { useEffect } from "react";
import { useTourStep } from "@/lib/tourStore";
import { setView, useView, views } from "@/lib/viewStore";

/**
 * Banner switch between Etsy today, Made for Them, and Made for Them with the
 * changes outlined. Sets html[data-view] for globals.css. Hidden during the
 * guided demo, which always shows the changes so its steps have something to click.
 */
export function ViewSwitch() {
  const view = useView();
  const inTour = useTourStep() !== null;

  useEffect(() => {
    const root = document.documentElement;
    if (inTour) delete root.dataset.view;
    else root.dataset.view = view;
  }, [view, inTour]);

  if (inTour) return null;
  return (
    <span role="group" aria-label="View" className="inline-flex overflow-hidden rounded-full border border-white/40 align-middle">
      {views.map((v) => (
        <button
          key={v.id}
          type="button"
          onClick={() => setView(v.id)}
          aria-pressed={view === v.id}
          className={`px-2.5 py-0.5 ${view === v.id ? "bg-white font-semibold text-neutral-900" : "hover:bg-white/15"}`}
        >
          {v.label}
        </button>
      ))}
    </span>
  );
}
