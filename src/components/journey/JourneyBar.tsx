"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePeople } from "@/lib/peopleStore";
import { endTour, setTourStep, useTourStep } from "@/lib/tourStore";
import { steps } from "./steps";

/** The guided-demo card, pinned to the bottom of every page while a demo runs. */
export function JourneyBar() {
  const step = useTourStep();
  const people = usePeople();
  const pathname = usePathname();
  const router = useRouter();
  const current = step === null ? undefined : steps[step];

  useEffect(() => {
    if (step === null || !current || !people) return;
    const next = steps[step + 1];
    // The viewer clicked the real link into the next step's page.
    if (next && next.path !== current.path && pathname === next.path) setTourStep(step + 1);
    // Or did this step's action on its own page.
    else if (pathname === current.path && current.autoNext?.(people)) setTourStep(step + 1);
  }, [step, current, people, pathname]);

  if (step === null || !people) return null;
  if (!current) {
    endTour(); // stale step number from an older demo
    return null;
  }

  const go = (to: number) => {
    setTourStep(to);
    router.push(steps[to].href(people));
  };
  const last = step === steps.length - 1;

  return (
    <>
      <div className="h-56" aria-hidden />
      <aside
        aria-label="Guided demo"
        className="fixed inset-x-2 bottom-2 z-50 mx-auto max-w-xl rounded-2xl border-2 border-amber-400 bg-neutral-900 p-4 text-white shadow-2xl"
      >
        <div className="flex items-center gap-2 text-xs text-amber-200">
          <span className="font-semibold">
            Guided demo · step {step + 1} of {steps.length}
          </span>
          {current.when && <span className="rounded bg-amber-300 px-1.5 py-0.5 font-semibold text-amber-950">⏩ {current.when}</span>}
          <button type="button" onClick={endTour} className="ml-auto underline">
            Exit
          </button>
        </div>
        <div className="mt-1 h-1 overflow-hidden rounded bg-neutral-700">
          <div className="h-full bg-amber-400" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>
        <p className="mt-2 font-semibold">{current.title}</p>
        <p className="mt-0.5 text-sm text-neutral-200">{current.body}</p>
        <div className="mt-3 flex items-center gap-3 text-sm">
          {step > 0 && (
            <button type="button" onClick={() => go(step - 1)} className="underline">
              ← Back
            </button>
          )}
          {pathname !== current.path && (
            <Link href={current.href(people)} className="text-amber-200 underline">
              Take me to this step
            </Link>
          )}
          {last ? (
            <button
              type="button"
              onClick={() => {
                endTour();
                router.push("/journey");
              }}
              className="ml-auto rounded-full bg-amber-400 px-4 py-1.5 font-semibold text-neutral-900"
            >
              Finish
            </button>
          ) : (
            <button type="button" onClick={() => go(step + 1)} className="ml-auto rounded-full bg-white px-4 py-1.5 font-semibold text-neutral-900">
              Next →
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
