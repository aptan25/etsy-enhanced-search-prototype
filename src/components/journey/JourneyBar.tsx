"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePeople } from "@/lib/peopleStore";
import { endTour, setTourStep, useTourStep } from "@/lib/tourStore";
import { persona, steps } from "./steps";

/** The guided-demo panel, pinned to the top of every page while the demo runs. */
export function JourneyBar() {
  const step = useTourStep();
  const people = usePeople();
  const pathname = usePathname();
  const router = useRouter();
  const current = step === null ? undefined : steps[step];

  // The viewer clicked the real link into the next step's page.
  useEffect(() => {
    if (step === null || !current) return;
    const next = steps[step + 1];
    if (next && next.path !== current.path && pathname === next.path) setTourStep(step + 1);
  }, [step, current, pathname]);

  // Hide concept labels and make this step's target pulse (globals.css).
  useEffect(() => {
    const root = document.documentElement;
    if (!current) {
      delete root.dataset.tour;
      return;
    }
    root.dataset.tour = current.target ?? "on";
    return () => {
      delete root.dataset.tour;
    };
  }, [current]);

  // A stale step number from an older version of the demo.
  useEffect(() => {
    if (step !== null && !current) endTour();
  }, [step, current]);

  if (step === null || !current || !people) return null;

  const go = (to: number) => {
    setTourStep(to);
    router.push(steps[to].href(people));
  };
  const last = step === steps.length - 1;
  const done = current.done?.(people) ?? false;

  return (
    <aside aria-label="Guided demo" className="sticky top-0 z-40 border-b-2 border-amber-400 bg-amber-50 text-neutral-900 shadow-sm">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-start gap-x-4 gap-y-2 px-4 py-3 sm:flex-nowrap sm:px-8">
        <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-300 font-serif text-lg sm:flex" aria-hidden>
          {persona.initial}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2 text-xs text-amber-900">
            <span>
              You&apos;re {persona.name}, shopping for Mom · step {step + 1} of {steps.length}
            </span>
            {current.when && <span className="rounded bg-amber-300 px-1.5 font-semibold">⏩ {current.when}</span>}
          </p>
          <p className="font-semibold">{current.title}</p>
          <p className="text-sm text-neutral-700">{current.body}</p>
          {pathname !== current.path && (
            <Link href={current.href(people)} className="text-sm font-semibold underline">
              Go to this step
            </Link>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3 text-sm">
          {step > 0 && (
            <button type="button" onClick={() => go(step - 1)} className="underline">
              Back
            </button>
          )}
          {last ? (
            <button
              type="button"
              onClick={() => {
                endTour();
                router.push("/journey");
              }}
              className="rounded-full bg-neutral-900 px-4 py-1.5 font-semibold text-white"
            >
              Finish
            </button>
          ) : (
            <button
              type="button"
              onClick={() => go(step + 1)}
              className={`rounded-full px-4 py-1.5 font-semibold ${done ? "tour-pulse bg-neutral-900 text-white" : "border border-neutral-400 bg-white"}`}
            >
              Next →
            </button>
          )}
          <button type="button" onClick={endTour} className="text-neutral-500 underline">
            Exit
          </button>
        </div>
      </div>
      <div className="h-1 bg-amber-100">
        <div className="h-full bg-amber-400" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
      </div>
    </aside>
  );
}
